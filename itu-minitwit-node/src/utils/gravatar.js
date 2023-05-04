const crypto = require('crypto');

const gravatar = function gravatarUrl(email, size = 80) {
    const hash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
    return `http://www.gravatar.com/avatar/${hash}?d=identicon&s=${size}`;
}

module.exports = gravatar;