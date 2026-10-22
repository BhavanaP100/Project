const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  memberId: {
    type: String,
    required: true // ✅ uniqueness removed
  },
  name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  phone: {
    type: String,
    required: true
    // match: /^[6-9]\d{9}$/ // Optional: uncomment for Indian mobile format
  },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  photoUrl: {
    type: String,
    default: ''
  },
  homeId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Member', memberSchema);
