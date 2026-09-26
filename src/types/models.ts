import { User } from './user';
import { AttendanceRecord, DailyAttendance } from './attendance';
import { Task } from './task';

export type {
  User,
  AttendanceRecord,
  DailyAttendance,
  Task,
};

export interface Report {
  id: string;
  title: string;
  type: 'ATTENDANCE' | 'TASKS' | 'PRODUCTIVITY';
  generatedBy: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  data: Record<string, unknown>;
  fileUrl?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  memberCount: number;
  createdAt: string;
}

export interface NotificationPayload {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'TASK' | 'ATTENDANCE' | 'REPORT' | 'SYSTEM';
  actionUrl?: string;
  read: boolean;
  createdAt: string;
}
