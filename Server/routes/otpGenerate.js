const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const crypto = require('crypto');
const db = require('./db'); 
const OTPModel = require('./otpSchema')


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'avijitsarkarofficial39@gmail.com',
    pass: 'ifrv xeaq reyb dcgt',
  },
});

const generateRandomOTP = () => {
    const otp = crypto.randomInt(1000, 10000);
    console.log("your otp is", otp)
    return otp.toString();

  };
  
router.post('/', async (req, res) => {
    const { email, firstName } = req.body;
  
    // Check if the email already exists in the collection
    const existingOTPDocument = await OTPModel.findOne({ email });
  
    if (existingOTPDocument) {
      // If the email exists, update the existing document with a new OTP
      const newOTP = generateRandomOTP();
      existingOTPDocument.otp = newOTP;
      await existingOTPDocument.save();
  
      const mailOptions = {
        from: 'your_email@gmail.com',
        to: email,
        subject: `aloha ${firstName}`,
        text: `Your updated OTP for verification is: ${newOTP}`,
      };
  
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
      });
    } else {
      // If the email doesn't exist, create a new document with a new OTP
      const otp = generateRandomOTP();
      const otpDocument = new OTPModel({ email, otp });
      await otpDocument.save();
  
      const mailOptions = {
        from: 'your_email@gmail.com',
        to: email,
        subject: `aloha ${firstName}`,
        text: `Your OTP for verification is: ${otp}`,
      };
  
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
      });
    }
});

module.exports = router;