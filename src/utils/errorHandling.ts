import { ERROR_CODES } from './constants';
import { ErrorWithCode } from '@types/common';
import axios, { AxiosError } from 'axios';

export class AppError extends Error implements ErrorWithCode {
  code: string;
  message: string;
  statusCode?: number;
  details?: Record<string, unknown>;

  constructor(
    code: string,
    message: string,
    statusCode?: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.code = code;
    this.message = message;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const handleApiError = (error: any): AppError => {
  // Network error (no response from server)
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return new AppError(
        ERROR_CODES.TIMEOUT,
        'La solicitud tardó demasiado. Por favor, intenta de nuevo.',
        undefined
      );
    }

    if (!error.message || error.message === 'Network Error') {
      return new AppError(
        ERROR_CODES.NO_CONNECTION,
        'No hay conexión a internet. Por favor, verifica tu conexión.',
        undefined
      );
    }

    return new AppError(
      ERROR_CODES.NETWORK_ERROR,
      error.message || 'Error de red desconocido',
      undefined
    );
  }

  // Server responded with error status
  const status = error.response.status;
  const data = error.response.data;

  // Check if response has our standard error format
  if (data?.error?.code) {
    return new AppError(
      data.error.code,
      data.error.message || 'Error desconocido',
      status,
      data.error.details
    );
  }

  // Handle common HTTP status codes
  switch (status) {
    case 400:
      return new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        data?.message || 'Los datos enviados no son válidos',
        status,
        data?.details
      );
    case 401:
      return new AppError(
        ERROR_CODES.UNAUTHORIZED,
        'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
        status
      );
    case 403:
      return new AppError(
        ERROR_CODES.FORBIDDEN,
        'No tienes permiso para realizar esta acción',
        status
      );
    case 404:
      return new AppError(
        ERROR_CODES.NOT_FOUND,
        'El recurso solicitado no fue encontrado',
        status
      );
    case 409:
      return new AppError(
        ERROR_CODES.CONFLICT,
        'Hay un conflicto con los datos. Por favor, actualiza e intenta de nuevo.',
        status
      );
    case 500:
    case 502:
    case 503:
    case 504:
      return new AppError(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        'El servidor está experimentando problemas. Por favor, intenta más tarde.',
        status
      );
    default:
      return new AppError(
        'UNKNOWN_ERROR',
        data?.message || 'Ocurrió un error desconocido',
        status
      );
  }
};

export const getErrorMessage = (error: any): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (axios.isAxiosError(error)) {
    const appError = handleApiError(error);
    return appError.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocurrió un error desconocido';
};

export const isNetworkError = (error: any): boolean => {
  if (error instanceof AppError) {
    return [
      ERROR_CODES.NETWORK_ERROR,
      ERROR_CODES.NO_CONNECTION,
      ERROR_CODES.TIMEOUT,
    ].includes(error.code);
  }
  return false;
};

export const isAuthError = (error: any): boolean => {
  if (error instanceof AppError) {
    return [
      ERROR_CODES.UNAUTHORIZED,
      ERROR_CODES.TOKEN_EXPIRED,
      ERROR_CODES.SESSION_EXPIRED,
    ].includes(error.code);
  }
  return false;
};

export const isValidationError = (error: any): boolean => {
  if (error instanceof AppError) {
    return error.code === ERROR_CODES.VALIDATION_ERROR;
  }
  return false;
};

export const isSyncConflict = (error: any): boolean => {
  if (error instanceof AppError) {
    return error.code === ERROR_CODES.CONFLICT_DETECTED;
  }
  return false;
};
