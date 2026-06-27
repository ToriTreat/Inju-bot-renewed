const logger = require('../utils/logger');
const ws = require('../websocket');
const data = require('../services/fetcher');
const config = require('../config/bot');
const VerificationSession = require('../database/models/VerificationSession');
const emojiInit = require('../utils/externalEmojis').init;

// FIX: Check mongoose connection state before running DB operations.
// Without this, deleteMany() fires even when MongoDB is unavailable
// (bufferCommands=false), causing repeated error logs every 5 minutes.
let mongoose;
try { mongoose = require('mongoose'); } catch (_) { mongoose = null; }
function isMongoConnected() {
  return mongoose && mongoose.connection && mongoose.connection.readyState === 1;
}
const customEmojis = require('../utils/customEmojis');
const emojis = require('../utils/emojis');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    logger.info(`BADDIES is ONLINE as ${client.user.tag}`);

    client.user.setPresence({
      activities: [{ name: 'BADDIES SYSTEM', type: 0 }],
      status: 'dnd',
    });

    try {
      if (typeof client.guilds?.cache?.first === 'function') {
        for (const [, guild] of client.guilds.cache) {
          try { await guild.emojis.fetch(); } catch (_) { /* guild-scoped fetch best-effort */ }
        }
      }
      customEmojis.reResolve();
      emojis.reResolve();
      logger.info('Custom emoji registry resolved against live cache');
    } catch (err) {
      logger.warn(`Custom emoji reResolve failed: ${err.message}`);
    }

    await emojiInit();

    ws.connect();
    data.setWsInstance(ws);

    ws.on('message', (msg) => {
      if (msg?.type === 'stats_update' && msg?.userId) {
        logger.debug(`WS stats update for ${msg.userId}`);
      }
    });

    setInterval(async () => {
      if (!isMongoConnected()) {
        logger.debug('Session cleanup skipped — MongoDB not connected');
        return;
      }
      try {
        const expired = await VerificationSession.deleteMany({
          createdAt: { $lt: new Date(Date.now() - 600000) },
        });
        if (expired.deletedCount > 0) {
          logger.debug(`Cleaned ${expired.deletedCount} expired verification sessions`);
        }
      } catch (err) {
        logger.error(`Session cleanup error: ${err.message}`);
      }
    }, 300000);
  },
};
