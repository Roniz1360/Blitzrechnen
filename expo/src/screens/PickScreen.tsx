import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Props } from '../navigation';
import { useApp } from '../AppStateContext';
import { activeProfile, progressFor } from '../storage';
import { EXERCISES } from '../models';
import { Screen, ChunkyButton } from '../components/ui';
import { Stars } from '../components/Stars';
import { BoltIcon, StarIcon } from '../components/Icons';
import { Colors, Radius, Fonts } from '../theme';

export function PickScreen({ navigation, route }: Props<'Pick'>) {
  const { mode } = route.params;
  const isTest = mode === 'test';
  const { state } = useApp();
  const profile = activeProfile(state);

  return (
    <Screen
      title={isTest ? 'Blitz-Test wählen' : 'Übung wählen'}
      subtitle="Tippe auf eine Karte"
      onBack={() => navigation.goBack()}
      right={
        <View style={styles.starPill}>
          <StarIcon size={18} color={Colors.night} />
          <Text style={styles.starPillText}>{profile?.totalStars ?? 0}</Text>
        </View>
      }
    >
      <View style={styles.grid}>
        {EXERCISES.map((t) => {
          const prog = progressFor(profile, t.id);
          return (
            <ChunkyButton
              key={t.id} bg={Colors.white} edge={Colors.lilacLine} style={styles.tile}
              accessibilityLabel={t.title}
              onPress={() => navigation.navigate('Level', { typeId: t.id, mode })}
            >
              <View style={[styles.glyph, { backgroundColor: t.color }]}>
                <Text style={styles.glyphText} adjustsFontSizeToFit numberOfLines={1}>{t.glyph}</Text>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.title} numberOfLines={2}>{t.title}</Text>
                {isTest && prog.bestPercent > 0
                  ? <Text style={styles.best}>Bestwert {prog.bestPercent}%</Text>
                  : <Stars filled={prog.bestLevelStars} size={16} />}
              </View>
              {prog.passed ? (
                <View style={styles.badge} accessibilityLabel="Blitz geschafft">
                  <BoltIcon size={14} color={Colors.night} />
                </View>
              ) : null}
            </ChunkyButton>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  starPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.sunny, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  starPillText: { fontFamily: Fonts.display, fontSize: 16, color: Colors.night },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14 },
  tile: { width: '48%', minHeight: 100, borderRadius: Radius.md, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  glyph: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  glyphText: { fontFamily: Fonts.display, fontSize: 20, color: Colors.white },
  title: { fontFamily: Fonts.displaySemi, fontSize: 16, lineHeight: 18, color: Colors.ink },
  best: { fontFamily: Fonts.body, fontSize: 12, color: Colors.muted },
  badge: {
    position: 'absolute', top: -6, right: -4, width: 26, height: 26, borderRadius: 13,
    backgroundColor: Colors.sunny, borderWidth: 3, borderColor: Colors.white, alignItems: 'center', justifyContent: 'center',
  },
});
