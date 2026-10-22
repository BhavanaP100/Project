const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  memberId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  reminderDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled'],
    default: 'Pending'
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

module.exports = mongoose.model('Reminder', reminderSchema);