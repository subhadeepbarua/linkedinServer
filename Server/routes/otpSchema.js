const mongoose = require('mongoose');

// Define the schema for the OTP data
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true // Ensure each email has a unique OTP document
  },
  otp: {
    type: String,
    required: true
  }
});

// Create the OTP model using the schema
const OTPModel = mongoose.model('temotps', otpSchema);

module.exports = OTPModel;
