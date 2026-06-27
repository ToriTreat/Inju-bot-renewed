const mongoose = require('mongoose');

const verificationSessionSchema = new mongoose.Schema({
  discordId: { type: String, required: true },
  state: { type: String, required: true, unique: true },
  guildId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 },
});

module.exports = mongoose.model('VerificationSession', verificationSessionSchema);
