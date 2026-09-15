import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View, Easing } from 'react-native';

const COLORS = ['#FFD23F', '#6D3BF5', '#10B981', '#EF6C6C', '#3B82F6', '#EC4899'];

interface Piece { x: number; delay: number; color: string; size: number; drift: number; }

/** Kurzer Konfetti-Regen als Belohnung. */
export function Confetti({ play }: { play: boolean }) {
  const { width, height } = Dimensions.get('window');
  const progress = useRef(new Animated.Value(0)).current;
  const pieces = useRef<Piece[]>(
    Array.from({ length: 60 }).map(() => ({
      x: Math.random(),
      delay: Math.random() * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 10 + Math.random() * 12,
      drift: (Math.random() - 0.5) * 0.3,
    }))
  ).current;

  useEffect(() => {
    if (play) {
      progress.setValue(0);
      Animated.timing(progress, { toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: true }).start();
    }
  }, [play, progress]);

  if (!play) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p, i) => {
        const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [-20, height + 20] });
        const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [p.x * width, (p.x + p.drift) * width] });
        const opacity = progress.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] });
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size * 0.6,
              backgroundColor: p.color,
              borderRadius: 2,
              opacity,
              transform: [{ translateX }, { translateY }],
            }}
          />
        );
      })}
    </View>
  );
}
