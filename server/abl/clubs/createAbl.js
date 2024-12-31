const AJV = require("ajv");
const ajv = new AJV({ coerceTypes: true, removeAdditional: true });

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    user_id: { type: "integer" },
  },
  required: ["name", "description", "user_id"],
  additionalProperties: false,
};

const clubDao = require("../../dao/clubs-dao.js");

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

    // TODO: check if user_id is valid user id?
    // TODO: how to handle duplicates?

    res.status(201).json(await clubDao.create(req.body));
  } catch (e) {
    res.status(500).json({
      status: 500,
      type: "error",
      message: e.message,
    });
  }
}

module.exports = CreateAbl;
