const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/OpenPage");

function listAll() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT 
        Events.id AS event_id,
        Events.description AS event_description,
        Events.start_date,
        Events.end_date,
        Events.book_id,
        Events.club_id,
        Clubs.name AS club_name,
        Books.title AS book_title,
        Books.isbn AS book_isbn,
        Books.cover_url AS book_cover_url,
        Books.description AS book_description,
        Authors.id AS author_id,
        Authors.full_name AS author_name,
        Genres.id AS genre_id,
        Genres.name AS genre_name
      FROM 
          Events
      LEFT JOIN 
          Books ON Events.book_id = Books.id
      LEFT JOIN 
          Clubs ON Events.club_id = Clubs.id
      LEFT JOIN 
          Authors ON Books.author_id = Authors.id
      LEFT JOIN 
          Genres ON Books.genre_id = Genres.id
      `,
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      },
    );
  });
}

function get(eventId) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT 
        Events.id AS event_id,
        Events.description AS event_description,
        Events.start_date,
        Events.end_date,
        Events.book_id,
        Events.club_id,
        Clubs.name AS club_name,
        Books.title AS book_title,
        Books.isbn AS book_isbn,
        Books.cover_url AS book_cover_url,
        Books.description AS book_description,
        Authors.id AS author_id,
        Authors.full_name AS author_name,
        Genres.id AS genre_id,
        Genres.name AS genre_name
      FROM 
          Events
      LEFT JOIN 
          Books ON Events.book_id = Books.id
      LEFT JOIN 
          Clubs ON Events.club_id = Clubs.id
      LEFT JOIN 
          Authors ON Books.author_id = Authors.id
      LEFT JOIN 
          Genres ON Books.genre_id = Genres.id
      WHERE
        Events.id = $id
      `,
      {
        $id: eventId,
      },
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      },
    );
  });
}

function getClubEvents(clubId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT 
        Events.id AS event_id,
        Events.description AS event_description,
        Events.start_date,
        Events.end_date,
        Books.title AS book_title,
        Books.isbn AS book_isbn,
        Books.cover_url AS book_cover_url,
        Books.description AS book_description,
        Authors.id AS author_id,
        Authors.full_name AS author_name,
        Genres.id AS genre_id,
        Genres.name AS genre_name,
        Clubs.id AS club_id,
        Clubs.name AS club_name
      FROM 
          Events
      LEFT JOIN 
          Books ON Events.book_id = Books.id
      LEFT JOIN 
          Authors ON Books.author_id = Authors.id
      LEFT JOIN 
          Genres ON Books.genre_id = Genres.id
      LEFT JOIN 
          Clubs ON Events.club_id = Clubs.id
      WHERE
        Events.club_id = $id
      `,
      {
        $id: clubId,
      },
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      },
    );
  });
}

function patch(event, newData) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE Events SET description=$description, book_id=$book_id, club_id=$club_id, start_date=$start_date, end_date=$end_date WHERE id=$id",
      {
        $description: newData.description
          ? newData.description
          : event.description,
        $club_id: newData.club_id ? newData.club_id : event.club_id,
        $book_id: newData.book_id ? newData.book_id : event.book_id,
        $start_date: newData.start_date ? newData.start_date : event.start_date,
        $end_date: newData.end_date ? newData.end_date : event.end_date,
        $id: event.event_id,
      },
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      },
    );
  });
}

function create(event) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO Events (description, book_id, club_id, start_date, end_date) VALUES ($description, $book_id, $club_id, $start_date, $end_date)",
      {
        $description: event.description,
        $book_id: event.book_id,
        $club_id: event.club_id,
        $start_date: event.start_date,
        $end_date: event.end_date,
      },
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        const generatedId = this.lastID;
        resolve({
          id: generatedId,
          description: event.description,
          book_id: event.book_id,
          club_id: event.club_id,
          start_date: event.start_date,
          end_date: event.end_date,
        });
      },
    );
  });
}

module.exports = {
  listAll,
  get,
  getClubEvents,
  patch,
  create,
};
