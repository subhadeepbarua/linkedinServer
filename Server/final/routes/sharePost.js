const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Post = require("./timelineSchema");
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

  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const newPost = new Post({
      userId: UserId,
      caption: req.body.caption,
      media_url: result.secure_url,
    });
    await newPost.save();
    // Send the Cloudinary URL as response
    res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    // If an error occurred, send an error response
    console.error("Error uploading image:", error);
    res.status(500).send("Failed to upload image.");
  }
});

module.exports = router;
