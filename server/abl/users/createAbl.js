const AJV = require("ajv");
const ajv = new AJV({ coerceTypes: true, removeAdditional: true });
const auth = require("../../middleware/authMiddleware.js");

const schema = {
  type: "object",
  properties: {
    first_name: { type: "string" },
    last_name: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
  },
  required: ["first_name", "last_name", "email", "password"],
  additionalProperties: false,
};

const userDao = require("../../dao/users-dao.js");

async function CreateAbl(req, res) {
  try {
    const valid = ajv.validate(schema, req.body);
    if (!valid) {
      res.status(400).json({
        status: 400,
        type: "error",
        message: "Invalid request",
        validationError: ajv.errors,
      });
      return;
    }

    const usersList = await userDao.listAll();
    const emailExists = Array.prototype.some.call(
      usersList,
      (u) => u.email === req.body.email
    );
    if (emailExists) {
      res.status(409).json({
        status: 409,
        type: "error",
        message: "User with this email already exists.",
      });
      return;
    }

    const result = await userDao.create(req.body);
    const token = auth.createToken(result.id);
    res.cookie(auth.JWT_COOKIE_NAME, token, {
      maxAge: auth.JWT_EXPIRATION_MILLISECONDS,
      httpOnly: true,
    });
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({
      status: 500,
      type: "error",
      message: e.message,
    });
  }
}

module.exports = CreateAbl;
