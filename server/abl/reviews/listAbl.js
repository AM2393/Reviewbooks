const AJV = require("ajv");
const ajv = new AJV({ coerceTypes: true });

const schema = {
  type: "object",
  properties: {
    id: { type: "integer" },
  },
  additionalProperties: false,
};

const reviewDao = require("../../dao/reviews-dao.js");

async function ListAbl(req, res) {
  try {
    let id = -1;
    if (req.body.eventId) id = req.body.eventId;
    const valid = ajv.validate(schema, { id });
    if (!valid) {
      res.status(400).json({
        status: 400,
        type: "error",
        message: "Invalid request",
        validationError: ajv.errors,
      });
      return;
    }

    const reviews = await reviewDao.list(id);
    res.status(200).json(reviews);
  } catch (e) {
    res.status(500).json({
      status: 500,
      type: "error",
      message: e.message,
    });
  }
}

module.exports = ListAbl;
