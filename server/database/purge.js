const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/OpenPage");

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS test");
  db.run("DROP TABLE IF EXISTS Users");
  db.run("DROP TABLE IF EXISTS Clubs");
  db.run("DROP TABLE IF EXISTS ClubMembers");
  db.run("DROP TABLE IF EXISTS Authors");
  db.run("DROP TABLE IF EXISTS Genres");
  db.run("DROP TABLE IF EXISTS Books");
  db.run("DROP TABLE IF EXISTS Events");
  db.run("DROP TABLE IF EXISTS Reviews");
});

module.exports = db;
