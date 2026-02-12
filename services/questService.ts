import { MBTIState, Situation, MoodCategory, QuestResult, UserHistory } from '../types';
import { STATIC_QUEST_DB, StaticQuest } from '../constants';
import { generateQuest as generateAiQuest } from './geminiService';

// AI 확률을 1.0(100%)으로 설정하여 "초정밀 맥락 분석" 요구사항 충족
const AI_PROBABILITY = 1.0; 
const EXTREME_MOODS = ['lethargic', 'overwhelmed', 'depressed', 'anxious'];

export const getHybridQuest = async (
  mbti: MBTIState,
  situation: Situation,
  moodLabel: string,
  moodId: string,
  category: MoodCategory,
  history: UserHistory[]
): Promise<QuestResult> => {
  // 항상 AI를 사용하여 최상의 개인화 경험 제공
  const isFirstTime = history.length === 0;
  const isExtreme = EXTREME_MOODS.includes(moodId);
  const useAiRoll = Math.random() < AI_PROBABILITY;

  if (isFirstTime || isExtreme || useAiRoll) {
    try {
      const aiQuest = await generateAiQuest(mbti, situation, moodLabel, history);
      return {
        ...aiQuest,
        id: 'ai_' + Date.now(),
        isAiGenerated: true,
        rationale: aiQuest.rationale || 'AI가 당신의 심리 상태를 분석하여 맞춤 설계한 퀘스트입니다.'
      };
    } catch (error) {
      console.error("AI Generation failed, falling back to static DB", error);
    }
  }

  // Fallback to Static DB Logic
  const completedIds = JSON.parse(localStorage.getItem('completed_quest_ids') || '[]');
  let pool = STATIC_QUEST_DB.filter(q => q.category === category || q.category === 'any');
  let available = pool.filter(q => !completedIds.includes(q.id));
  if (available.length === 0) available = pool;
  const selected = available[Math.floor(Math.random() * available.length)];
  return applyQuestVariations(selected, mbti);
};

const applyQuestVariations = (quest: StaticQuest, mbti: MBTIState): QuestResult => {
  let instruction = quest.instructionTemplate;
  const colors = ['빨간색', '파란색', '노란색', '초록색', '흰색', '나무 재질'];
  const objects = ['물건', '책상 위 소품', '필기구', '전자기기'];
  const numbers = [100, 200, 50, 77];

  instruction = instruction.replace('[COLOR]', colors[Math.floor(Math.random() * colors.length)]);
  instruction = instruction.replace('[OBJECT]', objects[Math.floor(Math.random() * objects.length)]);
  instruction = instruction.replace('[NUMBER]', (numbers[Math.floor(Math.random() * numbers.length)]).toString());

  let title = quest.title;
  if (mbti.T) {
    title = `[효율적 회복] ${title}`;
  } else {
    title = `[마음 챙김] ${title}`;
  }

  return {
    id: quest.id,
    title,
    instruction,
    encouragement: quest.encouragement,
    tag: quest.tag,
    questType: quest.questType,
    rationale: quest.rationale,
    isAiGenerated: false
  };
};

export const markQuestAsCompleted = (id: string) => {
  if (id.startsWith('ai_')) return;
  const completedIds = JSON.parse(localStorage.getItem('completed_quest_ids') || '[]');
  const newIds = [id, ...completedIds].slice(0, 15);
  localStorage.setItem('completed_quest_ids', JSON.stringify(newIds));
};