const AJV = require("ajv");
const ajv = new AJV({ coerceTypes: true });

const schema = {
  type: "object",
  properties: {
    userId: { type: "number" },
    clubId: { type: "number" },
  },
  required: ["userId", "clubId"],
  additionalProperties: false,
};

const clubDao = require("../../dao/clubs-dao.js");

async function MemberAddAbl(req, res) {
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

    const { userId, clubId } = req.body;

    try {
      await clubDao.addMemberToClub(userId, clubId);
    } catch (e) {
      res.status(400).json({
        status: 400,
        type: "error",
        message: e.message,
      });
      return;
    }

    res.status(200).json({ userId, clubId });
  } catch (e) {
    res.status(500).json({
      status: 500,
      type: "error",
      message: e.message,
    });
  }
}

module.exports = MemberAddAbl;
