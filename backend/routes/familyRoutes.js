const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const familyController = require('../controllers/familyController');

// Multer setup (reserved for future use if you add file uploads like profile pictures or documents)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage: storage });

// GET all family contacts for a specific home
router.get('/', familyController.getFamilyContacts);

// POST a new family contact (with optional file uploads)
router.post(
  '/',
  upload.none(), // placeholder for future fields like { name: 'contactFile', maxCount: 1 }
  familyController.addFamilyContact
);

// PUT update an existing family contact (with optional file uploads)
router.put(
  '/:id',
  upload.none(), // placeholder for future fields
  familyController.updateFamilyContact
);

// DELETE a family contact
router.delete('/:id', familyController.deleteFamilyContact);

module.exports = router;