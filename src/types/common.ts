export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> {
  status: 'success' | 'error';
  data?: {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

export interface Photo {
  id: string;
  uri: string;
  width: number;
  height: number;
  timestamp: number;
  location?: Location;
  size: number;
  mimeType: string;
}

export interface SyncQueueItem {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: 'attendance' | 'task' | 'report';
  entityId: string;
  payload: Record<string, unknown>;
  timestamp: number;
  retries: number;
  status: 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED';
}

export type UserRole =
  | 'ADMIN'
  | 'ASIGNADORES'
  | 'MERCADERISTAS'
  | 'OBRA'
  | 'BIOMETRICO'
  | 'PLANTA'
  | 'ADMINISTRATIVO'
  | 'RUTA';

export interface ErrorWithCode {
  code: string;
  message: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}
