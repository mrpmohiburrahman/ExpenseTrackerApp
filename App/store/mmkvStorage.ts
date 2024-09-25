
// redux/mmkvStorage.ts

import { MMKV } from 'react-native-mmkv';

const MMKV_STORAGE_KEY = 'redux_storage';

// Initialize MMKV instance
const storage = new MMKV({
  id: MMKV_STORAGE_KEY,
  // Add encryption if needed
  // encryptionKey: 'your-encryption-key',
});

// Create a custom storage adapter for Redux Persist
const mmkvStorage = {
  // Retrieve the persisted state
  getItem: (key: string): Promise<string | null> => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },

  // Persist the state
  setItem: (key: string, value: string): Promise<void> => {
    storage.set(key, value);
    return Promise.resolve();
  },

  // Remove the persisted state
  removeItem: (key: string): Promise<void> => {
    storage.delete(key);
    return Promise.resolve();
  },
};

export default mmkvStorage;