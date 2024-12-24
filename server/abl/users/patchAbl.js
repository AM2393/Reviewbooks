const AJV = require("ajv");
const ajv = new AJV({ coerceTypes: true, removeAdditional: true });

const schema = {
  type: "object",
  properties: {
    id: { type: "number" },
  },
  required: [
    "id",
  ],
  additionalProperties: false,
  // first_name: { type: "string" },
  // last_name: { type: "string" },
  // email: { type: "string" },
  // password: { type: "string" },
};

const userDao = require("../../dao/users-dao.js");

async function PatchAbl(req, res) {
  try {
    const valid = ajv.validate(schema, req.params, req.body);
    if (!valid) {
      res.status(400).json({
        status: 400,
        type: "error",
        message: "Invalid request",
        validationError: ajv.errors,
      });
      return;
    }

    const user = await userDao.getAll(req.params.id);
    if (!user || user.length === 0) {
      res.status(404).json({
        status: 404,
        type: "error",
        message: "No user found",
      });
      return;
    }

    console.debug(user, req.body);
    res.status(200).json(
      await userDao.patch(user, req.body),
    );
  } catch (e) {
    res.status(500).json({
      status: 500,
      type: "error",
      message: e.message,
    });
  }
}

module.exports = PatchAbl;
