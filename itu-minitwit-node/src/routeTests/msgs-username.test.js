const request = require('supertest');
const app = require('../../app');
const database = require('../db/dbService');
const getAllUsers = require('../model/user');

jest.mock('../db/dbService');
jest.mock('../model/user');

describe('GET /msgs/:username', () => {

    test('returns 403 if authorization header is not correct', async () => {
        const response = await request(app)
          .get('/msgs/testuser')
          .set('Authorization', 'incorrect_token');
    
        expect(response.status).toBe(403);
        expect(response.body.error_msg).toBe("You are not authorized to use this resource!");
    });

    test('returns 404 if the user is not in the database', async () => {  
      
      getAllUsers.mockResolvedValue([{username: 'foo'}]);

      const response = await request(app)
        .get('/msgs/testuser')
        .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh');

      expect(response.status).toBe(404);
      expect(response.body.error_msg).toBe("User is not on our database");
    });

    test('returns 500 if the database does not work properly', async () => {  
      
      getAllUsers.mockResolvedValue([{username: 'testuser'}]);

      database.all = jest.fn((sql, params, callback) => {
        callback('Error', null);
      });

      const response = await request(app)
        .get('/msgs/testuser')
        .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      
        expect(response.status).toBe(500);
    });

    test('returns 200 and messages if everything is fine', async () => {

      getAllUsers.mockResolvedValue([{username: 'testuser'}]);

      database.all = jest.fn((sql, params, callback) => {
        callback(null, [{text: 'hello world', pubDate: '20-4-2020', username: 'testuser'}]);
      });
      const response = await request(app)
        .get('/msgs/testuser')
        .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
        expect(response.body).toEqual([{content: 'hello world', pubDate: '20-4-2020', user: 'testuser'}]);
        expect(response.status).toEqual(200);
    });

    test('returns 204 if everything is fine, but there are no messages', async () => {

      getAllUsers.mockResolvedValue([{username: 'testuser'}]);

      database.all = jest.fn((sql, params, callback) => {
        callback(null, []);
      });
      const response = await request(app)
        .get('/msgs/testuser')
        .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
        expect(response.body).toEqual({});
        expect(response.status).toEqual(204);
    });

});

describe('POST /msgs/:username', () => {

  test('returns 403 if authorization header is not correct', async () => {
      const response = await request(app)
        .post('/msgs/testuser')
        .set('Authorization', 'incorrect_token')
        .send({
          content: 'testcontent'
        });
  
      expect(response.status).toBe(403);
      expect(response.body.error_msg).toBe("You are not authorized to use this resource!");
  });

  test('returns 404 if the user is not in the database', async () => {  
    
    getAllUsers.mockResolvedValue([{username: 'foo'}]);

    const response = await request(app)
      .post('/msgs/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        content: 'testcontent'
      });

    expect(response.status).toBe(404);
    expect(response.body.error_msg).toBe("User is not on our database");
  });

  test('returns 500 if the database does not work properly', async () => {  
    
    getAllUsers.mockResolvedValue([{username: 'testuser'}]);

    database.add = jest.fn((table, data, callback) => {
      callback('Error', null);
    });

    const response = await request(app)
    .post('/msgs/testuser')
    .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
    .send({
      content: 'testcontent'
    });
    
    expect(response.status).toBe(500);
  });

  test('returns 204 if everything is fine', async () => {

    getAllUsers.mockResolvedValue([{username: 'testuser'}]);

    database.add = jest.fn((table, data, callback) => {
      callback(null, "Success");
    });
    
    const response = await request(app)
    .post('/msgs/testuser')
    .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
    .send({
      content: 'testcontent'
    });

      expect(response.body).toEqual({});
      expect(response.status).toEqual(204);
  });

});