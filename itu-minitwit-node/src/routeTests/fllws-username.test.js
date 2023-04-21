const request = require('supertest');
const app = require('../../app');
const database = require('../db/dbService');
const getAllUsers = require('../model/user');
const getFollowersFromUser = require('../model/followers.js');

jest.mock('../db/dbService');
jest.mock('../model/user');
jest.mock('../model/followers.js');

describe('GET /fllws/:username', () => {

    test('returns 403 if authorization header is not correct', async () => {
        const response = await request(app)
          .get('/fllws/testuser')
          .set('Authorization', 'incorrect_token');
    
        expect(response.status).toBe(403);
        expect(response.body.error_msg).toBe("You are not authorized to use this resource!");
    });

    test('returns 404 if the user is not in the database', async () => {  
      
      getAllUsers.mockResolvedValue([{username: 'foo'}]);

      const response = await request(app)
        .get('/fllws/testuser')
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
        .get('/fllws/testuser')
        .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      
        expect(response.status).toBe(500);
        expect(response.body.error_msg).toBe("Internal Server Error");
    });

    test('returns followers if everything is fine', async () => {

      getAllUsers.mockResolvedValue([{username: 'testuser'}]);

      database.all = jest.fn((sql, params, callback) => {
        callback(null, [{username: "one"}, {username: "two"}]);
      });

      const response = await request(app)
        .get('/fllws/testuser')
        .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')

        expect(response.body).toEqual({follows: ["one", "two"]});
    });
});

describe('POST /fllws/:username', () => {

  test('returns 403 if authorization header is not correct', async () => {
      const response = await request(app)
        .post('/fllws/testuser')
        .set('Authorization', 'incorrect_token');
  
      expect(response.status).toBe(403);
      expect(response.body.error_msg).toBe("You are not authorized to use this resource!");
  });

  test('returns 404 if the user is not in the database', async () => {  
    
    getAllUsers.mockResolvedValue([{username: 'foo'}]);

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh');

    expect(response.status).toBe(404);
    expect(response.body.error_msg).toBe("User is not on our database");
  });

  test('returns 404 if the follows user is not in the database', async () => {  
    
    getAllUsers.mockResolvedValue([{username: 'testuser'}]);

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        follow: "followuser"
      });

    expect(response.status).toBe(404);
    expect(response.body.error_msg).toBe("Follows user is not on our database");
  });

  test('returns 403 if the user already follows the follows user', async () => {  
    
    getAllUsers.mockResolvedValue([{username: 'testuser'}, {username: 'followuser'}]);
    getFollowersFromUser.mockResolvedValue((['followuser']));

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        follow: "followuser"
      });

    expect(response.status).toBe(403);
    expect(response.body.error_msg).toBe("User already follows this user");
  });

  test('returns 500 if the database fails while following', async () => {  
    
    getAllUsers.mockResolvedValue([{username: 'testuser'}, {username: 'followuser'}]);
    getFollowersFromUser.mockResolvedValue([]);

    database.run = jest.fn((sql, params, callback) => {
      callback('Error', null);
    });

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        follow: "followuser"
      });

    expect(response.status).toBe(500);
  });

  test('returns 204 if all fine while following', async () => {  
    
    getAllUsers.mockResolvedValue([{username: 'testuser'}, {username: 'followuser'}]);
    getFollowersFromUser.mockResolvedValue([]);

    database.run = jest.fn((sql, params, callback) => {
      callback(null, 'Success');
    });

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        follow: "followuser"
      });

    expect(response.status).toBe(204);
  });

  test('returns 404 if unfollows user is not in the DB', async () => {  
    
    getAllUsers.mockResolvedValue([{username: 'testuser'}, {username: 'followuser'}]);
    getFollowersFromUser.mockResolvedValue([]);

    database.run = jest.fn((sql, params, callback) => {
      callback(null, 'Success');
    });

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        unfollow: "unfollowuser"
      });

    expect(response.status).toBe(404);
    expect(response.body.error_msg).toBe("Unfollows user is not on our database");
  });

  test('returns 404 if user does not follow the unfollows user', async () => {  
    
    getAllUsers.mockResolvedValue([{username: 'testuser'}, {username: 'unfollowuser'}]);
    getFollowersFromUser.mockResolvedValue([]);

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        unfollow: "unfollowuser"
      });

    expect(response.status).toBe(404);
  });

  test('returns 500 if DB fails while unfollowing', async () => {  
    
    getAllUsers.mockResolvedValue([{username: 'testuser'}, {username: 'unfollowuser'}]);
    getFollowersFromUser.mockResolvedValue(['unfollowuser']);

    database.run = jest.fn((sql, params, callback) => {
      callback('Error', null);
    });

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        unfollow: "unfollowuser"
      });

    expect(response.status).toBe(500);
  });

  test.only('returns 204 if all ok while unfollowing', async () => {  
    
    getAllUsers.mockResolvedValue([{username: 'testuser'}, {username: 'unfollowuser'}]);
    getFollowersFromUser.mockResolvedValue(['unfollowuser']);

    database.run = jest.fn((sql, params, callback) => {
      callback(null, 'Success');
    });

    const response = await request(app)
      .post('/fllws/testuser')
      .set('Authorization', 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')
      .send({
        unfollow: "unfollowuser"
      });

    expect(response.status).toBe(500);
  });
  
});