const request = require('supertest');
const app = require('../../app');
const LatestService = require('../services/LatestService');

describe('GET /latest', () => {
  // Create a test case for a successful response
  it('responds with 200 and the latest value', async () => {
    // Mock the latestService.getLatest function
    LatestService.prototype.getLatest = jest.fn().mockReturnValue(42);

    // Make a GET request to the endpoint
    const response = await request(app).get('/latest');

    // Check that the response has a 200 status code
    expect(response.status).toBe(200);

    // Check that the response body contains the latest value
    expect(response.body).toEqual({ latest: 42 });
  });


  /* // Create a test case for an error response
  it('responds with 500 if there is an error', async () => {
    // Mock the latestService.getLatest function to throw an error
    latestService.getLatest = jest.fn().mockImplementation(() => {
      throw new Error('Test error');
    });

    // Make a GET request to the endpoint
    const response = await request(app).get('/latest');

    // Check that the response has a 500 status code
    expect(response.status).toBe(500);

    // Check that the response body contains the error message
    expect(response.body).toEqual({ error: 'Test error' });
  }); */
});