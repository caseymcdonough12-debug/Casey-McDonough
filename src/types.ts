export type TrackId =
  | 'finance'
  | 'personalFinance'
  | 'economics'
  | 'accounting'
  | 'marketing'
  | 'consulting'
  | 'startups'
  | 'operations';

export const ALL_TRACK_IDS: TrackId[] = [
  'finance',
  'personalFinance',
  'economics',
  'accounting',
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

export type QuestionKind = 'formula' | 'multipleChoice' | 'numeric';

export interface SpreadsheetCell {
  row: number;
  col: number;
  value: string;
}

interface BaseLessonQuestion {
  id: string;
  nodeId: string;
  conceptId: string; // groups questions so a teaching card can precede each new concept
  difficultyTier: 1 | 2 | 3 | 4 | 5;
  scenarioTag?: string; // e.g. "Your manager asks:" — frames the question as a real ask
  prompt: string;
  explanation: string;
}

export interface FormulaQuestion extends BaseLessonQuestion {
  kind: 'formula';
  columnHeaders: string[];
  cells: SpreadsheetCell[];
  targetCellLabel: string; // e.g. "D2" — where the user types the formula
  acceptedFormulas: string[]; // normalized (uppercase, no spaces) accepted answers
  correctFormula: string; // canonical form to display
}

export interface MultipleChoiceOption {
  id: string;
  text: string;
}

export interface MultipleChoiceQuestion extends BaseLessonQuestion {
  kind: 'multipleChoice';
  context?: string; // optional scenario paragraph shown above the options
  options: MultipleChoiceOption[];
  correctOptionId: string;
}

export interface NumericQuestion extends BaseLessonQuestion {
  kind: 'numeric';
  context?: string;
  columnHeaders?: string[];
  cells?: SpreadsheetCell[];
  targetLabel: string; // e.g. "Gross Margin %" or "Runway (months)"
  unit?: string; // '$', '%', 'months', 'x', etc. — shown as an input suffix
  correctValue: number;
  tolerance?: number; // absolute tolerance, defaults to 0.01
}

export type LessonQuestion = FormulaQuestion | MultipleChoiceQuestion | NumericQuestion;

export interface ConceptExample {
  scenarioPrompt: string; // the worked example's own prompt
  columnHeaders?: string[];
  cells?: SpreadsheetCell[];
  targetLabel: string; // cell label, or a plain label like "Runway (months)"
  answer: string; // formula, chosen option text, or a computed value + unit
  resultExplanation: string;
}

export interface ConceptTeaching {
  id: string;
  trackId: TrackId;
  nodeId: string;
  skillName: string; // short name/formula shown in the code chip, e.g. "SUM()" or "Net Income"
  whatItDoes: string; // one plain-English sentence
  depthNote?: string; // optional second explanatory sentence, for tracks that need more context than a job-role framing gives
  scenarioBoxLabel?: string; // defaults to "ON THE JOB"; e.g. "IN REAL LIFE" or "AS A FOUNDER" for non-job tracks
  jobRole: string; // e.g. "Financial Analyst", or a life/founder-stage label like "Your First Paycheck" for non-job tracks
  jobScenario: string; // one-sentence scenario for that role/stage
  alsoAppliesLabel?: string; // defaults to "Also comes up in:"; e.g. "Also matters when:" for non-job tracks
  alsoAppliesIn: string[]; // 3-4 other roles/fields (or situations, for non-job tracks) where this concept also comes up
  example: ConceptExample;
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
  lastDailyPracticeDate: string | null; // YYYY-MM-DD of last completed daily practice
}

export type ProgressState = Record<TrackId, TrackProgress>;

export interface ExploreTrackFeedback {
  thumbsUp: number;
  thumbsDown: number;
  nudgeDismissed: boolean;
}

export type ExploreFeedbackState = Record<TrackId, ExploreTrackFeedback>;
