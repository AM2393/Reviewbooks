const AJV = require("ajv");
const ajv = new AJV();

const bookDao = require("../../dao/book-dao.js");


async function ListAbl(req, res) {
  try {
    
    const genreList = await bookDao.listAllGenres();

    if (!genreList) {
      res.status(404).json({
        message: "No data found",
      });
      return;
    }

    let tempGenreList = []
    genreList.forEach((e) => {
      tempGenreList.push(e.name)
    });

    res.status(200).json(tempGenreList);
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
}

module.exports = ListAbl;
