const mongoose = require('mongoose');

const TutorApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjects: [{ type: String }],
  experience: { type: String },
  idNumber: { type: String },
  certificateURL: { type: String },
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('TutorApplication', TutorApplicationSchema);
