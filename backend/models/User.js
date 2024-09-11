const db = require('./db');
const bcrypt = require('bcryptjs');

const createUserTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      username VARCHAR(100) UNIQUE,
      password VARCHAR(255),
      email VARCHAR(100) UNIQUE,
      resetToken VARCHAR(100),
      resetTokenExpires DATETIME,
      role VARCHAR(20) DEFAULT 'user'
    )
  `;
  db.query(query, (err) => {
    if (err) throw err;
    console.log("Users table created or already exists.");
  });
};

createUserTable();

const User = {
  create: (userData, callback) => {
    bcrypt.hash(userData.password, 10, (err, hash) => {
      if (err) throw err;
      const query = `INSERT INTO Users (name, username, password, email) VALUES (?, ?, ?, ?)`;
      db.query(query, [userData.name, userData.username, hash, userData.email], callback);
    });
  },

  findByUsername: (username, callback) => {
    const query = `SELECT * FROM Users WHERE username = ?`;
    db.query(query, [username], callback);
  },

  findByEmail: (email, callback) => {
    const query = `SELECT * FROM Users WHERE email = ?`;
    db.query(query, [email], callback);
  },

  findByUsernameAndEmail: (username, email, callback) => {
    const query = `SELECT * FROM Users WHERE username = ? AND email = ?`;
    db.query(query, [username, email], callback);
  },

  saveResetToken: (id, token, expires, callback) => {
    const query = `UPDATE Users SET resetToken = ?, resetTokenExpires = ? WHERE id = ?`;
    db.query(query, [token, expires, id], callback);
  },

  findByResetToken: (token, callback) => {
    const query = `SELECT * FROM Users WHERE resetToken = ?`;
    db.query(query, [token], callback);
  },

  updatePassword: (id, password, callback) => {
    const query = `UPDATE Users SET password = ?, resetToken = NULL, resetTokenExpires = NULL WHERE id = ?`;
    db.query(query, [password, id], callback);
  }
};

module.exports = User;
