import { getApiClient } from './client';
import { ENDPOINTS } from './endpoints';
import { createLogger } from '@utils/logger';
import {
  LoginPayload,
  AuthResponse,
  RefreshTokenPayload,
  AuthTokens,
} from '@types/user';
import { ApiResponse } from '@types/common';

const log = createLogger('AuthService');

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      log.info('Initiating login', { email: payload.email });
      const client = getApiClient();
      const response = await client.post<ApiResponse<AuthResponse>>(
        ENDPOINTS.AUTH.LOGIN,
        payload
      );

      if (response.data.status === 'success' && response.data.data) {
        log.info('Login successful', { userId: response.data.data.user.id });
        return response.data.data;
      }

      throw new Error('Invalid login response format');
    } catch (error) {
      log.error('Login failed', error);
      throw error;
    }
  },

  async refreshToken(payload: RefreshTokenPayload): Promise<AuthTokens> {
    try {
      log.info('Refreshing token');
      const client = getApiClient();
      const response = await client.post<ApiResponse<AuthTokens>>(
        ENDPOINTS.AUTH.REFRESH_TOKEN,
        payload
      );

      if (response.data.status === 'success' && response.data.data) {
        log.info('Token refresh successful');
        return response.data.data;
      }

      throw new Error('Invalid refresh token response format');
    } catch (error) {
      log.error('Token refresh failed', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      log.info('Logging out');
      const client = getApiClient();
      await client.post<ApiResponse<{ success: boolean }>>(
        ENDPOINTS.AUTH.LOGOUT,
        {}
      );
      log.info('Logout successful');
    } catch (error) {
      log.warn('Logout request failed (continuing anyway)', error);
      // Don't throw - we want to logout locally even if the request fails
    }
  },

  async verifyBiometric(token: string): Promise<{ success: boolean }> {
    try {
      log.info('Verifying biometric');
      const client = getApiClient();
      const response = await client.post<ApiResponse<{ success: boolean }>>(
        ENDPOINTS.AUTH.VERIFY_BIOMETRIC,
        { token }
      );

      if (response.data.status === 'success' && response.data.data) {
        log.info('Biometric verification successful');
        return response.data.data;
      }

      throw new Error('Invalid biometric response format');
    } catch (error) {
      log.error('Biometric verification failed', error);
      throw error;
    }
  },
};
