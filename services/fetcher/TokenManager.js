const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');

class TokenManager {
  constructor() {
    this.userTokens = new Map();
    this.blacklisted = new Set();
    this._load();
  }

  _load() {
    try {
      const p = path.join(__dirname, '..', '..', '..', 'ws_partial_users.json');
      if (fs.existsSync(p)) {
        const data = JSON.parse(fs.readFileSync(p, 'utf8'));
        let count = 0;
        for (const entry of data) {
          const auth = entry.User?.Auth;
          if (Array.isArray(auth) && auth.length >= 3) {
            this.userTokens.set(String(auth[1]), { xId: auth[0], xToken: auth[2] });
            count++;
          }
        }
        logger.info(`TokenManager: loaded ${count} tokens`);
      }
    } catch (err) {
      logger.warn(`TokenManager: load error: ${err.message}`);
    }
  }

  getTokenForUser(discordId) {
    return this.userTokens.get(String(discordId)) || null;
  }

  getAnyToken() {
    if (this.userTokens.size === 0) return null;
    const valid = Array.from(this.userTokens.values()).filter(t => !this.blacklisted.has(t.xId));
    if (valid.length === 0) {
      this.blacklisted.clear();
      const all = Array.from(this.userTokens.values());
      return all[Math.floor(Math.random() * all.length)];
    }
    return valid[Math.floor(Math.random() * valid.length)];
  }

  addToken(discordId, xId, xToken) {
    this.userTokens.set(String(discordId), { xId, xToken });
  }

  reportFailure(xId) {
    this.blacklisted.add(xId);
    logger.warn(`TokenManager: blacklisted xId=${xId}, ${this.userTokens.size - this.blacklisted.size} remaining`);
  }

  get size() { return this.userTokens.size; }
  get validCount() { return this.userTokens.size - this.blacklisted.size; }
}

module.exports = TokenManager;
