
export type MBTIDimension = 'EI' | 'SN' | 'TF' | 'JP';

export interface MBTIState {
  E: boolean; 
  S: boolean; 
  T: boolean; 
  J: boolean; 
}

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  joinedAt: number;
  role: UserRole;
}

export type Situation = 'office' | 'home' | 'cafe' | 'bed' | 'transit' | 'outside';

export type MoodCategory = 'low_energy' | 'high_stress' | 'calm_refresh' | 'performance_boost';

export interface Mood {
  id: string;
  label: string;
  category?: MoodCategory;
}

export interface MoodCategoryConfig {
  id: MoodCategory;
  title: string;
  emoji: string;
  color: string;
  hoverColor: string;
  themeGradient: string;
  accentColor: string;
  moods: Mood[];
}

export type FeedbackScore = 'negative' | 'neutral' | 'positive';

export interface UserHistory {
  questTitle: string;
  score: FeedbackScore;
  timestamp: number;
  moodCategory?: MoodCategory;
  moodLabel?: string;
  questType?: string;
  questId?: string;
}

export interface QuestResult {
  id: string;
  title: string;
  instruction: string;
  encouragement: string;
  tag: string;
  questType: string;
  rationale: string;
  isAiGenerated?: boolean;
}

export interface StepProps {
  onNext: () => void;
  onBack?: () => void;
}
