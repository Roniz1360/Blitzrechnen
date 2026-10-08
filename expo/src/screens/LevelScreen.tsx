import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Props } from '../navigation';
import { exerciseById, Levels } from '../models';
import { Screen, ChunkyButton } from '../components/ui';
import { Mascot } from '../components/Mascot';
import { Stars } from '../components/Stars';
import { ChevronIcon } from '../components/Icons';
import { Colors, Radius, Fonts } from '../theme';

export function LevelScreen({ navigation, route }: Props<'Level'>) {
  const { typeId, mode } = route.params;
  const type = exerciseById(typeId)!;

  return (
    <Screen title={type.title} subtitle={mode === 'test' ? 'Blitz-Test' : 'Üben'} onBack={() => navigation.goBack()}>
      <View style={styles.mascotBox}>
        <Mascot message={type.description} size={96} />
      </View>
      <Text style={styles.q}>Wie schwer soll es sein?</Text>
      {Levels.map((lvl) => (
        <ChunkyButton
          key={lvl.id} bg={Colors.white} edge={Colors.lilacLine} style={styles.card}
          accessibilityLabel={lvl.label}
          onPress={() => navigation.navigate('Play', { typeId, mode, level: lvl.id })}
        >
          <View style={[styles.badge, { backgroundColor: type.color }]}>
            <Text style={styles.badgeNum}>{lvl.stars}</Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.label}>{lvl.label}</Text>
            <Stars filled={lvl.stars} total={3} size={18} />
          </View>
          <ChevronIcon size={28} color={type.color} />
        </ChunkyButton>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  mascotBox: { backgroundColor: Colors.night, borderRadius: Radius.lg, padding: 14 },
  q: { fontFamily: Fonts.display, fontSize: 20, color: Colors.ink, textAlign: 'center', marginTop: 4 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 16, borderRadius: Radius.lg, padding: 18 },
  badge: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  badgeNum: { fontFamily: Fonts.display, fontSize: 26, color: Colors.white },
  label: { fontFamily: Fonts.display, fontSize: 22, color: Colors.ink },
});
