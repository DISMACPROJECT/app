import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TasksState, Task, TaskStatus, TaskPriority } from '@types/task';
import { getApiClient } from '@services/api/client';
import { ENDPOINTS } from '@services/api/endpoints';

const initialState: TasksState = {
  tasks: [],
  selectedTask: null,
  filters: {},
  stats: null,
  loading: false,
  isLoading: false,
  isSyncing: false,
  error: null,
  lastUpdated: null,
};

export const getTasks = createAsyncThunk(
  'tasks/get',
  async (_, { rejectWithValue }) => {
    try {
      const client = getApiClient();
      const response = await client.get(ENDPOINTS.TASKS.LIST);
      return response.data.tasks || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al obtener tareas'
      );
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async (
    { taskId, status }: { taskId: string; status: TaskStatus },
    { rejectWithValue }
  ) => {
    try {
      const client = getApiClient();
      const response = await client.put(ENDPOINTS.TASKS.UPDATE(taskId), {
        status,
      });
      return response.data.task;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Error al actualizar tarea'
      );
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
      state.lastUpdated = Date.now();
    },
    addTask: (state, action) => {
      state.tasks.unshift(action.payload);
      state.lastUpdated = Date.now();
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
        if (state.selectedTask?.id === action.payload.id) {
          state.selectedTask = action.payload;
        }
        state.lastUpdated = Date.now();
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      if (state.selectedTask?.id === action.payload) {
        state.selectedTask = null;
      }
      state.lastUpdated = Date.now();
    },
    selectTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    setTaskStats: (state, action) => {
      state.stats = action.payload;
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
    clearTasks: (state) => {
      state.tasks = [];
      state.selectedTask = null;
      state.filters = {};
      state.stats = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTaskStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  selectTask,
  clearSelectedTask,
  setFilters,
  setTaskStats,
  setLoading,
  setSyncing,
  setError,
  clearError,
  clearTasks,
} = taskSlice.actions;

export { getTasks, updateTaskStatus };

export default taskSlice.reducer;
