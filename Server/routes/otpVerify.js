const express = require('express');
const router = express.Router();
const OTPModel = require('./otpSchema')

router.post('/', async (req, res) => {

  const { email, otp } = req.body;

  try {
    // Retrieve the stored OTP from MongoDB for the given email
    const otpDocument = await OTPModel.findOne({ email });

    if (!otpDocument) {
      return res.status(400).send('OTP not found for the provided email');
    }


    const isOTPValid = otp == otpDocument.otp;

    if (isOTPValid) {
      res.status(200).send('OTP verified successfully');
    } else {
      res.status(400).send('Invalid OTP');
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;