const mongoose = require('mongoose');

// Define the schema for the OTP data
const postSchema = new mongoose.Schema({
    userId:{
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: null,
    },
    time: {
      type: Date,
      default: Date.now,
    },
    media_url: {
      type: String,
      default: null,
    },

    reactions: [
      {
        userId: { type: String },
        reaction: { type: Number },
      }
    ],
    comments: [ {
      userId: { type: String },
      text: { type: String },
      timeStamp: {type: Date, default: Date.now}
    }]
  });

// Create the OTP model using the schema
const POSTModel = mongoose.model('post_informations', postSchema);

module.exports = POSTModel;
