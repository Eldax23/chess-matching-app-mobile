import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAuthStore } from '@store/authStore';
import {
  RootStackParamList,
  AuthStackParamList,
  AppTabParamList,
  HomeStackParamList,
  ProposalsStackParamList,
  ProfileStackParamList,
  SettingsStackParamList,
} from '@types/index';

// Auth Screens (not created yet)
// import LoginScreen from '@screens/auth/LoginScreen';
// import RegisterScreen from '@screens/auth/RegisterScreen';

// Home Stack Screens (not created yet)
// import MapScreen from '@screens/home/MapScreen';
// import UserProfileScreen from '@screens/home/UserProfileScreen';
// import SetAvailabilityScreen from '@screens/home/SetAvailabilityScreen';

// Proposals Stack Screens (not created yet)
// import ProposalsListScreen from '@screens/proposals/ProposalsListScreen';
// import ProposalDetailScreen from '@screens/proposals/ProposalDetailScreen';
// import RecordMatchScreen from '@screens/proposals/RecordMatchScreen';

// Profile Stack Screens (not created yet)
// import ProfileScreen from '@screens/profile/ProfileScreen';
// import EditProfileScreen from '@screens/profile/EditProfileScreen';
// import MatchHistoryScreen from '@screens/profile/MatchHistoryScreen';

// Settings Stack Screens (not created yet)
// import SettingsScreen from '@screens/settings/SettingsScreen';
// import BlockListScreen from '@screens/settings/BlockListScreen';

// Placeholder screens for now
const PlaceholderScreen = ({ name }: { name: string }) => (
  <>{/* Placeholder for {name} screen */}</>
);

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppTabs = createBottomTabNavigator<AppTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ProposalsStack = createNativeStackNavigator<ProposalsStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

const AuthStackNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true,
    }}>
    <AuthStack.Screen
      name="Login"
      component={() => <PlaceholderScreen name="Login" />}
      options={{ animationEnabled: false }}
    />
    <AuthStack.Screen
      name="Register"
      component={() => <PlaceholderScreen name="Register" />}
    />
  </AuthStack.Navigator>
);

const HomeStackNavigator = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerShown: true,
      headerTitle: 'Find Players',
      headerTintColor: '#1E293B',
    }}>
    <HomeStack.Screen
      name="Map"
      component={() => <PlaceholderScreen name="Map" />}
      options={{ headerTitle: 'Find Players' }}
    />
    <HomeStack.Screen
      name="UserProfile"
      component={() => <PlaceholderScreen name="UserProfile" />}
      options={{ headerTitle: "Player's Profile" }}
    />
    <HomeStack.Screen
      name="SetAvailability"
      component={() => <PlaceholderScreen name="SetAvailability" />}
      options={{ headerTitle: 'Set Availability' }}
    />
  </HomeStack.Navigator>
);

const ProposalsStackNavigator = () => (
  <ProposalsStack.Navigator
    screenOptions={{
      headerShown: true,
      headerTitle: 'Match Requests',
      headerTintColor: '#1E293B',
    }}>
    <ProposalsStack.Screen
      name="ProposalsList"
      component={() => <PlaceholderScreen name="ProposalsList" />}
      options={{ headerTitle: 'Match Requests' }}
    />
    <ProposalsStack.Screen
      name="ProposalDetail"
      component={() => <PlaceholderScreen name="ProposalDetail" />}
      options={{ headerTitle: 'Request Details' }}
    />
    <ProposalsStack.Screen
      name="RecordMatch"
      component={() => <PlaceholderScreen name="RecordMatch" />}
      options={{ headerTitle: 'Record Match' }}
    />
  </ProposalsStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator
    screenOptions={{
      headerShown: true,
      headerTitle: 'Profile',
      headerTintColor: '#1E293B',
    }}>
    <ProfileStack.Screen
      name="Profile"
      component={() => <PlaceholderScreen name="Profile" />}
      options={{ headerTitle: 'Profile' }}
    />
    <ProfileStack.Screen
      name="EditProfile"
      component={() => <PlaceholderScreen name="EditProfile" />}
      options={{ headerTitle: 'Edit Profile' }}
    />
    <ProfileStack.Screen
      name="MatchHistory"
      component={() => <PlaceholderScreen name="MatchHistory" />}
      options={{ headerTitle: 'Match History' }}
    />
  </ProfileStack.Navigator>
);

const SettingsStackNavigator = () => (
  <SettingsStack.Navigator
    screenOptions={{
      headerShown: true,
      headerTitle: 'Settings',
      headerTintColor: '#1E293B',
    }}>
    <SettingsStack.Screen
      name="Settings"
      component={() => <PlaceholderScreen name="Settings" />}
      options={{ headerTitle: 'Settings' }}
    />
    <SettingsStack.Screen
      name="BlockList"
      component={() => <PlaceholderScreen name="BlockList" />}
      options={{ headerTitle: 'Blocked Players' }}
    />
    <SettingsStack.Screen
      name="About"
      component={() => <PlaceholderScreen name="About" />}
      options={{ headerTitle: 'About' }}
    />
  </SettingsStack.Navigator>
);

const AppTabNavigator = () => (
  <AppTabs.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string;

        if (route.name === 'HomeStack') {
          iconName = 'map';
        } else if (route.name === 'ProposalsStack') {
          iconName = 'mail';
        } else if (route.name === 'ProfileStack') {
          iconName = 'person';
        } else if (route.name === 'SettingsStack') {
          iconName = 'settings';
        } else {
          iconName = 'help';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#3B82F6',
      tabBarInactiveTintColor: '#9CA3AF',
      tabBarShowLabel: true,
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
    })}>
    <AppTabs.Screen
      name="HomeStack"
      component={HomeStackNavigator}
      options={{ tabBarLabel: 'Find Players' }}
    />
    <AppTabs.Screen
      name="ProposalsStack"
      component={ProposalsStackNavigator}
      options={{ tabBarLabel: 'Requests' }}
    />
    <AppTabs.Screen
      name="ProfileStack"
      component={ProfileStackNavigator}
      options={{ tabBarLabel: 'Profile' }}
    />
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
    // Try to restore token when app starts
    restoreToken();
  }, [restoreToken]);

  if (isLoading) {
    return null; // Show splash screen here
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}>
        {user ? (
          <RootStack.Screen
            name="App"
            component={AppTabNavigator}
            options={{ animationEnabled: false }}
          />
        ) : (
          <RootStack.Screen
            name="Auth"
            component={AuthStackNavigator}
            options={{ animationEnabled: false }}
          />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
