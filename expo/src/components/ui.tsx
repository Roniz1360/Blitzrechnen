import React, { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius, Fonts } from '../theme';
import { BackIcon } from './Icons';

/** Bildschirm mit Nachthimmel-Kopfzeile (abgerundet) und Zurück-Knopf. */
export function Screen({ title, subtitle, right, onBack, scroll = true, children }: {
  title: string; subtitle?: string; right?: ReactNode; headerColor?: string; onBack: () => void; scroll?: boolean; children: ReactNode;
}) {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={onBack} hitSlop={10} accessibilityRole="button" accessibilityLabel="Zurück">
          <BackIcon size={24} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.headerSub}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
      <SafeAreaView style={styles.fill} edges={['bottom']}>
        {scroll ? (
          <ScrollView contentContainerStyle={styles.body}>{children}</ScrollView>
        ) : (
          <View style={[styles.body, styles.fill]}>{children}</View>
        )}
      </SafeAreaView>
    </SafeAreaView>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/** Knopf mit «3D»-Kante, der beim Drücken einsinkt. */
export function ChunkyButton({ bg, edge, style, children, ...rest }: PressableProps & {
  bg: string; edge: string; style?: StyleProp<ViewStyle>; children: ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      {...rest}
      style={({ pressed }) => [
        { backgroundColor: bg, borderBottomColor: edge, borderBottomWidth: pressed ? 2 : 6, marginTop: pressed ? 4 : 0 },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.night },
  fill: { flex: 1, backgroundColor: Colors.lilac },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20, backgroundColor: Colors.night,
  },
  backBtn: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.night2, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: Colors.white, fontSize: 24, fontFamily: Fonts.display },
  headerSub: { color: Colors.nightText, fontSize: 13, fontFamily: Fonts.body },
  body: { padding: 16, gap: 14 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.md, padding: 18 },
});
