import { Location } from './common';

export type AttendanceType = 'IN' | 'OUT' | 'LUNCH_IN' | 'LUNCH_OUT';
export type AttendanceStatus = 'COMPLETED' | 'PENDING' | 'LATE' | 'MISSED';

export interface AttendanceRecord {
  id: string;
  userId: string;
  type: AttendanceType;
  timestamp: string;
  location: Location;
  photo?: string;
  notes?: string;
  verifiedByBiometric: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DailyAttendance {
  date: string;
  userId: string;
  checkIn?: AttendanceRecord;
  checkOut?: AttendanceRecord;
  lunchIn?: AttendanceRecord;
  lunchOut?: AttendanceRecord;
  workHours?: number;
  lunchDuration?: number;
  status: AttendanceStatus;
  notes?: string;
}

export interface AttendanceMarkPayload {
  type: AttendanceType;
  location: Location;
  photo?: string;
  notes?: string;
  verifiedByBiometric: boolean;
  timestamp?: string;
}

export interface AttendanceHistoryPayload {
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface AttendanceState {
  records: AttendanceRecord[];
  dailyAttendance: DailyAttendance | null;
  todayStatus: AttendanceStatus | null;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  lastUpdated: number | null;
}
