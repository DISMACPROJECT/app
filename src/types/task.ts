import { Photo, Location } from './common';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  createdBy: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  location?: Location;
  photos: Photo[];
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormPayload {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  location?: Location;
  photos?: Photo[];
  notes?: string;
}

export interface TaskUpdatePayload {
  status?: TaskStatus;
  notes?: string;
  photos?: Photo[];
  location?: Location;
  completedAt?: string;
}

export interface TaskListFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignedTo?: string;
  createdBy?: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  search?: string;
  limit?: number;
  offset?: number;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  overdue: number;
  completionRate: number;
}

export interface TasksState {
  tasks: Task[];
  selectedTask: Task | null;
  filters: TaskListFilters;
  stats: TaskStats | null;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  lastUpdated: number | null;
}
