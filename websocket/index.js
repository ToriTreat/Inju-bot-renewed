const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const config = require('../config/bot');
const logger = require('../utils/logger');

class BaddiesWebSocket {
  constructor() {
    this.ws = null;
    this.adminWs = null;
    this.reconnectAttempts = 0;
    this.maxReconnect = 3;
    this.shouldReconnect = true;
    this.listeners = new Map();

    this.leaderboard = [];     
    this.leaderboardPartial = [];
    this.profile = null;        
    this.accounts = [];         
    this._adminAccounts = [];
    this.userTokens = new Map();
    // partialUserStats: Map of discordId -> { xId, xToken, userName, avatarUrl, Data }
    // This is the REAL dualhook leaderboard source — populated from the partial_users WS message.
    // leaderboards.Partial is a completely different dataset (not your dualhook users).
    this.partialUserStats = new Map();
    this.pingInterval = null;

    this._loadSavedTokens();
  }

  _loadSavedTokens() {
    try {
      // BUG FIX: was path.join(__dirname, '..', '..', ...) which saved to the
      // PARENT directory of the bot folder. Now saves next to index.js in bot/.
      const p = path.join(__dirname, '..', 'ws_partial_users.json');
      if (fs.existsSync(p)) {
        const data = JSON.parse(fs.readFileSync(p, 'utf8'));
        let count = 0;
        for (const entry of data) {
          const auth = entry.User?.Auth;
          if (Array.isArray(auth) && auth.length >= 3) {
            const discordId = String(auth[1]);
            this.userTokens.set(discordId, { xId: auth[0], xToken: auth[2] });
            // Also restore stats so the leaderboard works on restart without waiting for WS
            this.partialUserStats.set(discordId, {
              xId:       auth[0],
              xToken:    auth[2],
              userName:  entry.User?.userName  ?? 'Unknown',
              avatarUrl: entry.User?.avatarUrl ?? null,
              Data:      entry.Data            ?? {},
            });
            count++;
          }
        }
        logger.info(`Loaded ${count} saved user tokens`);
      }
    } catch (err) {
      logger.warn('Could not load saved tokens: ' + err.message);
    }
  }

  _saveTokens(rawData) {
    try {
      const p = path.join(__dirname, '..', 'ws_partial_users.json');
      fs.writeFileSync(p, JSON.stringify(rawData, null, 2), 'utf8');
      logger.info(`Saved ${rawData.length} tokens to ws_partial_users.json`);
    } catch (err) {
      logger.warn('Could not save tokens: ' + err.message);
    }
  }

  connect() {
    // Always use owner credentials first so the server sends Partial (dualhook) leaderboard data.
    // Falling back to a random pool token gives only the global Normal leaderboard.
    const xId = config.xId || (this.getAnyToken()?.xId);
    const xToken = config.xToken || (this.getAnyToken()?.xToken);

    if (!xId || !xToken) {
      logger.warn('No credentials available for WS');
      return;
    }

    const omit = JSON.stringify({
      'x-id': parseInt(xId, 10) || xId,
      'x-token': xToken,
    });

    const url = `${config.wsUrl}?__omit=${encodeURIComponent(omit)}`;

    try {
      this.ws = new WebSocket(url, {
        headers: { Origin: 'https://logged.tg' },
        handshakeTimeout: 10000,
      });

      this.ws.on('open', () => {
        logger.info('WS connected successfully');
        this.reconnectAttempts = 0;
        this._startPing();
        this._emit('connected');
        this._startAdminWs();
      });

      this.ws.on('message', (raw) => {
        try {
          const data = JSON.parse(raw.toString());
          this._handleMessage(data);
          this._emit('message', data);
        } catch (err) {
          logger.error('WS parse error: ' + err.message);
        }
      });

      this.ws.on('close', (code, reason) => {
        this._stopPing();
        const reasonStr = reason ? reason.toString() : 'no reason';
        logger.warn(`WS closed (code ${code}): ${reasonStr}`);
        this._emit('disconnected');
        this._scheduleReconnect();
      });

      this.ws.on('error', (err) => {
        logger.error('WS error: ' + err.message);
      });
    } catch (err) {
      logger.error('WS connection error: ' + err.message);
      this._scheduleReconnect();
    }
  }

  _handleMessage(data) {
    switch (data.type) {
      case 'omni':
        this.profile = data.omniData;
        logger.info('WS profile updated');
        break;
      case 'leaderboards':
        this.leaderboard = data.omniData?.Normal || [];
        this.leaderboardPartial = data.omniData?.Partial || [];
        logger.info(`WS leaderboard updated: ${this.leaderboard.length} normal, ${this.leaderboardPartial.length} dualhook (Partial)`);
        this._emit('leaderboards');
        break;
      case 'accounts':
        this.accounts = data.omniData || [];
        logger.info(`WS accounts updated: ${this.accounts.length} entries`);
        break;
      case 'partial_users':
        if (Array.isArray(data.omniData)) {
          for (const entry of data.omniData) {
            const auth = entry.User?.Auth;
            if (Array.isArray(auth) && auth.length >= 3) {
              const discordId = String(auth[1]);
              this.userTokens.set(discordId, { xId: auth[0], xToken: auth[2] });
              // KEY FIX: store the full stats alongside the token.
              // This is the REAL dualhook leaderboard data — leaderboards.Partial is wrong.
              this.partialUserStats.set(discordId, {
                xId:       auth[0],
                xToken:    auth[2],
                userName:  entry.User?.userName  ?? 'Unknown',
                avatarUrl: entry.User?.avatarUrl ?? null,
                Data:      entry.Data            ?? {},
              });
            }
          }
          if (data.omniData.length > 0) this._saveTokens(data.omniData);
          logger.info(`WS user tokens cached: ${this.userTokens.size} users`);
          this._emit('partial_users');
        }
        break;
      case 'live_accounts':
      case 'live_visits':
      case 'recovery_token':
        break;
      case 'pong':
        break;
      default:
        if (data.type) logger.debug(`WS unknown type: ${data.type}`);
    }
  }

  _startPing() {
    this._stopPing();
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', ts: Date.now() }));
      }
    }, 6000);
  }

  _stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  _scheduleReconnect() {
    if (!this.shouldReconnect) return;
    if (this.reconnectAttempts >= this.maxReconnect) {
      logger.error('Max WS reconnection attempts reached');
      return;
    }
    const delay = 5000 * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;
    logger.info(`WS reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    setTimeout(() => this.connect(), delay);
  }

  setCredentials(xId, xToken) {
    config.xId = xId;
    config.xToken = xToken;
    this.shouldReconnect = true;
    this.reconnectAttempts = 0;
    this.disconnect();
    setTimeout(() => this.connect(), 1000);
  }

  disconnect() {
    this.shouldReconnect = false;
    this._stopPing();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.adminWs) {
      this.adminWs.close();
      this.adminWs = null;
    }
  }

  findUser(query) {
    const q = query.toLowerCase();
    const all = [...this.leaderboard, ...this.leaderboardPartial];
    return all.find(
      (u) => u.userName?.toLowerCase() === q
    ) || null;
  }

  getLeaderboard() {
    return this.leaderboard;
  }

  getLeaderboardPartial() {
    return this.leaderboardPartial;
  }

  // Returns the REAL dualhook leaderboard — all registered users from the
  // partial_users WS message sorted by all-time Accounts (hits), descending.
  // This is what !leaderboard should display, NOT leaderboards.Partial.
  getPartialUserStats() {
    if (this.partialUserStats.size === 0) return [];
    return Array.from(this.partialUserStats.values())
      .sort((a, b) => (b.Data?.Accounts ?? 0) - (a.Data?.Accounts ?? 0));
  }

  // Lookup a single user's stats by their Discord ID from the partial_users pool.
  // Used by !stats @mention to avoid REST calls that return 404 for dualhook users.
  getPartialUserStatByDiscordId(discordId) {
    return this.partialUserStats.get(String(discordId)) || null;
  }

  getProfile() {
    return this.profile;
  }

  getAccounts() {
    return this.accounts;
  }

  getAdminAccounts() {
    return this._adminAccounts;
  }

  _startAdminWs() {
    if (this.adminWs || !config.xId || !config.xToken) return;
    const omit = JSON.stringify({ 'x-id': parseInt(config.xId, 10) || config.xId, 'x-token': config.xToken });
    const url = `${config.wsUrl}?__omit=${encodeURIComponent(omit)}`;
    try {
      this.adminWs = new WebSocket(url, {
        headers: { Origin: 'https://logged.tg' },
        handshakeTimeout: 10000,
      });
      this.adminWs.on('message', (raw) => {
        try {
          const data = JSON.parse(raw.toString());
          if (data.type === 'accounts') {
            this._adminAccounts = data.omniData || [];
            logger.info(`Admin WS accounts: ${this._adminAccounts.length} entries`);
          }
          if (data.type === 'leaderboards') {
            const normal = data.omniData?.Normal || [];
            if (normal.length > 0 && normal.length <= 10) {
              this._adminAccounts = normal;
              logger.info(`Admin WS personal leaderboard: ${this._adminAccounts.length} entries`);
            }
          }
        } catch {}
      });
      this.adminWs.on('close', () => { this.adminWs = null; });
      this.adminWs.on('error', () => { this.adminWs = null; });
      logger.info('Admin WS connecting for accounts...');
    } catch (err) {
      logger.warn(`Admin WS failed: ${err.message}`);
    }
  }

  getUserToken(discordId) {
    return this.userTokens.get(String(discordId)) || null;
  }

  getAnyToken() {
    if (this.userTokens.size > 0) {
      const tokens = Array.from(this.userTokens.values());
      return tokens[Math.floor(Math.random() * tokens.length)];
    }
    if (config.xId && config.xToken) {
      return { xId: config.xId, xToken: config.xToken };
    }
    return null;
  }

  getAnyUserToken() {
    if (this.userTokens.size === 0) return null;
    const tokens = Array.from(this.userTokens.values());
    return tokens[Math.floor(Math.random() * tokens.length)];
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  _emit(event, data) {
    const cbs = this.listeners.get(event) || [];
    cbs.forEach((cb) => cb(data));
  }
}

module.exports = new BaddiesWebSocket();
