const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./volume/OpenPage");

function listAll() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT
        id,
        full_name
      FROM
        Authors
      `,
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      },
    );
  });
}

function get(authorId) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT
        id,
        full_name
      FROM
        Authors
      WHERE
        id = $id
      `,
      {
        $id: authorId,
      },
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      },
    );
  });
}

function patch(author, newData) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE Authors SET full_name=$full_name WHERE id=$id",
      {
        $full_name: newData.full_name ? newData.full_name : author.full_name,
        $id: author.id,
      },
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      },
    );
  });
}

function create(author) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO Authors (full_name) VALUES ($full_name)",
      {
        $full_name: author.full_name,
      },
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        const generatedId = this.lastID;
        resolve({
          id: generatedId,
          full_name: author.full_name,
        });
      },
    );
  });
}

module.exports = {
  listAll,
  get,
  patch,
  create,
};
