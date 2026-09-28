/**
 * Google Drive Configuration
 *
 * Todas las fotos se guardan en una carpeta del proyecto en Google Drive.
 * La app descarga y sincroniza fotos según sea necesario.
 */

export const driveConfig = {
  // ID de la carpeta principal del proyecto en Google Drive
  // Reemplazar con el ID real de la carpeta
  projectFolderId: process.env.EXPO_PUBLIC_DRIVE_PROJECT_FOLDER || 'PROJECT_FOLDER_ID',

  // Subcarpetas para organizar contenido
  folders: {
    // Fotos de tareas
    taskPhotos: 'task-photos',
    // Fotos de marcajes
    attendancePhotos: 'attendance-photos',
    // Reportes PDF
    reports: 'reports',
    // Avatares de usuarios
    avatars: 'avatars',
  },

  // Configuración de fotos
  photos: {
    // Máximo tamaño de archivo en bytes (5 MB)
    maxSize: 5 * 1024 * 1024,
    // Calidad de compresión (0-1)
    compression: 0.8,
    // Retención de fotos en días
    retentionDays: 60,
    // Extensiones permitidas
    allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  },

  // URLs de acceso a Drive
  // Las fotos se sirven a través de: https://drive.google.com/uc?export=view&id={FILE_ID}
  viewUrl: (fileId: string) =>
    `https://drive.google.com/uc?export=view&id=${fileId}`,

  // URL de descarga
  downloadUrl: (fileId: string) =>
    `https://drive.google.com/uc?export=download&id=${fileId}`,

  // URL de thumbnail
  thumbnailUrl: (fileId: string) =>
    `https://drive.google.com/uc?export=view&id=${fileId}&sz=w400`,
};

/**
 * Estructura de carpetas en Drive:
 *
 * /DCONTROL
 *   /task-photos
 *     /[TASK_ID]
 *       - photo1.jpg
 *       - photo2.jpg
 *   /attendance-photos
 *     /[YEAR]/[MONTH]
 *       - [USER_ID]-[TIMESTAMP].jpg
 *   /reports
 *     /[YEAR]/[MONTH]
 *       - report-[ID].pdf
 *   /avatars
 *     - user-[USER_ID].jpg
 */
