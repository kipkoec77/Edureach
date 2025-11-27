const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  userId: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
}, { _id: true });

const DiscussionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  messages: [MessageSchema]
}, { timestamps: true });

module.exports = mongoose.models?.Discussion || mongoose.model('Discussion', DiscussionSchema);
