const jwt = require("jsonwebtoken");

const JWT_SECRET = "amazing secret key";
const JWT_EXPIRATION_SECONDS = 60 * 60 * 24; // 1 day
const JWT_EXPIRATION_MILLISECONDS = JWT_EXPIRATION_SECONDS * 1000;
const JWT_COOKIE_NAME = "jwt";

/**
 * Creates a JWT token with the given user ID
 * If remember is true, the token will expire in 30 days, otherwise it will expire in 1 day
 */
const createToken = (id, remember) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: remember ? JWT_EXPIRATION_SECONDS * 30 : JWT_EXPIRATION_SECONDS,
  });
};

/**
 * Gets a valid token from the given token string or returns null if the token is invalid
 */
const getValidToken = (token) => {
  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    return decodedToken.id;
  } catch (err) {
    return null;
  }
};

module.exports = {
  createToken,
  getValidToken,
  JWT_SECRET,
  JWT_EXPIRATION_SECONDS,
  JWT_EXPIRATION_MILLISECONDS,
  JWT_COOKIE_NAME,
};
