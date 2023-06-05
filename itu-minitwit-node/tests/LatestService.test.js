const assert = require('assert');
const sinon = require('sinon');
const LatestService = require('../src/services/LatestService');

const sandbox = sinon.createSandbox();

describe('LatestService', () => {
  const latestService = new LatestService();
  afterEach(() => {
    sandbox.restore();
  });

  it('initializedCorrectly', async () => {
    sandbox.stub(LatestService.prototype, 'getLatest').resolves(0);
    const result = await latestService.getLatest();
    assert.strictEqual(result, 0);
  });
});