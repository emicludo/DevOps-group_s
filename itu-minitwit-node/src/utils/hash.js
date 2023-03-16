const crypto = require('crypto')

const hash = (password) => {
  const hash = crypto.createHash('sha256')
  // Add the string to be hashed
  hash.update(password)
  // Generate the hash digest as a hexadecimal string
  const hashDigest = hash.digest('hex')
  return hashDigest
}

module.exports = hash
