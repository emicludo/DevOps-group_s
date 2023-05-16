const gravatar = require('../src/utils/gravatar');
const crypto = require('crypto');
const expect = require('chai').expect;

describe('gravatar function', () => {
  it('should return the correct URL for a given email and size', () => {
    const email = 'test@example.com';
    const size = 200;
    const expectedUrl = `http://www.gravatar.com/avatar/${crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex')}?d=identicon&s=${size}`;

    const actualUrl = gravatar(email, size);

    expect(actualUrl).to.equal(expectedUrl);
  });

  it('should use a default size of 80 if none is provided', () => {
    const email = 'test@example.com';
    const expectedUrl = `http://www.gravatar.com/avatar/${crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex')}?d=identicon&s=80`;

    const actualUrl = gravatar(email);

    expect(actualUrl).to.equal(expectedUrl);
  });

  it('should return an identicon by default', () => {
    const email = 'test@example.com';
    const expectedUrl = `http://www.gravatar.com/avatar/${crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex')}?d=identicon&s=80`;

    const actualUrl = gravatar(email);

    expect(actualUrl).to.contain('d=identicon');
  });
});