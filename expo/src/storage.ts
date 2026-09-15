import AsyncStorage from '@react-native-async-storage/async-storage';

// ---- Datentypen (wie native App) ----

export interface ExerciseProgress {
  practiced: boolean;
  tested: boolean;
  passed: boolean;
  bestPercent: number;
  bestLevelStars: number;
  totalCorrect: number;
}

export function emptyProgress(): ExerciseProgress {
  return { practiced: false, tested: false, passed: false, bestPercent: 0, bestLevelStars: 0, totalCorrect: 0 };
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  totalStars: number;
  progress: Record<string, ExerciseProgress>;
}

export interface AppState {
  profiles: Profile[];
  activeProfileId: string | null;
  soundOn: boolean;
  testSeconds: number;
  testCount: number;
  parentPinHash: string | null;
}

export function initialState(): AppState {
  return { profiles: [], activeProfileId: null, soundOn: true, testSeconds: 60, testCount: 10, parentPinHash: null };
}

export function activeProfile(s: AppState): Profile | undefined {
  return s.profiles.find((p) => p.id === s.activeProfileId);
}

export function passCount(p: Profile): number {
  return Object.values(p.progress).filter((x) => x.passed).length;
}

export function progressFor(p: Profile | undefined, typeId: string): ExerciseProgress {
  return p?.progress[typeId] ?? emptyProgress();
}

// ---- Persistenz (offline, auf dem Gerät) ----

const KEY = 'blitz_state_v1';

export async function loadState(): Promise<AppState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return initialState();
    return { ...initialState(), ...JSON.parse(raw) };
  } catch {
    return initialState();
  }
}

export async function saveState(state: AppState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Speichern fehlgeschlagen – App läuft mit In-Memory-Zustand weiter.
  }
}
