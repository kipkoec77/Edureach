const express = require('express');
const router = express.Router();
const AttendanceRecord = require('../models/AttendanceRecord');
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');

// POST /api/attendance/create/:courseId - Tutor creates attendance session
router.post('/create/:courseId', auth, async (req, res) => {
  try{
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    if (course.createdBy !== req.user._id.toString()) return res.status(403).json({ msg: 'Only course tutor can create attendance' });

    const totalEnrolled = (course.students || []).length;
    
    const attendance = new AttendanceRecord({
      courseId,
      tutorId: req.user._id.toString(),
      totalEnrolled,
      presentStudents: [],
      status: 'open'
    });
    
    await attendance.save();
    res.json({ success: true, attendance });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/attendance/mark/:attendanceId - Student marks themselves present
router.post('/mark/:attendanceId', auth, async (req, res) => {
  try{
    const { attendanceId } = req.params;
    const attendance = await AttendanceRecord.findById(attendanceId);
    if (!attendance) return res.status(404).json({ msg: 'Attendance session not found' });
    if (attendance.status === 'closed') return res.status(400).json({ msg: 'Attendance session is closed' });

    // Check if student is enrolled
    const course = await Course.findById(attendance.courseId);
    const isEnrolled = (course.students || []).some(s => s.studentId === req.user._id.toString());
    if (!isEnrolled) return res.status(403).json({ msg: 'You are not enrolled in this course' });

    // Check if already marked
    if (attendance.presentStudents.includes(req.user._id.toString())) {
      return res.json({ success: true, msg: 'Already marked present', attendance });
    }

    attendance.presentStudents.push(req.user._id.toString());
    await attendance.save();
    res.json({ success: true, attendance });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/attendance/course/:courseId - Get all attendance records for a course
router.get('/course/:courseId', auth, async (req, res) => {
  try{
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    const isTutor = course.createdBy === req.user._id.toString();
    const isEnrolled = (course.students || []).some(s => s.studentId === req.user._id.toString());
    if (!isTutor && !isEnrolled) return res.status(403).json({ msg: 'Forbidden' });

    const records = await AttendanceRecord.find({ courseId }).sort({ date: -1 });
    res.json({ success: true, records });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PATCH /api/attendance/close/:attendanceId - Tutor closes attendance session
router.patch('/close/:attendanceId', auth, async (req, res) => {
  try{
    const { attendanceId } = req.params;
    const attendance = await AttendanceRecord.findById(attendanceId);
    if (!attendance) return res.status(404).json({ msg: 'Attendance not found' });
    if (attendance.tutorId !== req.user._id.toString()) return res.status(403).json({ msg: 'Only the tutor who created this can close it' });

    attendance.status = 'closed';
    await attendance.save();
    res.json({ success: true, attendance });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
