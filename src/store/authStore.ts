import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@services/api';
import {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  AuthState,
} from '@types/index';

export const useAuthStore = create<
  AuthState & {
    register: (data: RegisterRequest) => Promise<void>;
    login: (data: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    restoreToken: () => Promise<void>;
    updateUser: (user: User) => void;
    clearError: () => void;
  }
>(set => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,

  register: async data => {
    set({ isLoading: true, error: null });
    try {
      const response: AuthResponse = await apiClient.register(data);

      // Save tokens to async storage
      await AsyncStorage.setItem('accessToken', response.accessToken);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
      await AsyncStorage.setItem('userId', response.userId);

      // Set auth token in API client
      apiClient.setAuthToken(response.accessToken);

      // Fetch full user profile
      const userProfile = await apiClient.getMyProfile();

      set({
        user: userProfile,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  login: async data => {
    set({ isLoading: true, error: null });
    try {
      const response: AuthResponse = await apiClient.login(data);

      // Save tokens to async storage
      await AsyncStorage.setItem('accessToken', response.accessToken);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
      await AsyncStorage.setItem('userId', response.userId);

      // Set auth token in API client
      apiClient.setAuthToken(response.accessToken);

      // Fetch full user profile
      const userProfile = await apiClient.getMyProfile();

      set({
        user: userProfile,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.logout();

      // Clear tokens from storage and API client
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userId');

      apiClient.clearAuthToken();

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Logout failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  restoreToken: async () => {
    set({ isLoading: true });
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (accessToken && refreshToken) {
        apiClient.setAuthToken(accessToken);

        // Fetch user profile to verify token is still valid
        const userProfile = await apiClient.getMyProfile();

        set({
          user: userProfile,
          accessToken,
          refreshToken,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      // Token is invalid or expired, user needs to login
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      apiClient.clearAuthToken();

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
      });
    }
  },

  updateUser: user => {
    set({ user });
  },

  clearError: () => {
    set({ error: null });
  },
}));
