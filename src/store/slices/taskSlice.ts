import { createSlice } from '@reduxjs/toolkit';
import { TasksState, Task, TaskStatus, TaskPriority } from '@types/task';

const initialState: TasksState = {
  tasks: [],
  selectedTask: null,
  filters: {},
  stats: null,
  isLoading: false,
  isSyncing: false,
  error: null,
  lastUpdated: null,
};

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

export default taskSlice.reducer;
