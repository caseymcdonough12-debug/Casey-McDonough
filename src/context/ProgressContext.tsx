import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ALL_TRACK_IDS, ExploreFeedbackState, ProgressState, TrackId, TrackProgress } from '../types';
import { nextStreakOnActivity, todayStr } from '../utils/date';
import { recalibrateProficiency } from '../utils/proficiency';
import { xpForAnswer } from '../utils/xp';
import { useUser } from './UserContext';

const PROGRESS_KEY = 'rung:progress';
const EXPLORE_FEEDBACK_KEY = 'rung:exploreFeedback';

function emptyTrackProgress(effectiveProficiency: number): TrackProgress {
  return {
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    completedNodeIds: [],
    effectiveProficiency,
    recentAnswers: [],
    lastDailyPracticeDate: null,
  };
}

function emptyExploreFeedback() {
  return { thumbsUp: 0, thumbsDown: 0, nudgeDismissed: false };
}

interface ProgressContextValue {
  progress: ProgressState;
  exploreFeedback: ExploreFeedbackState;
  loading: boolean;
  getTrackProgress: (trackId: TrackId) => TrackProgress;
  recordAnswer: (
    trackId: TrackId,
    difficultyTier: number,
    wasCorrect: boolean
  ) => Promise<number>;
  completeNode: (trackId: TrackId, nodeId: string) => Promise<void>;
  completeDailyPractice: (trackId: TrackId) => Promise<void>;
  recordExploreFeedback: (
    trackId: TrackId,
    liked: boolean
  ) => Promise<{ showNudge: boolean }>;
  dismissNudge: (trackId: TrackId) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(
  undefined
);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useUser();
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [exploreFeedback, setExploreFeedback] =
    useState<ExploreFeedbackState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [progressRaw, feedbackRaw] = await Promise.all([
          AsyncStorage.getItem(PROGRESS_KEY),
          AsyncStorage.getItem(EXPLORE_FEEDBACK_KEY),
        ]);
        setProgress(progressRaw ? JSON.parse(progressRaw) : {});
        setExploreFeedback(feedbackRaw ? JSON.parse(feedbackRaw) : {});
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persistProgress = async (next: ProgressState) => {
    setProgress(next);
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
  };

  const persistFeedback = async (next: ExploreFeedbackState) => {
    setExploreFeedback(next);
    await AsyncStorage.setItem(EXPLORE_FEEDBACK_KEY, JSON.stringify(next));
  };

  const getTrackProgress = (trackId: TrackId): TrackProgress => {
    return progress?.[trackId] ?? emptyTrackProgress(profile.estimatedProficiency);
  };

  const recordAnswer = async (
    trackId: TrackId,
    difficultyTier: number,
    wasCorrect: boolean
  ) => {
    const current = getTrackProgress(trackId);
    const xpEarned = wasCorrect
      ? xpForAnswer(difficultyTier, current.effectiveProficiency)
      : 0;
    const { proficiency, recentAnswers } = recalibrateProficiency(
      current.recentAnswers,
      wasCorrect,
      current.effectiveProficiency
    );
    const { streak, lastActiveDate } = nextStreakOnActivity(
      current.streak,
      current.lastActiveDate
    );

    const next: TrackProgress = {
      ...current,
      xp: current.xp + xpEarned,
      streak,
      lastActiveDate,
      effectiveProficiency: proficiency,
      recentAnswers,
    };

    await persistProgress({ ...(progress ?? {}), [trackId]: next } as ProgressState);
    return xpEarned;
  };

  const completeNode = async (trackId: TrackId, nodeId: string) => {
    const current = getTrackProgress(trackId);
    if (current.completedNodeIds.includes(nodeId)) return;
    const next: TrackProgress = {
      ...current,
      completedNodeIds: [...current.completedNodeIds, nodeId],
    };
    await persistProgress({ ...(progress ?? {}), [trackId]: next } as ProgressState);
  };

  const completeDailyPractice = async (trackId: TrackId) => {
    const current = getTrackProgress(trackId);
    const next: TrackProgress = { ...current, lastDailyPracticeDate: todayStr() };
    await persistProgress({ ...(progress ?? {}), [trackId]: next } as ProgressState);
  };

  const recordExploreFeedback = async (trackId: TrackId, liked: boolean) => {
    const current = exploreFeedback?.[trackId] ?? emptyExploreFeedback();
    const next = {
      ...current,
      thumbsUp: current.thumbsUp + (liked ? 1 : 0),
      thumbsDown: current.thumbsDown + (liked ? 0 : 1),
    };
    await persistFeedback({ ...(exploreFeedback ?? {}), [trackId]: next } as ExploreFeedbackState);
    const showNudge = next.thumbsUp >= 2 && !next.nudgeDismissed;
    return { showNudge };
  };

  const dismissNudge = async (trackId: TrackId) => {
    const current = exploreFeedback?.[trackId] ?? emptyExploreFeedback();
    const next = { ...current, nudgeDismissed: true };
    await persistFeedback({ ...(exploreFeedback ?? {}), [trackId]: next } as ExploreFeedbackState);
  };

  const value = useMemo(
    () => ({
      progress: progress ?? ({} as ProgressState),
      exploreFeedback: exploreFeedback ?? ({} as ExploreFeedbackState),
      loading,
      getTrackProgress,
      recordAnswer,
      completeNode,
      completeDailyPractice,
      recordExploreFeedback,
      dismissNudge,
    }),
    [progress, exploreFeedback, loading, profile.estimatedProficiency]
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within a ProgressProvider');
  return ctx;
}

export { ALL_TRACK_IDS };
