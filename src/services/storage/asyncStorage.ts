import AsyncStorage from '@react-native-async-storage/async-storage';
import { createLogger } from '@utils/logger';

const log = createLogger('AsyncStorage');

export const asyncStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
      log.debug(`Stored item: ${key}`);
    } catch (error) {
      log.error(`Failed to store item: ${key}`, error);
      throw error;
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        log.debug(`Retrieved item: ${key}`);
      }
      return value;
    } catch (error) {
      log.error(`Failed to retrieve item: ${key}`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
      log.debug(`Removed item: ${key}`);
    } catch (error) {
      log.error(`Failed to remove item: ${key}`, error);
      throw error;
    }
  },

  async multiSet(items: [string, string][]): Promise<void> {
    try {
      await AsyncStorage.multiSet(items);
      log.debug(`Stored ${items.length} items`);
    } catch (error) {
      log.error('Failed to store multiple items', error);
      throw error;
    }
  },

  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    try {
      const items = await AsyncStorage.multiGet(keys);
      log.debug(`Retrieved ${items.length} items`);
      return items;
    } catch (error) {
      log.error('Failed to retrieve multiple items', error);
      return keys.map((key) => [key, null]);
    }
  },

  async removeMultiple(keys: string[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
      log.debug(`Removed ${keys.length} items`);
    } catch (error) {
      log.error('Failed to remove multiple items', error);
      throw error;
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
      log.debug('Cleared all items');
    } catch (error) {
      log.error('Failed to clear storage', error);
      throw error;
    }
  },

  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      log.error('Failed to get all keys', error);
      return [];
    }
  },
};

export const getStoredJSON = async <T>(key: string): Promise<T | null> => {
  try {
    const item = await asyncStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

export const setStoredJSON = async <T>(key: string, value: T): Promise<void> => {
  await asyncStorage.setItem(key, JSON.stringify(value));
};
