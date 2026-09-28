import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T,>(selector: (state: RootState) => T): T =>
  useSelector((state: RootState) => selector(state));

// Auth selectors & hooks
export const useAuth = () => {
  return useAppSelector((state) => state.auth);
};

export const useUser = () => {
  return useAppSelector((state) => state.auth.user);
};

export const useAccessToken = () => {
  return useAppSelector((state) => state.auth.accessToken);
};

export const useIsAuthenticated = () => {
  return useAppSelector((state) => state.auth.isAuthenticated);
};

// Attendance selectors & hooks
export const useAttendance = () => {
  return useAppSelector((state) => state.attendance);
};

export const useAttendanceRecords = () => {
  return useAppSelector((state) => state.attendance.records);
};

export const useTodayAttendance = () => {
  return useAppSelector((state) => state.attendance.dailyAttendance);
};

export const useTodayStatus = () => {
  return useAppSelector((state) => state.attendance.todayStatus);
};

// Tasks selectors & hooks
export const useTasks = () => {
  return useAppSelector((state) => state.tasks);
};

export const useTaskList = () => {
  return useAppSelector((state) => state.tasks.tasks);
};

export const useSelectedTask = () => {
  return useAppSelector((state) => state.tasks.selectedTask);
};

export const useTaskStats = () => {
  return useAppSelector((state) => state.tasks.stats);
};

// UI selectors & hooks
export const useUI = () => {
  return useAppSelector((state) => state.ui);
};

export const useIsOnline = () => {
  return useAppSelector((state) => state.ui.isOnline);
};

export const useNotifications = () => {
  return useAppSelector((state) => state.ui.notifications);
};

export const useSyncInProgress = () => {
  return useAppSelector((state) => state.ui.syncInProgress);
};
