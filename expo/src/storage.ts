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
  /** Anzahl Tage in Folge mit mindestens einer Runde. */
  streak?: number;
  /** Letzter Spieltag als YYYY-MM-DD (lokal). */
  lastPlayDay?: string;
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

/** Heutiges Datum als YYYY-MM-DD (lokale Zeit). */
export function dayKey(d: Date = new Date()): string {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dayKey(d);
}

/** Neue Serie nach einer gespielten Runde heute. */
export function bumpStreak(p: Profile): { streak: number; lastPlayDay: string } {
  const today = dayKey();
  if (p.lastPlayDay === today) return { streak: p.streak ?? 1, lastPlayDay: today };
  const streak = p.lastPlayDay === yesterdayKey() ? (p.streak ?? 0) + 1 : 1;
  return { streak, lastPlayDay: today };
}

/** Aktuelle Serie für die Anzeige (0, wenn gestern und heute nicht gespielt). */
export function currentStreak(p: Profile | undefined): number {
  if (!p?.lastPlayDay) return 0;
  return p.lastPlayDay === dayKey() || p.lastPlayDay === yesterdayKey() ? (p.streak ?? 0) : 0;
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
