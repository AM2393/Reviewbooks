const AJV = require("ajv");
const ajv = new AJV({ coerceTypes: true, removeAdditional: true });

const schema = {
  type: "object",
  properties: {
    full_name: { type: "string" },
  },
  required: ["full_name"],
  additionalProperties: false,
};

const authorDao = require("../../dao/authors-dao.js");

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

    res.status(201).json(await authorDao.create(req.body));
  } catch (e) {
    res.status(500).json({
      status: 500,
      type: "error",
      message: e.message,
    });
  }
}

module.exports = CreateAbl;
