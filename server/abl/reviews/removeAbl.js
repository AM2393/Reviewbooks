const AJV = require("ajv");
const ajv = new AJV({ coerceTypes: true });

const schema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    userId: { type: "integer" }
  },
  required: ["id", "userId"]
};

const reviewDao = require("../../dao/reviews-dao.js");

async function RemoveAbl(req, res) {
  try {
    const valid = ajv.validate(schema, { ...req.body });
    if (!valid) {
      res.status(400).json({
        status: 400,
        type: "error",
        message: "Invalid request",
        validationError: ajv.errors
      });
      return;
    }

    const existingReview = await reviewDao.get(req.body.id);
    if (!existingReview) {
      res.status(404).json({
        status: 404,
        type: "error",
        message: "Review not found"
      });
      return;
    }

    if (existingReview.author_id !== parseInt(req.body.userId)) {
      res.status(403).json({
        status: 403,
        type: "error",
        message: "Unauthorized to remove this review"
      });
      return;
    }

    await reviewDao.remove(req.body.id);

    res.status(200).json({
      status: 200,
      message: "Review removed successfully"
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      type: "error",
      message: e.message
    });
  }
}

module.exports = RemoveAbl;

