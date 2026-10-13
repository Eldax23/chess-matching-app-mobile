import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ID_KEY = 'userId';

export const tokenUtils = {
  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  async getUserId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(USER_ID_KEY);
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  },

  async setTokens(
    accessToken: string,
    refreshToken: string,
    userId: string,
  ): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [TOKEN_KEY, accessToken],
        [REFRESH_TOKEN_KEY, refreshToken],
        [USER_ID_KEY, userId],
      ]);
    } catch (error) {
      console.error('Error setting tokens:', error);
      throw error;
    }
  },

  async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_ID_KEY]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
      throw error;
    }
  },

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      return Date.now() >= expirationTime;
    } catch {
      return true;
    }
  },
};

// Time utilities
export const timeUtils = {
  formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString();
  },

  formatTime(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },

  formatDateTime(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString();
  },

  getTimeUntilExpiry(expiryDate: string | Date): string {
    const d = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();

    if (diffMs < 0) {
      return 'Expired';
    }

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  },
};

// String utilities
export const stringUtils = {
  truncate(str: string, length: number): string {
    return str.length > length ? str.substring(0, length) + '...' : str;
  },

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  formatUsername(username: string): string {
    return '@' + username;
  },
};

// Validation utilities
export const validationUtils = {
  isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  isValidPassword(password: string): boolean {
    return password.length >= 8;
  },

  isValidUsername(username: string): boolean {
    return username.length >= 3 && username.length <= 20;
  },

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};

// Rating utilities
export const ratingUtils = {
  // The single most representative rating for a player: FIDE, then Chess.com, then Lichess
  best(p: {
    fideRating?: number;
    chessComRating?: number;
    lichessRating?: number;
  }): { label: string; rating: number } | null {
    if (p.fideRating) return { label: 'FIDE', rating: p.fideRating };
    if (p.chessComRating) return { label: 'Chess.com', rating: p.chessComRating };
    if (p.lichessRating) return { label: 'Lichess', rating: p.lichessRating };
    return null;
  },
};
