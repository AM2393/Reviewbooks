const AJV = require("ajv");
const ajv = new AJV();

const schema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    title: { type: "string" },
    isbn: { type: "string" },
    author: { type: "string" },
    cover_url: { type: "string" },
    genre: { type: "string" },
    description: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

const bookDao = require("../../dao/book-dao.js");

async function UpdateAbl(req, res) {
  try {
    const dtoIn = req.body;

    const valid = ajv.validate(schema, dtoIn);
    if (!valid) {
      res.status(400).json({
        message: "Invalid request",
        validationError: ajv.errors,
      });
      return;
    }

    const updatedBook = await bookDao.updateBook(dtoIn);

    if (!updatedBook) {
      res.status(404).json({
        message: "Book not found",
      });
      return;
    }

    res.status(200).json(updatedBook);
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
}

module.exports = UpdateAbl;
