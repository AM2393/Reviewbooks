const AJV = require("ajv");
const ajv = new AJV();

const schema = {
  type: "object",
  properties: {
    id: {
      type: "number",
      multipleOf: 1,
      minimum: 0
    }
  },
  required: ["id"],
  additionalProperties: false,
};

const bookDao = require("../../dao/book-dao.js");

async function ListAbl(req, res) {
  try {

    const dtoIn = {
      id: Number(req.query.id)
    }

    const valid = ajv.validate(schema, dtoIn);
    if (!valid) {
      res.status(400).json({
        message: "Invalid request",
        validationError: ajv.errors,
      });
      return;
    }

    let book = await bookDao.getBook(dtoIn.id);
    if (!book || book.length === 0) {
      res.status(404).json({
        message: "Book not found",
      });
      return;
    }
    if (book.length > 1) {
      res.status(404).json({
        message: "Books have same IDs",
      });
      return;
    }

    const reviews = await bookDao.getBookReviews(dtoIn.id);
    if (!reviews) {
      res.status(404).json({
        message: "Review not found",
      });
      return;
    }

    book = {book: book[0], reviews}

    res.status(200).json(book);
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
}

module.exports = ListAbl;
