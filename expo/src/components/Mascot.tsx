import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, Easing } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors, Fonts } from '../theme';

/** Blitzi – fröhliche Gewitterwolke mit Blitz, schwebt sanft auf und ab. */
export function Mascot({ message, size = 110, animate = true }: { message?: string; size?: number; animate?: boolean }) {
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 1300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 1300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [animate, bob]);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  const w = size;
  const h = size * (104 / 118);

  return (
    <View style={styles.row}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        <Svg width={w} height={h} viewBox="0 0 118 104">
          <Path d="M28 70 C10 70 6 48 22 42 C20 22 44 14 54 28 C62 10 92 12 94 36 C112 36 114 70 92 70 Z" fill="#FFFFFF" />
          <Circle cx={46} cy={48} r={5} fill={Colors.night} />
          <Circle cx={72} cy={48} r={5} fill={Colors.night} />
          <Circle cx={47.5} cy={46.5} r={1.6} fill="#FFFFFF" />
          <Circle cx={73.5} cy={46.5} r={1.6} fill="#FFFFFF" />
          <Path d="M50 58 Q59 66 68 58" stroke={Colors.night} strokeWidth={3.5} fill="none" strokeLinecap="round" />
          <Circle cx={38} cy={57} r={4} fill="#FFB4C8" />
          <Circle cx={80} cy={57} r={4} fill="#FFB4C8" />
          <Path d="M62 68 L50 88 L60 88 L54 104 L74 80 L63 80 L70 68 Z" fill={Colors.sunny} stroke="#F5A400" strokeWidth={2} strokeLinejoin="round" />
        </Svg>
      </Animated.View>
      {message ? (
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{message}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  bubble: {
    flex: 1, marginBottom: 28, backgroundColor: Colors.white,
    borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottomRightRadius: 20, borderBottomLeftRadius: 4,
    paddingHorizontal: 14, paddingVertical: 12,
  },
  bubbleText: { fontFamily: Fonts.displaySemi, fontSize: 18, lineHeight: 23, color: Colors.night },
});
