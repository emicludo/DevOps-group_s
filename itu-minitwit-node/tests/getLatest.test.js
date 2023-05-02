const request = require('supertest');
const app = require('../app');
const LatestService = require('../src/services/LatestService');
const sinon = require('sinon');
const { expect } = require('chai');

describe('GET /latest', () => {

  // successful response
  it('responds with 200 and the latest value', async () => {
    // Mock the latestService.getLatest function
    const getLatestStub = sinon.stub(LatestService.prototype, 'getLatest').returns(42);

    // Make a GET request to the endpoint
    const response = await request(app).get('/latest');

    // Check that the response has a 200 status code
    expect(response.status).to.equal(200);

    // Check that the response body contains the latest value
    expect(response.body).to.deep.equal({ latest: 42 });

    // Restore the stub
    getLatestStub.restore();
  });
});