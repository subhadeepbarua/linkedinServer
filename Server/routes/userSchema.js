const mongoose = require('mongoose');

// Define the schema for the OTP data
const userProfileSchema = new mongoose.Schema({
  userId: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  about: String,
  description: String,
  profilePic: String,
  coverPic: String,
  country: String,
  city: String,
  eStatus: String,
  jobTitle: String,
  eType: String,
  skills: Array,
  connections:Array,
  connection_req: Array,
  connection_sent: Array,
  experience: Array,
  education: Array
});

// Create the OTP model using the schema
const USERModel = mongoose.model('user_profiles', userProfileSchema);

module.exports = USERModel;
