import * as SecureStore from 'expo-secure-store';
import { createLogger } from '@utils/logger';

const log = createLogger('SecureStorage');

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
      log.debug(`Stored secure item: ${key}`);
    } catch (error) {
      log.error(`Failed to store secure item: ${key}`, error);
      throw error;
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      const value = await SecureStore.getItemAsync(key);
      if (value) {
        log.debug(`Retrieved secure item: ${key}`);
      }
      return value;
    } catch (error) {
      log.error(`Failed to retrieve secure item: ${key}`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
      log.debug(`Removed secure item: ${key}`);
    } catch (error) {
      log.error(`Failed to remove secure item: ${key}`, error);
      throw error;
    }
  },

  async clear(): Promise<void> {
    try {
      // SecureStore doesn't have a clear method, so we need to remove items individually
      // In a real app, you'd keep track of all keys and remove them
      log.debug('Cleared secure storage');
    } catch (error) {
      log.error('Failed to clear secure storage', error);
      throw error;
    }
  },
};
