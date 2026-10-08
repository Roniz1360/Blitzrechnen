import React, { ReactNode, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Props } from '../navigation';
import { useApp } from '../AppStateContext';
import { activeProfile, passCount, currentStreak, dayKey } from '../storage';
import { EXERCISES } from '../models';
import { Colors, Radius, Fonts } from '../theme';
import { Mascot } from '../components/Mascot';
import { CreateProfileDialog } from '../components/ProfileDialog';
import { ChunkyButton } from '../components/ui';
import { StarIcon, FlameIcon, BoltIcon, GearIcon, PencilIcon, TimerIcon, MedalIcon, ChevronIcon } from '../components/Icons';

/** Übung des Tages – wechselt jeden Tag, für alle Kinder gleich. */
function dailyExercise() {
  const [y, m, d] = dayKey().split('-').map(Number);
  const dayNo = Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  return EXERCISES[dayNo % EXERCISES.length];
}

export function HomeScreen({ navigation }: Props<'Home'>) {
  const { state, addProfile } = useApp();
  const profile = activeProfile(state);
  const [showCreate, setShowCreate] = useState(false);
  const mustCreate = !profile;
  const passed = profile ? passCount(profile) : 0;
  const daily = dailyExercise();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {(mustCreate || showCreate) && (
        <CreateProfileDialog
          canCancel={!mustCreate}
          onCreate={(n, a) => { addProfile(n, a); setShowCreate(false); }}
          onCancel={() => setShowCreate(false)}
        />
      )}
      <ScrollView style={{ backgroundColor: Colors.lilac }} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.hero}>
          <View style={styles.topRow}>
            <Pressable style={styles.profile} onPress={() => navigation.navigate('Profiles')} accessibilityRole="button" accessibilityLabel="Profil wechseln">
              <View style={styles.avatar}><Text style={{ fontSize: 24 }}>{profile?.avatar ?? '🦊'}</Text></View>
              <View>
                <Text style={styles.hello}>Hallo,</Text>
                <Text style={styles.name}>{profile?.name ?? 'Kind'}</Text>
              </View>
            </Pressable>
            <Pressable style={styles.iconBtn} onPress={() => navigation.navigate('Settings')} accessibilityRole="button" accessibilityLabel="Einstellungen">
              <GearIcon size={24} />
            </Pressable>
          </View>

          <Mascot message="Bereit für einen Blitz? Ich zähl auf dich!" size={118} />

          <View style={styles.stats}>
            <Stat icon={<StarIcon size={24} />} value={`${profile?.totalStars ?? 0}`} label="Sterne" />
            <Stat icon={<FlameIcon size={24} />} value={`${currentStreak(profile)}`} label="Tage in Folge" />
            <Stat icon={<BoltIcon size={24} />} value={`${passed}/10`} label="Blitze" />
          </View>
        </View>

        <View style={styles.body}>
          <ChunkyButton
            bg={Colors.sunny} edge={Colors.sunnyDeep} style={styles.daily}
            accessibilityLabel={`Tages-Blitz: ${daily.title}`}
            onPress={() => navigation.navigate('Play', { typeId: daily.id, mode: 'practice', level: 0 })}
          >
            <View style={styles.dailyIcon}><BoltIcon size={30} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.kicker}>TAGES-BLITZ</Text>
              <Text style={styles.dailyTitle}>{daily.title}</Text>
              <Text style={styles.dailySub}>10 Aufgaben – los geht's!</Text>
            </View>
            <ChevronIcon size={28} color={Colors.night} />
          </ChunkyButton>

          <View style={styles.twoCol}>
            <ChunkyButton bg={Colors.blitz} edge={Colors.blitzDark} style={styles.tile} onPress={() => navigation.navigate('Pick', { mode: 'practice' })}>
              <PencilIcon size={40} />
              <Text style={styles.tileTitle}>Üben</Text>
              <Text style={[styles.tileSub, { color: '#E4DBFF' }]}>In Ruhe trainieren</Text>
            </ChunkyButton>
            <ChunkyButton bg={Colors.coral} edge={Colors.coralDeep} style={styles.tile} onPress={() => navigation.navigate('Pick', { mode: 'test' })}>
              <TimerIcon size={40} />
              <Text style={styles.tileTitle}>Blitz-Test</Text>
              <Text style={[styles.tileSub, { color: '#FFE1E2' }]}>Auf Zeit rechnen</Text>
            </ChunkyButton>
          </View>

          <ChunkyButton bg={Colors.white} edge={Colors.lilacLine} style={styles.pass} onPress={() => navigation.navigate('Pass')}>
            <View style={styles.passIcon}><MedalIcon size={32} color={Colors.grass} /></View>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={styles.passTitle}>Mein Blitz-Pass</Text>
              <View style={styles.track}><View style={[styles.trackFill, { width: `${passed * 10}%` }]} /></View>
              <Text style={styles.passSub}>{passed} von 10 Blitzen geschafft</Text>
            </View>
          </ChunkyButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <View style={styles.stat}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.night },
  hero: {
    backgroundColor: Colors.night, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24,
    borderBottomLeftRadius: 36, borderBottomRightRadius: 36, gap: 16,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.orange, borderWidth: 3, borderColor: Colors.sunny, alignItems: 'center', justifyContent: 'center' },
  hello: { color: Colors.nightText, fontFamily: Fonts.body, fontSize: 13 },
  name: { color: Colors.white, fontFamily: Fonts.displaySemi, fontSize: 22 },
  iconBtn: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.night2, alignItems: 'center', justifyContent: 'center' },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, backgroundColor: Colors.night2, borderRadius: 18, paddingVertical: 10, alignItems: 'center', gap: 2 },
  statValue: { color: Colors.white, fontFamily: Fonts.display, fontSize: 22 },
  statLabel: { color: Colors.nightText, fontFamily: Fonts.body, fontSize: 12 },
  body: { padding: 20, gap: 14 },
  daily: { borderRadius: Radius.lg, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  dailyIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: Colors.night, alignItems: 'center', justifyContent: 'center' },
  kicker: { color: Colors.night, fontFamily: Fonts.bodyHeavy, fontSize: 12, letterSpacing: 1 },
  dailyTitle: { color: Colors.night, fontFamily: Fonts.display, fontSize: 21 },
  dailySub: { color: Colors.night, fontFamily: Fonts.body, fontSize: 14 },
  twoCol: { flexDirection: 'row', gap: 14 },
  tile: { flex: 1, borderRadius: Radius.lg, padding: 16, gap: 8 },
  tileTitle: { color: Colors.white, fontFamily: Fonts.display, fontSize: 24 },
  tileSub: { fontFamily: Fonts.body, fontSize: 14 },
  pass: { borderRadius: Radius.lg, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  passIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#E6F8F0', alignItems: 'center', justifyContent: 'center' },
  passTitle: { color: Colors.ink, fontFamily: Fonts.display, fontSize: 20 },
  track: { height: 12, borderRadius: 6, backgroundColor: Colors.lilacTrack, overflow: 'hidden' },
  trackFill: { height: 12, borderRadius: 6, backgroundColor: Colors.grass },
  passSub: { color: Colors.muted, fontFamily: Fonts.body, fontSize: 13 },
});
