import { NavigatorScreenParams } from '@react-navigation/native';
import { TrackId } from '../types';

export type RootStackParamList = {
  TrackSelect: undefined;
  LifeStage: { track: TrackId | null };
  MainTabs: NavigatorScreenParams<MainTabsParamList> | undefined;
  Lesson: { trackId: TrackId; nodeId: string; fromExplore: boolean };
  DailyPractice: { trackId: TrackId };
  Completion: {
    trackId: TrackId;
    nodeId: string;
    xpEarned: number;
    correctCount: number;
    totalCount: number;
    fromExplore: boolean;
    isDaily?: boolean;
  };
  ExploreFeedback: { trackId: TrackId; nodeId: string };
};

export type MainTabsParamList = {
  Learn: undefined;
  Explore: undefined;
};
