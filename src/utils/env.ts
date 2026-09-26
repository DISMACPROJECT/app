export const env = {
  API_BASE_URL:
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    'https://script.google.com/macros/d/DEPLOYMENT_ID/usercoderun',
  API_TIMEOUT: parseInt(
    process.env.EXPO_PUBLIC_API_TIMEOUT || '30000',
    10
  ),
  LOG_LEVEL: process.env.EXPO_PUBLIC_LOG_LEVEL || 'info',
  ENABLE_BIOMETRIC: process.env.EXPO_PUBLIC_ENABLE_BIOMETRIC === 'true',
  ENABLE_GPS: process.env.EXPO_PUBLIC_ENABLE_GPS === 'true',
  ENABLE_OFFLINE_MODE: process.env.EXPO_PUBLIC_ENABLE_OFFLINE_MODE === 'true',
  PHOTO_RETENTION_DAYS: parseInt(
    process.env.EXPO_PUBLIC_PHOTO_RETENTION_DAYS || '60',
    10
  ),
  TASK_RETENTION_DAYS: parseInt(
    process.env.EXPO_PUBLIC_TASK_RETENTION_DAYS || '90',
    10
  ),
  SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN || '',
};
