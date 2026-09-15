import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExerciseType } from '../models';
import { Mascot } from '../components/Mascot';
import { Stars } from '../components/Stars';
import { Confetti } from '../components/Confetti';
import { Colors, Radius } from '../theme';

export function ResultView({ type, isTest, correct, total, onHome, onAgain }: {
  type: ExerciseType; isTest: boolean; correct: number; total: number; onHome: () => void; onAgain: () => void;
}) {
  const percent = total > 0 ? Math.floor((correct * 100) / total) : 0;
  const stars = percent >= 90 ? 3 : percent >= 70 ? 2 : percent >= 40 ? 1 : 0;
  const passed = isTest && percent >= 80;
  const great = percent >= 70;
  const [celebrate, setCelebrate] = useState(false);
  useEffect(() => { setCelebrate(great); }, []);

  const message = passed ? 'Bestanden! Du hast den Blitz geschafft! 🏅'
    : percent >= 70 ? 'Super gemacht!'
    : percent >= 40 ? 'Gut geübt – weiter so!'
    : 'Übung macht den Meister. Nochmal?';

  return (
    <SafeAreaView style={styles.fill} edges={['top', 'bottom']}>
      <View style={styles.center}>
        <Mascot animate={great} size={120} />
        <Text style={styles.msg}>{message}</Text>
        <View style={styles.card}>
          <Text style={styles.type}>{type.title}</Text>
          <Stars filled={stars} total={3} size={44} />
          <Text style={styles.score}>{correct} von {total} richtig</Text>
          {isTest ? <Text style={[styles.percent, passed && { color: Colors.grass }]}>{percent} %</Text> : null}
        </View>
        <Pressable style={styles.primary} onPress={onAgain}><Text style={styles.primaryText}>Nochmal</Text></Pressable>
        <Pressable style={styles.ghost} onPress={onHome}><Text style={styles.ghostText}>Zur Startseite</Text></Pressable>
      </View>
      <Confetti play={celebrate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: Colors.blitz },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  msg: { color: Colors.white, fontWeight: '800', fontSize: 24, textAlign: 'center' },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: 24, alignItems: 'center', gap: 10, width: '100%' },
  type: { fontWeight: '700', fontSize: 18, color: Colors.muted },
  score: { fontWeight: '800', fontSize: 26, color: Colors.ink },
  percent: { fontWeight: '700', fontSize: 20, color: Colors.muted },
  primary: { backgroundColor: Colors.white, borderRadius: Radius.md, height: 60, width: '100%', alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: Colors.blitzDark, fontWeight: '800', fontSize: 20 },
  ghost: { borderWidth: 2, borderColor: '#FFFFFF88', borderRadius: Radius.md, height: 56, width: '100%', alignItems: 'center', justifyContent: 'center' },
  ghostText: { color: Colors.white, fontWeight: '700', fontSize: 18 },
});
