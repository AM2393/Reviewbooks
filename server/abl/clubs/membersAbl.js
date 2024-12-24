const AJV = require("ajv");
const ajv = new AJV({ coerceTypes: true });

const schema = {
  type: "object",
  properties: {
    id: { type: "number" },
  },
  required: ["id"],
  additionalProperties: false,
};

const clubDao = require("../../dao/clubs-dao.js");

async function MembersAbl(req, res) {
  try {
    const valid = ajv.validate(schema, req.params);
    if (!valid) {
      res.status(400).json({
        status: 400,
        type: "error",
        message: "Invalid request",
        validationError: ajv.errors,
      });
      return;
    }

    const { id } = req.params;

    try {
      const members = await clubDao.listMembers(id);
      res.status(200).json(members);
    } catch (e) {
      res.status(400).json({
        status: 400,
        type: "error",
        message: e.message,
      });
    }
  } catch (e) {
    res.status(500).json({
      status: 500,
      type: "error",
      message: e.message,
    });
  }
}

module.exports = MembersAbl;
