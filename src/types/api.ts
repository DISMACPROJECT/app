import {
  User,
  AuthTokens,
  AuthResponse,
  LoginPayload,
  RefreshTokenPayload,
  ChangePasswordPayload,
} from './user';
import {
  AttendanceRecord,
  DailyAttendance,
  AttendanceMarkPayload,
  AttendanceHistoryPayload,
} from './attendance';
import {
  Task,
  TaskFormPayload,
  TaskUpdatePayload,
  TaskListFilters,
} from './task';
import { ApiResponse, PaginatedResponse } from './common';

export type { ApiResponse, PaginatedResponse };

export interface ApiEndpoints {
  // Auth
  login: {
    method: 'POST';
    path: '/auth/login';
    payload: LoginPayload;
    response: ApiResponse<AuthResponse>;
  };
  refreshToken: {
    method: 'POST';
    path: '/auth/refresh-token';
    payload: RefreshTokenPayload;
    response: ApiResponse<AuthTokens>;
  };
  logout: {
    method: 'POST';
    path: '/auth/logout';
    payload: Record<string, unknown>;
    response: ApiResponse<{ success: boolean }>;
  };

  // User
  getProfile: {
    method: 'GET';
    path: '/user/profile';
    response: ApiResponse<User>;
  };
  updateProfile: {
    method: 'PUT';
    path: '/user/profile';
    payload: Partial<User>;
    response: ApiResponse<User>;
  };
  changePassword: {
    method: 'POST';
    path: '/user/change-password';
    payload: ChangePasswordPayload;
    response: ApiResponse<{ success: boolean }>;
  };

  // Attendance
  markAttendance: {
    method: 'POST';
    path: '/attendance/mark';
    payload: AttendanceMarkPayload;
    response: ApiResponse<AttendanceRecord>;
  };
  getAttendanceHistory: {
    method: 'GET';
    path: '/attendance/history';
    queryParams: AttendanceHistoryPayload;
    response: PaginatedResponse<AttendanceRecord>;
  };
  getTodayAttendance: {
    method: 'GET';
    path: '/attendance/today';
    response: ApiResponse<DailyAttendance>;
  };
  updateAttendance: {
    method: 'PUT';
    path: '/attendance/{id}';
    payload: Partial<AttendanceRecord>;
    response: ApiResponse<AttendanceRecord>;
  };

  // Tasks
  getTasks: {
    method: 'GET';
    path: '/tasks';
    queryParams: TaskListFilters;
    response: PaginatedResponse<Task>;
  };
  getTask: {
    method: 'GET';
    path: '/tasks/{id}';
    response: ApiResponse<Task>;
  };
  createTask: {
    method: 'POST';
    path: '/tasks';
    payload: TaskFormPayload;
    response: ApiResponse<Task>;
  };
  updateTask: {
    method: 'PUT';
    path: '/tasks/{id}';
    payload: TaskUpdatePayload;
    response: ApiResponse<Task>;
  };
  deleteTask: {
    method: 'DELETE';
    path: '/tasks/{id}';
    response: ApiResponse<{ success: boolean }>;
  };
  uploadTaskPhoto: {
    method: 'POST';
    path: '/tasks/{id}/photos';
    payload: FormData;
    response: ApiResponse<{ photoId: string; url: string }>;
  };
  completeTask: {
    method: 'POST';
    path: '/tasks/{id}/complete';
    payload: TaskUpdatePayload;
    response: ApiResponse<Task>;
  };

  // Reports
  getReports: {
    method: 'GET';
    path: '/reports';
    response: PaginatedResponse<any>;
  };
  generateReport: {
    method: 'POST';
    path: '/reports/generate';
    payload: {
      type: 'ATTENDANCE' | 'TASKS' | 'PRODUCTIVITY';
      startDate: string;
      endDate: string;
      filters?: Record<string, unknown>;
    };
    response: ApiResponse<{ reportId: string; url: string }>;
  };
  downloadReport: {
    method: 'GET';
    path: '/reports/{id}/download';
    response: Blob;
  };
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path?: string;
  details?: Record<string, unknown>;
}
