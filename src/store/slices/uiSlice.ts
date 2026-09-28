import { createSlice } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface UIState {
  isOnline: boolean;
  notifications: Notification[];
  isLoading: boolean;
  syncInProgress: boolean;
}

const initialState: UIState = {
  isOnline: true,
  notifications: [],
  isLoading: false,
  syncInProgress: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    showNotification: (state, action) => {
      const id = Math.random().toString(36).substr(2, 9);
      state.notifications.push({ ...action.payload, id });
    },
    hideNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSyncInProgress: (state, action) => {
      state.syncInProgress = action.payload;
    },
  },
});

export const {
  setOnlineStatus,
  showNotification,
  hideNotification,
  clearNotifications,
  setLoading,
  setSyncInProgress,
} = uiSlice.actions;

export default uiSlice.reducer;
