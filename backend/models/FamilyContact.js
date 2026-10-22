const mongoose = require('mongoose');

const familyContactSchema = new mongoose.Schema({
  memberId: {
    type: String,
    required: true
  },
  memberName: {
    type: String,
    default: ''
  },
  relation: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  contactDate: {
    type: Date,
    default: null
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

module.exports = mongoose.model('FamilyContact', familyContactSchema);