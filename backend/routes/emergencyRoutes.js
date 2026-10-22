const express = require('express');
const router = express.Router();
const multer = require('multer');
const emergencyController = require('../controllers/emergencyController');

// Multer setup for parsing FormData (no file uploads)
const upload = multer();

// GET all emergency contacts for a specific home
router.get('/', emergencyController.getEmergencyContacts);

// POST a new emergency contact
router.post('/', upload.none(), emergencyController.addEmergencyContact);

// PUT update an existing emergency contact
router.put('/:id', upload.none(), emergencyController.updateEmergencyContact);

// DELETE an emergency contact
router.delete('/:id', emergencyController.deleteEmergencyContact);

module.exports = router;
