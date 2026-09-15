import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Props } from '../navigation';
import { useApp } from '../AppStateContext';
import { activeProfile, progressFor } from '../storage';
import { EXERCISES } from '../models';
import { Screen } from '../components/ui';
import { Colors, Radius } from '../theme';

export function PickScreen({ navigation, route }: Props<'Pick'>) {
  const { mode } = route.params;
  const isTest = mode === 'test';
  const { state } = useApp();
  const profile = activeProfile(state);

  return (
    <Screen title={isTest ? 'Blitz-Test wählen' : 'Übung wählen'} headerColor={isTest ? Colors.grass : Colors.blitz} onBack={() => navigation.goBack()}>
      <View style={styles.grid}>
        {EXERCISES.map((t) => {
          const prog = progressFor(profile, t.id);
          return (
            <Pressable key={t.id} style={[styles.tile, { backgroundColor: t.color }]} onPress={() => navigation.navigate('Level', { typeId: t.id, mode })}>
              {prog.passed ? <View style={styles.badge}><Text style={{ fontSize: 16 }}>🏅</Text></View> : null}
              <Text style={styles.emoji}>{t.emoji}</Text>
              <Text style={styles.title}>{t.title}</Text>
              {isTest && prog.bestPercent > 0 ? <Text style={styles.best}>Bestwert: {prog.bestPercent}%</Text> : null}
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  tile: { width: '47%', aspectRatio: 0.95, borderRadius: Radius.lg, padding: 14, justifyContent: 'space-between' },
  badge: { position: 'absolute', top: 10, right: 10, backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  emoji: { fontSize: 42 },
  title: { color: Colors.white, fontWeight: '800', fontSize: 18 },
  best: { color: '#FFFFFFE6', fontSize: 13, marginTop: 2 },
});
