const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Submission = require('../models/Submission');
const AttendanceRecord = require('../models/AttendanceRecord');
const { auth } = require('../middleware/auth');

// GET /api/student/courses - Get all courses student is enrolled in
router.get('/courses', auth, async (req, res) => {
  try{
    const courses = await Course.find({ 'students.studentId': req.user._id.toString() }).sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/student/assignments - Get all assignments from enrolled courses
router.get('/assignments', auth, async (req, res) => {
  try{
    const courses = await Course.find({ 'students.studentId': req.user._id.toString() });
    const assignments = [];
    
    for (const course of courses) {
      for (const assignment of (course.assignments || [])) {
        // Check if student has submitted
        const submission = await Submission.findOne({
          courseId: course._id,
          assignmentId: assignment._id,
          studentId: req.user._id.toString(),
          archived: { $ne: true }
        });

        assignments.push({
          ...assignment.toObject(),
          courseId: course._id,
          courseTitle: course.title,
          submitted: !!submission,
          submissionId: submission?._id,
          grade: submission?.grade,
          feedback: submission?.feedback
        });
      }
    }

    // Sort by due date (upcoming first)
    assignments.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    res.json({ success: true, assignments });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/student/notes - Get all notes from enrolled courses
router.get('/notes', auth, async (req, res) => {
  try{
    const courses = await Course.find({ 'students.studentId': req.user._id.toString() });
    const notes = [];
    
    for (const course of courses) {
      for (const note of (course.notes || [])) {
        notes.push({
          ...note.toObject(),
          courseId: course._id,
          courseTitle: course.title
        });
      }
    }

    // Sort by upload date (newest first)
    notes.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    res.json({ success: true, notes });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/student/attendance - Get attendance records for student
router.get('/attendance', auth, async (req, res) => {
  try{
    const courses = await Course.find({ 'students.studentId': req.user._id.toString() });
    const courseIds = courses.map(c => c._id);

    const records = await AttendanceRecord.find({ courseId: { $in: courseIds } }).sort({ date: -1 });
    
    const attendanceData = records.map(record => {
      const course = courses.find(c => c._id.toString() === record.courseId.toString());
      return {
        ...record.toObject(),
        courseTitle: course?.title || 'Unknown Course',
        wasPresent: record.presentStudents.includes(req.user._id.toString()),
        totalPresent: record.presentStudents.length
      };
    });

    res.json({ success: true, attendance: attendanceData });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/student/progress - Calculate student progress across courses
router.get('/progress', auth, async (req, res) => {
  try{
    const courses = await Course.find({ 'students.studentId': req.user._id.toString() });
    const progressData = [];

    for (const course of courses) {
      const totalAssignments = (course.assignments || []).length;
      
      if (totalAssignments === 0) {
        progressData.push({
          courseId: course._id,
          courseTitle: course.title,
          progress: 0,
          submitted: 0,
          total: 0
        });
        continue;
      }

      let submittedCount = 0;
      for (const assignment of course.assignments) {
        const submission = await Submission.findOne({
          courseId: course._id,
          assignmentId: assignment._id,
          studentId: req.user._id.toString(),
          archived: { $ne: true }
        });
        if (submission) submittedCount++;
      }

      const progress = Math.round((submittedCount / totalAssignments) * 100);
      
      progressData.push({
        courseId: course._id,
        courseTitle: course.title,
        progress,
        submitted: submittedCount,
        total: totalAssignments
      });
    }

    res.json({ success: true, progress: progressData });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
