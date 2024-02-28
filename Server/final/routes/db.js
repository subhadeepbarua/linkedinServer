// db.js

const mongoose = require('mongoose');

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://LinkedInUserDB:K4VksmR4kicVHpzB@userdatabase.pbyxc6b.mongodb.net/LinkedIn?retryWrites=true&w=majority').then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

module.exports = mongoose.connection;
