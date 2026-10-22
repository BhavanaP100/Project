const mongoose = require('mongoose');

const caregiverSchema = new mongoose.Schema({
  caregiverId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  shift_time: {
    type: String,
    required: true
  },
  shift_hour: {
    type: String,
    required: true
  },
  assignedMembers: {
    type: [String],
    default: []
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

module.exports = mongoose.model('Caregiver', caregiverSchema);
