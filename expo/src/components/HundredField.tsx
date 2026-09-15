import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme';

/** Hunderterfeld: 10×10 Punkte, die ersten [count] gefüllt. Volle Zehnerstreifen betont. */
export function HundredField({ count, size = 300 }: { count: number; size?: number }) {
  const cols = 10;
  const gap = size / (cols * 8);
  const cell = (size - gap * (cols + 1)) / cols;
  const dots = [];
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const index = row * cols + col;
      const filled = index < count;
      const rowComplete = (row + 1) * cols <= count;
      const color = rowComplete ? Colors.blitz : filled ? Colors.sunny : '#E3DCF3';
      dots.push(
        <View
          key={index}
          style={{
            position: 'absolute',
            left: gap + col * (cell + gap),
            top: gap + row * (cell + gap),
            width: cell,
            height: cell,
            borderRadius: cell / 2,
            backgroundColor: color,
          }}
        />
      );
    }
  }
  return <View style={[styles.box, { width: size, height: size }]}>{dots}</View>;
}

const styles = StyleSheet.create({
  box: { alignSelf: 'center' },
});
