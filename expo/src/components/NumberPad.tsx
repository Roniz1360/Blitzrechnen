import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../theme';
import { ChunkyButton } from './ui';
import { DeleteIcon, CheckIcon } from './Icons';

interface Props {
  onDigit: (d: number) => void;
  onDelete: () => void;
  onOk: () => void;
  okEnabled: boolean;
}

/** Grosser, kinderfreundlicher Ziffernblock 0–9, Löschen, OK – Tasten sinken beim Drücken ein. */
export function NumberPad({ onDigit, onDelete, onOk, okEnabled }: Props) {
  const rows = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  return (
    <View style={styles.pad}>
      {rows.map((row, i) => (
        <View style={styles.row} key={i}>
          {row.map((d) => <Digit key={d} d={d} onPress={() => onDigit(d)} />)}
        </View>
      ))}
      <View style={styles.row}>
        <Key bg="#4A3FA8" edge="#241C66" label="Löschen" onPress={onDelete}><DeleteIcon size={30} /></Key>
        <Digit d={0} onPress={() => onDigit(0)} />
        <Key
          bg={okEnabled ? Colors.grassBright : '#5A5299'} edge={okEnabled ? Colors.grassDeep : '#3B3290'}
          label="Prüfen" onPress={onOk} disabled={!okEnabled}
        >
          <CheckIcon size={32} color={okEnabled ? '#0B3B2A' : '#8A80D0'} />
        </Key>
      </View>
    </View>
  );
}

function Digit({ d, onPress }: { d: number; onPress: () => void }) {
  return (
    <Key bg={Colors.white} edge={Colors.nightText} label={`${d}`} onPress={onPress}>
      <Text style={styles.digit}>{d}</Text>
    </Key>
  );
}

function Key({ bg, edge, label, onPress, disabled, children }: {
  bg: string; edge: string; label: string; onPress: () => void; disabled?: boolean; children: ReactNode;
}) {
  return (
    <ChunkyButton bg={bg} edge={edge} style={styles.key} onPress={onPress} disabled={disabled} accessibilityLabel={label}>
      {children}
    </ChunkyButton>
  );
}

const styles = StyleSheet.create({
  pad: { width: '100%', gap: 10 },
  row: { flexDirection: 'row', gap: 10 },
  key: { flex: 1, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  digit: { fontFamily: Fonts.display, fontSize: 30, color: Colors.night },
});
