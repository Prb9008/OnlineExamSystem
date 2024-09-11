const db = require('./db');

const createOtpTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Otps (
      id INT AUTO_INCREMENT PRIMARY KEY,
      otp VARCHAR(6),
      email VARCHAR(100),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      expiresAt DATETIME
    )
  `;
  db.query(query, (err) => {
    if (err) throw err;
    console.log("Otps table created or already exists.");
  });
};

createOtpTable();

const Otp = {
  create: (otpData, callback) => {
    const query = `INSERT INTO Otps (otp, email, expiresAt) VALUES (?, ?, ?)`;
    db.query(query, [otpData.otp, otpData.email, otpData.expiresAt], callback);
  },

  findByEmailAndOtp: (email, otp, callback) => {
    const query = `SELECT * FROM Otps WHERE email = ? AND otp = ? AND expiresAt > NOW()`;
    db.query(query, [email, otp], callback);
  }
};

module.exports = Otp;
