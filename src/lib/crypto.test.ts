import { CryptoService } from './crypto';

describe('CryptoService', () => {
  describe('hash', () => {
    it('should generate consistent hash for the same input', () => {
      const input = 'testPassword123';
      const hash1 = CryptoService.hash(input);
      const hash2 = CryptoService.hash(input);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 produces 64 hex characters
    });

    it('should generate different hashes for different inputs', () => {
      const hash1 = CryptoService.hash('password1');
      const hash2 = CryptoService.hash('password2');

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty string', () => {
      const hash = CryptoService.hash('');
      expect(hash).toBeTruthy();
      expect(hash).toHaveLength(64);
    });

    it('should handle special characters', () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const hash = CryptoService.hash(specialChars);
      expect(hash).toBeTruthy();
      expect(hash).toHaveLength(64);
    });

    it('should handle unicode characters', () => {
      const unicode = '你好世界 🎉';
      const hash = CryptoService.hash(unicode);
      expect(hash).toBeTruthy();
      expect(hash).toHaveLength(64);
    });
  });

  describe('encrypt/decrypt', () => {
    const testPassword = 'testEncryptionKey123';
    const testData = {
      name: '张三',
      amount: 100,
      message: '新婚快乐'
    };

    it('should encrypt and decrypt data correctly', () => {
      const encrypted = CryptoService.encrypt(testData, testPassword);
      const decrypted = CryptoService.decrypt(encrypted, testPassword);

      expect(decrypted).toEqual(testData);
    });

    it('should produce different encrypted strings for same data', () => {
      const encrypted1 = CryptoService.encrypt(testData, testPassword);
      const encrypted2 = CryptoService.encrypt(testData, testPassword);

      // Due to IV (initialization vector), encrypted outputs should be different
      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should fail to decrypt with wrong password', () => {
      const encrypted = CryptoService.encrypt(testData, testPassword);

      const result = CryptoService.decrypt(encrypted, 'wrongPassword');
      expect(result).toBeNull();
    });

    it('should handle empty data object', () => {
      const emptyData = {};
      const encrypted = CryptoService.encrypt(emptyData, testPassword);
      const decrypted = CryptoService.decrypt(encrypted, testPassword);

      expect(decrypted).toEqual(emptyData);
    });

    it('should handle complex nested objects', () => {
      const complexData = {
        event: {
          name: 'Test Event',
          guests: [
            { name: 'Alice', amount: 100 },
            { name: 'Bob', amount: 200 }
          ],
          metadata: {
            created: new Date().toISOString(),
            theme: 'festive'
          }
        }
      };

      const encrypted = CryptoService.encrypt(complexData, testPassword);
      const decrypted = CryptoService.decrypt(encrypted, testPassword);

      expect(decrypted).toEqual(complexData);
    });

    it('should handle string data', () => {
      const stringData = 'Hello World';
      const encrypted = CryptoService.encrypt(stringData, testPassword);
      const decrypted = CryptoService.decrypt(encrypted, testPassword);

      expect(decrypted).toBe(stringData);
    });

    it('should handle array data', () => {
      const arrayData = [1, 2, 3, 'test', { key: 'value' }];
      const encrypted = CryptoService.encrypt(arrayData, testPassword);
      const decrypted = CryptoService.decrypt(encrypted, testPassword);

      expect(decrypted).toEqual(arrayData);
    });
  });

  describe('integration tests', () => {
    it('should handle round-trip encryption with real-world data', () => {
      const password = 'MySecurePassword!@#';
      const eventData = {
        id: 'evt_123456',
        name: '张三李四新婚之喜',
        startDateTime: '2024-01-20T18:00',
        endDateTime: '2024-01-20T22:00',
        passwordHash: CryptoService.hash('admin123'),
        theme: 'festive',
        recorder: '王五',
        createdAt: new Date().toISOString(),
        guests: [
          { id: 'g1', name: 'Alice', amount: 888, type: '现金', note: '新婚快乐' },
          { id: 'g2', name: 'Bob', amount: 1688, type: '现金', note: '百年好合' }
        ]
      };

      const encrypted = CryptoService.encrypt(eventData, password);
      const decrypted = CryptoService.decrypt(encrypted, password);

      expect(decrypted).toEqual(eventData);
      expect(typeof encrypted).toBe('string');
      expect(encrypted.length).toBeGreaterThan(0);
    });

    it('should verify password with hash', () => {
      const password = 'testPassword';
      const hash = CryptoService.hash(password);

      // Simulate password verification
      const verifyHash = CryptoService.hash(password);
      expect(verifyHash).toBe(hash);
    });
  });
});
