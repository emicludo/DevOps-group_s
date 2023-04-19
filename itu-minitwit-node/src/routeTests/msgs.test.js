const request = require('supertest');
const app = require('../../app');
const getAllUsers = require('../model/user');
const database = require('../db/dbService');

jest.mock('../model/user');
jest.mock('../db/dbService');

describe('GET /msgs', () => {

    test('returns 403 if authorization header is not correct', async () => {
        const response = await request(app)
          .get('/msgs')
          .set('Authorization', 'incorrect_token');
    
        expect(response.status).toBe(403);
      });

});