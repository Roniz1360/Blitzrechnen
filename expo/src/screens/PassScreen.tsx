import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Props } from '../navigation';
import { useApp } from '../AppStateContext';
import { activeProfile, passCount, progressFor } from '../storage';
import { EXERCISES } from '../models';
import { Screen } from '../components/ui';
import { LockIcon } from '../components/Icons';
import { Colors, Radius, Fonts } from '../theme';

export function PassScreen({ navigation }: Props<'Pass'>) {
  const { state } = useApp();
  const profile = activeProfile(state);
  const passed = profile ? passCount(profile) : 0;
  const done = passed === 10;

  return (
    <Screen title="Mein Blitz-Pass" onBack={() => navigation.goBack()}>
      <View style={styles.head}>
        <View style={styles.headRow}>
          <Text style={styles.headTitle}>{passed} von 10</Text>
          <Text style={styles.headSub}>{done ? 'Blitz-Meister!' : `Noch ${10 - passed} bis zum Meister`}</Text>
        </View>
        <View style={styles.track}><View style={[styles.fill, { width: `${passed * 10}%` }]} /></View>
      </View>

      <View style={styles.grid}>
        {EXERCISES.map((t) => {
          const p = progressFor(profile, t.id);
          const status = p.passed ? 'bestanden' : p.tested ? 'getestet' : p.practiced ? 'geübt' : 'noch offen';
          return (
            <View key={t.id} style={styles.cell} accessible accessibilityLabel={`${t.title}: ${status}`}>
              <View style={[styles.badge, p.passed ? { backgroundColor: t.color, borderColor: Colors.sunny } : styles.badgeLocked]}>
                {p.passed
                  ? <Text style={styles.glyph} adjustsFontSizeToFit numberOfLines={1}>{t.glyph}</Text>
                  : <LockIcon size={26} color="#8A80B8" />}
              </View>
              <Text style={[styles.label, !p.passed && { color: '#6B6390' }]} numberOfLines={2}>{t.title}</Text>
              <Text style={styles.status}>{p.bestPercent > 0 ? `${status} · ${p.bestPercent}%` : status}</Text>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { backgroundColor: Colors.night, borderRadius: Radius.lg, padding: 16, gap: 10 },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 },
  headTitle: { color: Colors.sunny, fontFamily: Fonts.display, fontSize: 30 },
  headSub: { color: Colors.nightText, fontFamily: Fonts.body, fontSize: 14 },
  track: { height: 16, backgroundColor: Colors.night3, borderRadius: 8, overflow: 'hidden' },
  fill: { height: 16, borderRadius: 8, backgroundColor: Colors.sunny },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 16 },
  cell: { width: '33.33%', alignItems: 'center', gap: 4, paddingHorizontal: 4 },
  badge: { width: 84, height: 84, borderRadius: 42, borderWidth: 4, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  badgeLocked: { backgroundColor: Colors.lilacTrack, borderColor: Colors.lilacLine },
  glyph: { fontFamily: Fonts.display, fontSize: 26, color: Colors.white },
  label: { fontFamily: Fonts.bodyHeavy, fontSize: 13, lineHeight: 15, color: Colors.ink, textAlign: 'center' },
  status: { fontFamily: Fonts.body, fontSize: 11, color: Colors.muted, textAlign: 'center' },
});
