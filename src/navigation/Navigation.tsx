import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAuthStore } from '@/store/authStore';
import {
  RootStackParamList,
  AuthStackParamList,
  AppTabParamList,
  HomeStackParamList,
  ProposalsStackParamList,
  ProfileStackParamList,
  SettingsStackParamList,
} from '@/types';
import { colors } from '@/theme';
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

const screenOptions = {
  headerTintColor: colors.textPrimary,
  headerStyle: { backgroundColor: colors.surface },
  headerShadowVisible: false,
  headerTitleStyle: { fontWeight: '700' as const },
};

const AuthStackNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={screenOptions}>
    <HomeStack.Screen name="Map" component={MapScreen} options={{ headerTitle: 'Find Players' }} />
    <HomeStack.Screen
      name="UserProfile"
      component={UserProfileScreen}
      options={{ headerTitle: "Player's Profile" }}
    />
    <HomeStack.Screen
      name="SetAvailability"
      component={SetAvailabilityScreen}
      options={{ headerTitle: 'Set Availability' }}
    />
  </HomeStack.Navigator>
);

const ProposalsStackNavigator = () => (
  <ProposalsStack.Navigator screenOptions={screenOptions}>
    <ProposalsStack.Screen
      name="ProposalsList"
      component={ProposalsListScreen}
      options={{ headerTitle: 'Match Requests' }}
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
    <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ headerTitle: 'Profile' }} />
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
      options={{ headerTitle: 'Settings' }}
    />
    <SettingsStack.Screen
      name="BlockList"
      component={BlockListScreen}
      options={{ headerTitle: 'Blocked Players' }}
    />
    <SettingsStack.Screen name="About" component={AboutScreen} options={{ headerTitle: 'About' }} />
  </SettingsStack.Navigator>
);

const AppTabNavigator = () => (
  <AppTabs.Navigator
    screenOptions={({ route }: { route: { name: keyof AppTabParamList } }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }: { color: string; size: number }) => {
        let iconName = 'help';
        if (route.name === 'HomeStack') iconName = 'map';
        else if (route.name === 'ProposalsStack') iconName = 'mail';
        else if (route.name === 'ProfileStack') iconName = 'person';
        else if (route.name === 'SettingsStack') iconName = 'settings';
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textTertiary,
      tabBarLabelStyle: { fontSize: 12, fontWeight: '500' as const },
    })}>
    <AppTabs.Screen name="HomeStack" component={HomeStackNavigator} options={{ tabBarLabel: 'Find Players' }} />
    <AppTabs.Screen
      name="ProposalsStack"
      component={ProposalsStackNavigator}
      options={{ tabBarLabel: 'Requests' }}
    />
    <AppTabs.Screen name="ProfileStack" component={ProfileStackNavigator} options={{ tabBarLabel: 'Profile' }} />
    <AppTabs.Screen
      name="SettingsStack"
      component={SettingsStackNavigator}
      options={{ tabBarLabel: 'Settings' }}
    />
  </AppTabs.Navigator>
);

export const Navigation = () => {
  const { user, isLoading, restoreToken } = useAuthStore();

  useEffect(() => {
    restoreToken();
  }, [restoreToken]);

  if (isLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <NavigationContainer>
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
