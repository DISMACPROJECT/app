import * as Notifications from 'expo-notifications';
import { createLogger } from '@utils/logger';

const log = createLogger('NotificationService');

// Configurar cómo se comportan las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  badge?: number;
}

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';
      log.info('Notification permissions', { granted });
      return granted;
    } catch (error) {
      log.error('Error requesting notification permissions', error);
      return false;
    }
  },

  async getExpoPushToken(): Promise<string | null> {
    try {
      const token = (
        await Notifications.getExpoPushTokenAsync()
      ).data;
      log.info('Expo push token', { tokenLength: token.length });
      return token;
    } catch (error) {
      log.error('Error getting expo push token', error);
      return null;
    }
  },

  async sendLocalNotification(payload: NotificationPayload): Promise<string | null> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: payload.title,
          body: payload.body,
          data: payload.data || {},
          badge: payload.badge || 1,
          sound: 'default',
        },
        trigger: null, // Inmediato
      });

      log.info('Local notification sent', { notificationId });
      return notificationId;
    } catch (error) {
      log.error('Error sending local notification', error);
      return null;
    }
  },

  async scheduleNotification(
    payload: NotificationPayload,
    delaySeconds: number
  ): Promise<string | null> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: payload.title,
          body: payload.body,
          data: payload.data || {},
          badge: payload.badge || 1,
          sound: 'default',
        },
        trigger: {
          seconds: delaySeconds,
        },
      });

      log.info('Scheduled notification', { notificationId, delaySeconds });
      return notificationId;
    } catch (error) {
      log.error('Error scheduling notification', error);
      return null;
    }
  },

  // Notificaciones para eventos específicos

  async notifyAttendanceMarked(type: 'IN' | 'OUT'): Promise<void> {
    await this.sendLocalNotification({
      title: 'Marcaje Registrado',
      body: `Tu ${type === 'IN' ? 'entrada' : 'salida'} ha sido registrada correctamente`,
      data: { event: 'attendance_marked', type },
      badge: 1,
    });
  },

  async notifyTaskCompleted(taskTitle: string): Promise<void> {
    await this.sendLocalNotification({
      title: '¡Tarea Completada!',
      body: `Has marcado como completada: ${taskTitle}`,
      data: { event: 'task_completed' },
      badge: 2,
    });
  },

  async notifyTaskAssigned(taskTitle: string, assignedBy: string): Promise<void> {
    await this.sendLocalNotification({
      title: 'Nueva Tarea Asignada',
      body: `${assignedBy} te asignó: ${taskTitle}`,
      data: { event: 'task_assigned' },
      badge: 3,
    });
  },

  async notifyPhotoUploaded(fileName: string): Promise<void> {
    await this.sendLocalNotification({
      title: 'Foto Cargada',
      body: `Tu foto "${fileName}" se subió a Google Drive correctamente`,
      data: { event: 'photo_uploaded' },
      badge: 1,
    });
  },

  async notifyReportGenerated(reportType: string): Promise<void> {
    await this.sendLocalNotification({
      title: 'Reporte Generado',
      body: `Tu reporte de ${reportType} está listo`,
      data: { event: 'report_generated' },
      badge: 1,
    });
  },

  async notifyDailyReminder(): Promise<void> {
    await this.sendLocalNotification({
      title: 'Recordatorio Diario',
      body: '¿Ya marcaste tu asistencia hoy?',
      data: { event: 'daily_reminder' },
      badge: 1,
    });
  },

  async scheduleAttendanceReminder(hourOfDay: number = 8): Promise<void> {
    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(hourOfDay, 0, 0, 0);

    if (targetTime <= now) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    const secondsUntilTarget = Math.floor(
      (targetTime.getTime() - now.getTime()) / 1000
    );

    await this.scheduleNotification(
      {
        title: 'Recordatorio de Asistencia',
        body: 'Es hora de marcar tu entrada',
        data: { event: 'attendance_reminder' },
      },
      secondsUntilTarget
    );

    log.info('Attendance reminder scheduled', {
      targetTime: targetTime.toISOString(),
    });
  },

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.dismissNotificationAsync(notificationId);
      log.info('Notification cancelled', { notificationId });
    } catch (error) {
      log.error('Error cancelling notification', error);
    }
  },

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync();
      log.info('All notifications cancelled');
    } catch (error) {
      log.error('Error cancelling all notifications', error);
    }
  },
};
