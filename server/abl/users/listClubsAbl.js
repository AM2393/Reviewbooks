const AJV = require("ajv");
const ajv = new AJV();

const schema = {
  type: "object",
  properties: {
    userId: { type: "number" },
  },
  required: ["userId"],
  additionalProperties: false,
};

const clubDao = require("../../dao/clubs-dao");

async function ListClubsAbl(req, res) {
  try {
    const params = {
      userId: Number(req.params.userId),
    };
    const valid = ajv.validate(schema, params);
    if (!valid) {
      res.status(400).json({
        status: 400,
        message: "Invalid request",
        validationError: ajv.errors,
      });
      return;
    }

    const { userId } = params;

    const clubs = await clubDao.listUserClubs(userId);
    if (!clubs || clubs.length === 0) {
      res.status(404).json({
        status: 404,
        type: "error",
        message: "No clubs found",
      });
      return;
    }

    res.status(200).json(clubs);
  } catch (e) {
    res.status(500).json({
      status: 500,
      type: "error",
      message: e.message,
    });
  }
}

module.exports = ListClubsAbl;
