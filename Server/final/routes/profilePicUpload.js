const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UserProfile = require("./userSchema");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: "dfzlrypkl",
  api_key: "273539591639949",
  api_secret: "56vLUH98Hur_x0_qVWTfbMUP6rk",
});
const upload = multer({ dest: "uploads/" });

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization token not provided" });
  }

  try {
    const decoded = jwt.verify(token, "ab543327");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  const UserId = req.user.userId;
  const ImageType = req.body.imageType;

  console.log(UserId)
  console.log(ImageType)
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    let userProfile = await UserProfile.findOne({ userId: UserId });
    console.log(userProfile)
    userProfile[ImageType] = result.secure_url;
    // Save the new post to the database
    await userProfile.save();
    // Send the Cloudinary URL as response
    res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    // If an error occurred, send an error response
    console.error("Error uploading image:", error);
    res.status(500).send("Failed to upload image.");
  }
});

module.exports = router;
