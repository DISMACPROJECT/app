import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { asyncStorage } from '@services/storage';

import authReducer from './slices/authSlice';
import attendanceReducer from './slices/attendanceSlice';
import taskReducer from './slices/taskSlice';
import uiReducer from './slices/uiSlice';

const authPersistConfig = {
  key: 'auth',
  storage: asyncStorage,
  whitelist: ['user', 'accessToken', 'refreshToken'],
  blacklist: ['isLoading', 'error'],
};

const attendancePersistConfig = {
  key: 'attendance',
  storage: asyncStorage,
  whitelist: ['records', 'dailyAttendance'],
  blacklist: ['isLoading', 'isSyncing', 'error'],
};

const taskPersistConfig = {
  key: 'tasks',
  storage: asyncStorage,
  whitelist: ['tasks', 'stats'],
  blacklist: ['isLoading', 'isSyncing', 'error', 'filters', 'selectedTask'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedAttendanceReducer = persistReducer(
  attendancePersistConfig,
  attendanceReducer
);
const persistedTaskReducer = persistReducer(taskPersistConfig, taskReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    attendance: persistedAttendanceReducer,
    tasks: persistedTaskReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const preloadedState: PreloadedState<RootState> = {
  auth: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    accessToken: null,
    refreshToken: null,
    lastTokenRefresh: null,
  },
  attendance: {
    records: [],
    dailyAttendance: null,
    todayStatus: null,
    isLoading: false,
    isSyncing: false,
    error: null,
    lastUpdated: null,
  },
  tasks: {
    tasks: [],
    selectedTask: null,
    filters: {},
    stats: null,
    isLoading: false,
    isSyncing: false,
    error: null,
    lastUpdated: null,
  },
  ui: {
    isOnline: true,
    notifications: [],
    isLoading: false,
    syncInProgress: false,
  },
};

export const resetStore = () => {
  store.dispatch({ type: '@@RESET' });
};
