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
router.get('/:userId', verifyToken, async (req, res) => {
const profileId = req.user.userId;
const { userId } = req.params;

try {
  const userProfile = await UserProfile.findOne({ userId: userId });
  res.json({userProfile,profileId});
} catch (error) {
  console.error('Error fetching user profile data:', error);
  res.status(500).json({ error: 'Internal server error' });
}
});

module.exports = router;
