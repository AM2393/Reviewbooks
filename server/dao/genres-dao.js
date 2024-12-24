const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/OpenPage");

function listAll() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT
        id,
        name
      FROM
        Genres
      `,
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      }
    );
  });
}

function get(genreId) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT
        id,
        name
      FROM
        Genres
      WHERE
        id = $id
      `,
      {
        $id: genreId,
      },
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      }
    );
  });
}

function patch(genre, newData) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE Genres SET name=$name WHERE id=$id",
      {
        $name: newData.name ? newData.name : genre.name,
        $id: genre.id,
      },
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      }
    );
  });
}

function create(genre) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO Genres (name) VALUES ($name)",
      {
        $name: genre.name,
      },
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        const generatedId = this.lastID;
        resolve({
          id: generatedId,
          name: genre.name,
        });
      }
    );
  });
}

module.exports = {
  listAll,
  get,
  patch,
  create,
};
