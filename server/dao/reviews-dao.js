const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/OpenPage");

function create(review) {
  return new Promise((resolve, reject) => {
    const created_at = new Date().toISOString();
    db.run(
      `INSERT INTO Reviews (review, author_id, book_id, event_id, created_at) VALUES ($text, $userId, $bookId, $event_id, $created_at)`,
      {
        $userId: review.userId,
        $bookId: review.bookId,
        $text: review.text,
        $created_at: created_at,
        $event_id: review.eventId,
      },
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({
          id: this.lastID,
          userId: review.userId,
          bookId: review.bookId,
          text: review.text,
          createdAt: created_at,
          eventId: review.eventId,
        });
      },
    );
  });
}

function get(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM Reviews WHERE id = ?", [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function list(eventId) {
  return new Promise((resolve, reject) => {
    let query = `
     SELECT
      Reviews.id,
      Reviews.review,
      Reviews.author_id,
      Reviews.book_id,
      Reviews.event_id,
      Reviews.created_at,
      Users.first_name,
      Users.last_name
     FROM Reviews
     INNER JOIN Users ON Reviews.author_id=Users.id`;
    let params = [];

    if (eventId != -1) {
      query += " WHERE Reviews.event_id = ?";
      params.push(eventId);
    }

    query += " ORDER BY Reviews.created_at DESC";

    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function update(id, reviewData) {
  return new Promise((resolve, reject) => {
    const updated_at = new Date().toISOString();
    db.run(
      "UPDATE Reviews SET rating = $rating, review = $text, updated_at = $updated_at WHERE id = $id",
      {
        $id: id,
        $rating: reviewData.rating,
        $text: reviewData.text,
        $updated_at: updated_at,
      },
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        if (this.changes === 0) {
          reject(new Error("Review not found"));
          return;
        }
        resolve({
          id: id,
          ...reviewData,
          updatedAt: updated_at,
        });
      },
    );
  });
}

function remove(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM Reviews WHERE id = ?", [id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      if (this.changes === 0) {
        reject(new Error("Review not found"));
        return;
      }
      resolve();
    });
  });
}

module.exports = {
  create,
  get,
  list,
  update,
  remove,
};
