const assert = require('assert');
const LatestService = require('../src/services/LatestService');

describe('LatestService', () => {
  const latestService = new LatestService();

  it('initializedCorrectly', () => {
    assert.strictEqual(latestService.getLatest(), 0);
  });

  it('updatesStateWithValidValue', () => {
    latestService.updateLatest(4);
    assert.strictEqual(latestService.getLatest(), 4);
  });

  it('updatesStateWithNoValue', () => {
    latestService.updateLatest();
    assert.strictEqual(latestService.getLatest(), undefined);
  });
});