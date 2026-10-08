import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

type P = { size?: number; color?: string };

const STAR = 'M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z';
const BOLT = 'M13 2L4 14h7l-1 8 9-12h-7z';

export function StarIcon({ size = 24, color = '#FFC21A' }: P) {
  return <Svg width={size} height={size} viewBox="0 0 24 24"><Path d={STAR} fill={color} /></Svg>;
}

export function BoltIcon({ size = 24, color = '#FFD23F' }: P) {
  return <Svg width={size} height={size} viewBox="0 0 24 24"><Path d={BOLT} fill={color} /></Svg>;
}

export function FlameIcon({ size = 24, color = '#FF8A3D' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-4-1-6 1-9z" fill={color} />
    </Svg>
  );
}

function Stroke({ size = 24, color = '#FFFFFF', width = 2.4, children }: P & { width?: number; children: React.ReactNode }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </Svg>
  );
}

export const BackIcon = (p: P) => <Stroke {...p} width={3}><Path d="M15 5l-7 7 7 7" /></Stroke>;
export const ChevronIcon = (p: P) => <Stroke {...p} width={3}><Path d="M9 5l7 7-7 7" /></Stroke>;
export const CloseIcon = (p: P) => <Stroke {...p} width={3}><Path d="M6 6l12 12M18 6L6 18" /></Stroke>;
export const CheckIcon = (p: P) => <Stroke {...p} width={3.2}><Path d="M5 12.5l4.5 4.5L19 7.5" /></Stroke>;
export const PencilIcon = (p: P) => <Stroke {...p}><Path d="M12 20h9" /><Path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></Stroke>;
export const TimerIcon = (p: P) => <Stroke {...p}><Circle cx={12} cy={13} r={8} /><Path d="M12 9v4l2.5 2.5" /><Path d="M9 2h6" /></Stroke>;
export const MedalIcon = (p: P) => <Stroke {...p}><Circle cx={12} cy={9} r={6} /><Path d="M8.5 14L7 22l5-3 5 3-1.5-8" /></Stroke>;
export const LockIcon = (p: P) => <Stroke {...p}><Rect x={5} y={11} width={14} height={10} rx={2} /><Path d="M8 11V7a4 4 0 0 1 8 0v4" /></Stroke>;
export const BulbIcon = (p: P) => <Stroke {...p}><Path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z" /></Stroke>;
export const RetryIcon = (p: P) => <Stroke {...p} width={3}><Path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><Path d="M3 3v5h5" /></Stroke>;
export const DeleteIcon = (p: P) => <Stroke {...p} width={2.6}><Path d="M21 5H9l-6 7 6 7h12z" /><Path d="M17 9l-5 6M12 9l5 6" /></Stroke>;
export const GearIcon = (p: P) => (
  <Stroke {...p} width={2}>
    <Circle cx={12} cy={12} r={3} />
    <Path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </Stroke>
);
