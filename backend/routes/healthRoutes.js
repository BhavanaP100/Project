const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const healthController = require('../controllers/healthController');

// Multer setup for BP/Sugar report uploads
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

// GET all health records for a specific home
router.get('/', healthController.getHealthRecords);

// POST a new health record (with optional file uploads)
router.post(
  '/',
  upload.fields([
    { name: 'bpReport', maxCount: 1 },
    { name: 'sugarReport', maxCount: 1 }
  ]),
  healthController.addHealthRecord
);

// PUT update an existing health record (with optional file uploads)
router.put(
  '/:id',
  upload.fields([
    { name: 'bpReport', maxCount: 1 },
    { name: 'sugarReport', maxCount: 1 }
  ]),
  healthController.updateHealthRecord
);

// DELETE a health record
router.delete('/:id', healthController.deleteHealthRecord);

module.exports = router;
