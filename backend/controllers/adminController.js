const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Register new admin
exports.registerAdmin = async (req, res) => {
  const { homeId, name, email, password } = req.body;

  if (!homeId || !name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ homeId, name, email, password: hashedPassword });

    await newAdmin.save();
    res.json({ success: true, message: 'Admin registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// Login admin
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // ✅ Patch: support both homeId and homeAd
    const homeId = admin.homeId || admin.homeAd;
    if (!homeId) {
      return res.status(500).json({ success: false, message: 'Admin homeId not found' });
    }

    res.json({ success: true, homeId });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};
