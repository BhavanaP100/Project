const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  memberId: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    default: null
  },
  weight: {
    type: Number,
    default: null
  },
  bloodGroup: {
    type: String,
    default: ''
  },
  bp: {
    type: String,
    default: ''
  },
  bpReport: {
    type: String,
    default: ''
  },
  sugar: {
    type: String,
    default: ''
  },
  sugarReport: {
    type: String,
    default: ''
  },
  healthIssues: {
    type: String,
    default: ''
  },
  treatment: {
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

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
