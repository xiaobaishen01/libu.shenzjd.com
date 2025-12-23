import CryptoJS from 'crypto-js';

export const CryptoService = {
  // AES-256 加密
  encrypt: (data: any, key: string): string => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  },

  // AES-256 解密
  decrypt: <T>(ciphertext: string, key: string): T | null => {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, key);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (!decrypted) return null;
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  },

  // SHA-256 哈希
  hash: (password: string): string => {
    return CryptoJS.SHA256(password).toString();
  },
};
