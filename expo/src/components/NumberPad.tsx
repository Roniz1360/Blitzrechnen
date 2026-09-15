import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Radius } from '../theme';

interface Props {
  onDigit: (d: number) => void;
  onDelete: () => void;
  onOk: () => void;
  okEnabled: boolean;
}

/** Grosser, kinderfreundlicher Ziffernblock 0–9, Löschen, OK. */
export function NumberPad({ onDigit, onDelete, onOk, okEnabled }: Props) {
  const rows = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  return (
    <View style={styles.pad}>
      {rows.map((row, i) => (
        <View style={styles.row} key={i}>
          {row.map((d) => (
            <Key key={d} label={`${d}`} bg={Colors.surfaceVariant} fg={Colors.blitzDark} onPress={() => onDigit(d)} />
          ))}
        </View>
      ))}
      <View style={styles.row}>
        <Key label="⌫" bg={Colors.surfaceVariant} fg={Colors.ink} onPress={onDelete} />
        <Key label="0" bg={Colors.surfaceVariant} fg={Colors.blitzDark} onPress={() => onDigit(0)} />
        <Key label="OK" bg={okEnabled ? Colors.grass : '#BFCBD6'} fg={Colors.white} onPress={onOk} disabled={!okEnabled} />
      </View>
    </View>
  );
}

function Key({ label, bg, fg, onPress, disabled }: { label: string; bg: string; fg: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.key, { backgroundColor: bg, opacity: pressed && !disabled ? 0.7 : 1 }]}
    >
      <Text style={[styles.keyText, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pad: { width: '100%', gap: 10 },
  row: { flexDirection: 'row', gap: 10 },
  key: { flex: 1, aspectRatio: 1.5, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  keyText: { fontSize: 28, fontWeight: '800' },
});
