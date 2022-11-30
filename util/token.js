require('dotenv').config();
const jwt = require('jsonwebtoken');

//Will be used later
function createToken(payload, time) {
  const config = {
    expiresIn: time,
    algorithm: 'HS256',
  };

  return jwt.sign(payload, process.env.JWT_SECRET, config);
}

module.exports = createToken;