const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./volume/OpenPage");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Users (
		id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		first_name TEXT NOT NULL,
		last_name TEXT NOT NULL,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL
	);`);

  db.run(`CREATE TABLE IF NOT EXISTS Clubs (
		id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		description TEXT,
		user_id INTEGER NOT NULL,
		created_at TEXT NOT NULL,
		CONSTRAINT Clubs_Users_FK FOREIGN KEY (id) REFERENCES Users(id)
	);`);

  db.run(`CREATE TABLE IF NOT EXISTS ClubMembers (
		id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		club_id INTEGER NOT NULL,
		CONSTRAINT ClubMembers_Users_FK FOREIGN KEY(id) REFERENCES Users(id),
		CONSTRAINT ClubMembers_Clubs_FK FOREIGN KEY(id) REFERENCES Clubs(id)
	);`);

  db.run(`CREATE TABLE IF NOT EXISTS Authors (
		id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		full_name TEXT NOT NULL
	);`);

  db.run(`CREATE TABLE IF NOT EXISTS Genres (
		id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL
	);`);

  db.run(`CREATE TABLE IF NOT EXISTS Books (
		id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		isbn TEXT NOT NULL UNIQUE,
		author_id INTEGER NOT NULL,
		cover_url TEXT,
		genre_id INTEGER NOT NULL,
		description TEXT,
		CONSTRAINT Books_Authors_FK FOREIGN KEY(id) REFERENCES Authors(id),
		CONSTRAINT Books_Genres_FK FOREIGN KEY(id) REFERENCES Genres(id)
	);`);

  db.run(`CREATE TABLE IF NOT EXISTS Events (
		id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		description TEXT NOT NULL,
		start_date TEXT NOT NULL,
		end_date TEXT NOT NULL,
		book_id INTEGER NOT NULL,
		club_id INTEGER NOT NULL,
		CONSTRAINT Events_Books_FK FOREIGN KEY(id) REFERENCES Books(id),
		CONSTRAINT Events_Clubs_FK FOREIGN KEY(id) REFERENCES Clubs(id)
	);`);

  db.run(`CREATE TABLE IF NOT EXISTS Reviews (
		id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		review TEXT NOT NULL,
		author_id INTEGER NOT NULL,
		book_id INTEGER NOT NULL,
		event_id INTEGER NOT NULL,
		created_at TEXT NOT NULL NOT NULL,
		CONSTRAINT Reviews_Users_FK FOREIGN KEY(id) REFERENCES Users(id),
		CONSTRAINT Reviews_Books_FK FOREIGN KEY(id) REFERENCES Books(id),
		CONSTRAINT Reviews_Events_FK FOREIGN KEY(id) REFERENCES Events(id)
	);`);

  // Insert data

  db.run(`INSERT INTO Users (id, first_name, last_name, email, password)
		VALUES
		(1, 'John', 'Doe', 'johndoe@example.com', 'password123'),
		(2, 'Jane', 'Smith', 'janecsmith@example.com', 'password456'),
		(3, 'Example', 'User', 'exampleuser@example.com', 'password789'),
		(4, 'Test', 'User1', 'testuser1@example.com', 'password012'),
		(5, 'Test', 'User2', 'testuser2@example.com', 'password345');
	`);

  db.run(`INSERT INTO Clubs (id, name, description, user_id, created_at)
		VALUES
		(1, 'Book Club', 'A club for book lovers', 1, '2023-01-01T18:04:09.007Z'),
		(2, 'Reading Group', 'A group for readers to discuss books', 2, '2023-02-02T18:48:18.004Z'),
		(3, 'Literary Society', 'A society for literature enthusiasts', 3,'2023-03-03T20:20:52.420Z'),
		(4, 'Bookworms Unite', 'A club for book lovers of all ages', 4, '2023-04-04T20:20:52:608Z'),
		(5, 'Reading Retreat', 'A retreat for readers to relax and read', 5, '2023-05-05T15:48:20.823Z');
	`);

  db.run(`INSERT INTO ClubMembers (id, user_id, club_id)
		VALUES
		(1, 1, 1),
		(2, 1, 3),
		(3, 2, 2),
		(4, 2, 4),
		(5, 3, 5);
	`);

  db.run(`INSERT INTO Authors (id, full_name)
		VALUES
		(1, 'John Smith'),
		(2, 'Jane Doe'),
		(3, 'Ernest Hemingway'),
		(4, 'Jane Austen'),
		(5, 'Stephen King'),
		(6, 'J.K. Rowling'),
		(7, 'George R.R. Martin'),
		(8, 'J.R.R. Tolkien'),
		(9, 'Isaac Asimov'),
		(10, 'Agatha Christie'),
		(11, 'Karel Čapek'),
		(12, 'Franz Kafka'),
		(13, 'Milan Kundera'),
		(14, 'Jaroslav Hašek'),
		(15, 'Bohumil Hrabal'),
		(16, 'Zdeněk Jirotka');
	`);

  db.run(`INSERT INTO Genres (id, name)
		VALUES
		(1, 'Fiction'),
		(2, 'Non-Fiction'),
		(3, 'Mystery'),
		(4, 'Romance'),
		(5, 'Science Fiction'),
		(6, 'Fantasy'),
		(7, 'Horror'),
		(8, 'Thriller'),
		(9, 'Historical Fiction'),
		(10, 'Biography'),
		(11, 'Young Adult'),
		(12, 'Children''s'),
		(13, 'Poetry'),
		(14, 'Graphic Novel'),
		(15, 'Self-Help');
	`);

  db.run(
    `INSERT INTO Books (id, title, isbn, author_id, cover_url, genre_id, description)
		VALUES
		(1, 'To Kill a Mockingbird', '9780446536473', 1, 'https://picsum.photos/200?random=1', 1, 'Classic novel'),
		(2, 'The Great Gatsby', '9780743273565', 2, 'https://picsum.photos/200?random=2', 1, 'Classic novel'),
		(3, '1984', '9780451524935', 3, 'https://picsum.photos/200?random=3', 3, 'Dystopian classic'),
		(4, 'Pride and Prejudice', '9780143039531', 4, 'https://picsum.photos/200?random=4', 2, 'Classic romance'),
		(5, 'The Hunger Games', '9780545139708', 5, 'https://picsum.photos/200?random=5', 5, 'Dystopian adventure'),
		(6, 'Harry Potter and the Philosopher''s Stone', '9780747532699', 6, 'https://picsum.photos/200?random=6', 6, 'A young wizard''s journey begins with his acceptance to Hogwarts.'),
		(7, 'A Game of Thrones', '9780553103540', 7, 'https://picsum.photos/200?random=7', 6, 'A tale of power, politics, and intrigue in the Seven Kingdoms.'),
		(8, 'The Fellowship of the Ring', '9780261103573', 8, 'https://picsum.photos/200?random=8', 6, 'The first part of the epic journey to destroy the One Ring.'),
		(9, 'Foundation', '9780553293357', 9, 'https://picsum.photos/200?random=9', 7, 'A mathematician''s plan to preserve knowledge in a collapsing empire.'),
		(10, 'Murder on the Orient Express', '9780062073501', 10, 'https://picsum.photos/200?random=10', 8, 'A murder mystery solved aboard a luxurious train.');
	`,
  );

  db.run(
    `INSERT INTO Reviews (id, review, author_id, book_id, event_id, created_at)
		VALUES
		(1, 'I loved this book! It was so well-written and engaging 1.', 1, 5, 2,'2024-02-15T18:04:09.264Z'),
		(6, 'I loved this book! It was so well-written and engaging 3.', 1, 5, 2,'2026-02-15T18:04:09.264Z'),
		(7, 'I loved this book! It was so well-written and engaging 2.', 1, 5, 2,'2025-02-15T18:04:09.264Z'),
		(2, 'The author did a great job of bringing the characters to life. Highly recommend!', 3, 5, 2, '2024-03-17T18:48:18.666Z'),
		(3, "I didn't enjoy this book as much as I thought I would.", 4, 3, 4,'2024-05-02T20:27:35.422Z'),
		(4, 'This event was so much fun! The author was great and the Q&A was really interesting.', 1, 1, 1, '2024-02-20T20:20:52.420Z'),
		(5, 'I had a hard time getting into this book, but it was worth sticking with. Good character development!', 2, 3, 4, '2024-05-15T25:48:20.823Z');
	`,
  );

  db.run(
    `INSERT INTO Events (id, description, start_date, end_date, book_id, club_id)
		VALUES
		(1, 'Book discussion and Q&A', '2023-02-20T10:00:00.000Z', '2025-02-20T12:00:00.000Z', 1, 1),
		(2, 'Author talk and signing', '2023-03-15T14:00:00.000Z', '2025-03-15T16:00:00.000Z', 5, 4),
		(3, 'Literary festival event', '2023-04-10T09:00:00.000Z', '2025-04-10T11:00:00.000Z', 4, 2),
		(4, 'Book club meeting', '2023-05-15T18:00:00.000Z', '2024-05-15T20:00:00.000Z', 3, 5),
		(5, 'Reading and discussion', '2023-10-20T20:00:00.000Z', '2024-01-05T12:00:00.000Z', 2, 3),
		(6, 'Workshop: Writing your first novel', '2024-08-15T10:00:00.000Z', '2024-08-05T12:00:00.000Z', 7, 5),
		(7, 'Author talk and signing', '2024-06-15T10:00:00.000Z', '2025-08-10T11:00:00.000Z', 7, 5);
	`,
  );
});

module.exports = db;
/*
CREATE TABLE IF NOT EXISTS Users (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	email TEXT NOT NULL,
	password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Clubs (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	description TEXT,
	user_id INTEGER NOT NULL,
	created_at TEXT NOT NULL,
	CONSTRAINT Clubs_Users_FK FOREIGN KEY (id) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS ClubMembers (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER NOT NULL,
	club_id INTEGER NOT NULL,
	CONSTRAINT ClubMembers_Users_FK FOREIGN KEY (id) REFERENCES Users(id),
	CONSTRAINT ClubMembers_Clubs_FK FOREIGN KEY (id) REFERENCES Clubs(id)
);


CREATE TABLE IF NOT EXISTS Authors (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	full_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Genres (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Books (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL,
	isbn TEXT NOT NULL UNIQUE,
	author_id INTEGER NOT NULL,
	cover_url TEXT,
	genre_id INTEGER NOT NULL,
	description TEXT,
	CONSTRAINT Books_Authors_FK FOREIGN KEY (id) REFERENCES Authors(id),
	CONSTRAINT Books_Genres_FK FOREIGN KEY (id) REFERENCES Genres(id)
);

CREATE TABLE IF NOT EXISTS Events (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	description TEXT NOT NULL,
	start_date TEXT NOT NULL,
	end_date TEXT NOT NULL,
	book_id INTEGER NOT NULL,
	club_id INTEGER NOT NULL,
	CONSTRAINT Events_Books_FK FOREIGN KEY (id) REFERENCES Books(id),
	CONSTRAINT Events_Clubs_FK FOREIGN KEY (id) REFERENCES Clubs(id)
);

CREATE TABLE IF NOT EXISTS Reviews (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	review TEXT NOT NULL,
	author_id INTEGER NOT NULL,
	book_id INTEGER NOT NULL,
	event_id INTEGER NOT NULL,
	created_at TEXT NOT NULL NOT NULL,
	CONSTRAINT Reviews_Users_FK FOREIGN KEY (id) REFERENCES Users(id),
	CONSTRAINT Reviews_Books_FK FOREIGN KEY (id) REFERENCES Books(id),
	CONSTRAINT Reviews_Events_FK FOREIGN KEY (id) REFERENCES Events(id)
);


-----
data
-----

INSERT INTO Users (id, first_name, last_name, email, password)
VALUES
(1, 'John', 'Doe', 'johndoe@example.com', 'password123'),
(2, 'Jane', 'Smith', 'janecsmith@example.com', 'password456'),
(3, 'Example', 'User', 'exampleuser@example.com', 'password789'),
(4, 'Test', 'User1', 'testuser1@example.com', 'password012'),
(5, 'Test', 'User2', 'testuser2@example.com', 'password345');

INSERT INTO Clubs (id, name, description, user_id, created_at)
VALUES
(1, 'Book Club', 'A club for book lovers', 1, '2023-01-01'),
(2, 'Reading Group', 'A group for readers to discuss books', 2, '2023-02-02'),
(3, 'Literary Society', 'A society for literature enthusiasts', 3,'2023-03-03'),
(4, 'Bookworms Unite', 'A club for book lovers of all ages', 4, '2023-04-04'),
(5, 'Reading Retreat', 'A retreat for readers to relax and read', 5, '2023-05-05');

INSERT INTO ClubMembers (id, user_id, club_id)
VALUES
(1, 1, 1),
(2, 1, 3),
(3, 2, 2),
(4, 2, 4),
(5, 3, 5);

INSERT INTO Authors (id, full_name)
VALUES
(1, 'John Smith'),
(2, 'Jane Doe'),
(3, 'Example Author'),
(4, 'Test Author1'),
(5, 'Test Author2');

INSERT INTO Genres (id, name)
VALUES
(1, 'Fiction'),
(2, 'Non-Fiction'),
(3, 'Mystery'),
(4, 'Romance'),
(5, 'Science Fiction');

INSERT INTO Books (id, title, isbn, author_id, cover_url, genre_id, description)
VALUES
(1, 'To Kill a Mockingbird', '9780446536473', 1, 'https://picsum.photos/200?random=1', 1, 'Classic novel'),
(2, 'The Great Gatsby', '9780743273565', 2, 'https://picsum.photos/200?random=2', 1, 'Classic novel'),
(3, '1984', '9780451524935', 3, 'https://picsum.photos/200?random=3', 3, 'Dystopian classic'),
(4, 'Pride and Prejudice', '9780143039531', 4, 'https://picsum.photos/200?random=4', 2, 'Classic romance'),
(5, 'The Hunger Games', '9780545139708', 5, 'https://picsum.photos/200?random=5', 5, 'Dystopian adventure');

INSERT INTO Reviews (id, review, author_id, book_id, event_id, created_at)
VALUES
(1, 'I loved this book! It was so well-written and engaging.', 1, 1, 2,'2024-02-15'),
(2, 'The author did a great job of bringing the characters to life. Highly recommend!', 3, 5, 2, '2024-03-17'),
(3, "I didn't enjoy this book as much as I thought I would.", 4, 3, 4,'2024-05-02'),
(4, 'This event was so much fun! The author was great and the Q&A was really interesting.', 1, 2, 1, '2024-02-20'),
(5, 'I had a hard time getting into this book, but it was worth sticking with. Good character development!', 2, 4, 4, '2024-05-15');


INSERT INTO Events (id, description, start_date, end_date, book_id, club_id)
VALUES
(1, 'Book discussion and Q&A', '2023-02-20 10:00:00', '2023-02-20 12:00:00', 1, 1),
(2, 'Author talk and signing', '2023-03-15 14:00:00', '2023-03-15 16:00:00', 5, 4),
(3, 'Literary festival event', '2023-04-10 09:00:00', '2023-04-10 11:00:00', 4, 2),
(4, 'Book club meeting', '2023-05-15 18:00:00', '2023-05-15 20:00:00', 3, 5),
(5, 'Reading and discussion', '2023-10-20 20:00:00', '2024-01-05 12:00:00', 2, 3);

*/
