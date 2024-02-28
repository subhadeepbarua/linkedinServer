const express = require('express')
const router = express.Router();
const UserProfile = require('./userSchema')
const jwt = require('jsonwebtoken');

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

router.get('/', async (req, res) => {
    const searchQuery = req.query.query;
  
    try {

      const searchResults = await UserProfile.find({
        firstName: { $regex: searchQuery, $options: 'i' }, // Case-insensitive search for firstName
      });
      res.json(searchResults);
    } catch (error) {
      console.error('Error searching data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;