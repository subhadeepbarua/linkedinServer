const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userProfiles = require("./userSchema");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization token not provided" });
  }

  try {
    const decoded = jwt.verify(token, "ab543327"); // Replace 'your_secret_key' with your actual secret key
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

router.get("/", verifyToken, async (req, res) => {
  const UserId = req.user.userId;

  try {
    const userDetails = await userProfiles.findOne({ userId: UserId });
    const yourConnections = await userProfiles.find({userId: userDetails.connections })
    const reqSent = await userProfiles.find({userId: userDetails.connection_sent})
    const reqRecived = await  userProfiles.find({userId: userDetails.connection_req})

    const exceptionUserIds = [ UserId,...userDetails.connections, ...userDetails.connection_sent, ...userDetails.connection_req];

    const peopleYouMayKnow = await userProfiles.find({userId: {$nin:exceptionUserIds}})
    return res.status(200).json({yourConnections,reqRecived,reqSent,peopleYouMayKnow});
    //return res.status(200).json({reqRecived,reqSent});
  } catch (error) {
    console.error("Error adding connection:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
