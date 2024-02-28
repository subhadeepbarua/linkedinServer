const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const POST = require('./timelineSchema');
const USER = require('./userSchema')

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token not provided' });
  }

  try {
    const decoded = jwt.verify(token, 'ab543327');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

router.get('/', verifyToken, async (req, res) => {
  try {
    // Extract user information from the request object
    const userId = req.user.userId;

    // Fetch profile data associated with the user
    const userProfile = await USER.findOne({ userId: userId });
    
    // Find all documents in post collection that match the conditions
    const postData = await POST.aggregate([
      {
        $match: {
          $or: [
            { userId: { $in: userProfile.connections } },
            { userId: userId }
          ]
        }
      },
      {
        $lookup: {
          from: "user_profiles", // Assuming the collection name is user_profiles
          localField: "userId",
          foreignField: "userId",
          as: "userProfileData"
        }
      },
      {
        $addFields: {
          firstName: { $arrayElemAt: ["$userProfileData.firstName", 0] },
          lastName: { $arrayElemAt: ["$userProfileData.lastName", 0] },
          profilePic: { $arrayElemAt: ["$userProfileData.profilePic", 0] },
          description: { $arrayElemAt: ["$userProfileData.description", 0] }
          // Add other fields from userProfileData as needed
        }
      },
      {
        $project: {
          userProfileData: 0 // Exclude the userProfileData array from the output
        }
      }
    ]);

    if (!postData) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json(postData);
  } catch (error) {
    console.error('Error fetching profile data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});






module.exports = router;
