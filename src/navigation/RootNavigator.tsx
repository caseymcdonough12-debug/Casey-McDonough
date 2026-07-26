import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useUser } from '../context/UserContext';
import CompletionScreen from '../screens/CompletionScreen';
import LessonScreen from '../screens/LessonScreen';
import ExploreFeedbackScreen from '../screens/explore/ExploreFeedbackScreen';
import LifeStageScreen from '../screens/onboarding/LifeStageScreen';
import TrackSelectScreen from '../screens/onboarding/TrackSelectScreen';
import { useTheme } from '../theme/ThemeContext';
import MainTabs from './MainTabs';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { profile, loading } = useUser();
  const { colors, isDark } = useTheme();

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!profile.hasOnboarded ? (
          <>
            <Stack.Screen name="TrackSelect" component={TrackSelectScreen} />
            <Stack.Screen name="LifeStage" component={LifeStageScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="Lesson"
              component={LessonScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen name="Completion" component={CompletionScreen} />
            <Stack.Screen
              name="ExploreFeedback"
              component={ExploreFeedbackScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
