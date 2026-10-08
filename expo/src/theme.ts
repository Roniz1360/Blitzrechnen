// «Gewitter-Abenteuer»: Nachthimmel, Sonnengelb-Blitz, kräftige Akzente für Kinder
export const Colors = {
  // Nachthimmel (Kopfbereiche, Rechnen, Ergebnis)
  night: '#1B1640',
  night2: '#2D2470',
  night3: '#3B3290',
  nightText: '#C9C2F0',
  // Heller Grund für Listen
  lilac: '#F3F0FF',
  lilacLine: '#D9D1F7',
  lilacTrack: '#E9E4FA',
  // Akzente
  blitz: '#6D3BF5',
  blitzDark: '#4C1FBF',
  sunny: '#FFD23F',
  sunnyDeep: '#E0A800',
  star: '#FFC21A',
  grass: '#0E9F6E',
  grassBright: '#22C08A',
  grassDeep: '#0E8A5F',
  coral: '#E5484D',
  coralDeep: '#B5262B',
  orange: '#FF8A3D',
  sky: '#2563EB',
  ink: '#1F1A3A',
  white: '#FFFFFF',
  muted: '#5B5478',
  // Alt-Namen (Dialoge, Einstellungen)
  cream: '#F3F0FF',
  surfaceVariant: '#F1ECFB',
};

export const Radius = { sm: 14, md: 20, lg: 24, xl: 28 };

// Runde, kindgerechte Schriften (werden in App.tsx geladen)
export const Fonts = {
  display: 'Fredoka_700Bold',
  displaySemi: 'Fredoka_600SemiBold',
  body: 'Nunito_700Bold',
  bodyHeavy: 'Nunito_800ExtraBold',
};

/** «3D»-Schatten unter Knöpfen: farbige Kante statt weicher Schatten. */
export function chunky(edge: string, depth = 6) {
  return { borderBottomWidth: depth, borderBottomColor: edge };
}
