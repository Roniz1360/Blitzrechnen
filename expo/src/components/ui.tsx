import React, { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius } from '../theme';

/** Bildschirm mit farbiger Kopfzeile und Zurück-Knopf. */
export function Screen({ title, headerColor = Colors.blitz, onBack, scroll = true, children }: {
  title: string; headerColor?: string; onBack: () => void; scroll?: boolean; children: ReactNode;
}) {
  return (
    <SafeAreaView style={styles.fill} edges={['top', 'bottom']}>
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <Pressable style={styles.backBtn} onPress={onBack} hitSlop={10}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.body}>{children}</ScrollView>
      ) : (
        <View style={[styles.body, styles.fill]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: Colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, gap: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF33', alignItems: 'center', justifyContent: 'center' },
  backIcon: { color: Colors.white, fontSize: 30, marginTop: -4, fontWeight: '800' },
  headerTitle: { color: Colors.white, fontSize: 22, fontWeight: '800', flexShrink: 1 },
  body: { padding: 16, gap: 14 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.md, padding: 18 },
});
