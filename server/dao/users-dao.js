const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/OpenPage");

function listAll() {
  return new Promise((resolve, reject) => {
    db.all("SELECT id, first_name, last_name, email FROM Users", (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
}

function get(userId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id, first_name, last_name, email FROM Users WHERE id = $id",
      {
        $id: userId,
      },
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      },
    );
  });
}

function getByEmail(userEmail) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id, first_name, last_name, email, password FROM Users WHERE email = $email",
      {
        $email: userEmail,
      },
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      },
    );
  });
}

// DO NOT use externally
function getAll(userId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id, first_name, last_name, email, password FROM Users WHERE id = $id",
      {
        $id: userId,
      },
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      },
    );
  });
}

function patch(user, newData) {
  return new Promise((resolve, reject) => {
    const salt = bcrypt.genSaltSync();
    db.run(
      "UPDATE Users SET first_name=$first_name, last_name=$last_name, email=$email, password=$password WHERE id=$id",
      {
        $first_name: newData.first_name ? newData.first_name : user.first_name,
        $last_name: newData.last_name ? newData.last_name : user.last_name,
        $email: newData.email ? newData.email : user.email,
        $password: newData.password
          ? bcrypt.hashSync(newData.password, salt)
          : user.password,
        $id: user.id,
      },
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      },
    );
  });
}

function create(user) {
  return new Promise((resolve, reject) => {
    const salt = bcrypt.genSaltSync();
    db.run(
      "INSERT INTO Users (first_name, last_name, email, password) VALUES ($first_name, $last_name, $email, $password)",
      {
        $first_name: user.first_name,
        $last_name: user.last_name,
        $email: user.email,
        $password: bcrypt.hashSync(user.password, salt),
      },
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        // Resolve with the ID of the newly inserted user
        const generatedId = this.lastID;
        const newUser = {
          id: generatedId,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        };
        resolve(newUser);
      },
    );
  });
}

module.exports = {
  listAll,
  get,
  getByEmail,
  getAll,
  patch,
  create,
};
