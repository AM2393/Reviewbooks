const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./volume/OpenPage");

function listAll() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM Books", (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
}

module.exports = {
  listAll,
};
