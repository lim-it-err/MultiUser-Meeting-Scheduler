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

function verify(token) { // access token 검증
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      ok: true,
      uid: decoded.uid,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message,
    };
  }
}

module.exports = {createToken, verify};