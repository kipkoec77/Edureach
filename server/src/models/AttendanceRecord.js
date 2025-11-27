const mongoose = require('mongoose');

const AttendanceRecordSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  tutorId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  totalEnrolled: { type: Number, default: 0 },
  presentStudents: [{ type: String }], // Array of user IDs
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AttendanceRecord', AttendanceRecordSchema);
