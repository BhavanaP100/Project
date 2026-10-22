const Member = require('../models/Member');
const HealthRecord = require('../models/HealthRecord');

// Get all health records for a specific home
exports.getHealthRecords = async (req, res) => {
  const homeId = req.query.homeId;
  if (!homeId) {
    return res.status(400).json({ success: false, message: 'homeId is required' });
  }

  try {
    const members = await Member.find({ homeId }).sort({ memberId: 1 });
    const records = await HealthRecord.find({ homeId });

    console.log(`🔍 homeId: ${homeId}`);
    console.log(`✅ Members found: ${members.length}`);
    console.log(`✅ Health records found: ${records.length}`);

    const recordMap = {};
    records.forEach(r => {
      if (r.memberId) {
        recordMap[r.memberId.toUpperCase()] = r;
      }
    });

    const combined = members.map(member => {
      const key = member.memberId?.toUpperCase();
      const record = recordMap[key] || {};

      return {
        memberId: member.memberId,
        age: record.age || '',
        weight: record.weight || '',
        bloodGroup: record.bloodGroup || '',
        bp: record.bp || '',
        bpReport: record.bpReport || '',
        sugar: record.sugar || '',
        sugarReport: record.sugarReport || '',
        healthIssues: record.healthIssues || '',
        treatment: record.treatment || '',
        _id: record._id || null
      };
    });

    res.json(combined);
  } catch (err) {
    console.error('❌ Fetch error:', err);
    res.status(500).json({ success: false, message: 'Error fetching health records' });
  }
};

// Add a new health record
exports.addHealthRecord = async (req, res) => {
  const homeId = req.body.homeId;
  if (!homeId) {
    return res.status(400).json({ success: false, message: 'homeId is required' });
  }

  try {
    if (req.files?.bpReport?.[0]) {
      req.body.bpReport = `/uploads/${req.files.bpReport[0].filename}`;
    }
    if (req.files?.sugarReport?.[0]) {
      req.body.sugarReport = `/uploads/${req.files.sugarReport[0].filename}`;
    }

    const newRecord = new HealthRecord({ ...req.body, homeId });
    await newRecord.save();
    res.json({ success: true, message: 'Health record added successfully' });
  } catch (err) {
    console.error('❌ Add error:', err);
    res.status(500).json({ success: false, message: 'Error adding health record' });
  }
};


// Update an existing health record with optional file uploads
exports.updateHealthRecord = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Record ID is required' });
  }

  try {
    if (req.files?.bpReport?.[0]) {
      req.body.bpReport = `/uploads/${req.files.bpReport[0].filename}`;
    }
    if (req.files?.sugarReport?.[0]) {
      req.body.sugarReport = `/uploads/${req.files.sugarReport[0].filename}`;
    }

    await HealthRecord.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, message: 'Health record updated successfully' });
  } catch (err) {
    console.error('❌ Update error:', err);
    res.status(500).json({ success: false, message: 'Error updating health record' });
  }
};

// Delete a health record
exports.deleteHealthRecord = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Record ID is required' });
  }

  try {
    await HealthRecord.findByIdAndDelete(id);
    res.json({ success: true, message: 'Health record deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ success: false, message: 'Error deleting health record' });
  }
};
