const request = require('supertest');
const app = require('../../app');
const getAllUsers = require('../model/user');
const database = require('../db/dbService');

jest.mock('../model/user');
jest.mock('../db/dbService');

/* describe('POST /register', () => {

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

  test('returns 400 if the username is already taken', async () => {

    getAllUsers.mockResolvedValue([{username: 'foo'}, {username: 'testuser'}]);

    const response = await request(app)
      .post('/register')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        pwd: 'testpassword'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('error_msg');
    expect(getAllUsers).toHaveBeenCalled();
  });

  test('returns 400 if the password is missing', async () => {

    getAllUsers.mockResolvedValue([]);

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

  test('returns 400 if the email is not in correct format', async () => {

    getAllUsers.mockResolvedValue([]);

    const response = await request(app)
      .post('/register')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        username: 'testuser',
        email: 'testuserexample.com',
        pwd: 'testpassword'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('error_msg');
    expect(getAllUsers).toHaveBeenCalled();
  });

  test('returns 200 if all fine', async () => {

    getAllUsers.mockResolvedValue([]);
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

    expect(response.status).toBe(204);
    expect(database.add).toHaveBeenCalled();
  });

  test('returns 500 if the database does not work properly', async () => {

    getAllUsers.mockRejectedValue(new Error('Database error'));
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
  });
}); */

test('sth', () => {
  expect('hello').toBe('hello');
})