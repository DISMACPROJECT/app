import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { env } from '@utils/env';
import { createLogger } from '@utils/logger';
import { handleApiError } from '@utils/errorHandling';

const log = createLogger('ApiClient');

let apiInstance: AxiosInstance | null = null;

export const createApiClient = (getToken: () => Promise<string | null>): AxiosInstance => {
  const instance = axios.create({
    baseURL: env.API_BASE_URL,
    timeout: env.API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'DCONTROL-Mobile/1.0.0',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      log.debug('API Request', {
        method: config.method?.toUpperCase(),
        url: config.url,
        hasAuth: !!token,
      });
      return config;
    },
    (error) => {
      log.error('Request Interceptor Error', error);
      return Promise.reject(handleApiError(error));
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      log.debug('API Response', {
        status: response.status,
        url: response.config.url,
      });
      return response;
    },
    (error) => {
      const appError = handleApiError(error);
      log.error('API Error', appError);
      return Promise.reject(appError);
    }
  );

  return instance;
};

export const getApiClient = (): AxiosInstance => {
  if (!apiInstance) {
    throw new Error('API client not initialized. Call initializeApiClient first.');
  }
  return apiInstance;
};

export const initializeApiClient = (getToken: () => Promise<string | null>) => {
  apiInstance = createApiClient(getToken);
  return apiInstance;
};

export const resetApiClient = () => {
  apiInstance = null;
};
