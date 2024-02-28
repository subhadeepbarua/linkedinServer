const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserProfile = require('./userSchema');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token not provided' });
  }

  try {
    const decoded = jwt.verify(token, 'ab543327'); // Replace 'your_secret_key' with your actual secret key
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Protected route to get profile data
router.get('/', verifyToken, async (req, res) => {
  try {
    // Extract user information from the request object
    const userId = req.user.userId;

    // Fetch profile data associated with the user
    const userProfile = await UserProfile.findOne({ userId: userId });
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching profile data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
