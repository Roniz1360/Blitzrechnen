import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Profiles: undefined;
  Pick: { mode: 'practice' | 'test' };
  Level: { typeId: string; mode: 'practice' | 'test' };
  Play: { typeId: string; mode: 'practice' | 'test'; level: number };
  Pass: undefined;
  Settings: undefined;
};

export type Props<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
