const request = require('supertest');
const app = require('../../app');
const getAllUsers = require('../model/user');

jest.mock('../model/user');

describe('POST /register', () => {

  test('returns 403 if authorization header is not correct', async () => {
    const response = await request(app)
      .post('/register')
      .set('Authorization', 'incorrect_token')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        pwd: 'testpassword'
      });

    expect(response.status).toBe(403);
  });

  test.only('returns 400 if the username is already taken', async () => {

    getAllUsers.mockResolvedValue(['foo', 'testuser']);

    const response = await request(app)
      .post('/register')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        pwd: null
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('error_msg');
    expect(getAllUsers).toHaveBeenCalled();
  });
});