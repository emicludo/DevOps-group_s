const request = require('supertest');
const app = require('../../app');

describe('POST /register', () => {
  it('returns 403 if authorization header is not correct', async () => {
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
});