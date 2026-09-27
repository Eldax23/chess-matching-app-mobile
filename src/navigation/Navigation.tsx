import React, { useEffect } from 'react';
import { NavigationContainer, DarkTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAuthStore } from '@/store/authStore';
import { useProposalStore } from '@/store/proposalStore';
import {
  RootStackParamList,
  AuthStackParamList,
  AppTabParamList,
  HomeStackParamList,
  ProposalsStackParamList,
  ProfileStackParamList,
  SettingsStackParamList,
} from '@/types';
import { colors, fonts } from '@/theme';
import { LoadingSpinner } from '@/components';

// Auth screens
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';

// Home stack screens
import MapScreen from '@/screens/home/MapScreen';
import UserProfileScreen from '@/screens/home/UserProfileScreen';
import SetAvailabilityScreen from '@/screens/home/SetAvailabilityScreen';

// Proposals stack screens
import ProposalsListScreen from '@/screens/proposals/ProposalsListScreen';
import ProposalDetailScreen from '@/screens/proposals/ProposalDetailScreen';
import RecordMatchScreen from '@/screens/proposals/RecordMatchScreen';

// Profile stack screens
import ProfileScreen from '@/screens/profile/ProfileScreen';
import EditProfileScreen from '@/screens/profile/EditProfileScreen';
import MatchHistoryScreen from '@/screens/profile/MatchHistoryScreen';

// Settings stack screens
import SettingsScreen from '@/screens/settings/SettingsScreen';
import BlockListScreen from '@/screens/settings/BlockListScreen';
import AboutScreen from '@/screens/settings/AboutScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppTabs = createBottomTabNavigator<AppTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ProposalsStack = createNativeStackNavigator<ProposalsStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

const navTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.textPrimary,
    border: colors.borderLight,
    notification: colors.primary,
  },
};

const screenOptions = {
  headerTintColor: colors.textPrimary,
  headerStyle: { backgroundColor: colors.background },
  headerShadowVisible: false,
  headerTitleStyle: { fontWeight: '800' as const },
  contentStyle: { backgroundColor: colors.background },
};

// Main screens render their own branded AppHeader
const noHeader = { headerShown: false };

const TAB_ICONS: Record<keyof AppTabParamList, string> = {
  HomeStack: 'radar',
  ProposalsStack: 'sword-cross',
  ProfileStack: 'account-circle-outline',
  SettingsStack: 'cog-outline',
};

const AuthStackNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={screenOptions}>
    <HomeStack.Screen name="Map" component={MapScreen} options={noHeader} />
    <HomeStack.Screen
      name="UserProfile"
      component={UserProfileScreen}
      options={{ headerTitle: "Player's Profile" }}
    />
    <HomeStack.Screen
      name="SetAvailability"
      component={SetAvailabilityScreen}
      options={noHeader}
    />
  </HomeStack.Navigator>
);

const ProposalsStackNavigator = () => (
  <ProposalsStack.Navigator screenOptions={screenOptions}>
    <ProposalsStack.Screen
      name="ProposalsList"
      component={ProposalsListScreen}
      options={noHeader}
    />
    <ProposalsStack.Screen
      name="ProposalDetail"
      component={ProposalDetailScreen}
      options={{ headerTitle: 'Request Details' }}
    />
    <ProposalsStack.Screen
      name="RecordMatch"
      component={RecordMatchScreen}
      options={{ headerTitle: 'Record Match' }}
    />
  </ProposalsStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={screenOptions}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} options={noHeader} />
    <ProfileStack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{ headerTitle: 'Edit Profile' }}
    />
    <ProfileStack.Screen
      name="MatchHistory"
      component={MatchHistoryScreen}
      options={{ headerTitle: 'Match History' }}
    />
  </ProfileStack.Navigator>
);

const SettingsStackNavigator = () => (
  <SettingsStack.Navigator screenOptions={screenOptions}>
    <SettingsStack.Screen
      name="Settings"
      component={SettingsScreen}
      options={noHeader}
    />
    <SettingsStack.Screen
      name="BlockList"
      component={BlockListScreen}
      options={{ headerTitle: 'Blocked Players' }}
    />
    <SettingsStack.Screen name="About" component={AboutScreen} options={{ headerTitle: 'About' }} />
  </SettingsStack.Navigator>
);

const AppTabNavigator = () => {
  const incomingCount = useProposalStore(s => s.incomingProposals.length);
  const fetchIncomingProposals = useProposalStore(s => s.fetchIncomingProposals);

  // Load incoming requests up front so the Challenges badge is accurate
  useEffect(() => {
    fetchIncomingProposals().catch(() => {});
  }, [fetchIncomingProposals]);

  return (
    <AppTabs.Navigator
      screenOptions={({ route }: { route: { name: keyof AppTabParamList } }) => ({
        headerShown: false,
        tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
          <Icon name={TAB_ICONS[route.name]} size={focused ? 26 : 24} color={color} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderLight,
          height: 68,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.mono,
          fontSize: 10,
          fontWeight: '700' as const,
          letterSpacing: 0.8,
        },
        tabBarBadgeStyle: {
          backgroundColor: colors.secondary,
          color: colors.textInverse,
          fontSize: 10,
          fontWeight: '800' as const,
        },
      })}>
      <AppTabs.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{ tabBarLabel: 'RADAR' }}
      />
      <AppTabs.Screen
        name="ProposalsStack"
        component={ProposalsStackNavigator}
        options={{
          tabBarLabel: 'CHALLENGES',
          tabBarBadge: incomingCount > 0 ? incomingCount : undefined,
        }}
      />
      <AppTabs.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{ tabBarLabel: 'PROFILE' }}
      />
      <AppTabs.Screen
        name="SettingsStack"
        component={SettingsStackNavigator}
        options={{ tabBarLabel: 'SETTINGS' }}
      />
    </AppTabs.Navigator>
  );
};

export const Navigation = () => {
  const { user, isLoading, restoreToken } = useAuthStore();

  useEffect(() => {
    restoreToken();
  }, [restoreToken]);

  if (isLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <RootStack.Screen name="App" component={AppTabNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
