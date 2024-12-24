const AJV = require("ajv");
const ajv = new AJV({ coerceTypes: true, removeAdditional: true });

const schema = {
  type: "object",
  properties: {
    description: { type: "string" },
    book_id: { type: "integer" },
    club_id: { type: "integer" },
    start_date: { type: "string" },
    end_date: { type: "string" },

  },
  required: [
    "description",
    "book_id",
    "club_id",
    "start_date",
    "end_date",
  ],
  additionalProperties: false,
};

const eventDao = require("../../dao/events-dao.js");

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

    res.status(201).json(
      await eventDao.create(req.body),
    );
  } catch (e) {
    res.status(500).json({
      status: 500,
      type: "error",
      message: e.message,
    });
  }
}

module.exports = CreateAbl;
