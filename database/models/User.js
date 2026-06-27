const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: { type: String, unique: true, required: true },
  username: { type: String },
  globalName: { type: String },
  avatar: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String },
  verified: { type: Boolean, default: false },
  verifiedAt: { type: Date },
  xId: { type: String },
  xToken: { type: String },
  statsProfile: { type: Object, default: null },
  lastStatsUpdate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', userSchema);
