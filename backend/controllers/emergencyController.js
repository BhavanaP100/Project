const Member = require('../models/Member');
const EmergencyContact = require('../models/EmergencyContact');

// Get all emergency contacts for a specific home
exports.getEmergencyContacts = async (req, res) => {
  const homeId = req.query.homeId;
  if (!homeId) {
    return res.status(400).json({ success: false, message: 'homeId is required' });
  }

  try {
    const members = await Member.find({ homeId }).sort({ memberId: 1 });
    const contacts = await EmergencyContact.find({ homeId });

    console.log(`🔍 homeId: ${homeId}`);
    console.log(`✅ Members found: ${members.length}`);
    console.log(`✅ Emergency contacts found: ${contacts.length}`);

    const contactMap = {};
    contacts.forEach(c => {
      if (c.memberId) {
        contactMap[c.memberId.toUpperCase()] = c;
      }
    });

    const combined = members.map(member => {
      const key = member.memberId?.toUpperCase();
      const contact = contactMap[key] || {};

      return {
        memberId: member.memberId,
        doctorName: contact.doctorName || '',
        hospital: contact.hospital || '',
        emergencyPhone: contact.emergencyPhone || '',
        notes: contact.notes || '',
        _id: contact._id || null
      };
    });

    res.json(combined);
  } catch (err) {
    console.error('❌ Fetch error:', err);
    res.status(500).json({ success: false, message: 'Error fetching emergency contacts' });
  }
};

// Add a new emergency contact
exports.addEmergencyContact = async (req, res) => {
  const homeId = req.body.homeId;
  if (!homeId) {
    return res.status(400).json({ success: false, message: 'homeId is required' });
  }

  try {
    const newContact = new EmergencyContact({ ...req.body, homeId });
    await newContact.save();
    res.json({ success: true, message: 'Emergency contact added successfully' });
  } catch (err) {
    console.error('❌ Add error:', err);
    res.status(500).json({ success: false, message: 'Error adding emergency contact' });
  }
};

// Update an existing emergency contact
exports.updateEmergencyContact = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Contact ID is required' });
  }

  try {
    await EmergencyContact.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, message: 'Emergency contact updated successfully' });
  } catch (err) {
    console.error('❌ Update error:', err);
    res.status(500).json({ success: false, message: 'Error updating emergency contact' });
  }
};

// Delete an emergency contact
exports.deleteEmergencyContact = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Contact ID is required' });
  }

  try {
    await EmergencyContact.findByIdAndDelete(id);
    res.json({ success: true, message: 'Emergency contact deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ success: false, message: 'Error deleting emergency contact' });
  }
};
