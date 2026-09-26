import { STORAGE_KEYS } from '@utils/constants';

export const storageConfig = {
  // Token keys
  accessTokenKey: STORAGE_KEYS.ACCESS_TOKEN,
  refreshTokenKey: STORAGE_KEYS.REFRESH_TOKEN,

  // Auth state
  authStateKey: STORAGE_KEYS.AUTH_STATE,
  userDataKey: STORAGE_KEYS.USER_DATA,

  // App data
  attendanceKey: STORAGE_KEYS.ATTENDANCE,
  tasksKey: STORAGE_KEYS.TASKS,

  // Sync
  syncQueueKey: STORAGE_KEYS.SYNC_QUEUE,
  lastSyncKey: STORAGE_KEYS.LAST_SYNC,

  // Settings
  appSettingsKey: STORAGE_KEYS.APP_SETTINGS,
};

export interface StorageState {
  auth: {
    user: any;
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
    isAuthenticated: boolean;
  };
  attendance: {
    records: any[];
    lastUpdated: number;
  };
  tasks: {
    items: any[];
    lastUpdated: number;
  };
  sync: {
    queue: any[];
    lastSync: number;
    isOnline: boolean;
  };
  settings: {
    theme: 'light' | 'dark';
    language: 'es' | 'en';
    enableBiometric: boolean;
    enableOfflineMode: boolean;
  };
}
