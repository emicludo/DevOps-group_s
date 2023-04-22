const LatestService = require('./LatestService');
jest.useFakeTimers();

const latestService = new LatestService();

test('initializedCorrectly', () => {
    expect(latestService.getLatest()).toBe(0);
})

test('updatesStateWithValidValue', () => {
    latestService.updateLatest(4);
    expect(latestService.getLatest()).toBe(4);
})

test('updatesStateWithNoValue', () => {
    latestService.updateLatest();
    expect(latestService.getLatest()).toBe();
})