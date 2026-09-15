import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, Easing } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors, Radius } from '../theme';

/** Blitzi – freundliches Blitz-Maskottchen (SVG) mit sanfter Wackel-Animation. */
export function Mascot({ message, size = 96, animate = true }: { message?: string; size?: number; animate?: boolean }) {
  const rot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(rot, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(rot, { toValue: -1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [animate, rot]);

  const rotate = rot.interpolate({ inputRange: [-1, 1], outputRange: ['-6deg', '6deg'] });
  const w = size;
  const h = size * (180 / 140);

  return (
    <View style={styles.row}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Svg width={w} height={h} viewBox="0 0 140 180">
          <Path d="M78,14 L34,90 L64,90 L52,166 L112,74 L78,74 Z" fill={Colors.sunny} stroke="#F4A716" strokeWidth={5} strokeLinejoin="round" />
          <Circle cx={55} cy={74} r={7} fill="#FF8FB1" opacity={0.7} />
          <Circle cx={84} cy={68} r={7} fill="#FF8FB1" opacity={0.7} />
          <Circle cx={58} cy={58} r={6} fill="#FFFFFF" />
          <Circle cx={82} cy={54} r={6} fill="#FFFFFF" />
          <Circle cx={59} cy={58} r={3} fill="#2A2118" />
          <Circle cx={83} cy={54} r={3} fill="#2A2118" />
          <Path d="M60,68 Q70,78 82,68" stroke="#2A2118" strokeWidth={4} strokeLinecap="round" fill="none" />
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
  row: { flexDirection: 'row', alignItems: 'center' },
  bubble: {
    flex: 1, marginLeft: 8, backgroundColor: Colors.white, borderRadius: Radius.md,
    paddingHorizontal: 16, paddingVertical: 12,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  bubbleText: { fontSize: 17, fontWeight: '700', color: Colors.ink },
});
