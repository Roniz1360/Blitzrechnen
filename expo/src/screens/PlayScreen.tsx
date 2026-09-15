import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Props } from '../navigation';
import { useApp } from '../AppStateContext';
import { exerciseById, levelStars, LevelId, Task } from '../models';
import { nextTask } from '../generators';
import { NumberPad } from '../components/NumberPad';
import { HundredField } from '../components/HundredField';
import { Colors, Radius } from '../theme';
import { ResultView } from './ResultView';

type Feedback = 'none' | 'correct' | 'wrong';

export function PlayScreen({ navigation, route }: Props<'Play'>) {
  const { typeId, mode, level } = route.params;
  const isTest = mode === 'test';
  const type = exerciseById(typeId)!;
  const { state, recordPractice, recordTest } = useApp();
  const total = isTest ? state.testCount : 10;

  const tasks = useMemo<Task[]>(
    () => Array.from({ length: total }, () => nextTask(typeId, level as LevelId)),
    [typeId, level, total]
  );

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>('none');
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(state.testSeconds);
  const recorded = useRef(false);

  // Timer nur im Test
  useEffect(() => {
    if (!isTest || finished) return;
    if (timeLeft <= 0) { setFinished(true); return; }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [isTest, finished, timeLeft]);

  const advance = () => {
    setFeedback('none');
    setInput('');
    setIndex((i) => {
      if (i + 1 >= total) { setFinished(true); return i; }
      return i + 1;
    });
  };

  const buzz = (ok: boolean) => {
    if (!state.soundOn) return;
    Haptics.notificationAsync(ok ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error).catch(() => {});
  };

  const submit = () => {
    const val = parseInt(input, 10);
    if (Number.isNaN(val)) return;
    if (val === tasks[index].answer) { setCorrect((c) => c + 1); setFeedback('correct'); buzz(true); }
    else { setFeedback('wrong'); buzz(false); }
  };

  // Auto-weiter nach Feedback
  useEffect(() => {
    if (feedback === 'correct') { const t = setTimeout(advance, 650); return () => clearTimeout(t); }
    if (feedback === 'wrong' && isTest) { const t = setTimeout(advance, 900); return () => clearTimeout(t); }
  }, [feedback, index]);

  // Ergebnis speichern
  useEffect(() => {
    if (!finished || recorded.current) return;
    recorded.current = true;
    const percent = total > 0 ? Math.floor((correct * 100) / total) : 0;
    if (isTest) {
      const earned = percent >= 80 ? levelStars(level as LevelId) * 2 : percent >= 50 ? levelStars(level as LevelId) : 1;
      recordTest(typeId, percent, levelStars(level as LevelId), correct, earned);
    } else {
      recordPractice(typeId, correct);
    }
  }, [finished]);

  if (finished) {
    return (
      <ResultView
        type={type}
        isTest={isTest}
        correct={correct}
        total={total}
        onHome={() => navigation.popToTop()}
        onAgain={() => navigation.goBack()}
      />
    );
  }

  const task = tasks[index];
  const boxColor = feedback === 'correct' ? Colors.grass : feedback === 'wrong' ? Colors.coral : Colors.surfaceVariant;

  return (
    <SafeAreaView style={styles.fill} edges={['top', 'bottom']}>
      <View style={[styles.header, { backgroundColor: type.color }]}>
        <View style={styles.headRow}>
          <Text style={styles.headText}>{index + 1} / {total}</Text>
          <Text style={styles.headTitle}>{type.title}</Text>
          {isTest ? <Text style={styles.timer}>⏱ {timeLeft}</Text> : <Text style={styles.headText}>✓ {correct}</Text>}
        </View>
        <View style={styles.track}><View style={[styles.fillBar, { width: `${(index / total) * 100}%` }]} /></View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {task.visual?.kind === 'hundredField' && <HundredField count={task.visual.count} size={280} />}
        {task.visual?.kind === 'chartStrip' && (
          <View style={styles.strip}>
            {task.visual.values.map((v, i) => (
              <View key={i} style={[styles.stripCell, v === null && styles.stripGap]}>
                <Text style={styles.stripText}>{v === null ? '?' : v}</Text>
              </View>
            ))}
          </View>
        )}
        <Text style={styles.question}>{task.question}</Text>
        <View style={[styles.answer, { backgroundColor: boxColor }]}>
          <Text style={[styles.answerText, feedback !== 'none' && { color: Colors.white }]}>{input || '?'}</Text>
        </View>
        {feedback === 'wrong' && !isTest ? <Text style={styles.hint}>Fast! {task.hint}</Text> : null}
      </ScrollView>

      <View style={{ padding: 16 }}>
        <NumberPad
          okEnabled={input.length > 0 && feedback === 'none'}
          onDigit={(d) => {
            if (feedback === 'correct') return;
            if (feedback === 'wrong') { setFeedback('none'); setInput(`${d}`); return; }
            if (input.length < 3) setInput(input + d);
          }}
          onDelete={() => { if (feedback === 'wrong') setFeedback('none'); setInput((s) => s.slice(0, -1)); }}
          onOk={() => { if (feedback === 'none') submit(); }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: Colors.cream },
  header: { paddingHorizontal: 16, paddingVertical: 14 },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headText: { color: Colors.white, fontWeight: '700', fontSize: 18 },
  headTitle: { color: Colors.white, fontWeight: '800', fontSize: 18, flexShrink: 1, textAlign: 'center' },
  timer: { color: Colors.white, fontWeight: '700', backgroundColor: '#FFFFFF40', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 },
  track: { height: 10, backgroundColor: '#FFFFFF4D', borderRadius: 6, marginTop: 10, overflow: 'hidden' },
  fillBar: { height: 10, backgroundColor: Colors.white, borderRadius: 6 },
  body: { padding: 20, alignItems: 'center', gap: 14 },
  question: { fontSize: 32, fontWeight: '800', textAlign: 'center', color: Colors.ink, lineHeight: 40 },
  answer: { minWidth: 160, borderRadius: Radius.md, paddingHorizontal: 32, paddingVertical: 16, alignItems: 'center' },
  answerText: { fontSize: 44, fontWeight: '800', color: Colors.ink },
  hint: { color: Colors.coral, fontWeight: '700', fontSize: 16, textAlign: 'center' },
  strip: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  stripCell: { width: 72, height: 72, borderRadius: Radius.sm, backgroundColor: Colors.surfaceVariant, alignItems: 'center', justifyContent: 'center' },
  stripGap: { backgroundColor: '#FFD23F40', borderWidth: 3, borderColor: Colors.sunny },
  stripText: { fontSize: 30, fontWeight: '800', color: Colors.ink },
});
