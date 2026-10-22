const Member = require('../models/Member');
const Caregiver = require('../models/Caregiver');
const Reminder = require('../models/Reminder');

// Get all members for a specific home
exports.getMembers = async (req, res) => {
  const { homeId } = req.query;
  if (!homeId) {
    return res.status(400).json({ success: false, message: 'homeId is required' });
  }

  try {
    const members = await Member.find({ homeId });
    res.json(members);
  } catch (err) {
    console.error('Get members error:', err);
    res.status(500).json({ success: false, message: 'Error fetching members' });
  }
};

// Add a new member
exports.addMember = async (req, res) => {
  try {
    const {
      homeId,
      name,
      dob,
      age,
      gender,
      phone,
      email
    } = req.body || {};

    console.log('Received homeId:', homeId);

    if (!homeId || !name || !dob || !age || !gender || !phone || !email) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const count = await Member.countDocuments({ homeId });
    const memberId = `M-${(count + 1).toString().padStart(3, '0')}`;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newMember = new Member({
      homeId,
      memberId,
      name,
      dob,
      age,
      gender,
      phone,
      email,
      photoUrl
    });

    await newMember.save();
    res.json({ success: true, message: 'Member added successfully' });
  } catch (err) {
    console.error('Add member error:', err);
    res.status(500).json({ success: false, message: err.message || 'Error adding member' });
  }
};

// Update an existing member (flexible: only homeId required)
exports.updateMember = async (req, res) => {
  try {
    const {
      homeId,
      memberId,
      name,
      dob,
      age,
      gender,
      phone,
      email
    } = req.body || {};

    if (!homeId) {
      return res.status(400).json({ success: false, message: 'homeId is required' });
    }

    const updateData = {};
    ['memberId', 'name', 'dob', 'age', 'gender', 'phone', 'email'].forEach(field => {
      if (req.body[field]) updateData[field] = req.body[field];
    });

    if (req.file) {
      updateData.photoUrl = `/uploads/${req.file.filename}`;
    }

    updateData.homeId = homeId;

    await Member.findByIdAndUpdate(req.params.id, updateData);
    res.json({ success: true, message: 'Member updated successfully' });
  } catch (err) {
    console.error('Update member error:', err);
    res.status(500).json({ success: false, message: err.message || 'Error updating member' });
  }
};

// Delete a member
exports.deleteMember = async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Member deleted successfully' });
  } catch (err) {
    console.error('Delete member error:', err);
    res.status(500).json({ success: false, message: 'Error deleting member' });
  }
};

// Dashboard summary for a specific home
exports.getDashboardSummary = async (req, res) => {
  const { homeId } = req.query;
  if (!homeId) {
    return res.status(400).json({ success: false, message: 'homeId is required' });
  }

  try {
    const memberCount = await Member.countDocuments({ homeId });
    const caregiverCount = await Caregiver.countDocuments({ homeId });
    const upcomingReminders = await Reminder.find({ homeId }).sort({ date: 1 }).limit(3);

    res.json({
      success: true,
      memberCount,
      caregiverCount,
      upcomingReminders
    });
  } catch (err) {
    console.error('Dashboard summary error:', err);
    res.status(500).json({ success: false, message: err.message || 'Error fetching dashboard summary' });
  }
};
