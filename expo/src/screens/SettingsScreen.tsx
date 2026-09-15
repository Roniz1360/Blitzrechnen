import React, { useState } from 'react';
import { View, Text, Switch, Pressable, StyleSheet } from 'react-native';
import { Props } from '../navigation';
import { useApp } from '../AppStateContext';
import { Screen, Card } from '../components/ui';
import { Colors, Radius } from '../theme';
import { SetPinDialog, VerifyPinDialog } from '../components/PinDialogs';

export function SettingsScreen({ navigation }: Props<'Settings'>) {
  const { state, setSound, setTestSeconds, setPin, clearPin } = useApp();
  const hasPin = !!state.parentPinHash;

  const [unlocked, setUnlocked] = useState(!hasPin);
  const [showSet, setShowSet] = useState(false);
  const [showRemove, setShowRemove] = useState(false);

  if (!unlocked) {
    return (
      <Screen title="Einstellungen" onBack={() => navigation.goBack()}>
        <VerifyPinDialog
          expectedHash={state.parentPinHash}
          title="Einstellungen – Eltern-PIN"
          onSuccess={() => setUnlocked(true)}
          onCancel={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  return (
    <Screen title="Einstellungen" onBack={() => navigation.goBack()}>
      {showSet && <SetPinDialog onSet={(p) => { setPin(p); setShowSet(false); }} onCancel={() => setShowSet(false)} />}
      {showRemove && (
        <VerifyPinDialog expectedHash={state.parentPinHash} title="PIN entfernen"
          onSuccess={() => { clearPin(); setShowRemove(false); }} onCancel={() => setShowRemove(false)} />
      )}

      <Card>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={styles.h}>Töne & Vibration</Text>
            <Text style={styles.sub}>Rückmeldung fühlbar/hörbar</Text>
          </View>
          <Switch value={state.soundOn} onValueChange={setSound} />
        </View>
      </Card>

      <Card>
        <Text style={styles.h}>Zeit für den Blitz-Test</Text>
        <View style={styles.chips}>
          {[30, 60, 90, 120].map((sec) => (
            <Pressable key={sec} onPress={() => setTestSeconds(sec)} style={[styles.chip, state.testSeconds === sec && styles.chipSel]}>
              <Text style={[styles.chipText, state.testSeconds === sec && { color: Colors.white }]}>{sec} s</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card>
        <Text style={styles.h}>Eltern-PIN 🔒</Text>
        <Text style={styles.sub}>
          {hasPin ? 'Aktiv. Schützt Profil-Löschen und Einstellungen.' : 'Aus. Richte eine PIN ein, damit Kinder keine Profile löschen.'}
        </Text>
        <View style={[styles.chips, { marginTop: 12 }]}>
          {hasPin ? (
            <>
              <Pressable style={styles.outline} onPress={() => setShowSet(true)}><Text style={styles.outlineText}>PIN ändern</Text></Pressable>
              <Pressable style={styles.outline} onPress={() => setShowRemove(true)}><Text style={[styles.outlineText, { color: Colors.coral }]}>PIN entfernen</Text></Pressable>
            </>
          ) : (
            <Pressable style={styles.primary} onPress={() => setShowSet(true)}><Text style={styles.primaryText}>PIN einrichten</Text></Pressable>
          )}
        </View>
      </Card>

      <Card style={{ backgroundColor: Colors.surfaceVariant }}>
        <Text style={styles.h}>Über Zahlenblitz</Text>
        <Text style={styles.sub}>Kopfrechnen für die 2. Klasse (Zahlenraum bis 100), passend zum Lehrplan 21. Alle Daten bleiben offline auf dem Gerät.</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  h: { fontWeight: '700', fontSize: 18, color: Colors.ink },
  sub: { fontSize: 14, color: Colors.muted, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surfaceVariant },
  chipSel: { backgroundColor: Colors.blitz },
  chipText: { fontWeight: '700', color: Colors.ink },
  outline: { borderWidth: 2, borderColor: Colors.surfaceVariant, borderRadius: Radius.sm, paddingHorizontal: 16, paddingVertical: 10 },
  outlineText: { fontWeight: '700', color: Colors.blitz },
  primary: { backgroundColor: Colors.blitz, borderRadius: Radius.sm, paddingHorizontal: 18, paddingVertical: 12 },
  primaryText: { color: Colors.white, fontWeight: '800' },
});
