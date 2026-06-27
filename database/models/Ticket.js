const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true },
  channelId: { type: String, required: true },
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
  closedAt: { type: Date },
  closedBy: { type: String },
  transcript: { type: Array, default: [] },
});

module.exports = mongoose.model('Ticket', ticketSchema);
