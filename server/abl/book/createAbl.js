const AJV = require("ajv");
const ajv = new AJV();

const schema = {
  type: "object",
  properties: {
    title: { type: "string" },
    isbn: { type: "string" },
    author: { type: "string" },
    cover_url: { type: "string" },
    genre: { type: "string" },
    description: { type: "string" }
  },
  required: ["title", "isbn", "author", "genre"],
  additionalProperties: false,
};

const bookDao = require("../../dao/book-dao.js");

async function CreateAbl(req, res) {
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

    const newBook = await bookDao.createBook(dtoIn);

    if (!newBook) {
      res.status(500).json({
        message: "Failed to create book",
      });
      return;
    }

    res.status(201).json(newBook);
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
}

module.exports = CreateAbl;

