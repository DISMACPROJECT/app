import * as ImagePicker from 'expo-image-picker';
import { getApiClient } from '@services/api/client';
import { ENDPOINTS } from '@services/api/endpoints';
import { createLogger } from '@utils/logger';

const log = createLogger('DriveService');

export interface PhotoUploadResult {
  id: string;
  driveFileId: string;
  fileName: string;
  uploadedAt: string;
  url?: string;
}

export const driveService = {
  async requestCameraPermission(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      log.error('Error requesting camera permission', error);
      return false;
    }
  },

  async requestLibraryPermission(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      log.error('Error requesting library permission', error);
      return false;
    }
  },

  async pickImageFromCamera(): Promise<string | null> {
    try {
      const hasPermission = await this.requestCameraPermission();
      if (!hasPermission) {
        log.warn('Camera permission not granted');
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      log.error('Error picking image from camera', error);
      return null;
    }
  },

  async pickImageFromLibrary(): Promise<string | null> {
    try {
      const hasPermission = await this.requestLibraryPermission();
      if (!hasPermission) {
        log.warn('Library permission not granted');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      log.error('Error picking image from library', error);
      return null;
    }
  },

  async uploadPhotoToTask(
    taskId: string,
    photoUri: string
  ): Promise<PhotoUploadResult | null> {
    try {
      log.info('Uploading photo to task', { taskId });

      const client = getApiClient();

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('taskId', taskId);

      // Add image file
      const fileName = `task-${taskId}-${Date.now()}.jpg`;
      const file = {
        uri: photoUri,
        type: 'image/jpeg',
        name: fileName,
      } as any;

      formData.append('photo', file);

      const response = await client.post<any>(
        ENDPOINTS.TASKS.UPLOAD_PHOTO(taskId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success && response.data.photo) {
        log.info('Photo uploaded successfully', {
          photoId: response.data.photo.id,
        });
        return response.data.photo;
      }

      throw new Error('Invalid photo upload response');
    } catch (error) {
      log.error('Error uploading photo', error);
      throw error;
    }
  },

  async getPhotoUrl(driveFileId: string): Promise<string> {
    // Generate Google Drive preview URL
    return `https://drive.google.com/uc?export=view&id=${driveFileId}`;
  },

  async getThumbnailUrl(driveFileId: string): Promise<string> {
    // Generate Google Drive thumbnail URL
    return `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w200`;
  },

  async deletePhoto(taskId: string, photoId: string): Promise<void> {
    try {
      log.info('Deleting photo', { taskId, photoId });
      const client = getApiClient();
      await client.delete(ENDPOINTS.TASKS.DELETE_PHOTO(taskId, photoId));
      log.info('Photo deleted successfully');
    } catch (error) {
      log.error('Error deleting photo', error);
      throw error;
    }
  },

  async getTaskPhotos(taskId: string): Promise<PhotoUploadResult[]> {
    try {
      log.info('Fetching task photos', { taskId });
      const client = getApiClient();
      const response = await client.get(ENDPOINTS.TASKS.GET_PHOTOS(taskId));

      if (response.data.success) {
        return response.data.photos || [];
      }

      return [];
    } catch (error) {
      log.error('Error fetching task photos', error);
      return [];
    }
  },
};
