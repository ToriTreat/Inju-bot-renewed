const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  action: { type: String, required: true },
  userId: { type: String },
  moderatorId: { type: String },
  reason: { type: String },
  details: { type: Object },
  guildId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Log', logSchema);
