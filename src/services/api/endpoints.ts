export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    VERIFY_BIOMETRIC: '/auth/verify-biometric',
  },

  // User
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
    GET_BY_ID: (id: string) => `/user/${id}`,
  },

  // Attendance
  ATTENDANCE: {
    MARK: '/attendance/mark',
    HISTORY: '/attendance/history',
    TODAY: '/attendance/today',
    GET_BY_ID: (id: string) => `/attendance/${id}`,
    UPDATE: (id: string) => `/attendance/${id}`,
    DELETE: (id: string) => `/attendance/${id}`,
    STATS: '/attendance/stats',
  },

  // Tasks
  TASKS: {
    LIST: '/tasks',
    CREATE: '/tasks',
    GET_BY_ID: (id: string) => `/tasks/${id}`,
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
    COMPLETE: (id: string) => `/tasks/${id}/complete`,
    UPLOAD_PHOTO: (id: string) => `/tasks/${id}/photos`,
    GET_PHOTOS: (id: string) => `/tasks/${id}/photos`,
    DELETE_PHOTO: (id: string, photoId: string) =>
      `/tasks/${id}/photos/${photoId}`,
    STATS: '/tasks/stats',
  },

  // Reports
  REPORTS: {
    LIST: '/reports',
    CREATE: '/reports/generate',
    GET_BY_ID: (id: string) => `/reports/${id}`,
    DOWNLOAD: (id: string) => `/reports/${id}/download`,
    DELETE: (id: string) => `/reports/${id}`,
  },

  // Sync
  SYNC: {
    PUSH: '/sync/push',
    PULL: '/sync/pull',
  },
};
