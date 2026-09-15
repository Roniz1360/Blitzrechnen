// Datentypen – portiert aus der nativen Kotlin-App

export type LevelId = 0 | 1 | 2;

export const Levels = [
  { id: 0 as LevelId, label: 'Anfänger', stars: 1 },
  { id: 1 as LevelId, label: 'Könner', stars: 2 },
  { id: 2 as LevelId, label: 'Profi', stars: 3 },
];

export function levelStars(id: LevelId): number {
  return Levels[id]?.stars ?? 1;
}

export interface ExerciseType {
  id: string;
  title: string;
  emoji: string;
  color: string;
  lp21: string;
  description: string;
}

// Die 10 Blitz-Übungstypen der 2. Klasse (Zahlenraum bis 100)
export const EXERCISES: ExerciseType[] = [
  { id: 'anzahl', title: 'Wie viele?', emoji: '👀', color: '#EF6C6C', lp21: 'MA.1.A.1', description: 'Zähle die Punkte am Hunderterfeld.' },
  { id: 'tafel', title: 'Zahlen finden', emoji: '🔢', color: '#F59E0B', lp21: 'MA.1.A.1.c', description: 'Welche Zahl fehlt?' },
  { id: 'schritte', title: 'Zählen in Schritten', emoji: '🐾', color: '#10B981', lp21: 'MA.1.A.2.d', description: 'Zähle in 2er-, 5er- oder 10er-Schritten.' },
  { id: 'erg_zehner', title: 'Ergänzen zum Zehner', emoji: '🔟', color: '#14B8A6', lp21: 'MA.1.A.3.b', description: 'Ergänze bis zum nächsten Zehner.' },
  { id: 'erg_hundert', title: 'Ergänzen bis 100', emoji: '💯', color: '#3B82F6', lp21: 'MA.1.A.3.b', description: 'Ergänze bis 100.' },
  { id: 'doppel', title: 'Verdoppeln & Halbieren', emoji: '✌️', color: '#8B5CF6', lp21: 'MA.1.A.3.b', description: 'Verdopple oder halbiere die Zahl.' },
  { id: 'plus', title: 'Plusaufgaben', emoji: '➕', color: '#6D3BF5', lp21: 'MA.1.A.3.b', description: 'Rechne die Plusaufgabe.' },
  { id: 'minus', title: 'Minusaufgaben', emoji: '➖', color: '#EC4899', lp21: 'MA.1.A.3.b', description: 'Rechne die Minusaufgabe.' },
  { id: 'hundert_teilen', title: '100 teilen', emoji: '🍰', color: '#F97316', lp21: 'MA.1.A.3.b', description: 'Wie viel fehlt zu 100?' },
  { id: 'malreihen', title: 'Malreihen 2·5·10', emoji: '⭐', color: '#0EA5E9', lp21: 'MA.1.A.3.c', description: 'Rechne mit den Reihen 2, 5 und 10.' },
];

export function exerciseById(id: string): ExerciseType | undefined {
  return EXERCISES.find((e) => e.id === id);
}

export type Visual =
  | { kind: 'hundredField'; count: number }
  | { kind: 'chartStrip'; values: (number | null)[] };

export interface Task {
  typeId: string;
  question: string;
  answer: number;
  hint: string;
  visual?: Visual;
}
