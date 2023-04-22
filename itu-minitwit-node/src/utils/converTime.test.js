const convert = require('./convertTime');
jest.useFakeTimers();

describe('convert', () => {
  test('converting an epoch time to a correct format', () => {
    // Set up test data
    const epochTime = 1618886400000; // April 20, 2021 04:40:00 UTC

    // Call the function and assert the output
    expect(convert(epochTime)).toEqual('2021-4-20 @ 4:40');
  });

  test('single-digit minutes', () => {
    // Set up test data
    const epochTime = 1642446000000; // January 17, 2022 08:00:00 UTC

    // Call the function and assert the output
    expect(convert(epochTime)).toEqual('2022-1-17 @ 20:0');
  });

  test('double-digit minutes', () => {
    // Set up test data
    const epochTime = 1674085200000; // January 19, 2023 12:40:00 UTC

    // Call the function and assert the output
    expect(convert(epochTime)).toEqual('2023-1-19 @ 0:40');
  });
});