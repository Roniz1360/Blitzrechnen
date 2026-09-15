import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Props } from '../navigation';
import { useApp } from '../AppStateContext';
import { passCount } from '../storage';
import { Screen } from '../components/ui';
import { Colors, Radius } from '../theme';
import { CreateProfileDialog } from '../components/ProfileDialog';
import { VerifyPinDialog } from '../components/PinDialogs';

export function ProfilesScreen({ navigation }: Props<'Profiles'>) {
  const { state, addProfile, selectProfile, deleteProfile } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const requestDelete = (id: string) => {
    if (state.parentPinHash) setPendingDelete(id);
    else deleteProfile(id);
  };

  return (
    <Screen title="Wer bist du?" onBack={() => navigation.goBack()}>
      {showCreate && (
        <CreateProfileDialog canCancel onCreate={(n, a) => { addProfile(n, a); setShowCreate(false); }} onCancel={() => setShowCreate(false)} />
      )}
      {pendingDelete && (
        <VerifyPinDialog
          expectedHash={state.parentPinHash}
          title="Profil löschen – Eltern-PIN"
          onSuccess={() => { deleteProfile(pendingDelete); setPendingDelete(null); }}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {state.profiles.map((p) => (
        <Pressable key={p.id} onPress={() => { selectProfile(p.id); navigation.goBack(); }} style={[styles.card, p.id === state.activeProfileId && styles.active]}>
          <Text style={{ fontSize: 40 }}>{p.avatar}</Text>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.name}>{p.name}</Text>
            <Text style={styles.sub}>⭐ {p.totalStars}  ·  🏅 {passCount(p)}/10</Text>
          </View>
          <Pressable hitSlop={10} onPress={() => requestDelete(p.id)}><Text style={{ fontSize: 22 }}>🗑️</Text></Pressable>
        </Pressable>
      ))}

      <Pressable style={styles.add} onPress={() => setShowCreate(true)}>
        <Text style={styles.addText}>＋  Neues Kind hinzufügen</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.md, padding: 16 },
  active: { backgroundColor: '#E9DEFF' },
  name: { fontSize: 22, fontWeight: '800', color: Colors.ink },
  sub: { fontSize: 15, color: Colors.muted },
  add: { backgroundColor: '#FFD23F40', borderRadius: Radius.md, padding: 20 },
  addText: { fontWeight: '700', fontSize: 18, color: Colors.blitz },
});
