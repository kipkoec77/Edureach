const express = require('express');
const router = express.Router();
const TutorApplication = require('../models/TutorApplication');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

// POST /api/tutors/apply
router.post('/apply', auth, async (req, res) => {
  try {
    const { subjects, experience, idNumber, certificateURL } = req.body;
    const existing = await TutorApplication.findOne({ userId: req.user._id });
    if (existing) return res.status(400).json({ msg: 'Application already submitted' });
    const app = new TutorApplication({ userId: req.user._id, subjects, experience, idNumber, certificateURL });
    await app.save();
    res.json(app);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// GET /api/admin/tutors/pending
router.get('/pending', auth, requireRole('admin'), async (req, res) => {
  try {
    const pending = await TutorApplication.find({ status: 'pending' }).populate('userId', 'name email');
    res.json(pending);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// PATCH /api/admin/tutors/approve/:id
router.patch('/approve/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const app = await TutorApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ msg: 'Application not found' });
    app.status = req.body.status || 'approved';
    await app.save();
    if (app.status === 'approved') {
      await User.findByIdAndUpdate(app.userId, { role: 'tutor', approvedTutor: true });
    }
    res.json(app);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
