const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { auth, requireRole } = require('../middleware/auth');

// POST /api/questions  (student asks)
router.post('/', auth, requireRole('student'), async (req, res) => {
  try {
    const { tutorId, courseId, message } = req.body;
    const q = new Question({ studentId: req.user._id, tutorId, courseId, message });
    await q.save();
    res.json(q);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// GET /api/questions/:courseId
router.get('/:courseId', auth, async (req, res) => {
  try {
    const questions = await Question.find({ courseId: req.params.courseId });
    res.json(questions);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
