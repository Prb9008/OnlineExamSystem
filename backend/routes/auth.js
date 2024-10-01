const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const multer = require('multer');  // For profile picture uploads
require('dotenv').config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/register', (req, res) => {
  const { name, username, password, email } = req.body;

  User.create({ name, username, password, email }, (err) => {
    if (err) return res.status(400).json({ error: err });
    res.status(201).json({ message: 'User registered successfully.' });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, (err, users) => {
    if (err || users.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const user = users[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials.' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );

      res.json({ token });
    });
  });
});

router.post('/send-otp', (req, res) => {
  const { username, email } = req.body;

  User.findByUsernameAndEmail(username, email, (err, users) => {
    if (err || users.length === 0) {
      return res.status(400).json({ error: 'User not found.' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60000); // OTP expires in 5 minutes

    Otp.create({ otp, email, expiresAt }, (err) => {
      if (err) return res.status(500).json({ error: 'Error generating OTP' });

      transporter.sendMail({
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
      });

      res.json({ message: 'OTP sent successfully' });
    });
  });
});

router.post('/verify-otp', (req, res) => {
  const { username, email, otp } = req.body;

  Otp.findByEmailAndOtp(email, otp, (err, otps) => {
    if (err || otps.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified successfully' });
  });
});

router.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  User.findByEmail(email, (err, users) => {
    if (err || users.length === 0) {
      return res.status(400).json({ error: 'User with this email does not exist.' });
    }

    const user = users[0];
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 hour

    User.saveResetToken(user.id, resetToken, resetTokenExpires, (err) => {
      if (err) return res.status(500).json({ error: 'Error saving reset token' });

      transporter.sendMail({
        to: email,
        subject: 'Password Reset',
        text: `You requested a password reset. Click the following link to reset your password: http://localhost:4200/reset-password?token=${resetToken}`,
      });

      res.json({ message: 'Password reset email sent successfully' });
    });
  });
});

router.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;

  User.findByResetToken(token, (err, users) => {
    if (err || users.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    const user = users[0];
    if (user.resetTokenExpires < Date.now()) {
      return res.status(400).json({ error: 'Token has expired.' });
    }

    bcrypt.hash(newPassword, 10, (err, hash) => {
      if (err) throw err;

      User.updatePassword(user.id, hash, (err) => {
        if (err) return res.status(500).json({ error: 'Error updating password' });

        res.json({ message: 'Password updated successfully' });
      });
    });
  });
});

// Profile management (new)
router.post('/profile', upload.single('profile_picture'), (req, res) => {
  const userId = req.user.id;
  const { mobile_number, education, role } = req.body;
  const profile_picture = req.file ? req.file.path : null;

  User.updateProfile(userId, { mobile_number, education, role, profile_picture }, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update profile' });
    res.json({ message: 'Profile updated successfully' });
  });
});

router.get('/profile', (req, res) => {
  const userId = req.user.id;
  User.findById(userId, (err, user) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch user profile' });
    res.json(user);
  });
});

// Dashboard (new)
router.get('/dashboard', (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT COUNT(*) AS testsTaken, AVG(score) AS averageScore 
    FROM Results WHERE user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch stats' });
    res.json(results[0]);
  });
});

module.exports = router;
