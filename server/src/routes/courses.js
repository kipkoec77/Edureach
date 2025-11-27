const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/auth');

// Storage helpers
const notesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/notes'))
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
const assignmentsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/assignments'))
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const uploadNote = multer({ storage: notesStorage });
const uploadAssignment = multer({ storage: assignmentsStorage });

const Discussion = require('../models/Discussion');

// POST /api/courses  (create, requires auth and tutor role)
router.post('/', auth, async (req, res) => {
  try{
    const sessionUserId = req.user._id.toString();
    const { title, description, category, level } = req.body;
    
    console.log(`[CREATE COURSE] User ${sessionUserId} attempting to create course: "${title}"`);
    
    // verify caller is tutor
    if (req.user.role !== 'tutor') {
      console.log(`[CREATE COURSE] BLOCKED - User has role: ${req.user.role}`);
      return res.status(403).json({ msg: 'Forbidden: tutors only' });
    }

    const course = new Course({ title, description, category, level, createdBy: sessionUserId });
    await course.save();
    console.log(`[CREATE COURSE] SUCCESS - Course created: ${course._id}`);
    res.json({ success: true, course });
  } catch (err){
    console.error('[CREATE COURSE ERROR]', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// POST /api/courses/:id/enroll - enroll current signed-in user as a student
router.post('/:id/enroll', auth, async (req, res) => {
  try{
    const sessionUserId = req.user._id.toString();
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // prevent duplicate enrollment
    const already = course.students?.some(s => s.studentId === sessionUserId);
    if (already) return res.json({ success: true, enrolled: true });

    course.students = course.students || [];
    course.students.push({ studentId: sessionUserId, enrolledAt: new Date() });
    await course.save();
    res.json({ success: true, enrolled: true });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/courses?tutorId=...  (public)
router.get('/', async (req, res) => {
  try{
    const tutorId = req.query.tutorId;
    let courses;
    if (tutorId) courses = await Course.find({ createdBy: tutorId }).sort({ createdAt: -1 });
    else courses = await Course.find().sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/courses/:id
router.get('/:id', async (req, res) => {
  try{
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    res.json({ success: true, course });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/courses/:id  (edit course)
router.put('/:id', auth, async (req, res) => {
  try{
    const sessionUserId = req.user._id.toString();

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    if (course.createdBy !== sessionUserId) return res.status(403).json({ msg: 'Forbidden' });

    const { title, description, category, level, syllabus } = req.body;
    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (category !== undefined) course.category = category;
    if (level !== undefined) course.level = level;
    if (syllabus !== undefined) course.syllabus = syllabus;

    await course.save();
    res.json({ success: true, course });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/courses/:id
router.delete('/:id', auth, async (req, res) => {
  try{
    const sessionUserId = req.user._id.toString();

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    if (course.createdBy !== sessionUserId) return res.status(403).json({ msg: 'Forbidden' });

    await course.remove();
    res.json({ success: true });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Upload note file
router.post('/:id/upload-note', auth, uploadNote.single('file'), async (req, res) => {
  try{
    const sessionUserId = req.user._id.toString();

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    if (course.createdBy !== sessionUserId) return res.status(403).json({ msg: 'Forbidden' });

    const file = req.file;
    const fileObj = { filename: file.filename, originalName: file.originalname, url: `/uploads/notes/${file.filename}` };
    course.notes.push(fileObj);
    await course.save();
    res.json({ success: true, note: fileObj });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Upload assignment file
router.post('/:id/upload-assignment', auth, uploadAssignment.single('file'), async (req, res) => {
  try{
    const sessionUserId = req.user._id.toString();

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    if (course.createdBy !== sessionUserId) return res.status(403).json({ msg: 'Forbidden' });

    const file = req.file;
    const { title, description, dueDate } = req.body;
    if (!title) return res.status(400).json({ msg: 'Assignment title is required' });

    const assignmentObj = { 
      title,
      description: description || '',
      filename: file.filename, 
      originalName: file.originalname, 
      url: `/uploads/assignments/${file.filename}`,
      dueDate: dueDate ? new Date(dueDate) : null
    };
    course.assignments.push(assignmentObj);
    await course.save();
    res.json({ success: true, assignment: assignmentObj });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Attendance: add record
router.post('/:id/attendance', auth, async (req, res) => {
  try{
    const sessionUserId = req.user._id.toString();

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    // allow only tutor (creator) to push attendance manually
    if (course.createdBy !== sessionUserId) return res.status(403).json({ msg: 'Forbidden' });

    const { studentId } = req.body;
    const entry = { studentId: studentId || null, date: new Date() };
    course.attendance.push(entry);
    await course.save();
    res.json({ success: true, entry });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET attendance
router.get('/:id/attendance', auth, async (req, res) => {
  try{
    const sessionUserId = req.user._id.toString();

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    // allow tutor (creator) or enrolled student to view attendance
    const isTutor = course.createdBy === sessionUserId;
    const isEnrolled = (course.students || []).some(s => s.studentId === sessionUserId);
    if (!isTutor && !isEnrolled) return res.status(403).json({ msg: 'Forbidden' });

    res.json({ success: true, attendance: course.attendance });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Discussions: GET and POST
router.get('/:id/discussions', async (req, res) => {
  try{
    const disc = await Discussion.findOne({ courseId: req.params.id });
    res.json({ success: true, messages: disc?.messages || [] });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/:id/discussions', auth, async (req, res) => {
  try{
    const sessionUserId = req.user._id.toString();

    const { message } = req.body;
    if (!message) return res.status(400).json({ msg: 'Missing message' });

    let disc = await Discussion.findOne({ courseId: req.params.id });
    if (!disc) {
      disc = new Discussion({ courseId: req.params.id, messages: [] });
    }
    disc.messages.push({ userId: sessionUserId, message, timestamp: new Date() });
    await disc.save();
    res.json({ success: true, message: disc.messages[disc.messages.length-1] });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ===== ANNOUNCEMENTS CRUD =====

// POST /api/courses/:id/announcements - Create announcement (Tutor only, own course)
router.post('/:id/announcements', auth, async (req, res) => {
  try{
    const sessionUserId = req.user._id.toString();

    const { title, message, content } = req.body;
    const announcementContent = content || message;
    const announcementTitle = title;
    
    if (!announcementTitle || !announcementContent) {
      return res.status(400).json({ msg: 'Title and content/message required' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // Verify ownership
    if (course.createdBy !== sessionUserId) {
      return res.status(403).json({ msg: 'Forbidden: You can only add announcements to your own courses' });
    }

    course.announcements = course.announcements || [];
    const newAnnouncement = { 
      title: announcementTitle, 
      content: announcementContent,
      message: announcementContent,
      createdAt: new Date() 
    };
    course.announcements.unshift(newAnnouncement);
    await course.save();

    res.json({ success: true, announcement: course.announcements[0] });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/courses/:id/announcements - Get announcements
router.get('/:id/announcements', auth, async (req, res) => {
  try{
    const sessionUserId = req.user._id.toString();

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    const isTutor = course.createdBy === sessionUserId;
    const isEnrolled = (course.students || []).some(s => s.studentId === sessionUserId);
    if (!isTutor && !isEnrolled) return res.status(403).json({ msg: 'Forbidden' });

    res.json({ success: true, announcements: course.announcements || [] });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/courses/:courseId/announcements/:announcementId - Edit announcement
router.put('/:courseId/announcements/:announcementId', auth, async (req, res) => {
  try{
    const sessionUserId = req.user._id.toString();

    const { title, message, content } = req.body;
    const announcementContent = content || message;
    const announcementTitle = title;
    
    if (!announcementTitle || !announcementContent) {
      return res.status(400).json({ msg: 'Title and content/message required' });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // Verify ownership
    if (course.createdBy !== sessionUserId) {
      return res.status(403).json({ msg: 'Forbidden: You can only edit announcements in your own courses' });
    }

    const announcement = course.announcements.id(req.params.announcementId);
    if (!announcement) return res.status(404).json({ msg: 'Announcement not found' });

    announcement.title = announcementTitle;
    announcement.content = announcementContent;
    announcement.message = announcementContent;
    await course.save();

    res.json({ success: true, announcement });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/courses/:courseId/announcements/:announcementId - Delete announcement
router.delete('/:courseId/announcements/:announcementId', auth, async (req, res) => {
  try{
    const sessionUserId = req.user._id.toString();

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // Verify ownership
    if (course.createdBy !== sessionUserId) {
      return res.status(403).json({ msg: 'Forbidden: You can only delete announcements from your own courses' });
    }

    const announcement = course.announcements.id(req.params.announcementId);
    if (!announcement) return res.status(404).json({ msg: 'Announcement not found' });

    announcement.remove();
    await course.save();

    res.json({ success: true, msg: 'Announcement deleted' });
  } catch (err){
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
