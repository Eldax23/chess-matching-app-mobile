import { create } from 'zustand';
import { apiClient } from '@services/api';
import { Location, LocationState, NearbyUser } from '@/types';

export const useLocationStore = create<
  LocationState & {
    setAvailability: (
      location: Location,
      hasBoard: boolean,
      expiresInHours?: number,
    ) => Promise<void>;
    setUnavailable: () => Promise<void>;
    getNearbyUsers: (radiusKm: number, hasBoard?: boolean) => Promise<NearbyUser[]>;
    searchRadiusKm: number;
    setSearchRadius: (radiusKm: number) => void;
    clearError: () => void;
  }
>(set => ({
  currentLocation: null,
  isAvailable: false,
  isLoading: false,
  error: null,
  searchRadiusKm: 10,

  setSearchRadius: radiusKm => {
    set({ searchRadiusKm: radiusKm });
  },

  setAvailability: async (location, hasBoard, expiresInHours = 4) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.setAvailability({
        isAvailable: true,
        latitude: location.latitude,
        longitude: location.longitude,
        hasBoard,
        expiresInHours,
      });

      set({
        currentLocation: location,
        isAvailable: true,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to set availability';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  setUnavailable: async () => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.setAvailability({
        isAvailable: false,
        latitude: 0,
        longitude: 0,
        hasBoard: false,
      });

      set({
        isAvailable: false,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to set unavailable';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  getNearbyUsers: async (radiusKm, hasBoard) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getNearbyUsers(radiusKm, hasBoard);
      set({ isLoading: false });
      return response.users || [];
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch nearby users';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
