const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const UserProfile = require('./userSchema');

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

router.post('/',verifyToken, async (req, res) => {
    try {

      const userId = req.user.userId;
      const { field, value } = req.body;
      
      let userProfile = await UserProfile.findOne({ userId });
  
      if (!userProfile) {
        userProfile = new UserProfile({ userId, value });
      } else {
  
        if(field === 'about')
        {
          userProfile.about = value;
        } else if(field === 'experience')
        { 
          userProfile.experience.push(value);
        }
        else if(field === 'education')
        { 
          userProfile.education.push(value);
        }
        else if(field === 'skill')
        { 
          userProfile.skills.push(value);
        }
      }
  
      await userProfile.save();
      return res.status(200).json({ message: 'Updated successfully', userProfile });
    } catch (error) {
      console.error('Error updating user profile:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;