const app = require('../app');
const User = require('../src/db/models/user');

describe('User', () => {
    before(async () => {
      await User.sync({ force: true }); // will drop and recreate the table each time you run the tests
    });

    it('creates a new user', async () => {
        const user = await User.create({ user_id: 1, username: 'Alice', email: 'alice@example.com', pw_hash: 'fjehjwkfhejwk' });
        expect(user.user_id).to.equal(1);
        expect(user.username).to.equal('Alice');
        expect(user.email).to.equal('alice@example.com');
        expect(user.pw_hash).to.equal('fjehjwkfhejwk');
      });
  });
  