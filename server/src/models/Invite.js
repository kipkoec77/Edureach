const mongoose = require('mongoose');

const InviteSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  role: { type: String, enum: ['instructor','tutor'], required: true },
  createdBy: { type: String },
  usedBy: { type: String },
  usedAt: { type: Date },
  expiresAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Invite', InviteSchema);
