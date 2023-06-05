const request = require('supertest');
const app = require('../app');
const database = require('../src/db/dbService');
const getAllUsers = require('../src/model/users');
const Message = require('../src/model/Message.js');

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;

const sandbox = sinon.createSandbox();

describe('GET /msgs/:username', () => {

    afterEach(() => {
        sandbox.restore();
      });
    
      it('returns 403 if authorization header is not correct', async () => {
        const response = await request(app)
          .get('/msgs/testuser')
          .set('Authorization', 'incorrect_token')
          .catch(err => err.response);
    
        expect(response.status).to.equal(403);
      });
    
      it('returns 404 if the user is not in the database', async () => {
        sandbox.stub(getAllUsers.prototype, 'getAllUsers').resolves([{ username: 'foo' }]);
    
        const response = await request(app)
          .get('/msgs/testuser')
          .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
          .catch(err => err.response);
    
        expect(response.status).to.equal(404);
      });
    
      it('returns 500 if the database does not work properly', async () => {
        const getAllUsersStub = sandbox.stub(getAllUsers.prototype, 'getAllUsers').resolves([{ username: 'testuser' }]);
        sandbox.stub(Message, 'findAll').rejects(new Error('Error text'));

    
        const response = await request(app)
          .get('/msgs/testuser')
          .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
    
        expect(response.status).to.equal(500);
      });
    
      it('returns 200 and messages if everything is fine', async () => {
        const getAllUsersStub = sandbox.stub(getAllUsers.prototype, 'getAllUsers').resolves([{ username: 'testuser' }]);
        sandbox.stub(Message, 'findAll').resolves([{text: 'hello world', pub_date: '20-4-2020', user: {username: 'testuser'}}]);
    
        const response = await request(app)
          .get('/msgs/testuser')
          .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
    
        expect(response.body).to.deep.equal([{content: 'hello world', pubDate: '20-4-2020', user: 'testuser'}]);
        expect(response.status).to.equal(200);
      });
    
      it('returns 204 if everything is fine, but there are no messages', async () => {
        const getAllUsersStub = sandbox.stub(getAllUsers.prototype, 'getAllUsers').resolves([{ username: 'testuser' }]);
        sandbox.stub(Message, 'findAll').resolves([]);

        const response = await request(app)
          .get('/msgs/testuser')
          .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
    
        expect(response.body).to.deep.equal({});
        expect(response.status).to.equal(204);
      });

})

describe('POST /msgs/:username', () => {

    afterEach(() => {
        sandbox.restore();
      });
    
    it('returns 403 if authorization header is not correct', async () => {
      const response = await request(app)
        .post('/msgs/testuser')
        .set('Authorization', 'incorrect_token')
        .send({
            content: 'testcontent'
          })
        .catch(err => err.response);

      expect(response.status).to.equal(403);
    });

    it('returns 404 if the user is not in the database', async () => {
        sandbox.stub(getAllUsers.prototype, 'getAllUsers').resolves([{ username: 'foo' }]);
        
        const response = await request(app)
          .post('/msgs/testuser')
          .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
          .send({
              content: 'testcontent'
            })
            .catch(err => err.response);
  
        expect(response.status).to.equal(404);
      });

      it('returns 500 if the database does not work properly', async () => {
        sandbox.stub(getAllUsers.prototype, 'getAllUsers').resolves([{ username: 'testuser' }]);
    
        sandbox.stub(Message, 'create').rejects(new Error('Error text'));
    
          const response = await request(app)
          .post('/msgs/testuser')
          .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
          .send({
              content: 'testcontent'
            });
    
        expect(response.status).to.equal(500);
      });

      it('returns 204 if everything is fine', async () => {
        sandbox.stub(getAllUsers.prototype, 'getAllUsers').resolves([{ username: 'testuser' }]);
    
        sandbox.stub(Message, 'create').resolves({});
    
          const response = await request(app)
          .post('/msgs/testuser')
          .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
          .send({
              content: 'testcontent'
            });
    
        expect(response.status).to.equal(204);
      });
});