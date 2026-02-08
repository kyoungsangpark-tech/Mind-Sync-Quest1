
import { MBTIState, Situation, MoodCategory, QuestResult, UserHistory } from '../types';
import { STATIC_QUEST_DB, StaticQuest } from '../constants';
import { generateQuest as generateAiQuest } from './geminiService';

const AI_PROBABILITY = 0.3; // 30% AI, 70% Static
const EXTREME_MOODS = ['lethargic', 'overwhelmed', 'depressed', 'anxious'];

export const getHybridQuest = async (
  mbti: MBTIState,
  situation: Situation,
  moodLabel: string,
  moodId: string,
  category: MoodCategory,
  history: UserHistory[]
): Promise<QuestResult> => {
  // 1. Initial Engagement or Extreme Moods: Always AI
  const isFirstTime = history.length === 0;
  const isExtreme = EXTREME_MOODS.includes(moodId);
  const useAiRoll = Math.random() < AI_PROBABILITY;

  if (isFirstTime || isExtreme || useAiRoll) {
    const aiQuest = await generateAiQuest(mbti, situation, moodLabel, history);
    return {
      ...aiQuest,
      id: 'ai_' + Date.now(),
      isAiGenerated: true,
      rationale: aiQuest.rationale || 'AI가 당신의 심리 상태를 분석하여 맞춤 설계한 퀘스트입니다.'
    };
  }

  // 2. Static DB Logic
  const completedIds = JSON.parse(localStorage.getItem('completed_quest_ids') || '[]');
  
  // Filter by category and exclude recently completed
  let pool = STATIC_QUEST_DB.filter(q => q.category === category || q.category === 'any');
  let available = pool.filter(q => !completedIds.includes(q.id));
  
  // If all exhausted, reset pool
  if (available.length === 0) available = pool;
  
  const selected = available[Math.floor(Math.random() * available.length)];
  
  // 3. Variation & Customization Logic
  return applyQuestVariations(selected, mbti);
};

const applyQuestVariations = (quest: StaticQuest, mbti: MBTIState): QuestResult => {
  let instruction = quest.instructionTemplate;

  // Placeholder replacements
  const colors = ['빨간색', '파란색', '노란색', '초록색', '흰색', '나무 재질'];
  const objects = ['물건', '책상 위 소품', '필기구', '전자기기'];
  const numbers = [100, 200, 50, 77];

  instruction = instruction.replace('[COLOR]', colors[Math.floor(Math.random() * colors.length)]);
  instruction = instruction.replace('[OBJECT]', objects[Math.floor(Math.random() * objects.length)]);
  instruction = instruction.replace('[NUMBER]', (numbers[Math.floor(Math.random() * numbers.length)]).toString());

  // MBTI Tone Wrapping
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
  const newIds = [id, ...completedIds].slice(0, 15); // Keep last 15
  localStorage.setItem('completed_quest_ids', JSON.stringify(newIds));
};
