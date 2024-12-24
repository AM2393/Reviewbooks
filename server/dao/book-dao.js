const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/OpenPage");

function listBooks(page, limit, filter, search) {

  let filterString = "";
  let tempFilter = (Array.isArray(filter) == true && filter.length > 0 && filter[0] != "None") ? JSON.stringify(filter) : "";

  if (Array.isArray(filter) == true && filter.length > 0 && filter[0] != "None") {

    tempFilter = tempFilter.slice(1)
    tempFilter = tempFilter.slice(0, tempFilter.length - 1)

    filterString = `Genres.name IN (${tempFilter})`
  }
  if (typeof filter == "string" && filter != "None") filterString = `Genres.name="${filter}"`

  const searchString = (search.length > 0) ? `instr(LOWER(Books.title), LOWER("${search}"))` : "";


  return new Promise((resolve, reject) => {
    db.all(
      `SELECT
         Books.id,
         Books.title,
         Books.isbn,
         Authors.full_name AS author,
         Books.cover_url,
         Genres.name AS genre,
         Books.description
       FROM 
         Books
       INNER JOIN Authors ON Books.author_id=Authors.id
       INNER JOIN Genres ON Books.genre_id=Genres.id
       ${(searchString != "" || filterString != "") ? "WHERE" : ""}
         ${searchString}
         ${(Array.isArray(filter) && searchString != "" && filterString != "" && filter[0] != "None") ? "AND" : ""}
         ${(!Array.isArray(filter) && searchString != "" && filterString != "" && filter != "None") ? "AND" : ""}
         ${filterString}
       LIMIT ${limit} OFFSET ${(page - 1) * limit}
      `,
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      }
    );
  });
}

/* 

*/

function listBooksNum(filter, search) {

  let filterString = "";
  let tempFilter = (Array.isArray(filter) == true && filter.length > 0 && filter[0] != "None") ? JSON.stringify(filter) : "";

  if (Array.isArray(filter) == true && filter.length > 0 && filter[0] != "None") {

    tempFilter = tempFilter.slice(1)
    tempFilter = tempFilter.slice(0, tempFilter.length - 1)

    filterString = `Genres.name IN (${tempFilter})`
  }
  if (typeof filter == "string" && filter != "None") filterString = `Genres.name="${filter}"`

  const searchString = (search.length > 0) ? `instr( Books.title, "${search}" )` : "";


  return new Promise((resolve, reject) => {
    db.all(
      `SELECT COUNT(*) AS count
       FROM 
         Books
       INNER JOIN Genres ON Books.genre_id=Genres.id
       ${(searchString != "" || filterString != "") ? "WHERE" : ""}
         ${searchString}
         ${(Array.isArray(filter) && searchString != "" && filterString != "" && filter[0] != "None") ? "AND" : ""}
         ${(!Array.isArray(filter) && searchString != "" && filterString != "" && filter != "None") ? "AND" : ""}
         ${filterString}
      `,
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows[0]);
      }
    );
  });
}

function getBook(id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT
         Books.id,
         Books.title,
         Books.isbn,
         Authors.full_name AS author,
         Books.cover_url,
         Genres.name AS genre,
         Books.description
       FROM 
         Books
       INNER JOIN Authors ON Books.author_id=Authors.id
       INNER JOIN Genres ON Books.genre_id=Genres.id
       WHERE Books.id=${id}
    `,
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      }
    );
  });
}

function getBookReviews(id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT
             Reviews.id,
             Reviews.review,
             Users.first_name,
             Users.last_name,
             Reviews.created_at
           FROM 
             Reviews
           INNER JOIN Users ON Reviews.author_id=Users.id
           WHERE Reviews.book_id=${id}
           ORDER BY Reviews.created_at DESC
        `,
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      }
    );
  });
}

function listAllGenres() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT
        Genres.name
       FROM 
        Genres
        `,
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      }
    );
  });
}

function listAllBooks() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT
         Books.id,
         Books.title,
         Books.isbn,
         Authors.full_name AS author
       FROM 
         Books
       INNER JOIN Authors ON Books.author_id=Authors.id
       INNER JOIN Genres ON Books.genre_id=Genres.id
    `,
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      }
    );
  });
}

function createBook(bookData) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO Books (title, isbn, author_id, cover_url, genre_id, description)
       VALUES ($title, $isbn, 
               (SELECT id FROM Authors WHERE full_name = $author), 
               $cover_url, 
               (SELECT id FROM Genres WHERE name = $genre), 
               $description)`,
      {
        $title: bookData.title,
        $isbn: bookData.isbn,
        $author: bookData.author,
        $cover_url: bookData.cover_url,
        $genre: bookData.genre,
        $description: bookData.description
      },
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: this.lastID, ...bookData });
      }
    );
  });
}

function updateBook(bookData) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Books 
       SET title = $title, 
           isbn = $isbn, 
           author_id = (SELECT id FROM Authors WHERE full_name = $author), 
           cover_url = $cover_url, 
           genre_id = (SELECT id FROM Genres WHERE name = $genre), 
           description = $description
       WHERE id = $id`,
      {
        $id: bookData.id,
        $title: bookData.title,
        $isbn: bookData.isbn,
        $author: bookData.author,
        $cover_url: bookData.cover_url,
        $genre: bookData.genre,
        $description: bookData.description
      },
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        if (this.changes === 0) {
          resolve(null);
        } else {
          resolve(bookData);
        }
      }
    );
  });
}

module.exports = {
  listBooks,
  listBooksNum,
  getBook,
  getBookReviews,
  listAllGenres,
  createBook,
  updateBook,
  listAllBooks
};
