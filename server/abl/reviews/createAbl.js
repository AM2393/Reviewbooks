const AJV = require("ajv");
const ajv = new AJV({ coerceTypes: true, removeAdditional: true });

const schema = {
  type: "object",
  properties: {
    userId: { type: "integer" },
    bookId: { type: "integer" },
    eventId: { type: "integer" },
    text: { type: "string" }
  },
  required: ["userId", "bookId", "eventId", "text"],
  additionalProperties: false
};

const reviewDao = require("../../dao/reviews-dao.js");

async function CreateAbl(req, res) {
  try {
    const valid = ajv.validate(schema, req.body);
    if (!valid) {
      res.status(400).json({
        status: 400,
        type: "error",
        message: "Invalid request",
        validationError: ajv.errors
      });
      return;
    }

    const newReview = await reviewDao.create(req.body);
    res.status(201).json(newReview);
  } catch (e) {
    res.status(500).json({
      status: 500,
      type: "error",
      message: e.message
    });
  }
}

module.exports = CreateAbl;

