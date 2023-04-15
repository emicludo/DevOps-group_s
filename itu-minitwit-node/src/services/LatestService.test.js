const LatestService = require('./LatestService');

const latestService = new LatestService();

test('initializedCorrectly', () => {
    expect(latestService.getLatest()).toBe(0);
})

test('updatesState', () => {
    latestService.updateLatest(4);
    expect(latestService.getLatest()).toBe(4);
})