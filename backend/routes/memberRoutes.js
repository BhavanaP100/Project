const express = require('express');
const router = express.Router();
const multer = require('multer');
const memberController = require('../controllers/memberController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.get('/', memberController.getMembers);
router.post('/', upload.single('photo'), memberController.addMember);
router.put('/:id', upload.single('photo'), memberController.updateMember);
router.delete('/:id', memberController.deleteMember);
router.get('/dashboard-summary', memberController.getDashboardSummary);

module.exports = router;
