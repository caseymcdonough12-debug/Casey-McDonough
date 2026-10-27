import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ResponsiveShell from './src/components/ResponsiveShell';
import { ProgressProvider } from './src/context/ProgressContext';
import { UserProvider } from './src/context/UserContext';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/theme/ThemeContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UserProvider>
          <ProgressProvider>
            <ResponsiveShell>
              <RootNavigator />
            </ResponsiveShell>
            <StatusBar style="auto" />
          </ProgressProvider>
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
