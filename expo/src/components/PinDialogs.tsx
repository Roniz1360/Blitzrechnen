import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Colors, Radius } from '../theme';
import { checkPin } from '../pin';

const onlyDigits = (s: string, max = 4) => s.replace(/[^0-9]/g, '').slice(0, max);

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

/** Fragt die Eltern-PIN ab; ruft onSuccess bei richtiger Eingabe. */
export function VerifyPinDialog({ expectedHash, title = 'Eltern-PIN eingeben', onSuccess, onCancel }: {
  expectedHash: string | null; title?: string; onSuccess: () => void; onCancel: () => void;
}) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  return (
    <Modal transparent animationType="fade" onRequestClose={onCancel}>
      <Card>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>Bitte die 4-stellige PIN eingeben.</Text>
        <TextInput
          style={[styles.input, error && { borderColor: Colors.coral }]}
          value={pin}
          onChangeText={(t) => { setPin(onlyDigits(t)); setError(false); }}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
        />
        {error ? <Text style={styles.err}>Falsche PIN</Text> : null}
        <View style={styles.actions}>
          <Pressable onPress={onCancel}><Text style={styles.btnGhost}>Abbrechen</Text></Pressable>
          <Pressable
            disabled={pin.length !== 4}
            onPress={async () => { if (await checkPin(pin, expectedHash)) onSuccess(); else setError(true); }}
          >
            <Text style={[styles.btn, pin.length !== 4 && styles.btnDisabled]}>OK</Text>
          </Pressable>
        </View>
      </Card>
    </Modal>
  );
}

/** Legt eine neue PIN fest (zweimal eingeben). */
export function SetPinDialog({ onSet, onCancel }: { onSet: (pin: string) => void; onCancel: () => void }) {
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const mismatch = confirm.length === 4 && pin !== confirm;
  const valid = pin.length === 4 && pin === confirm;
  return (
    <Modal transparent animationType="fade" onRequestClose={onCancel}>
      <Card>
        <Text style={styles.title}>Eltern-PIN festlegen</Text>
        <Text style={styles.text}>Wähle eine 4-stellige PIN. Damit schützt du das Löschen von Profilen und die Einstellungen.</Text>
        <TextInput style={styles.input} value={pin} onChangeText={(t) => setPin(onlyDigits(t))} keyboardType="number-pad" secureTextEntry maxLength={4} placeholder="Neue PIN" />
        <TextInput style={[styles.input, mismatch && { borderColor: Colors.coral }]} value={confirm} onChangeText={(t) => setConfirm(onlyDigits(t))} keyboardType="number-pad" secureTextEntry maxLength={4} placeholder="PIN wiederholen" />
        {mismatch ? <Text style={styles.err}>Die PINs stimmen nicht überein</Text> : null}
        <View style={styles.actions}>
          <Pressable onPress={onCancel}><Text style={styles.btnGhost}>Abbrechen</Text></Pressable>
          <Pressable disabled={!valid} onPress={() => onSet(pin)}>
            <Text style={[styles.btn, !valid && styles.btnDisabled]}>Speichern</Text>
          </Pressable>
        </View>
      </Card>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#0006', justifyContent: 'center', padding: 28 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: 22 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.ink, marginBottom: 8 },
  text: { fontSize: 15, color: Colors.ink, marginBottom: 12 },
  input: { borderWidth: 2, borderColor: Colors.surfaceVariant, borderRadius: Radius.sm, paddingHorizontal: 14, paddingVertical: 10, fontSize: 22, letterSpacing: 8, marginBottom: 10, color: Colors.ink },
  err: { color: Colors.coral, fontWeight: '700', marginBottom: 8 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 20, marginTop: 8, alignItems: 'center' },
  btn: { color: Colors.blitz, fontWeight: '800', fontSize: 16 },
  btnDisabled: { color: Colors.muted },
  btnGhost: { color: Colors.muted, fontWeight: '600', fontSize: 16 },
});
