import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Props } from '../navigation';
import { exerciseById, Levels } from '../models';
import { Screen } from '../components/ui';
import { Mascot } from '../components/Mascot';
import { Stars } from '../components/Stars';
import { Colors, Radius } from '../theme';

export function LevelScreen({ navigation, route }: Props<'Level'>) {
  const { typeId, mode } = route.params;
  const type = exerciseById(typeId)!;

  return (
    <Screen title={type.title} headerColor={type.color} onBack={() => navigation.goBack()}>
      <Mascot message={type.description} size={84} />
      <Text style={styles.q}>Wie schwer soll es sein?</Text>
      {Levels.map((lvl) => (
        <Pressable key={lvl.id} style={styles.card} onPress={() => navigation.navigate('Play', { typeId, mode, level: lvl.id })}>
          <View style={[styles.badge, { backgroundColor: type.color + '2E' }]}>
            <Text style={[styles.badgeNum, { color: type.color }]}>{lvl.stars}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.label}>{lvl.label}</Text>
            <Stars filled={lvl.stars} total={3} size={18} />
          </View>
          <Text style={[styles.play, { color: type.color }]}>▶</Text>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  q: { fontWeight: '700', fontSize: 18, color: Colors.ink, textAlign: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: 20 },
  badge: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  badgeNum: { fontWeight: '800', fontSize: 26 },
  label: { fontWeight: '800', fontSize: 22, color: Colors.ink },
  play: { fontSize: 28 },
});
