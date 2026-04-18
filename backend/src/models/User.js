const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  initialSavings: {
    type: Number,
    default: 0,
  },
  setupComplete: {
    type: Boolean,
    default: false,
  },
  magicLinkToken: {
    type: String,
    default: null,
  },
  magicLinkExpiry: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
