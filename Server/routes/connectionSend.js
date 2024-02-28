const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserProfileModel = require('./userSchema')

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

router.post('/',verifyToken,async (req, res) => {
    const { userId } = req.body;
    const SenderUserId = req.user.userId

    try {
        // Find the existing user profile by userId
        const reciverProfile = await UserProfileModel.findOne({ userId: userId });
        const senderProfile = await UserProfileModel.findOne({ userId: SenderUserId });
        if (!reciverProfile) {
          return res.status(404).json({ message: 'User profile not found' });
        }
    
        // Add the connectionId to the connections array in the user profile
        reciverProfile.connection_req.push(SenderUserId);
        senderProfile.connection_sent.push(userId)
        // Save the updated user prfile
    
        await senderProfile.save();
        await reciverProfile.save();
        return res.status(200).json({ message: 'Connection added successfully', senderProfile });
      } catch (error) {
        console.error('Error adding connection:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    
  });
module.exports = router;