const request = require('supertest');
const app = require('../app');
const database = require('../src/db/dbService');
const getAllUsers = require('../src/model/user');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;

const sandbox = sinon.createSandbox();

describe('POST /register', () => {  
    afterEach(() => {
      sandbox.restore();
    });

    it('returns 403 if authorization header is not correct', async () => {
        const response = await request(app)
        .post('/register')
        .set('Authorization', 'incorrect_token')
        .send({
          username: 'testuser',
          email: 'testuser@example.com',
          pwd: 'testpassword'
        });
    
        expect(response.status).to.equal(403);
    });

    it('returns 400 if the username is already taken', async () => {
        sandbox.stub(getAllUsers.prototype, 'getAllUsers').resolves([{username: 'foo'}, {username: 'testuser'}]);
      
        const response = await request(app)
          .post('/register')
          .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
          .send({
            username: 'testuser',
            email: 'testuser@example.com',
            pwd: 'testpassword'
          });
      
        expect(response.status).to.equal(400);
        expect(getAllUsers.prototype.getAllUsers.called).to.be.true;
      });

      it('returns 400 if the password is missing', async () => {
        sandbox.stub(getAllUsers.prototype, 'getAllUsers').resolves([]);
      
        const response = await request(app)
          .post('/register')
          .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
          .send({
            username: 'testuser',
            email: 'testuser@example.com',
            pwd: null
          });
      
        expect(response.status).to.equal(400);
        expect(getAllUsers.prototype.getAllUsers.called).to.be.true;
      });

      it('returns 400 if the email is not in correct format', async () => {
        sandbox.stub(getAllUsers.prototype, 'getAllUsers').resolves([]);
      
        const response = await request(app)
          .post('/register')
          .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
          .send({
            username: 'testuser',
            email: 'testuserexample.com',
            pwd: 'testpassword'
          });
      
        expect(response.status).to.equal(400);
        expect(getAllUsers.prototype.getAllUsers.called).to.be.true;
      });

      it('returns 200 if all fine', async () => {
        sandbox.stub(getAllUsers.prototype, 'getAllUsers').resolves([]);
        sandbox.stub(database, 'add').callsFake((table, data, callback) => {
            callback(null, 'Success');
        });
      
        const response = await request(app)
          .post('/register')
          .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
          .send({
            username: 'testuser',
            email: 'testuser@example.com',
            pwd: 'testpassword'
          });
      
        expect(response.status).to.equal(204);
        expect(database.add.called).to.be.true;
      });

      it('returns 500 if the database does not work properly', async () => {
        sandbox.stub(getAllUsers.prototype, 'getAllUsers').rejects(new Error('Database error'));
        sandbox.stub(database, 'add').callsFake((table, data, callback) => {
            callback('Success', null);
        });
    
        const response = await request(app)
            .post('/register')
            .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                pwd: 'testpassword'
            });
    
        expect(response.status).to.equal(500);
    });

});