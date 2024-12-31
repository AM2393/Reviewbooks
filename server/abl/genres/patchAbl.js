const AJV = require("ajv");
const ajv = new AJV({ coerceTypes: true, removeAdditional: true });

const schema = {
  type: "object",
  properties: {
    id: { type: "number" },
  },
  required: ["id"],
  additionalProperties: false,
};

const genreDao = require("../../dao/genres-dao.js");

async function PatchAbl(req, res) {
  try {
    const valid = ajv.validate(schema, req.params, req.body);
    if (!valid) {
      res.status(400).json({
        status: 400,
        type: "error",
        message: "Invalid request",
        validationError: ajv.errors,
      });
      return;
    }

    const genre = await genreDao.get(req.params.id);
    if (!genre || genre.length === 0) {
      res.status(404).json({
        status: 404,
        type: "error",
        message: "No genre with this id found",
      });
      return;
    }

    res.status(200).json(await genreDao.patch(genre, req.body));
  } catch (e) {
    res.status(500).json({
      status: 500,
      type: "error",
      message: e.message,
    });
  }
}

module.exports = PatchAbl;
