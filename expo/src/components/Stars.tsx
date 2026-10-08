import React from 'react';
import { View } from 'react-native';
import { StarIcon } from './Icons';

/** Reihe von Sternen (gefüllt/leer). */
export function Stars({ filled, total = 3, size = 22, empty = '#E3DDF5' }: { filled: number; total?: number; size?: number; empty?: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {Array.from({ length: total }).map((_, i) => (
        <StarIcon key={i} size={size} color={i < filled ? '#FFC21A' : empty} />
      ))}
    </View>
  );
}
