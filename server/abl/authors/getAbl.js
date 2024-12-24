const AJV = require("ajv");
const ajv = new AJV({ coerceTypes: true });

const schema = {
  type: "object",
  properties: {
    id: { type: "number" },
  },
  required: [
    "id",
  ],
  additionalProperties: false,
};

const authorDao = require("../../dao/authors-dao.js");

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

    const author = await authorDao.get(req.params.id);
    if (!author || author.length === 0) {
      res.status(404).json({
        status: 404,
        type: "error",
        message: "No author with this id found",
      });
      return;
    }

    res.status(200).json(author);
  } catch (e) {
    res.status(500).json({
      status: 500,
      type: "error",
      message: e.message,
    });
  }
}

module.exports = GetAbl;
