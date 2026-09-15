import { LevelId, Task } from './models';

// Zufallshilfen (untere Grenze inkl., obere exkl. – wie kotlin Random.nextInt)
function rnd(fromIncl: number, untilExcl: number): number {
  return fromIncl + Math.floor(Math.random() * (untilExcl - fromIncl));
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Aufgaben-Generatoren für die 2. Klasse (Zahlenraum bis 100), Lehrplan 21.
 * 1:1 portiert aus der nativen Kotlin-App.
 */
export function nextTask(typeId: string, level: LevelId): Task {
  switch (typeId) {
    case 'anzahl': return anzahl(level);
    case 'tafel': return tafel(level);
    case 'schritte': return schritte(level);
    case 'erg_zehner': return ergZehner(level);
    case 'erg_hundert': return ergHundert(level);
    case 'doppel': return doppel(level);
    case 'plus': return plus(level);
    case 'minus': return minus(level);
    case 'hundert_teilen': return hundertTeilen(level);
    case 'malreihen': return malreihen(level);
    default: return plus(level);
  }
}

function anzahl(level: LevelId): Task {
  let n: number;
  if (level === 0) n = rnd(1, 5) * 10 + rnd(0, 10);
  else if (level === 1) n = rnd(11, 80);
  else n = rnd(21, 100);
  return {
    typeId: 'anzahl',
    question: 'Wie viele Punkte?',
    answer: n,
    hint: 'Zähle zuerst die vollen Zehnerstreifen, dann die einzelnen Punkte.',
    visual: { kind: 'hundredField', count: n },
  };
}

function tafel(level: LevelId): Task {
  if (level === 0) {
    const m = rnd(2, 98);
    return { typeId: 'tafel', question: `Welche Zahl liegt zwischen ${m - 1} und ${m + 1}?`, answer: m, hint: 'Die Zahl in der Mitte.', visual: { kind: 'chartStrip', values: [m - 1, null, m + 1] } };
  } else if (level === 1) {
    const m = rnd(1, 90);
    return { typeId: 'tafel', question: `Welche Zahl steht ein Feld unter ${m}?`, answer: m + 10, hint: 'Ein Feld nach unten heisst +10.', visual: { kind: 'chartStrip', values: [m, null] } };
  } else {
    const m = rnd(12, 89);
    return { typeId: 'tafel', question: `Welche Zahl kommt vor ${m}?`, answer: m - 1, hint: 'Eins weniger.', visual: { kind: 'chartStrip', values: [null, m] } };
  }
}

function schritte(level: LevelId): Task {
  const step = level === 0 ? pick([10, 5]) : pick([2, 5, 10]);
  const forward = level === 0 ? true : Math.random() < 0.5;
  const start = forward ? rnd(0, 100 - 4 * step) : rnd(4 * step, 100);
  const seq = [0, 1, 2].map((i) => start + (forward ? i : -i) * step);
  const answer = start + (forward ? 3 : -3) * step;
  const shown = seq.join(', ') + ', ___';
  const dir = forward ? 'vorwärts' : 'rückwärts';
  return { typeId: 'schritte', question: `${shown}\n\nWie geht es weiter? (${step}er-Schritte ${dir})`, answer, hint: `Immer ${forward ? '+' : '−'}${step} rechnen.` };
}

function ergZehner(level: LevelId): Task {
  const tens = rnd(1, level === 0 ? 5 : 10);
  const ones = level === 0 ? rnd(1, 4) : rnd(1, 10);
  const start = tens * 10 + ones;
  const target = (tens + 1) * 10;
  return { typeId: 'erg_zehner', question: `${start} + ___ = ${target}`, answer: target - start, hint: 'Wie viel fehlt bis zum nächsten Zehner?', visual: { kind: 'hundredField', count: start } };
}

function ergHundert(level: LevelId): Task {
  let start: number;
  if (level === 0) start = rnd(1, 10) * 10;
  else if (level === 1) start = rnd(1, 10) * 5;
  else start = rnd(1, 100);
  return { typeId: 'erg_hundert', question: `${start} + ___ = 100`, answer: 100 - start, hint: `Denke: Wie weit ist es von ${start} bis 100?`, visual: { kind: 'hundredField', count: start } };
}

function doppel(level: LevelId): Task {
  const halve = level === 0 ? false : Math.random() < 0.5;
  if (halve) {
    const half = rnd(1, level === 2 ? 50 : 26);
    const n = half * 2;
    return { typeId: 'doppel', question: `Halbiere ${n}`, answer: half, hint: `Die Hälfte von ${n}.` };
  }
  const n = level === 2 ? rnd(10, 50) : rnd(1, 6) * 5;
  return { typeId: 'doppel', question: `Verdopple ${n}`, answer: n * 2, hint: `${n} und noch einmal ${n}.` };
}

function plus(level: LevelId): Task {
  if (level === 0) {
    const tens = rnd(1, 9), e1 = rnd(0, 5), e2 = rnd(0, 5);
    const a = tens * 10 + e1;
    return { typeId: 'plus', question: `${a} + ${e2} = `, answer: a + e2, hint: 'Zähle die Einer zusammen.' };
  } else if (level === 1) {
    const t1 = rnd(1, 5), e1 = rnd(0, 5);
    const t2 = rnd(1, 4), e2 = rnd(0, 5 - e1 + 1);
    const a = t1 * 10 + e1, b = t2 * 10 + e2;
    return { typeId: 'plus', question: `${a} + ${b} = `, answer: a + b, hint: 'Zehner und Einer getrennt rechnen.' };
  } else {
    const a = rnd(6, 60);
    const b = Math.max(6, rnd(6, 100 - a));
    return { typeId: 'plus', question: `${a} + ${b} = `, answer: a + b, hint: 'Erst zum Zehner, dann weiter.' };
  }
}

function minus(level: LevelId): Task {
  if (level === 0) {
    const tens = rnd(1, 9), e1 = rnd(2, 9);
    const a = tens * 10 + e1;
    const b = rnd(1, e1 + 1);
    return { typeId: 'minus', question: `${a} − ${b} = `, answer: a - b, hint: 'Nimm nur von den Einern weg.' };
  } else if (level === 1) {
    const t1 = rnd(2, 9), e1 = rnd(0, 9);
    const t2 = rnd(1, t1), e2 = rnd(0, e1 + 1);
    const a = t1 * 10 + e1, b = t2 * 10 + e2;
    return { typeId: 'minus', question: `${a} − ${b} = `, answer: a - b, hint: 'Zehner und Einer getrennt.' };
  } else {
    const a = rnd(20, 100);
    const b = rnd(6, a - 1);
    return { typeId: 'minus', question: `${a} − ${b} = `, answer: a - b, hint: 'Erst zum Zehner zurück.' };
  }
}

function hundertTeilen(level: LevelId): Task {
  let part: number;
  if (level === 0) part = rnd(1, 10) * 10;
  else if (level === 1) part = rnd(1, 20) * 5;
  else part = rnd(1, 100);
  return { typeId: 'hundert_teilen', question: `100 = ${part} + ___`, answer: 100 - part, hint: 'Die beiden Teile ergeben zusammen 100.' };
}

function malreihen(level: LevelId): Task {
  const factor = level === 0 ? pick([2, 10]) : pick([2, 5, 10]);
  const n = rnd(1, 11);
  return { typeId: 'malreihen', question: `${factor} · ${n} = `, answer: factor * n, hint: `Zähle in ${factor}er-Schritten ${n} mal.` };
}
