const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  assignmentId: { type: String, required: true },
  studentId: { type: String, required: true },
  originalName: { type: String },
  filename: { type: String },
  url: { type: String },
  submittedAt: { type: Date, default: Date.now },
  grade: { type: Number },
  feedback: { type: String },
  gradedBy: { type: String },
  gradedAt: { type: Date },
  archived: { type: Boolean, default: false },
  archivedAt: { type: Date },
  previousSubmissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
