import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Colors, Radius } from '../theme';

export const AVATARS = ['🦊', '🐼', '🐯', '🦄', '🐸', '🐵', '🐰', '🐧', '🐨', '🦁', '🐹', '🐢'];

export function CreateProfileDialog({ canCancel, onCreate, onCancel }: {
  canCancel: boolean; onCreate: (name: string, avatar: string) => void; onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  return (
    <Modal transparent animationType="fade" onRequestClose={canCancel ? onCancel : undefined}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Neues Kind</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(t) => setName(t.slice(0, 12))}
            placeholder="Dein Name"
            maxLength={12}
          />
          <Text style={styles.label}>Wähle ein Tier:</Text>
          <View style={styles.grid}>
            {AVATARS.map((a) => (
              <Pressable
                key={a}
                onPress={() => setAvatar(a)}
                style={[styles.avatar, a === avatar && styles.avatarSel]}
              >
                <Text style={{ fontSize: 26 }}>{a}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.actions}>
            {canCancel ? (
              <Pressable onPress={onCancel}><Text style={styles.ghost}>Abbrechen</Text></Pressable>
            ) : null}
            <Pressable disabled={!name.trim()} onPress={() => onCreate(name, avatar)}>
              <Text style={[styles.btn, !name.trim() && styles.disabled]}>Los geht's!</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#0006', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: 22 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.ink, marginBottom: 12 },
  input: { borderWidth: 2, borderColor: Colors.surfaceVariant, borderRadius: Radius.sm, paddingHorizontal: 14, paddingVertical: 10, fontSize: 18, color: Colors.ink, marginBottom: 14 },
  label: { fontWeight: '700', color: Colors.ink, marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  avatarSel: { borderColor: Colors.blitz, backgroundColor: '#6D3BF522' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 20, marginTop: 16, alignItems: 'center' },
  btn: { color: Colors.blitz, fontWeight: '800', fontSize: 16 },
  disabled: { color: Colors.muted },
  ghost: { color: Colors.muted, fontWeight: '600', fontSize: 16 },
});
