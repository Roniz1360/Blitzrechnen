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
  /** Kurzes Zeichen für die Kachel (statt Emoji). */
  glyph: string;
  color: string;
  lp21: string;
  description: string;
}

// Farben dunkel genug für weisse Schrift (Kontrast ≥ 4.5:1)
// Die 10 Blitz-Übungstypen der 2. Klasse (Zahlenraum bis 100)
export const EXERCISES: ExerciseType[] = [
  { id: 'anzahl', title: 'Wie viele?', emoji: '👀', glyph: '::', color: '#D9363E', lp21: 'MA.1.A.1', description: 'Zähle die Punkte am Hunderterfeld.' },
  { id: 'tafel', title: 'Zahlen finden', emoji: '🔢', glyph: '?', color: '#C2620A', lp21: 'MA.1.A.1.c', description: 'Welche Zahl fehlt?' },
  { id: 'schritte', title: 'Zählen in Schritten', emoji: '🐾', glyph: '+2', color: '#0E8A5F', lp21: 'MA.1.A.2.d', description: 'Zähle in 2er-, 5er- oder 10er-Schritten.' },
  { id: 'erg_zehner', title: 'Ergänzen zum Zehner', emoji: '🔟', glyph: '10', color: '#0F8078', lp21: 'MA.1.A.3.b', description: 'Ergänze bis zum nächsten Zehner.' },
  { id: 'erg_hundert', title: 'Ergänzen bis 100', emoji: '💯', glyph: '100', color: '#2563EB', lp21: 'MA.1.A.3.b', description: 'Ergänze bis 100.' },
  { id: 'doppel', title: 'Verdoppeln & Halbieren', emoji: '✌️', glyph: '×2', color: '#7C3AED', lp21: 'MA.1.A.3.b', description: 'Verdopple oder halbiere die Zahl.' },
  { id: 'plus', title: 'Plusaufgaben', emoji: '➕', glyph: '+', color: '#5B2BD9', lp21: 'MA.1.A.3.b', description: 'Rechne die Plusaufgabe.' },
  { id: 'minus', title: 'Minusaufgaben', emoji: '➖', glyph: '−', color: '#C0267A', lp21: 'MA.1.A.3.b', description: 'Rechne die Minusaufgabe.' },
  { id: 'hundert_teilen', title: '100 teilen', emoji: '🍰', glyph: '½', color: '#C2410C', lp21: 'MA.1.A.3.b', description: 'Wie viel fehlt zu 100?' },
  { id: 'malreihen', title: 'Malreihen 2·5·10', emoji: '⭐', glyph: '×', color: '#0369A1', lp21: 'MA.1.A.3.c', description: 'Rechne mit den Reihen 2, 5 und 10.' },
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
