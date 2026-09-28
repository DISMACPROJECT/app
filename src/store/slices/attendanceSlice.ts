import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AttendanceState, AttendanceRecord } from '@types/attendance';
import { getApiClient } from '@services/api/client';
import { ENDPOINTS } from '@services/api/endpoints';

const initialState: AttendanceState = {
  records: [],
  todayRecords: [],
  dailyAttendance: null,
  todayStatus: null,
  loading: false,
  isLoading: false,
  isSyncing: false,
  error: null,
  lastUpdated: null,
};

export const markAttendance = createAsyncThunk(
  'attendance/mark',
  async (
    payload: {
      type: 'IN' | 'OUT';
      latitude: number;
      longitude: number;
      accuracy: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const client = getApiClient();
      const response = await client.post(ENDPOINTS.ATTENDANCE.MARK, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al marcar asistencia'
      );
    }
  }
);

export const getAttendanceHistory = createAsyncThunk(
  'attendance/history',
  async (params: { userId: string; days?: number }, { rejectWithValue }) => {
    try {
      const client = getApiClient();
      const response = await client.get(ENDPOINTS.ATTENDANCE.HISTORY, {
        params: { days: params.days || 30 },
      });
      return response.data.attendance || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al obtener historial'
      );
    }
  }
);

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
      state.loading = action.payload;
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
      state.todayRecords = [];
      state.dailyAttendance = null;
      state.todayStatus = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.attendance) {
          state.records.unshift(action.payload.attendance);
        }
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAttendanceHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendanceHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.todayRecords = action.payload;
        state.records = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(getAttendanceHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
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

export { markAttendance, getAttendanceHistory };

export default attendanceSlice.reducer;
