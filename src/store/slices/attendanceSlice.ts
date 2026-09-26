import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AttendanceState, AttendanceRecord } from '@types/attendance';

const initialState: AttendanceState = {
  records: [],
  dailyAttendance: null,
  todayStatus: null,
  isLoading: false,
  isSyncing: false,
  error: null,
  lastUpdated: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setAttendanceRecords: (state, action) => {
      state.records = action.payload;
      state.lastUpdated = Date.now();
    },
    addAttendanceRecord: (state, action) => {
      state.records.unshift(action.payload);
      state.lastUpdated = Date.now();
    },
    setDailyAttendance: (state, action) => {
      state.dailyAttendance = action.payload;
      state.todayStatus = action.payload?.status;
      state.lastUpdated = Date.now();
    },
    setTodayStatus: (state, action) => {
      state.todayStatus = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSyncing: (state, action) => {
      state.isSyncing = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAttendance: (state) => {
      state.records = [];
      state.dailyAttendance = null;
      state.todayStatus = null;
      state.error = null;
    },
  },
});

export const {
  setAttendanceRecords,
  addAttendanceRecord,
  setDailyAttendance,
  setTodayStatus,
  setLoading,
  setSyncing,
  setError,
  clearError,
  clearAttendance,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
