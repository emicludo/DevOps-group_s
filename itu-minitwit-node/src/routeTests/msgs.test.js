const request = require('supertest');
const app = require('../../app');
const database = require('../db/dbService');

jest.mock('../db/dbService');

describe('GET /msgs', () => {

    test('returns 403 if authorization header is not correct', async () => {
        const response = await request(app)
          .get('/msgs')
          .set('Authorization', 'incorrect_token');
    
        expect(response.status).toBe(403);
      });

    /* // TO DO
      test('returns 500 if the database does not work properly', async () => {
      
      database.add = jest.fn((table, data, callback) => {
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

      expect(response.status).toBe(500);
    }); */

});