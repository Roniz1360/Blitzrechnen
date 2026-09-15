import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import {
  AppState, Profile, ExerciseProgress, emptyProgress,
  initialState, loadState, saveState,
} from './storage';
import { pinHash } from './pin';

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

interface Api {
  state: AppState;
  ready: boolean;
  addProfile: (name: string, avatar: string) => void;
  selectProfile: (id: string) => void;
  deleteProfile: (id: string) => void;
  setSound: (on: boolean) => void;
  setTestSeconds: (sec: number) => void;
  setPin: (pin: string) => Promise<void>;
  clearPin: () => void;
  recordPractice: (typeId: string, correct: number) => void;
  recordTest: (typeId: string, percent: number, levelStars: number, correct: number, earnedStars: number) => void;
}

const Ctx = createContext<Api | null>(null);

export function useApp(): Api {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp muss innerhalb von AppProvider verwendet werden');
  return v;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadState().then((s) => { setState(s); setReady(true); });
  }, []);

  // Bei jeder Änderung speichern
  const update = useCallback((fn: (s: AppState) => AppState) => {
    setState((prev) => {
      const next = fn(prev);
      saveState(next);
      return next;
    });
  }, []);

  const updateActive = useCallback((fn: (p: Profile) => Record<string, ExerciseProgress>, stars = 0) => {
    update((s) => {
      if (!s.activeProfileId) return s;
      return {
        ...s,
        profiles: s.profiles.map((p) =>
          p.id === s.activeProfileId
            ? { ...p, progress: fn(p), totalStars: p.totalStars + stars }
            : p
        ),
      };
    });
  }, [update]);

  const api: Api = {
    state,
    ready,
    addProfile: (name, avatar) => update((s) => {
      const p: Profile = { id: newId(), name: name.trim() || 'Kind', avatar, totalStars: 0, progress: {} };
      return { ...s, profiles: [...s.profiles, p], activeProfileId: s.activeProfileId ?? p.id };
    }),
    selectProfile: (id) => update((s) => ({ ...s, activeProfileId: id })),
    deleteProfile: (id) => update((s) => {
      const remaining = s.profiles.filter((p) => p.id !== id);
      return {
        ...s,
        profiles: remaining,
        activeProfileId: s.activeProfileId === id ? (remaining[0]?.id ?? null) : s.activeProfileId,
      };
    }),
    setSound: (on) => update((s) => ({ ...s, soundOn: on })),
    setTestSeconds: (sec) => update((s) => ({ ...s, testSeconds: sec })),
    setPin: async (pin) => { const h = await pinHash(pin); update((s) => ({ ...s, parentPinHash: h })); },
    clearPin: () => update((s) => ({ ...s, parentPinHash: null })),
    recordPractice: (typeId, correct) => updateActive((p) => {
      const cur = p.progress[typeId] ?? emptyProgress();
      return { ...p.progress, [typeId]: { ...cur, practiced: true, totalCorrect: cur.totalCorrect + correct } };
    }, /* Sterne = richtige Aufgaben */ correct),
    recordTest: (typeId, percent, levelStars, correct, earnedStars) => updateActive((p) => {
      const cur = p.progress[typeId] ?? emptyProgress();
      const passed = cur.passed || percent >= 80;
      return {
        ...p.progress,
        [typeId]: {
          ...cur,
          tested: true,
          passed,
          bestPercent: Math.max(cur.bestPercent, percent),
          bestLevelStars: Math.max(cur.bestLevelStars, percent >= 80 ? levelStars : 0),
          totalCorrect: cur.totalCorrect + correct,
        },
      };
    }, earnedStars),
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
