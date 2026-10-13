import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Navigation } from '@/navigation/Navigation';
import { colors } from '@/theme';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <Navigation />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
