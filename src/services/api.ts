import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  SetAvailabilityRequest,
  CreateProposalRequest,
  CreateMatchRequest,
} from '@/types';

const BASE_URL = 'https://api.chess-matching-app.com'; // Update with your API URL

class ApiClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = BASE_URL;
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );

    // Add response interceptor to handle token refresh
    this.instance.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (!refreshToken) {
              throw new Error('No refresh token');
            }

            const response = await axios.post(
              `${this.baseURL}/api/v1/auth/refresh`,
              { refreshToken },
            );

            const { accessToken, refreshToken: newRefreshToken } = response.data;

            await AsyncStorage.setItem('accessToken', accessToken);
            await AsyncStorage.setItem('refreshToken', newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.instance(originalRequest);
          } catch (refreshError) {
            // Refresh failed - user needs to re-login
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            throw refreshError;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  // ===== AUTH ENDPOINTS =====

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.instance.post('/api/v1/auth/register', data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.instance.post('/api/v1/auth/login', data);
    return response.data;
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const response = await this.instance.post('/api/v1/auth/refresh', {
      refreshToken,
    });
    return response.data;
  }

  async logout(refreshToken: string): Promise<void> {
    await this.instance.post('/api/v1/auth/logout', { refreshToken });
  }

  // ===== PROFILE ENDPOINTS =====

  async getMyProfile() {
    const response = await this.instance.get('/api/v1/profile/me');
    return response.data;
  }

  async getUserProfile(userId: string) {
    const response = await this.instance.get(`/api/v1/profile/${userId}`);
    return response.data;
  }

  async updateProfile(data: UpdateProfileRequest) {
    const response = await this.instance.put('/api/v1/profile/me', data);
    return response.data;
  }

  async uploadPhoto(uri: string, filename: string) {
    const formData = new FormData();
    formData.append('photo', {
      uri,
      type: 'image/jpeg',
      name: filename,
    } as any);

    const response = await this.instance.post(
      '/api/v1/profile/me/photo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  }

  // ===== AVAILABILITY ENDPOINTS =====

  async setAvailability(data: SetAvailabilityRequest) {
    const response = await this.instance.post('/api/v1/availability/set', data);
    return response.data;
  }

  async getNearbyUsers(radiusKm: number, hasBoard?: boolean, limit: number = 20) {
    const response = await this.instance.get('/api/v1/availability/nearby', {
      params: {
        radiusKm,
        hasBoard,
        limit,
      },
    });
    return response.data;
  }

  // ===== PROPOSAL ENDPOINTS =====

  async createProposal(data: CreateProposalRequest) {
    const response = await this.instance.post('/api/v1/proposals', data);
    return response.data;
  }

  async getIncomingProposals(status: string = 'pending', limit: number = 20) {
    const response = await this.instance.get('/api/v1/proposals/incoming', {
      params: { status, limit },
    });
    return response.data;
  }

  async getOutgoingProposals(status: string = 'pending', limit: number = 20) {
    const response = await this.instance.get('/api/v1/proposals/outgoing', {
      params: { status, limit },
    });
    return response.data;
  }

  async acceptProposal(proposalId: string) {
    const response = await this.instance.post(
      `/api/v1/proposals/${proposalId}/accept`,
      {},
    );
    return response.data;
  }

  async rejectProposal(proposalId: string, reason?: string) {
    const response = await this.instance.post(
      `/api/v1/proposals/${proposalId}/reject`,
      { reason },
    );
    return response.data;
  }

  async cancelProposal(proposalId: string) {
    const response = await this.instance.post(
      `/api/v1/proposals/${proposalId}/cancel`,
      {},
    );
    return response.data;
  }

  // ===== MATCH ENDPOINTS =====

  async recordMatch(data: CreateMatchRequest) {
    const response = await this.instance.post('/api/v1/matches', data);
    return response.data;
  }

  async getMatchHistory(userId?: string, limit: number = 50) {
    const response = await this.instance.get('/api/v1/matches/history', {
      params: { userId, limit },
    });
    return response.data;
  }

  // ===== BLOCK ENDPOINTS =====

  async blockUser(userId: string, reason?: string) {
    const response = await this.instance.post('/api/v1/blocks', {
      userId,
      reason,
    });
    return response.data;
  }

  async unblockUser(userId: string) {
    const response = await this.instance.delete(`/api/v1/blocks/${userId}`);
    return response.data;
  }

  async getBlockList() {
    const response = await this.instance.get('/api/v1/blocks');
    return response.data;
  }

  // ===== UTILITY =====

  setAuthToken(token: string) {
    this.instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  clearAuthToken() {
    delete this.instance.defaults.headers.common.Authorization;
  }
}

export const apiClient = new ApiClient();
