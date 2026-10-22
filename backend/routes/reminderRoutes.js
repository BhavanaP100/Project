const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const reminderController = require('../controllers/reminderController');

// Multer setup (reserved for future use if you add file uploads to reminders)
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

// GET all reminders for a specific home
router.get('/', reminderController.getReminders);

// POST a new reminder (with optional file uploads)
router.post(
  '/',
  upload.none(), // placeholder for future fields like { name: 'reminderFile', maxCount: 1 }
  reminderController.addReminder
);

// PUT update an existing reminder (with optional file uploads)
router.put(
  '/:id',
  upload.none(), // placeholder for future fields
  reminderController.updateReminder
);

// DELETE a reminder
router.delete('/:id', reminderController.deleteReminder);

module.exports = router;