const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Connection URL to MongoDB
const url = 'mongodb+srv://LinkedInUserDB:K4VksmR4kicVHpzB@userdatabase.pbyxc6b.mongodb.net/LinkedIn';
const dbName = 'LinkedIn';
const secretKey = 'ab543327'; // Change this to a secure random string

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Connect to MongoDB 
    const client = await MongoClient.connect(url);

    // Find the user in the  user_profiles collection using the provided email
    const user = await client.db(dbName).collection('user_profiles').findOne({ email });
    
    if (user) {
      // Get the stored password from the user_profiles collection
      const storedPassword = user.password;
      
      const passwordMatch = await bcrypt.compare(password, storedPassword);
      if (passwordMatch) {
        // Successful login
        const token = jwt.sign({ userId: user.userId }, secretKey, { expiresIn: '3h' }); // Generate JWT token
        res.status(200).json({ message: 'Login successful', token }); // Send token to client
      } else {
        // Incorrect password
        res.status(401).json({ message: 'Incorrect password' });
      }
    } else {
      // User not found in user_profiles collection
      res.status(404).json({ message: 'User not found' });
    }

    // Close the MongoDB connection
    client.close();
  } catch (error) {
    // Handle error, e.g., log the error and send a generic error message
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
