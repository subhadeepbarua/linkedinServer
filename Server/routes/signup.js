const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const USERModel = require('./userSchema'); // Importing the userProfileSchema

router.use(bodyParser.json());
router.use(cors());

// API endpoint to save user data
router.post('/', async (req, res) => {
    try {
        let userData = req.body;
        const { password } = userData;

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10); // Using bcrypt to hash the password

        // Replace the plain text password with the hashed password
        userData.password = hashedPassword;

        // Set default values for empty fields
        userData = {
            ...userData,
            about: userData.about || '',
            description: userData.description || '',
            profilePic: userData.profilePic || '',
            coverPic: userData.coverPic || '',
            skills: userData.skills || ''
        };

        // Insert user data into the user_profiles collection
        await USERModel.create(userData);

        res.status(200).json({ message: 'User data saved successfully!' });
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
