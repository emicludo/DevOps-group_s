const request = require('supertest');
const app = require('../../app');
const database = require('../db/dbService');
jest.useFakeTimers();

jest.mock('../db/dbService');

describe('GET /msgs', () => {

    test('returns 403 if authorization header is not correct', async () => {
        const response = await request(app)
          .get('/msgs')
          .set('Authorization', 'incorrect_token');
    
        expect(response.status).toBe(403);
    });

    test('returns 500 if the database does not work properly', async () => {  
      database.all = jest.fn((sql, params, callback) => {
        callback('Error', null);
      });
      const response = await request(app)
        .get('/msgs')
        .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      expect(response.status).toBe(500);
    });

    test('returns messages if everything is fine', async () => {  
      database.all = jest.fn((sql, params, callback) => {
        callback(null, [{text: 'hello world', pubDate: '20-4-2020', username: 'testuser'}]);
      });
      const response = await request(app)
        .get('/msgs')
        .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
        expect(response.body).toEqual([{content: 'hello world', pubDate: '20-4-2020', user: 'testuser'}]);
    });

});