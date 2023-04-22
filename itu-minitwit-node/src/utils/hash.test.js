const hash = require('./hash');
jest.useFakeTimers();

describe('hash function', () => {
    test('returns a hash string', () => {
      const password = 'myPassword';
      const hashedPassword = hash(password);
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(password);
    });

    test('empty password', () => {
      const password = '';
      const hashedPassword = hash(password);
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(password);
    });
  });