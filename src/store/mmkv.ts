import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
  id: 'runcasts-storage',
  encryptionKey: 'runcasts-secure-key' // Optional: if we want to encrypt MMKV data
});
