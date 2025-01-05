const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./volume/OpenPage");

function listAll() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT club.id, club.name, club.description, club.created_at, club.user_id, CONCAT(user.first_name, ' ', user.last_name) AS club_owner_fullname FROM Clubs AS club INNER JOIN Users AS user ON club.user_id = user.id",
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      },
    );
  });
}

function listUserClubs(userId) {
  const query = `
    SELECT DISTINCT 
      Clubs.id, 
      Clubs.name, 
      Clubs.description, 
      Clubs.user_id, 
      Clubs.created_at
    FROM Clubs
    LEFT JOIN ClubMembers ON Clubs.id = ClubMembers.club_id
    WHERE Clubs.user_id = ? OR ClubMembers.user_id = ?
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [userId, userId], (err, rows) => {
      if (err) {
        console.error("Error retrieving clubs:", err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function get(clubId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT club.id, club.name, club.description, club.created_at, club.user_id, CONCAT(user.first_name, ' ', user.last_name) AS club_owner_fullname FROM Clubs AS club INNER JOIN Users AS user ON club.user_id = user.id WHERE club.id = $id",
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

function patch(club, newData) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE Clubs SET name=$name, description=$description, user_id=$user_id WHERE id=$id",
      {
        $name: newData.name ? newData.name : club.name,
        $description: newData.description
          ? newData.description
          : club.description,
        $user_id: newData.user_id ? newData.user_id : club.user_id,
        $id: club.id,
      },
      (err, row) => {
        if (err) reject(err);
        resolve(row);
      },
    );
  });
}

function create(club) {
  return new Promise((resolve, reject) => {
    const created_at = new Date().toISOString();
    db.run(
      "INSERT INTO Clubs (name, description, created_at, user_id) VALUES ($name, $description, $created_at, $user_id)",
      {
        $name: club.name,
        $description: club.description,
        $created_at: created_at,
        $user_id: club.user_id,
      },
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        const generatedId = this.lastID;
        resolve({
          id: generatedId,
          name: club.name,
          description: club.description,
          created_at: created_at,
          user_id: club.user_id,
        });
      },
    );
  });
}

const addMemberToClub = (userId, clubId) => {
  const checkQuery = `
    SELECT COUNT(*) AS count 
    FROM ClubMembers 
    WHERE club_id = ? AND user_id = ?
  `;

  const insertQuery = `
    INSERT INTO ClubMembers (club_id, user_id)
    VALUES (?, ?)
  `;

  return new Promise((resolve, reject) => {
    db.get(checkQuery, [clubId, userId], (err, row) => {
      if (err) {
        return reject(new Error(`Error checking membership: ${err.message}`));
      }

      if (row.count > 0) {
        return reject(
          new Error("Membership already exists for this user in the club"),
        );
      }

      db.run(insertQuery, [clubId, userId], function (err) {
        if (err) {
          return reject(
            new Error(`Error adding member to club: ${err.message}`),
          );
        }

        resolve({
          clubId,
          userId,
        });
      });
    });
  });
};

const listMembers = (clubId) => {
  const query = `
    SELECT Users.id, Users.first_name, Users.last_name, Users.email
    FROM Users
    INNER JOIN ClubMembers ON Users.id = ClubMembers.user_id
    WHERE ClubMembers.club_id = ?`;

  return new Promise((resolve, reject) => {
    db.all(query, [clubId], (err, rows) => {
      if (err) {
        return reject(new Error(`Error loading club members`));
      }

      resolve(rows);
    });
  });
};

module.exports = {
  listAll,
  listUserClubs,
  get,
  patch,
  create,
  addMemberToClub,
  listMembers,
};
