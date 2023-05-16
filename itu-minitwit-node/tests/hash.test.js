const assert = require('assert');
const hash = require('../src/utils/hash');

describe('hash function', () => {
  it('should return a hash string', () => {
    const password = 'myPassword';
    const hashedPassword = hash(password);
    assert.strictEqual(typeof hashedPassword, 'string');
    assert.notStrictEqual(hashedPassword, password);
  });

  it('should hash an empty password', () => {
    const password = '';
    const hashedPassword = hash(password);
    assert.strictEqual(typeof hashedPassword, 'string');
    assert.notStrictEqual(hashedPassword, password);
  });
});