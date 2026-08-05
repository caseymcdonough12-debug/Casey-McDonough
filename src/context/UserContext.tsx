import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ExperienceLevel, LifeStage, TrackId, UserProfile } from '../types';
import { estimatedProficiencyFromExperience } from '../utils/xp';

const STORAGE_KEY = 'rung:userProfile';

const DEFAULT_PROFILE: UserProfile = {
  hasAccount: false,
  accountName: null,
  accountEmail: null,
  hasOnboarded: false,
  onboardingTrack: null,
  isExploring: false,
  lifeStage: null,
  experience: null,
  estimatedProficiency: 1,
  currentTrack: 'finance',
};

interface UserContextValue {
  profile: UserProfile;
  loading: boolean;
  createAccount: (name: string, email: string) => Promise<void>;
  completeOnboarding: (
    track: TrackId | null,
    lifeStage: LifeStage,
    experience: ExperienceLevel
  ) => Promise<void>;
  setCurrentTrack: (track: TrackId) => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(raw) });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (next: UserProfile) => {
    setProfile(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const createAccount = async (name: string, email: string) => {
    await persist({
      ...profile,
      hasAccount: true,
      accountName: name,
      accountEmail: email,
    });
  };

  const completeOnboarding = async (
    track: TrackId | null,
    lifeStage: LifeStage,
    experience: ExperienceLevel
  ) => {
    await persist({
      ...profile,
      hasOnboarded: true,
      onboardingTrack: track,
      isExploring: track === null,
      lifeStage,
      experience,
      estimatedProficiency: estimatedProficiencyFromExperience(experience),
      currentTrack: track ?? 'finance',
    });
  };

  const setCurrentTrack = async (track: TrackId) => {
    await persist({ ...profile, currentTrack: track });
  };

  const value = useMemo(
    () => ({ profile, loading, createAccount, completeOnboarding, setCurrentTrack }),
    [profile, loading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}
