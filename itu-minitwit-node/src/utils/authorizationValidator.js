const isSimulator = (header) => {
  return header === 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh';
}

module.exports = isSimulator;