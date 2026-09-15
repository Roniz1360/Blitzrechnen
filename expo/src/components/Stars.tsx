import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../theme';

/** Reihe von Sternen (gefüllt/leer). */
export function Stars({ filled, total = 3, size = 22 }: { filled: number; total?: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: total }).map((_, i) => (
        <Text key={i} style={{ fontSize: size, color: i < filled ? Colors.sunny : '#BBBBBB' }}>
          {i < filled ? '⭐' : '☆'}
        </Text>
      ))}
    </View>
  );
}
