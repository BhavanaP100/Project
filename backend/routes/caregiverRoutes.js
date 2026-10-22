const express = require('express');
const router = express.Router();
const caregiverController = require('../controllers/caregiverController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
  }
});

// Get all caregivers for a specific home
router.get('/', caregiverController.getCaregivers);

// Add a new caregiver (with optional photo)
router.post('/', upload.fields([{ name: 'photo', maxCount: 1 }]), caregiverController.addCaregiver);

// Update an existing caregiver (with optional photo)
router.put('/:id', upload.fields([{ name: 'photo', maxCount: 1 }]), caregiverController.updateCaregiver);

// Delete a caregiver
router.delete('/:id', caregiverController.deleteCaregiver);

module.exports = router;
