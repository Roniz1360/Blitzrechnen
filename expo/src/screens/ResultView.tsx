import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExerciseType } from '../models';
import { Confetti } from '../components/Confetti';
import { ChunkyButton } from '../components/ui';
import { Mascot } from '../components/Mascot';
import { StarIcon, BoltIcon, RetryIcon } from '../components/Icons';
import { Colors, Radius, Fonts } from '../theme';

export function ResultView({ type, isTest, correct, total, earnedStars, timeUsed, onHome, onAgain }: {
  type: ExerciseType; isTest: boolean; correct: number; total: number; earnedStars: number; timeUsed?: number;
  onHome: () => void; onAgain: () => void;
}) {
  const percent = total > 0 ? Math.floor((correct * 100) / total) : 0;
  const stars = percent >= 90 ? 3 : percent >= 70 ? 2 : percent >= 40 ? 1 : 0;
  const passed = isTest && percent >= 80;
  const great = percent >= 70;
  const [celebrate, setCelebrate] = useState(false);
  useEffect(() => { setCelebrate(great); }, []);

  // Sterne springen nacheinander herein
  const anims = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(220, anims.map((a) =>
      Animated.spring(a, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true })
    )).start();
  }, [anims]);

  const title = passed ? 'Blitz geschafft!'
    : percent >= 70 ? 'Super gemacht!'
    : percent >= 40 ? 'Gut geübt!'
    : 'Weiter so!';
  const message = passed ? 'Du bist ein echter Rechen-Blitz.'
    : percent >= 70 ? 'Fast alles richtig – stark!'
    : percent >= 40 ? 'Jedes Mal wirst du schneller.'
    : 'Übung macht den Meister. Nochmal?';

  const time = timeUsed !== undefined ? `${Math.floor(timeUsed / 60)}:${`${timeUsed % 60}`.padStart(2, '0')}` : null;

  return (
    <SafeAreaView style={styles.fill} edges={['top', 'bottom']}>
      <View style={styles.center}>
        <View style={styles.stars}>
          {anims.map((a, i) => {
            const big = i === 1;
            const rotate = i === 0 ? '-12deg' : i === 2 ? '12deg' : '0deg';
            return (
              <Animated.View key={i} style={{ marginBottom: big ? 18 : 0, transform: [{ scale: a }, { rotate }] }}>
                <StarIcon size={big ? 88 : 64} color={i < stars ? Colors.star : Colors.night3} />
              </Animated.View>
            );
          })}
        </View>

        <View style={{ alignItems: 'center', gap: 6 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.msg}>{message}</Text>
        </View>

        {passed ? (
          <View style={styles.medal}>
            <BoltIcon size={50} color={Colors.night} />
            <Text style={styles.medalText} numberOfLines={1} adjustsFontSizeToFit>{type.title}</Text>
          </View>
        ) : (
          <Mascot size={110} animate={great} />
        )}

        <View style={styles.statRow}>
          <Stat value={`${correct}/${total}`} label="richtig" />
          {time ? <Stat value={time} label="Zeit" /> : <Stat value={`${percent}%`} label="Treffer" />}
          <Stat value={`+${earnedStars}`} label="Sterne" gold />
        </View>
      </View>

      <View style={styles.actions}>
        <ChunkyButton bg={Colors.sunny} edge={Colors.sunnyDeep} style={styles.primary} onPress={onAgain}>
          <RetryIcon size={24} color={Colors.night} />
          <Text style={styles.primaryText}>Nochmal</Text>
        </ChunkyButton>
        <Pressable style={styles.ghost} onPress={onHome} accessibilityRole="button">
          <Text style={styles.ghostText}>Zur Startseite</Text>
        </Pressable>
      </View>
      <Confetti play={celebrate} />
    </SafeAreaView>
  );
}

function Stat({ value, label, gold }: { value: string; label: string; gold?: boolean }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, gold && { color: Colors.sunny }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: Colors.night },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 20 },
  stars: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  title: { color: Colors.sunny, fontFamily: Fonts.display, fontSize: 38, textAlign: 'center' },
  msg: { color: '#E4DBFF', fontFamily: Fonts.body, fontSize: 18, textAlign: 'center' },
  medal: {
    width: 150, height: 150, borderRadius: 75, backgroundColor: Colors.sunny, alignItems: 'center', justifyContent: 'center',
    borderWidth: 8, borderColor: Colors.night2, paddingHorizontal: 14,
  },
  medalText: { fontFamily: Fonts.display, fontSize: 16, color: Colors.night },
  statRow: { flexDirection: 'row', gap: 10, width: '100%' },
  stat: { flex: 1, backgroundColor: Colors.night2, borderRadius: 18, paddingVertical: 12, alignItems: 'center' },
  statValue: { color: Colors.white, fontFamily: Fonts.display, fontSize: 26 },
  statLabel: { color: Colors.nightText, fontFamily: Fonts.body, fontSize: 13 },
  actions: { paddingHorizontal: 20, paddingBottom: 16, gap: 12 },
  primary: { height: 64, borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  primaryText: { color: Colors.night, fontFamily: Fonts.display, fontSize: 22 },
  ghost: { height: 56, borderRadius: 20, backgroundColor: Colors.night2, alignItems: 'center', justifyContent: 'center' },
  ghostText: { color: Colors.white, fontFamily: Fonts.displaySemi, fontSize: 19 },
});
