
import React from 'react';
import { 
  Briefcase, Home, Coffee, Bed, Train, Trees, 
} from 'lucide-react';
import { Situation, MoodCategory, MoodCategoryConfig } from './types';

export const SITUATIONS: { id: Situation; label: string; icon: React.ReactNode }[] = [
  { id: 'office', label: 'Office', icon: <Briefcase size={24} /> },
  { id: 'home', label: 'Home', icon: <Home size={24} /> },
  { id: 'cafe', label: 'Cafe', icon: <Coffee size={24} /> },
  { id: 'bed', label: 'Bed', icon: <Bed size={24} /> },
  { id: 'transit', label: 'Transit', icon: <Train size={24} /> },
  { id: 'outside', label: 'Outside', icon: <Trees size={24} /> },
];

export interface StaticQuest {
  id: string;
  category: MoodCategory | 'any';
  title: string;
  instructionTemplate: string;
  encouragement: string;
  rationale: string;
  tag: string;
  questType: string;
}

export const STATIC_QUEST_DB: StaticQuest[] = [
  // Group 1: Low Energy (무기력/우울)
  {
    id: 'a1',
    category: 'low_energy',
    title: '사물 비틀기',
    instructionTemplate: '주변에 보이는 [OBJECT] 3개의 위치를 평소와 완전히 다르게 배치해보세요.',
    encouragement: '사소한 환경 변화가 뇌에 새로운 시작이라는 신호를 보냅니다.',
    rationale: '환경에 대한 작은 통제권 행사는 무기력을 해소하는 도파민 회로를 활성화합니다.',
    tag: 'Change',
    questType: 'movement'
  },
  {
    id: 'a2',
    category: 'low_energy',
    title: '먼지 사냥',
    instructionTemplate: '지금 눈에 보이는 가장 작은 쓰레기 딱 [NUMBER]개만 주워 버리세요.',
    encouragement: '주변이 깨끗해질수록 마음의 무게도 가벼워집니다.',
    rationale: '즉각적인 성취 경험은 뇌의 보상 체계를 자극하여 의욕을 만들어냅니다.',
    tag: 'Achievement',
    questType: 'movement'
  },
  {
    id: 'a3',
    category: 'low_energy',
    title: '블라인드 댄스',
    instructionTemplate: '좋아하는 신나는 노래를 틀고 30초만 눈을 감고 몸을 자유롭게 흔드세요.',
    encouragement: '누구도 보지 않아요, 오직 당신의 리듬에 집중하세요!',
    rationale: '시각을 차단하고 몸의 움직임에 집중하면 고유수용감각이 깨어나 활력이 생깁니다.',
    tag: 'Energy',
    questType: 'movement'
  },
  {
    id: 'a4',
    category: 'low_energy',
    title: '셀프 하이파이브',
    instructionTemplate: '거울 속의 나를 보고 손바닥을 맞대거나 "좋아!"라고 작게 속삭이세요.',
    encouragement: '당신은 생각보다 훨씬 더 잘해내고 있습니다.',
    rationale: '긍정적인 자기 암시와 신체적 접촉은 유대감을 높이는 옥시토신 분비를 촉진합니다.',
    tag: 'Self-Love',
    questType: 'social'
  },
  {
    id: 'a5',
    category: 'low_energy',
    title: '1분의 시각화',
    instructionTemplate: '내일 이 시간, 아주 조금 더 기분이 좋아진 나의 모습을 상상하며 1분만 가만히 눈을 감아보세요.',
    encouragement: '당신의 상상이 곧 현실의 에너지가 될 거예요.',
    rationale: '뇌는 상상과 실제를 구분하지 못하며, 긍정적 시각화는 미래에 대한 기대감을 높입니다.',
    tag: 'Vision',
    questType: 'mindful'
  },

  // Group 2: High Stress (짜증/스트레스)
  {
    id: 'b1',
    category: 'high_stress',
    title: '얼음 요법',
    instructionTemplate: '차가운 물로 양쪽 손목 안쪽을 30초간 번갈아 적시세요.',
    encouragement: '차가운 감각이 소란스러운 마음을 잠재워줄 거예요.',
    rationale: '급격한 온도 변화는 과열된 편도체를 진정시키고 부교감 신경을 활성화합니다.',
    tag: 'Cooling',
    questType: 'sensory'
  },
  {
    id: 'b2',
    category: 'high_stress',
    title: '4-7-8 호흡',
    instructionTemplate: '4초 마시고, 7초 멈추고, 8초간 길게 내뱉는 호흡을 3회 반복하세요.',
    encouragement: '숨을 내뱉을 때마다 스트레스도 함께 나갑니다.',
    rationale: '긴 날숨은 심박수를 낮추고 뇌에 안전하다는 신호를 보내 강제 이완을 유도합니다.',
    tag: 'Breathing',
    questType: 'breathing'
  },
  {
    id: 'b3',
    category: 'high_stress',
    title: '종이 파쇄기',
    instructionTemplate: '지금 드는 짜증나는 생각을 종이에 휘갈겨 쓰고 힘껏 구겨 쓰레기통에 골인시키세요.',
    encouragement: '나쁜 기분은 이제 쓰레기통에 있습니다. 잊어버리세요!',
    rationale: '추상적인 감정을 물리적 실체로 만들어 버리는 행위는 심리적 배설 효과를 줍니다.',
    tag: 'Release',
    questType: 'movement'
  },
  {
    id: 'b4',
    category: 'high_stress',
    title: '먼 곳 응시',
    instructionTemplate: '모니터를 벗어나 창밖 가장 먼 곳의 [OBJECT]를 20초간 가만히 바라보세요.',
    encouragement: '시야가 넓어지면 마음의 공간도 넓어집니다.',
    rationale: '시각적 긴장이 풀리면 뇌의 투쟁-도피 반응이 약화되어 긴장이 해소됩니다.',
    tag: 'Focus',
    questType: 'sensory'
  },
  {
    id: 'b5',
    category: 'high_stress',
    title: '근육 이완법',
    instructionTemplate: '양쪽 어깨를 귀까지 바짝 올렸다가 한 번에 "툭" 하고 떨어뜨리세요.',
    encouragement: '어깨의 무게가 당신의 마음 무게였을지도 몰라요.',
    rationale: '의도적인 근육 수축 후 이완은 신체의 긴장 해소를 통해 심리적 안정을 유도합니다.',
    tag: 'Relief',
    questType: 'movement'
  },

  // Group 3: Calm Refresh (지루함/공허함)
  {
    id: 'c1',
    category: 'calm_refresh',
    title: '컬러 헌팅',
    instructionTemplate: '지금 주변에서 [COLOR]색 물건 5개를 찾아 그 이름을 하나씩 불러보세요.',
    encouragement: '세상이 다시 선명해 보이기 시작합니다.',
    rationale: '특정 색상을 탐색하는 인지 활동은 잡생각을 멈추고 현재에 집중하게 합니다.',
    tag: 'Awareness',
    questType: 'cognitive'
  },
  {
    id: 'c2',
    category: 'calm_refresh',
    title: '반대 손 챌린지',
    instructionTemplate: '평소 안 쓰는 손으로 스마트폰을 만지거나 물컵을 들어보세요.',
    encouragement: '뇌의 새로운 부분이 반짝이며 깨어나고 있어요.',
    rationale: '익숙하지 않은 신체 활동은 뇌의 새로운 신경 회로를 자극하여 권태감을 해소합니다.',
    tag: 'Novelty',
    questType: 'movement'
  },
  {
    id: 'c3',
    category: 'calm_refresh',
    title: '향기 샤워',
    instructionTemplate: '주변의 향기 나는 물건(핸드크림 등)의 냄새를 10초간 깊게 맡으세요.',
    encouragement: '향기가 당신의 기분을 새로운 곳으로 데려다줍니다.',
    rationale: '후각은 뇌의 감정 중추와 가장 가깝게 연결되어 있어 즉각적인 기분 전환이 가능합니다.',
    tag: 'Sensory',
    questType: 'sensory'
  },
  {
    id: 'c4',
    category: 'calm_refresh',
    title: '1분 낙서',
    instructionTemplate: '종이에 아무 의미 없는 선이나 동그라미를 1분간 자유롭게 채워보세요.',
    encouragement: '정답은 없어요. 손이 가는 대로 움직여보세요.',
    rationale: '무의식적인 낙서(두들링)는 억눌린 스트레스를 해소하고 창의적 환기를 돕습니다.',
    tag: 'Art',
    questType: 'creative'
  },
  {
    id: 'c5',
    category: 'calm_refresh',
    title: '사소한 칭찬',
    instructionTemplate: '최근에 내가 한 일 중 아주 사소한 것(예: 일찍 일어남) 하나를 스스로 크게 칭찬해 주세요.',
    encouragement: '당신은 오늘 하루도 충분히 멋지게 살고 있습니다.',
    rationale: '작은 장점에 집중하는 것은 자존감을 방어하고 긍정적 자아상을 강화합니다.',
    tag: 'Gratitude',
    questType: 'social'
  },

  // Group 4: Performance Boost (불안/긴장)
  {
    id: 'd1',
    category: 'performance_boost',
    title: '5-4-3-2-1 기법',
    instructionTemplate: '보이는 것 5개, 소리 4개, 만지는 것 3개, 냄새 2개, 맛 1개에 차례로 집중해보세요.',
    encouragement: '당신은 이제 안전하고 평온한 "현재"에 있습니다.',
    rationale: '그라운딩 기법은 불안한 미래에서 현재의 물리적 감각으로 의식을 복귀시킵니다.',
    tag: 'Grounding',
    questType: 'sensory'
  },
  {
    id: 'd2',
    category: 'performance_boost',
    title: '발바닥 지지',
    instructionTemplate: '의자에 앉아 발바닥 전체가 바닥에 닿는 느낌을 30초간 강하게 느껴보세요.',
    encouragement: '단단한 바닥이 당신을 든든하게 받쳐주고 있습니다.',
    rationale: '하체로 무게중심을 이동시키는 감각은 정서적 불안정감을 물리적으로 낮춰줍니다.',
    tag: 'Stability',
    questType: 'sensory'
  },
  {
    id: 'd3',
    category: 'performance_boost',
    title: '숫자 거꾸로 세기',
    instructionTemplate: '[NUMBER]에서 7씩 빼며 3번만 거꾸로 말해보세요.',
    encouragement: '뇌가 복잡한 감정 대신 연산에 집중하기 시작했습니다.',
    rationale: '고차원적 인지 기능을 강제로 사용하면 감정 중추의 과잉 활동이 억제됩니다.',
    tag: 'Logic',
    questType: 'cognitive'
  },
  {
    id: 'd4',
    category: 'performance_boost',
    title: '나비 포옹',
    instructionTemplate: '양팔을 가슴 위에서 교차해 어깨를 번갈아 20번 토닥여주세요.',
    encouragement: '괜찮아요, 당신은 이미 잘하고 있고 앞으로도 그럴 거예요.',
    rationale: '좌우 번갈아 가며 신체를 자극하는 기법은 뇌의 정보 처리를 도와 안정을 줍니다.',
    tag: 'Support',
    questType: 'movement'
  },
  {
    id: 'd5',
    category: 'performance_boost',
    title: '상상 아지트',
    instructionTemplate: '세상에서 가장 안전하다고 느끼는 장소의 온도와 냄새를 30초간 상상해 보세요.',
    encouragement: '그곳의 평온함이 당신의 마음속으로 스며듭니다.',
    rationale: '안전한 장소에 대한 연상은 뇌에 휴식 신호를 보내 코르티솔 수치를 낮춥니다.',
    tag: 'Safe Space',
    questType: 'mindful'
  }
];

export const MOOD_CATEGORIES: MoodCategoryConfig[] = [
  {
    id: 'low_energy',
    title: '에너지가 바닥날 때',
    emoji: '🔋',
    color: 'bg-blue-50 text-blue-700 border-blue-100',
    hoverColor: 'hover:bg-blue-100',
    themeGradient: 'from-blue-50 to-indigo-100',
    accentColor: 'bg-blue-600',
    moods: [
      { id: 'lethargic', label: '무기력해요' },
      { id: 'tired', label: '지쳐요' },
      { id: 'dazed', label: '멍해요' },
      { id: 'depressed', label: '우울해요' },
    ]
  },
  {
    id: 'high_stress',
    title: '스트레스가 높을 때',
    emoji: '🌋',
    color: 'bg-rose-50 text-rose-700 border-rose-100',
    hoverColor: 'hover:bg-rose-100',
    themeGradient: 'from-rose-50 to-orange-100',
    accentColor: 'bg-rose-600',
    moods: [
      { id: 'annoyed', label: '짜증나요' },
      { id: 'anxious', label: '불안해요' },
      { id: 'sensitive', label: '예민해요' },
      { id: 'overwhelmed', label: '압도당했어요' },
    ]
  },
  {
    id: 'calm_refresh',
    title: '차분한 환기가 필요할 때',
    emoji: '☁️',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    hoverColor: 'hover:bg-emerald-100',
    themeGradient: 'from-emerald-50 to-teal-100',
    accentColor: 'bg-emerald-600',
    moods: [
      { id: 'bored', label: '지루해요' },
      { id: 'distracted', label: '잡생각이 많아요' },
      { id: 'calm', label: '차분해요' },
      { id: 'empty', label: '공허해요' },
    ]
  },
  {
    id: 'performance_boost',
    title: '더 잘하고 싶을 때',
    emoji: '🚀',
    color: 'bg-purple-50 text-purple-700 border-purple-100',
    hoverColor: 'hover:bg-purple-100',
    themeGradient: 'from-purple-50 to-indigo-100',
    accentColor: 'bg-purple-600',
    moods: [
      { id: 'excited', label: '설레요' },
      { id: 'motivated', label: '의욕 넘쳐요' },
      { id: 'focus', label: '집중하고 싶어요' },
      { id: 'nervous', label: '긴장돼요' },
    ]
  }
];

export const MBTI_DETAILS = {
  E: { title: '외향형', desc: '외부에서 에너지를 얻어요' },
  I: { title: '내향형', desc: '내면에서 에너지를 얻어요' },
  S: { title: '감각형', desc: '오감과 실제 경험을 중시해요' },
  N: { title: '직관형', desc: '아이디어와 가능성을 보아요' },
  T: { title: '사고형', desc: '논리와 분석으로 판단해요' },
  F: { title: '감정형', desc: '공감과 가치를 우선시해요' },
  J: { title: '판단형', desc: '계획적이고 체계적인 걸 선호해요' },
  P: { title: '인식형', desc: '유연하고 즉흥적인 게 좋아요' },
};
