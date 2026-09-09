import Geolocation from '@react-native-community/geolocation';
import { Location } from '@/types';

// Request permissions (iOS specific)
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    return new Promise(resolve => {
      Geolocation.requestAuthorization(
        () => {
          // Permission granted
          resolve(true);
        },
        () => {
          // Permission denied
          resolve(false);
        },
      );
    });
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

// Get current location
export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        resolve({
          latitude,
          longitude,
        });
      },
      error => {
        console.error('Error getting location:', error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  });
};

// Watch location updates
export const watchLocation = (
  callback: (location: Location) => void,
  onError?: (error: any) => void,
): number => {
  return Geolocation.watchPosition(
    position => {
      const { latitude, longitude } = position.coords;
      callback({ latitude, longitude });
    },
    error => {
      console.error('Error watching location:', error);
      onError?.(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000,
    },
  );
};

// Stop watching location
export const stopWatchingLocation = (watchId: number) => {
  Geolocation.clearWatch(watchId);
};

// Calculate distance between two points (in km)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

// Format distance for display
export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
};

// Check if location is within radius
export const isWithinRadius = (
  userLat: number,
  userLon: number,
  pointLat: number,
  pointLon: number,
  radiusKm: number,
): boolean => {
  const distance = calculateDistance(userLat, userLon, pointLat, pointLon);
  return distance <= radiusKm;
};
