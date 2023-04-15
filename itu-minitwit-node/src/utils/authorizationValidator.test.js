const isSimulator = require('./authorizationValidator')

test('recognizesSimulator', () => {
    expect(isSimulator('Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh')).toBe(true);
})

test('doesNotRecognizeSimulator', () => {
    expect(isSimulator('BUh')).toBe(false);
})