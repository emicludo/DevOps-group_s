const request = require('supertest');
const app = require('../app');
const getAllUsers = require('../src/model/users');
const getFollowersFromUser = require('../src/model/followers.js');
const Follower = require('../src/model/Follower.js');

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;

const sandbox = sinon.createSandbox();

describe('GET /fllws/:username', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('returns 403 if authorization header is not correct', async () => {
    const response = await request(app)
      .get('/fllws/testuser')
      .set('Authorization', 'incorrect_token')
      .catch(err => {
        return err.response
      });
    expect(response.status).to.equal(403);
  });

  it('returns 404 if the user is not in the database', async () => {
    sandbox.stub(getAllUsers.prototype, 'getAllUsers').resolves([{ username: 'foo' }]);    
    const response = await request(app)
      .get('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .catch(err => err.response);

    expect(response.status).to.equal(404);
  });

  it('returns 500 if the database does not work properly', async () => {
    sandbox.stub(getAllUsers.prototype, 'getAllUsers').resolves([{ username: 'testuser' }]);

    sandbox.stub(getFollowersFromUser.prototype, 'getFollowersFromUser').rejects(new Error('Error text'));

    const response = await request(app)
      .get('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .catch(err => err.response);

    expect(response.status).to.equal(500);
  });

  it('returns followers if everything is fine', async () => {
    sandbox.stub(getAllUsers.prototype, 'getAllUsers').resolves([{ username: 'testuser' }]);

    sandbox.stub(getFollowersFromUser.prototype, 'getFollowersFromUser').resolves(['one', 'two']);

    const response = await request(app)
      .get('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')

    expect(response.body).to.eql({ follows: ["one", "two"] });
  });
});

describe('POST /fllws/:username', () => {

  afterEach(() => {
    sinon.restore();
  });

  it('returns 403 if authorization header is not correct', async () => {
    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'incorrect_token')
      .catch(err => err.response);

    expect(response.status).to.equal(403);
  });

  it('returns 404 if the user is not in the database', async () => {
    sinon.stub(getAllUsers.prototype, 'getAllUsers').resolves([{username: 'foo'}]);

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .catch(err => err.response);

    expect(response.status).to.equal(404);
  });

  it('returns 404 if the follows user is not in the database', async () => {
    sinon.stub(getAllUsers.prototype, 'getAllUsers').resolves([{username: 'testuser'}]);

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        follow: "followuser"
      })
      .catch(err => err.response);

    expect(response.status).to.equal(404);
  });

  it('returns 204 if the user already follows the follows user', async () => {
    sinon.stub(getAllUsers.prototype, 'getAllUsers').resolves([{username: 'testuser'}, {username: 'followuser'}]);
    sinon.stub(getFollowersFromUser.prototype, 'getFollowersFromUser').resolves(['followuser']);

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        follow: "followuser"
      })
      .catch(err => err.response);

    expect(response.status).to.equal(204);
  });

  it('returns 500 if the database fails while following', async () => {
    sinon.stub(getAllUsers.prototype, 'getAllUsers').resolves([{username: 'testuser'}, {username: 'followuser'}]);
    sinon.stub(getFollowersFromUser.prototype, 'getFollowersFromUser').rejects(new Error('Error text'));
    sinon.stub(Follower, 'create').rejects(new Error('Error text'));

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        follow: "followuser"
      });

    expect(response.status).to.equal(500);
  });

  it('returns 204 if all fine while following', async () => {
    sinon.stub(getAllUsers.prototype, 'getAllUsers').resolves([{username: 'testuser'}, {username: 'followuser'}]);
    sinon.stub(getFollowersFromUser.prototype, 'getFollowersFromUser').resolves([]);
    sinon.stub(Follower, 'create').resolves();

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        follow: "followuser"
      });

    expect(response.status).to.equal(204);
  });

  it('returns 404 if unfollows user is not in the DB', async () => {  
    sinon.stub(getAllUsers.prototype, 'getAllUsers').resolves([{username: 'testuser'}, {username: 'followuser'}]);
    sinon.stub(getFollowersFromUser.prototype, 'getFollowersFromUser').resolves([]);

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        unfollow: "unfollowuser"
      })
      .catch(err => err.response);

    expect(response.status).to.be.equal(404);
  });

  it('returns 204 if user does not follow the unfollows user', async () => {
    sinon.stub(getAllUsers.prototype, 'getAllUsers').resolves([{username: 'testuser'}, {username: 'unfollowuser'}]);
    sinon.stub(getFollowersFromUser.prototype, 'getFollowersFromUser').resolves([]);

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        unfollow: "unfollowuser"
      });

    expect(response.status).to.equal(204);
  });

  it('returns 500 if DB fails while unfollowing', async () => {
    sinon.stub(getAllUsers.prototype, 'getAllUsers').resolves([{username: 'testuser'}, {username: 'unfollowuser'}]);
    sinon.stub(getFollowersFromUser.prototype, 'getFollowersFromUser').resolves(['unfollowuser']);
    sinon.stub(Follower, 'destroy').rejects(new Error('Error text'));

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        unfollow: "unfollowuser"
      });

    expect(response.status).to.equal(500);
  });

  it('returns 204 if all ok while unfollowing', async () => {
    sinon.stub(getAllUsers.prototype, 'getAllUsers').resolves([{username: 'testuser'}, {username: 'unfollowuser'}]);
    sinon.stub(getFollowersFromUser.prototype, 'getFollowersFromUser').resolves(['unfollowuser']);
    sinon.stub(Follower, 'destroy').resolves();

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        unfollow: "unfollowuser"
      });

    expect(response.status).to.equal(204);
  });

  it('returns 400 if sth else than follow or unfollow', async () => {
    sinon.stub(getAllUsers.prototype, 'getAllUsers').resolves([{username: 'testuser'}, {username: 'unfollowuser'}]);
    sinon.stub(getFollowersFromUser.prototype, 'getFollowersFromUser').resolves(['unfollowuser']);

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        test: "unfollowuser"
      })
      .catch(err => err.response);

    expect(response.status).to.equal(400);
  });

});
