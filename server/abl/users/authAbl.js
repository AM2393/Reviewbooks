const bcrypt = require("bcryptjs");
const auth = require("../../middleware/authMiddleware.js");
const userDao = require("../../dao/users-dao.js");

const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    if (isMatch) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

const AuthCheckAbl = async (req, res) => {
  const decodedVerifiedToken = auth.getValidToken(req.cookies.jwt);

  if (!decodedVerifiedToken) {
    res.status(200).json({ user: null });
    return;
  }

  const user = await userDao.get(decodedVerifiedToken);

  if (user) {
    res.status(200).json({ user });
  } else {
    res.status(200).json({ user: null });
  }
};

const LoginAbl = async (req, res) => {
  const { email, password, remember } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const user = await userDao.getByEmail(email);

  if (!user) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  if (!(await verifyPassword(password, user.password))) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const token = auth.createToken(user.id, remember);
  res.cookie(auth.JWT_COOKIE_NAME, token, {
    maxAge: remember
      ? auth.JWT_EXPIRATION_MILLISECONDS * 30
      : auth.JWT_EXPIRATION_MILLISECONDS,
    httpOnly: true,
  });

  delete user.password;

  res.status(200).json(user);
};

const LogoutAbl = (req, res) => {
  res.clearCookie(auth.JWT_COOKIE_NAME);
  res.status(200).json({ message: "Logout successful" });
};

module.exports = { AuthCheckAbl, LoginAbl, LogoutAbl };
