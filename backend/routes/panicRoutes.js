const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');

const statusFile = path.join(__dirname, '../panicStatus.json');

// POST /api/panic → ESP32 sends panic signal
router.post('/', (req, res) => {
  const panicData = { panic: true, message: req.body.message || "Panic triggered!" };
  fs.writeFileSync(statusFile, JSON.stringify(panicData));
  console.log('🚨 Panic signal received!', panicData);
  res.sendStatus(200);
});

// GET /api/panic/status → frontend checks panic state
router.get('/status', (req, res) => {
  const data = fs.readFileSync(statusFile);
  const status = JSON.parse(data);
  res.json(status);
});

// POST /api/panic/reset → optional manual reset
router.post('/reset', (req, res) => {
  const resetData = { panic: false, message: "" };
  fs.writeFileSync(statusFile, JSON.stringify(resetData));
  console.log('✅ Panic status reset.');
  res.sendStatus(200);
});

module.exports = router;
