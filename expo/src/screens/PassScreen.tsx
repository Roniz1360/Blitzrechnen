import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Props } from '../navigation';
import { useApp } from '../AppStateContext';
import { activeProfile, passCount, progressFor } from '../storage';
import { EXERCISES } from '../models';
import { Screen } from '../components/ui';
import { Colors, Radius } from '../theme';

export function PassScreen({ navigation }: Props<'Pass'>) {
  const { state } = useApp();
  const profile = activeProfile(state);
  const passed = profile ? passCount(profile) : 0;
  const done = passed === 10;

  return (
    <Screen title="Mein Blitz-Pass" headerColor={Colors.sunny} onBack={() => navigation.goBack()}>
      <View style={[styles.head, { backgroundColor: done ? Colors.grass : '#E9DEFF' }]}>
        <Text style={[styles.headTitle, done && { color: Colors.white }]}>
          {done ? '🏆 Blitzrechen-Pass geschafft!' : 'Dein Fortschritt'}
        </Text>
        <Text style={[styles.headSub, done && { color: Colors.white }]}>{passed} von 10 Blitzen bestanden</Text>
        <View style={styles.track}><View style={[styles.fill, { width: `${(passed / 10) * 100}%`, backgroundColor: done ? Colors.white : Colors.grass }]} /></View>
      </View>

      {EXERCISES.map((t) => {
        const p = progressFor(profile, t.id);
        return (
          <View key={t.id} style={styles.row}>
            <View style={[styles.icon, { backgroundColor: t.color + '2E' }]}><Text style={{ fontSize: 26 }}>{t.emoji}</Text></View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.title}>{t.title}</Text>
              <Text style={styles.badges}>
                <Text style={{ color: p.practiced ? Colors.grass : Colors.muted }}>{p.practiced ? '✓' : '·'} geübt   </Text>
                <Text style={{ color: p.tested ? Colors.grass : Colors.muted }}>{p.tested ? '✓' : '·'} getestet   </Text>
                {p.bestPercent > 0 ? <Text style={{ color: Colors.muted }}>{p.bestPercent}%</Text> : null}
              </Text>
            </View>
            <Text style={{ fontSize: 28 }}>{p.passed ? '🏅' : '⚪'}</Text>
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { borderRadius: Radius.lg, padding: 20 },
  headTitle: { fontWeight: '800', fontSize: 22, color: Colors.blitzDark },
  headSub: { fontSize: 16, color: Colors.blitzDark, marginTop: 4 },
  track: { height: 14, backgroundColor: '#FFFFFF88', borderRadius: 8, marginTop: 12, overflow: 'hidden' },
  fill: { height: 14, borderRadius: 8 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.md, padding: 14 },
  icon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontWeight: '700', fontSize: 17, color: Colors.ink },
  badges: { fontSize: 13, marginTop: 2 },
});
