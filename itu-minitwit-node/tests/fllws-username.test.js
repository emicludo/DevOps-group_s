const request = require('supertest');
const app = require('../app');
const database = require('../src/db/dbService');
const getAllUsers = require('../src/model/user');
const getFollowersFromUser = require('../src/model/followers.js');

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
      .set('Authorization', 'incorrect_token');

    expect(response.status).to.equal(403);
    expect(response.body.error_msg).to.equal("You are not authorized to use this resource!");
  });

  it('returns 404 if the user is not in the database', async () => {
    const getAllUsersStub = sandbox.stub(getAllUsers.prototype, 'getAllUsers').resolves([{ username: 'foo' }]);    
    const response = await request(app)
      .get('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh');

    expect(response.status).to.equal(404);
    expect(response.body.error_msg).to.equal("User is not on our database");
  });

  it('returns 500 if the database does not work properly', async () => {
    sandbox.stub(getAllUsers.prototype, 'getAllUsers').resolves([{ username: 'testuser' }]);

    sandbox.stub(database, 'all').callsFake((sql, params, callback) => {
      callback('Error', null);
    });

    const response = await request(app)
      .get('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')

    expect(response.status).to.equal(500);
    expect(response.body.error_msg).to.equal("Internal Server Error");
  });

  it('returns followers if everything is fine', async () => {
    sandbox.stub(getAllUsers.prototype, 'getAllUsers').resolves([{ username: 'testuser' }]);

    sandbox.stub(database, 'all').callsFake((sql, params, callback) => {
      callback(null, [{ username: "one" }, { username: "two" }]);
    });

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
      .set('Authorization', 'incorrect_token');

    expect(response.status).to.equal(403);
    expect(response.body.error_msg).to.equal("You are not authorized to use this resource!");
  });

  it('returns 404 if the user is not in the database', async () => {
    sinon.stub(getAllUsers.prototype, 'getAllUsers').resolves([{username: 'foo'}]);

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh');

    expect(response.status).to.equal(404);
    expect(response.body.error_msg).to.equal("User is not on our database");
  });

  it('returns 404 if the follows user is not in the database', async () => {
    sinon.stub(getAllUsers.prototype, 'getAllUsers').resolves([{username: 'testuser'}]);

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        follow: "followuser"
      });

    expect(response.status).to.equal(404);
    expect(response.body.error_msg).to.equal("Follows user is not on our database");
  });

  it('returns 403 if the user already follows the follows user', async () => {
    sinon.stub(getAllUsers.prototype, 'getAllUsers').resolves([{username: 'testuser'}, {username: 'followuser'}]);
    sinon.stub(getFollowersFromUser.prototype, 'getFollowersFromUser').resolves(['followuser']);

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        follow: "followuser"
      });

    expect(response.status).to.equal(403);
    expect(response.body.error_msg).to.equal("User already follows this user");
  });

  it('returns 500 if the database fails while following', async () => {
    sinon.stub(getAllUsers.prototype, 'getAllUsers').resolves([{username: 'testuser'}, {username: 'followuser'}]);
    sinon.stub(getFollowersFromUser.prototype, 'getFollowersFromUser').resolves([]);
    sinon.stub(database, 'run').callsArgWith(2, 'Error', null);

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

    sinon.stub(database, 'run').callsFake((sql, params, callback) => {
      callback(null, 'Success');
    });

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
    sinon.stub(database, 'run').callsFake((sql, params, callback) => {
      callback(null, 'Success');
    });

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        unfollow: "unfollowuser"
      });
    expect(response.status).to.be.equal(404);
    expect(response.body.error_msg).to.be.equal("Unfollows user is not on our database");
  });

  it('returns 404 if user does not follow the unfollows user', async () => {
    sinon.stub(getAllUsers.prototype, 'getAllUsers').resolves([{username: 'testuser'}, {username: 'unfollowuser'}]);
    sinon.stub(getFollowersFromUser.prototype, 'getFollowersFromUser').resolves([]);

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        unfollow: "unfollowuser"
      });

    expect(response.status).to.equal(404);
  });

  it('returns 500 if DB fails while unfollowing', async () => {
    sinon.stub(getAllUsers.prototype, 'getAllUsers').resolves([{username: 'testuser'}, {username: 'unfollowuser'}]);
    sinon.stub(getFollowersFromUser.prototype, 'getFollowersFromUser').resolves(['unfollowuser']);

    sinon.stub(database, 'run').callsFake((sql, params, callback) => {
      callback('Error', null);
    });

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

    sinon.stub(database, 'run').callsFake((sql, params, callback) => {
      callback(null, 'Success');
    });

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

    sinon.stub(database, 'run').callsFake((sql, params, callback) => {
      callback(null, 'Success');
    });

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        test: "unfollowuser"
      });

    expect(response.status).to.equal(400);
    expect(response.body.error_msg).to.equal('Invalid request body');
  });

});
