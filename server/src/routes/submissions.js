const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const Course = require('../models/Course');
const Submission = require('../models/Submission');
const { auth } = require('../middleware/auth');

// multer storage for submissions
const submissionsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/submissions'))
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
});
const uploadSubmission = multer({ storage: submissionsStorage });

// POST /api/submissions/:courseId/:assignmentId  (student submit)
// Enforce one submission per student per assignment. If previous submission exists and is graded -> reject.
// If previous exists and ungraded -> archive previous (set archived=true, archivedAt) and create a fresh submission.
router.post('/:courseId/:assignmentId', auth, uploadSubmission.single('file'), async (req, res) => {
  try{
    const sessionUserId = req.user._id.toString();

    const { courseId, assignmentId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // student must be enrolled
    const isEnrolled = (course.students || []).some(s => s.studentId === sessionUserId);
    if (!isEnrolled) return res.status(403).json({ msg: 'Forbidden: not enrolled' });

    const file = req.file;
    if (!file) return res.status(400).json({ msg: 'Missing file' });

    // find previous submission (most recent non-archived)
    const existing = await Submission.findOne({ courseId, assignmentId, studentId: sessionUserId, archived: { $ne: true } }).sort({ submittedAt: -1 });
    if (existing && existing.grade !== undefined && existing.grade !== null) {
      // already graded — lock submissions
      return res.status(403).json({ msg: 'Submission locked: assignment already graded', locked: true });
    }

    let previousId = null;
    if (existing) {
      // archive existing instead of deleting
      existing.archived = true;
      existing.archivedAt = new Date();
      await existing.save();
      previousId = existing._id;
    }

    const sub = new Submission({
      courseId,
      assignmentId,
      studentId: sessionUserId,
      originalName: file.originalname,
      filename: file.filename,
      url: `/uploads/submissions/${file.filename}`,
      previousSubmissionId: previousId || undefined,
    });
    await sub.save();
    res.json({ success: true, submission: sub, updated: !!previousId });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/submissions/:courseId/:assignmentId  (tutor lists all non-archived submissions)
router.get('/:courseId/:assignmentId', auth, async (req, res) => {
  try{
    const sessionUserId = req.user._id.toString();

    const { courseId, assignmentId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    if (course.createdBy !== sessionUserId) return res.status(403).json({ msg: 'Forbidden' });

    const subs = await Submission.find({ courseId, assignmentId, archived: { $ne: true } }).sort({ submittedAt: -1 });
    res.json({ success: true, submissions: subs });
  } catch (err){ console.error(err); res.status(500).json({ msg: 'Server error' }); }
});

// GET /api/submissions/:courseId/:assignmentId/me  (student's latest non-archived submission)
router.get('/:courseId/:assignmentId/me', auth, async (req, res) => {
  try{
    const sessionUserId = req.user._id.toString();
    const { courseId, assignmentId } = req.params;
    const sub = await Submission.findOne({ courseId, assignmentId, studentId: sessionUserId, archived: { $ne: true } }).sort({ submittedAt: -1 });
    res.json({ success: true, submission: sub });
  } catch (err){ console.error(err); res.status(500).json({ msg: 'Server error' }); }
});

// PATCH /api/submissions/:submissionId/grade  (tutor grades feedback) — grading locks further submissions by student
router.patch('/:submissionId/grade', auth, async (req, res) => {
  try{
    const sessionUserId = req.user._id.toString();
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;
    const sub = await Submission.findById(submissionId);
    if (!sub) return res.status(404).json({ msg: 'Submission not found' });
    const course = await Course.findById(sub.courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    if (course.createdBy !== sessionUserId) return res.status(403).json({ msg: 'Forbidden' });

    if (grade !== undefined) sub.grade = grade;
    if (feedback !== undefined) sub.feedback = feedback;
    sub.gradedBy = sessionUserId;
    sub.gradedAt = new Date();
    await sub.save();
    res.json({ success: true, submission: sub });
  } catch (err){ console.error(err); res.status(500).json({ msg: 'Server error' }); }
});

module.exports = router;
