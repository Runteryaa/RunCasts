import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'runcasts-storage',
  encryptionKey: 'runcasts-secure-key' // Optional: if we want to encrypt MMKV data
});
