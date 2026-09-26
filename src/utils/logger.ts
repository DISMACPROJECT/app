type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDevelopment = __DEV__;

export const logger = {
  debug: (tag: string, message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[${tag}] ${message}`, data || '');
    }
  },

  info: (tag: string, message: string, data?: any) => {
    console.log(`[${tag}] ℹ️ ${message}`, data || '');
  },

  warn: (tag: string, message: string, data?: any) => {
    console.warn(`[${tag}] ⚠️ ${message}`, data || '');
  },

  error: (tag: string, message: string, error?: any) => {
    console.error(`[${tag}] ❌ ${message}`, error || '');

    // TODO: Send to Sentry or error tracking service
    // Sentry.captureException(error, {
    //   tags: { context: tag },
    //   extra: { message }
    // })
  },

  group: (label: string) => {
    if (isDevelopment) {
      console.group(label);
    }
  },

  groupEnd: () => {
    if (isDevelopment) {
      console.groupEnd();
    }
  },

  table: (label: string, data: any) => {
    if (isDevelopment && console.table) {
      console.group(label);
      console.table(data);
      console.groupEnd();
    }
  },
};

export const createLogger = (tag: string) => ({
  debug: (message: string, data?: any) => logger.debug(tag, message, data),
  info: (message: string, data?: any) => logger.info(tag, message, data),
  warn: (message: string, data?: any) => logger.warn(tag, message, data),
  error: (message: string, error?: any) => logger.error(tag, message, error),
});
