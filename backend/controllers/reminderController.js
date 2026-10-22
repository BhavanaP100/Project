const Member = require('../models/Member');
const Reminder = require('../models/Reminder');

// Get all reminders for a specific home
exports.getReminders = async (req, res) => {
  const { homeId } = req.query;
  if (!homeId) {
    return res.status(400).json({ success: false, message: 'homeId is required' });
  }

  try {
    const members = await Member.find({ homeId }).sort({ memberId: 1 });
    const reminders = await Reminder.find({ homeId });

    console.log(`🔍 homeId: ${homeId}`);
    console.log(`✅ Members found: ${members.length}`);
    console.log(`✅ Reminders found: ${reminders.length}`);

    const reminderMap = {};
    reminders.forEach(r => {
      if (r.memberId) {
        reminderMap[r.memberId.toUpperCase()] = r;
      }
    });

    const combined = members.map(member => {
      const key = member.memberId?.toUpperCase();
      const reminder = reminderMap[key] || {};

      return {
        memberId: member.memberId,
        title: reminder.title || '',
        description: reminder.description || '',
        reminderDate: reminder.reminderDate || '',
        status: reminder.status || 'Pending',
        _id: reminder._id || null
      };
    });

    res.json(combined);
  } catch (err) {
    console.error('❌ Fetch error:', err);
    res.status(500).json({ success: false, message: 'Error fetching reminders' });
  }
};

// Add a new reminder
exports.addReminder = async (req, res) => {
  const { homeId } = req.body;
  if (!homeId) {
    return res.status(400).json({ success: false, message: 'homeId is required' });
  }

  try {
    const newReminder = new Reminder({ ...req.body, homeId });
    await newReminder.save();
    res.json({ success: true, message: 'Reminder added successfully' });
  } catch (err) {
    console.error('❌ Add error:', err);
    res.status(500).json({ success: false, message: 'Error adding reminder' });
  }
};

// Update an existing reminder
exports.updateReminder = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Reminder ID is required' });
  }

  try {
    await Reminder.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, message: 'Reminder updated successfully' });
  } catch (err) {
    console.error('❌ Update error:', err);
    res.status(500).json({ success: false, message: 'Error updating reminder' });
  }
};

// Delete a reminder
exports.deleteReminder = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Reminder ID is required' });
  }

  try {
    await Reminder.findByIdAndDelete(id);
    res.json({ success: true, message: 'Reminder deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ success: false, message: 'Error deleting reminder' });
  }
};