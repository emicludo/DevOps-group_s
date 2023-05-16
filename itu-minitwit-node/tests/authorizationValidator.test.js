const assert = require('assert');
const isSimulator = require('../src/utils/authorizationValidator');

describe('authorizationValidator', () => {
  it('should recognize simulator', () => {
    assert.strictEqual(isSimulator('Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh'), true);
  });

  it('should not recognize simulator', () => {
    assert.strictEqual(isSimulator('BUh'), false);
  });
});