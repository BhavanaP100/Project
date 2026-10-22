const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
  memberId: {
    type: String,
    required: true
  },
  doctorName: {
    type: String,
    default: ''
  },
  hospital: {
    type: String,
    default: ''
  },
  emergencyPhone: {
    type: String,
    default: ''
  },
  notes: {
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

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
