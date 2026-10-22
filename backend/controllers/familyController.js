const Member = require('../models/Member');
const FamilyContact = require('../models/FamilyContact');

// Get all family contacts for a specific home
exports.getFamilyContacts = async (req, res) => {
  const { homeId } = req.query;
  if (!homeId) {
    return res.status(400).json({ success: false, message: 'homeId is required' });
  }

  try {
    const members = await Member.find({ homeId }).sort({ memberId: 1 });
    const contacts = await FamilyContact.find({ homeId });

    console.log(`🔍 homeId: ${homeId}`);
    console.log(`✅ Members found: ${members.length}`);
    console.log(`✅ Family contacts found: ${contacts.length}`);

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
        memberName: contact.memberName || '',
        relation: contact.relation || '',
        phone: contact.phone || '',
        email: contact.email || '',
        contactDate: contact.contactDate || '',
        _id: contact._id || null
      };
    });

    res.json(combined);
  } catch (err) {
    console.error('❌ Fetch error:', err);
    res.status(500).json({ success: false, message: 'Error fetching family contacts' });
  }
};

// Add a new family contact
exports.addFamilyContact = async (req, res) => {
  const { homeId } = req.body;
  if (!homeId) {
    return res.status(400).json({ success: false, message: 'homeId is required' });
  }

  try {
    const newContact = new FamilyContact({ ...req.body, homeId });
    await newContact.save();
    res.json({ success: true, message: 'Family contact added successfully' });
  } catch (err) {
    console.error('❌ Add error:', err);
    res.status(500).json({ success: false, message: 'Error adding family contact' });
  }
};

// Update an existing family contact
exports.updateFamilyContact = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Contact ID is required' });
  }

  try {
    await FamilyContact.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, message: 'Family contact updated successfully' });
  } catch (err) {
    console.error('❌ Update error:', err);
    res.status(500).json({ success: false, message: 'Error updating family contact' });
  }
};

// Delete a family contact
exports.deleteFamilyContact = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Contact ID is required' });
  }

  try {
    await FamilyContact.findByIdAndDelete(id);
    res.json({ success: true, message: 'Family contact deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ success: false, message: 'Error deleting family contact' });
  }
};