export type TrackId =
  | 'finance'
  | 'marketing'
  | 'consulting'
  | 'startups'
  | 'operations';

export const ALL_TRACK_IDS: TrackId[] = [
  'finance',
  'marketing',
  'consulting',
  'startups',
  'operations',
];

export type LifeStage =
  | 'figuring-it-out'
  | 'know-my-major'
  | 'starting-soon'
  | 'just-curious';

export type ExperienceLevel = 'none' | '1-3' | '4+';

export interface TrackMeta {
  id: TrackId;
  name: string;
  tagline: string;
  color: string;
  icon: string; // emoji, avoids extra asset/font dependencies
  live: boolean;
}

export interface LessonNode {
  id: string;
  trackId: TrackId;
  title: string;
  order: number;
  live: boolean; // has real lesson content
}

export type QuestionKind = 'formula';

export interface SpreadsheetCell {
  row: number;
  col: number;
  value: string;
}

export interface LessonQuestion {
  id: string;
  nodeId: string;
  kind: QuestionKind;
  difficultyTier: 1 | 2 | 3 | 4 | 5;
  prompt: string;
  columnHeaders: string[];
  cells: SpreadsheetCell[];
  targetCellLabel: string; // e.g. "D2" — where the user types the formula
  acceptedFormulas: string[]; // normalized (uppercase, no spaces) accepted answers
  correctFormula: string; // canonical form to display
  explanation: string;
}

export interface UserProfile {
  hasOnboarded: boolean;
  onboardingTrack: TrackId | null; // null means "Not sure yet" -> Explore
  isExploring: boolean;
  lifeStage: LifeStage | null;
  experience: ExperienceLevel | null;
  estimatedProficiency: number; // 1-5, from onboarding, fixed baseline
  currentTrack: TrackId;
}

export interface TrackProgress {
  xp: number;
  streak: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  completedNodeIds: string[];
  effectiveProficiency: number; // per-track, adjusts from baseline via performance
  recentAnswers: boolean[]; // rolling window of correctness, most recent last
}

export type ProgressState = Record<TrackId, TrackProgress>;

export interface ExploreTrackFeedback {
  thumbsUp: number;
  thumbsDown: number;
  nudgeDismissed: boolean;
}

export type ExploreFeedbackState = Record<TrackId, ExploreTrackFeedback>;
