const express = require('express');
const multer = require('multer');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');  // Add authentication middleware
const router = express.Router();

// Setup multer for profile picture upload
const upload = multer({ dest: 'uploads/' });

// Get user profile (protected route)
router.get('/profile', authMiddleware, (req, res) => {  // Use middleware to protect the route
  const userId = req.user.id;  // User ID from JWT middleware
  User.findById(userId, (err, user) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch user profile' });
    res.json(user);
  });
});

// Update user profile (protected route)
router.post('/profile', authMiddleware, upload.single('profile_picture'), (req, res) => {  // Protect this route
  const userId = req.user.id;
  const { mobile_number, education, role } = req.body;
  const profile_picture = req.file ? req.file.path : null;

  User.updateProfile(userId, { mobile_number, education, role, profile_picture }, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update profile' });
    res.json({ message: 'Profile updated successfully' });
  });
});

module.exports = router;
