const Caregiver = require('../models/Caregiver');

// Get all caregivers for a specific home
exports.getCaregivers = async (req, res) => {
  const { homeId } = req.query;
  if (!homeId) {
    return res.status(400).json({ success: false, message: 'homeId is required' });
  }

  try {
    const caregivers = await Caregiver.find({ homeId });
    res.json(caregivers);
  } catch (err) {
    console.error('❌ Fetch error:', err);
    res.status(500).json({ success: false, message: 'Error fetching caregivers' });
  }
};

// Add a new caregiver
exports.addCaregiver = async (req, res) => {
  try {
    const { homeId } = req.body;
    if (!homeId) {
      return res.status(400).json({ success: false, message: 'homeId is required' });
    }

    // Handle photo upload
    if (req.file) {
      req.body.photoUrl = `/uploads/${req.file.filename}`;
    } else if (req.files?.photo?.[0]) {
      req.body.photoUrl = `/uploads/${req.files.photo[0].filename}`;
    }

    // Convert assignedMembers to array
    if (typeof req.body.assignedMembers === 'string') {
      req.body.assignedMembers = req.body.assignedMembers.split(',').map(id => id.trim());
    }

    // Generate unique caregiverId (auto-increment like CG-001, CG-002, ...)
    const lastCaregiver = await Caregiver.findOne({ homeId })
      .sort({ caregiverId: -1 }) // Sort descending by ID
      .select('caregiverId');

    let newNumber = 1;
    if (lastCaregiver && lastCaregiver.caregiverId) {
      // Extract numeric part safely
      const match = lastCaregiver.caregiverId.match(/CG-(\d+)/);
      if (match) {
        const lastNumber = parseInt(match[1]);
        newNumber = lastNumber + 1;
      }
    }

    // Assign new unique ID
    req.body.caregiverId = `CG-${newNumber.toString().padStart(3, '0')}`;

    // Create new caregiver
    const newCaregiver = new Caregiver(req.body);
    await newCaregiver.save();

    console.log(`✅ Caregiver added: ${req.body.caregiverId}`);
    res.json({ success: true, message: 'Caregiver added successfully' });
  } catch (err) {
    console.error('❌ Add error:', err);

    // Handle duplicate key error more gracefully
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Duplicate caregiver ID detected. Please try again.`,
      });
    }

    res.status(500).json({ success: false, message: 'Error adding caregiver' });
  }
};

// Update an existing caregiver
exports.updateCaregiver = async (req, res) => {
  try {
    const { homeId } = req.body;
    if (!homeId) {
      return res.status(400).json({ success: false, message: 'homeId is required' });
    }

    // Handle photo upload
    if (req.file) {
      req.body.photoUrl = `/uploads/${req.file.filename}`;
    } else if (req.files?.photo?.[0]) {
      req.body.photoUrl = `/uploads/${req.files.photo[0].filename}`;
    }

    // Convert assignedMembers to array
    if (typeof req.body.assignedMembers === 'string') {
      req.body.assignedMembers = req.body.assignedMembers.split(',').map(id => id.trim());
    }

    await Caregiver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Caregiver updated successfully' });
  } catch (err) {
    console.error('❌ Update error:', err);
    res.status(500).json({ success: false, message: 'Error updating caregiver' });
  }
};

// Delete a caregiver
exports.deleteCaregiver = async (req, res) => {
  try {
    await Caregiver.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Caregiver deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ success: false, message: 'Error deleting caregiver' });
  }
};
