const AJV = require("ajv");
const ajv = new AJV({ coerceTypes: true });

const schema = {
  type: "object",
  properties: {
    id: { type: "integer" },
  },
  required: ["id"],
};

const reviewDao = require("../../dao/reviews-dao.js");

async function GetAbl(req, res) {
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

    const review = await reviewDao.get(req.params.id);
    if (!review) {
      res.status(404).json({
        status: 404,
        type: "error",
        message: "Review not found",
      });
      return;
    }

    res.status(200).json(review);
  } catch (e) {
    res.status(500).json({
      status: 500,
      type: "error",
      message: e.message,
    });
  }
}

module.exports = GetAbl;
