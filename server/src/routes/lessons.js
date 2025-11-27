const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const { auth, requireRole } = require('../middleware/auth');

// POST /api/lessons (tutor uploads a lesson to a course)
router.post('/', auth, requireRole('tutor'), async (req, res) => {
  try {
    const { courseId, title, videoURL, pdfURL } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    if (!course.tutorId.equals(req.user._id)) return res.status(403).json({ msg: 'Not your course' });
    const lesson = new Lesson({ courseId, title, videoURL, pdfURL });
    await lesson.save();
    res.json(lesson);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// GET /api/lessons/:courseId
router.get('/:courseId', async (req, res) => {
  try {
    const lessons = await Lesson.find({ courseId: req.params.courseId });
    res.json(lessons);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
