import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { Fredoka_600SemiBold, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';

import { AppProvider, useApp } from './src/AppStateContext';
import { RootStackParamList } from './src/navigation';
import { Colors } from './src/theme';

import { HomeScreen } from './src/screens/HomeScreen';
import { ProfilesScreen } from './src/screens/ProfilesScreen';
import { PickScreen } from './src/screens/PickScreen';
import { LevelScreen } from './src/screens/LevelScreen';
import { PlayScreen } from './src/screens/PlayScreen';
import { PassScreen } from './src/screens/PassScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function Root() {
  const { ready } = useApp();
  const [fontsLoaded, fontError] = useFonts({ Fredoka_600SemiBold, Fredoka_700Bold, Nunito_700Bold, Nunito_800ExtraBold });
  // Bei Schrift-Fehler trotzdem starten (System-Schrift als Ersatz)
  if (!ready || (!fontsLoaded && !fontError)) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.night, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.white} size="large" />
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: Colors.night } }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profiles" component={ProfilesScreen} />
        <Stack.Screen name="Pick" component={PickScreen} />
        <Stack.Screen name="Level" component={LevelScreen} />
        <Stack.Screen name="Play" component={PlayScreen} />
        <Stack.Screen name="Pass" component={PassScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="light" />
        <Root />
      </AppProvider>
    </SafeAreaProvider>
  );
}
