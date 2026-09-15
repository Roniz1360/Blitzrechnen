import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { Props } from '../navigation';
import { useApp } from '../AppStateContext';
import { activeProfile, passCount } from '../storage';
import { Colors, Radius } from '../theme';
import { Mascot } from '../components/Mascot';
import { CreateProfileDialog } from '../components/ProfileDialog';

export function HomeScreen({ navigation }: Props<'Home'>) {
  const { state, addProfile } = useApp();
  const profile = activeProfile(state);
  const [showCreate, setShowCreate] = useState(false);
  const mustCreate = !profile;

  return (
    <SafeAreaView style={styles.fill} edges={['top', 'bottom']}>
      {(mustCreate || showCreate) && (
        <CreateProfileDialog
          canCancel={!mustCreate}
          onCreate={(n, a) => { addProfile(n, a); setShowCreate(false); }}
          onCancel={() => setShowCreate(false)}
        />
      )}
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.topRow}>
          <Pressable style={styles.chip} onPress={() => navigation.navigate('Profiles')}>
            <Text style={{ fontSize: 24 }}>{profile?.avatar ?? '🦊'}</Text>
            <Text style={styles.chipText}>{profile?.name ?? 'Kind'}</Text>
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={() => navigation.navigate('Settings')}>
            <Text style={{ fontSize: 22 }}>⚙️</Text>
          </Pressable>
        </View>

        <View style={{ marginTop: 8 }}>
          <Mascot message={`Hallo${profile ? ' ' + profile.name : ''}! Bereit zum Blitzrechnen?`} size={110} />
        </View>

        <View style={styles.stats}>
          <Stat emoji="⭐" value={`${profile?.totalStars ?? 0}`} label="Sterne" />
          <Stat emoji="🏅" value={`${profile ? passCount(profile) : 0}/10`} label="Blitze" />
        </View>

        <Big title="Üben" subtitle="In Ruhe trainieren" emoji="✏️" bg={Colors.sunny} fg={Colors.blitzDark} onPress={() => navigation.navigate('Pick', { mode: 'practice' })} />
        <Big title="Blitz-Test" subtitle="Auf Zeit rechnen" emoji="⏱️" bg={Colors.grass} fg={Colors.white} onPress={() => navigation.navigate('Pick', { mode: 'test' })} />
        <Big title="Mein Blitz-Pass" subtitle="Was ich schon kann" emoji="🏆" bg={Colors.white} fg={Colors.blitzDark} onPress={() => navigation.navigate('Pass')} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ emoji, value, label }: { emoji: string; value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Big({ title, subtitle, emoji, bg, fg, onPress }: { title: string; subtitle: string; emoji: string; bg: string; fg: string; onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.big, { backgroundColor: bg, opacity: pressed ? 0.9 : 1 }]} onPress={onPress}>
      <View style={[styles.bigIcon, { backgroundColor: fg + '22' }]}><Text style={{ fontSize: 34 }}>{emoji}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.bigTitle, { color: fg }]}>{title}</Text>
        <Text style={[styles.bigSub, { color: fg }]}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: Colors.blitz },
  body: { padding: 20, gap: 14 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFFFFF2E', borderRadius: 24, paddingHorizontal: 14, paddingVertical: 8 },
  chipText: { color: Colors.white, fontWeight: '700', fontSize: 18 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF2E', alignItems: 'center', justifyContent: 'center' },
  stats: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFFFFF29', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10 },
  statValue: { color: Colors.white, fontWeight: '800', fontSize: 20 },
  statLabel: { color: '#FFFFFFDD', fontSize: 14 },
  big: { flexDirection: 'row', alignItems: 'center', gap: 16, borderRadius: Radius.xl, padding: 20 },
  bigIcon: { width: 64, height: 64, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  bigTitle: { fontSize: 26, fontWeight: '800' },
  bigSub: { fontSize: 16, opacity: 0.8 },
});
