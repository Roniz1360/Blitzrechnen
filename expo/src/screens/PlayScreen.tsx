import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Props } from '../navigation';
import { useApp } from '../AppStateContext';
import { exerciseById, levelStars, LevelId, Task } from '../models';
import { nextTask } from '../generators';
import { NumberPad } from '../components/NumberPad';
import { HundredField } from '../components/HundredField';
import { CloseIcon, TimerIcon, CheckIcon, BulbIcon } from '../components/Icons';
import { Colors, Radius, Fonts } from '../theme';
import { ResultView } from './ResultView';

type Feedback = 'none' | 'correct' | 'wrong';
/** Ergebnis pro Aufgabe: g = beim ersten Versuch richtig, w = mit Fehler. */
type Mark = 'g' | 'w';

const PRAISE = ['Super!', 'Blitzschnell!', 'Richtig!', 'Toll gemacht!', 'Stark!', 'Genau!'];

/** Sterne für einen Blitz-Test (gleiche Regel wie in der nativen App). */
function testStars(percent: number, level: LevelId): number {
  return percent >= 80 ? levelStars(level) * 2 : percent >= 50 ? levelStars(level) : 1;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = `${sec % 60}`.padStart(2, '0');
  return `${m}:${s}`;
}

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
  const [marks, setMarks] = useState<Mark[]>([]);
  const [missed, setMissed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(state.testSeconds);
  const recorded = useRef(false);

  // Animationen für das Antwortfeld
  const scale = useRef(new Animated.Value(1)).current;
  const shake = useRef(new Animated.Value(0)).current;

  const pop = () => {
    scale.setValue(0.9);
    Animated.spring(scale, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }).start();
  };
  const wobble = () => {
    shake.setValue(0);
    Animated.timing(shake, { toValue: 1, duration: 320, easing: Easing.linear, useNativeDriver: true }).start();
  };
  const shakeX = shake.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [0, -10, 10, -6, 0] });

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
    setMissed(false);
    setIndex((i) => {
      if (i + 1 >= total) { setFinished(true); return i; }
      return i + 1;
    });
  };

  const buzz = (ok: boolean) => {
    if (!state.soundOn) return;
    Haptics.notificationAsync(ok ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error).catch(() => {});
  };

  const tap = () => {
    if (!state.soundOn) return;
    Haptics.selectionAsync().catch(() => {});
  };

  const submit = () => {
    const val = parseInt(input, 10);
    if (Number.isNaN(val)) return;
    if (val === tasks[index].answer) {
      setCorrect((c) => c + 1);
      setMarks((m) => { const n = [...m]; n[index] = missed ? 'w' : 'g'; return n; });
      setFeedback('correct'); buzz(true); pop();
    } else {
      setMissed(true);
      if (isTest) setMarks((m) => { const n = [...m]; n[index] = 'w'; return n; });
      setFeedback('wrong'); buzz(false); wobble();
    }
  };

  // Auto-weiter nach Feedback
  useEffect(() => {
    if (feedback === 'correct') { const t = setTimeout(advance, 750); return () => clearTimeout(t); }
    if (feedback === 'wrong' && isTest) { const t = setTimeout(advance, 900); return () => clearTimeout(t); }
  }, [feedback, index]);

  // Ergebnis speichern
  useEffect(() => {
    if (!finished || recorded.current) return;
    recorded.current = true;
    const percent = total > 0 ? Math.floor((correct * 100) / total) : 0;
    if (isTest) {
      recordTest(typeId, percent, levelStars(level as LevelId), correct, testStars(percent, level as LevelId));
    } else {
      recordPractice(typeId, correct);
    }
  }, [finished]);

  if (finished) {
    const percent = total > 0 ? Math.floor((correct * 100) / total) : 0;
    const earned = isTest ? testStars(percent, level as LevelId) : correct;
    return (
      <ResultView
        type={type}
        isTest={isTest}
        correct={correct}
        total={total}
        earnedStars={earned}
        timeUsed={isTest ? state.testSeconds - timeLeft : undefined}
        onHome={() => navigation.popToTop()}
        onAgain={() => navigation.replace('Play', { typeId, mode, level })}
      />
    );
  }

  const task = tasks[index];
  const ok = feedback === 'correct';
  const wrong = feedback === 'wrong';
  const lowTime = isTest && timeLeft <= 10;

  return (
    <SafeAreaView style={styles.fill} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.close} onPress={() => navigation.goBack()} hitSlop={8} accessibilityRole="button" accessibilityLabel="Beenden">
          <CloseIcon size={22} />
        </Pressable>
        <View style={styles.dots}>
          {tasks.map((_, i) => {
            const m = marks[i];
            const bg = m === 'g' ? Colors.grassBright : m === 'w' ? Colors.orange : i === index ? Colors.sunny : Colors.night3;
            return <View key={i} style={[styles.dot, { backgroundColor: bg }]} />;
          })}
        </View>
        {isTest ? (
          <View style={[styles.pill, lowTime && { backgroundColor: Colors.coral }]}>
            <TimerIcon size={16} color={lowTime ? Colors.white : Colors.sunny} />
            <Text style={styles.pillText}>{formatTime(Math.max(0, timeLeft))}</Text>
          </View>
        ) : (
          <View style={styles.pill}>
            <CheckIcon size={16} color={Colors.grassBright} />
            <Text style={styles.pillText}>{correct}</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={[styles.tag, { backgroundColor: type.color }]}>
          <Text style={styles.tagText}>{type.title.toUpperCase()} · {index + 1} VON {total}</Text>
        </View>

        {task.visual?.kind === 'hundredField' && (
          <View style={styles.visualCard}><HundredField count={task.visual.count} size={240} /></View>
        )}
        {task.visual?.kind === 'chartStrip' && (
          <View style={styles.strip}>
            {task.visual.values.map((v, i) => (
              <View key={i} style={[styles.stripCell, v === null && styles.stripGap]}>
                <Text style={[styles.stripText, v === null && { color: Colors.sunny }]}>{v === null ? '?' : v}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.question}>{task.question}</Text>

        <Animated.View
          style={[
            styles.answer,
            {
              borderColor: ok ? Colors.grassBright : wrong ? Colors.orange : Colors.sunny,
              backgroundColor: ok ? Colors.grass : wrong ? '#3B2A5A' : Colors.night2,
              transform: [{ scale }, { translateX: shakeX }],
            },
          ]}
        >
          <Text style={[styles.answerText, !input && { color: '#8A80D0' }]}>{input || '?'}</Text>
        </Animated.View>

        <View style={styles.feedbackRow}>
          {ok ? (
            <View style={styles.praise}>
              <CheckIcon size={22} />
              <Text style={styles.praiseText}>{PRAISE[index % PRAISE.length]}</Text>
            </View>
          ) : null}
          {wrong && !isTest ? (
            <View style={styles.hint}>
              <BulbIcon size={22} color="#C2410C" />
              <Text style={styles.hintText}>Fast! {task.hint}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.padArea}>
        <NumberPad
          okEnabled={input.length > 0 && feedback === 'none'}
          onDigit={(d) => {
            if (feedback === 'correct') return;
            tap();
            if (feedback === 'wrong') { if (isTest) return; setFeedback('none'); setInput(`${d}`); return; }
            if (input.length < 3) setInput(input + d);
          }}
          onDelete={() => {
            if (feedback === 'correct') return;
            tap();
            if (feedback === 'wrong') { if (isTest) return; setFeedback('none'); }
            setInput((s) => s.slice(0, -1));
          }}
          onOk={() => { if (feedback === 'none') submit(); }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: Colors.night },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 8 },
  close: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.night2, alignItems: 'center', justifyContent: 'center' },
  dots: { flex: 1, flexDirection: 'row', gap: 4 },
  dot: { flex: 1, height: 10, borderRadius: 5 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.night2, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 8 },
  pillText: { color: Colors.white, fontFamily: Fonts.display, fontSize: 16 },
  body: { flexGrow: 1, padding: 20, alignItems: 'center', justifyContent: 'center', gap: 16 },
  tag: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  tagText: { color: Colors.white, fontFamily: Fonts.bodyHeavy, fontSize: 12, letterSpacing: 0.8 },
  visualCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: 10 },
  question: { fontSize: 40, fontFamily: Fonts.display, textAlign: 'center', color: Colors.white, lineHeight: 48 },
  answer: { minWidth: 150, height: 92, borderRadius: 28, borderWidth: 4, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  answerText: { fontSize: 54, fontFamily: Fonts.display, color: Colors.white },
  feedbackRow: { minHeight: 52, alignItems: 'center', justifyContent: 'center' },
  praise: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.grass, borderRadius: 18, paddingHorizontal: 18, paddingVertical: 10 },
  praiseText: { color: Colors.white, fontFamily: Fonts.display, fontSize: 20 },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.white, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 10, maxWidth: '100%' },
  hintText: { color: Colors.night, fontFamily: Fonts.bodyHeavy, fontSize: 16, flexShrink: 1 },
  strip: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  stripCell: { width: 72, height: 72, borderRadius: Radius.sm, backgroundColor: Colors.night2, alignItems: 'center', justifyContent: 'center' },
  stripGap: { borderWidth: 3, borderColor: Colors.sunny, backgroundColor: '#3B3290' },
  stripText: { fontSize: 30, fontFamily: Fonts.display, color: Colors.white },
  padArea: { backgroundColor: Colors.night2, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 18, paddingBottom: 14 },
});
