const mongoose = require('mongoose');

const FileSubSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  url: String,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: true });

const AssignmentSubSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  filename: String,
  originalName: String,
  url: String,
  dueDate: Date,
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const AttendanceSchema = new mongoose.Schema({
  studentId: { type: String }, // Student identifier
  date: { type: Date, default: Date.now }
}, { _id: true });

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const StudentSubSchema = new mongoose.Schema({
  studentId: { type: String },
  enrolledAt: { type: Date, default: Date.now }
}, { _id: true });

const SyllabusModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  topics: [{ type: String }],
  id: { type: Number }
}, { _id: false });

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  level: { type: String },
  createdBy: { type: String, required: true }, // User ID of tutor
  notes: [FileSubSchema],
  assignments: [AssignmentSubSchema],
  attendance: [AttendanceSchema],
  announcements: [AnnouncementSchema],
  students: [StudentSubSchema],
  syllabus: [SyllabusModuleSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CourseSchema.pre('save', function(next){
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.models?.Course || mongoose.model('Course', CourseSchema);
