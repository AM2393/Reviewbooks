const AJV = require("ajv");
const ajv = new AJV();

const schema = {
  type: "object",
  properties: {
    page: {
      type: "number",
      multipleOf: 1,
      minimum: 1
    },
    limit: {
      type: "number",
      multipleOf: 1,
      minimum: 1,
      default: 1
    },
    filter: {
      type: [ "string", "array" ],
      default: ["None"]
    },
    search: {
      type: "string",
      default: ""
    }
  },
  required: ["page", "limit"],
  additionalProperties: false,
};

const bookDao = require("../../dao/book-dao.js");

async function ListAbl(req, res) {
  try {

    // console.log({query: req.query})

    let dtoIn = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      filter: JSON.parse(req.query.filter),
      search: JSON.parse(req.query.search)
    }
    if(dtoIn.filter === "null") {
      dtoIn = {...dtoIn, filter: "None"}
    }

    // console.log({dtoIn})

    const valid = ajv.validate(schema, dtoIn);
    if (!valid) {
      res.status(400).json({
        message: "Invalid request",
        validationError: ajv.errors,
      });
      return;
    }
    
    const bookList = await bookDao.listBooks(dtoIn.page, dtoIn.limit, dtoIn.filter, dtoIn.search);
    // console.log({bookList})
    const bookListNum = await bookDao.listBooksNum(dtoIn.filter, dtoIn.search);
    // console.log({bookListNum})

    if (!bookList || !bookListNum) {
      res.status(404).json({
        message: "No data found",
      });
      return;
    }

    res.status(200).json({count: bookListNum["count"], books: bookList});
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
}

module.exports = ListAbl;
