const axios = require('axios');
const WebSocket = require('ws');
const config = require('../../config/bot');
const logger = require('../../utils/logger');
const TokenManager = require('./TokenManager');
const CacheManager = require('./CacheManager');

class DataFetcher {
  constructor() {
    this.tokens = new TokenManager();
    this.cache = new CacheManager();
    this._ws = null;
    this._pendingFresh = null;
  }

  setWsInstance(ws) {
    this._ws = ws;
    ws.on('leaderboards', () => {
      this.cache.del('lb:full');
    });
    // Clear leaderboard cache when fresh partial_users stats arrive from WS
    ws.on('partial_users', () => {
      this.cache.del('lb:full');
    });
  }

  _getUserToken(discordId) {
    // Check WS in-memory token map first (loaded from ws_partial_users.json)
    if (this._ws) {
      const t = this._ws.getUserToken(discordId);
      if (t) return t;
    }
    const t = this.tokens.getTokenForUser(discordId);
    if (t) return t;
    if (config.xId && config.xToken) return { xId: config.xId, xToken: config.xToken };
    return null;
  }

  // ─── Open a temp WS for LEADERBOARD data (owner credentials) ───────────────
  async _openTempWs(xId, xToken, timeoutMs = 10000) {
    return new Promise((resolve) => {
      let done = false;
      const finish = (result) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        try { tempWs.close(); } catch (_) {}
        resolve(result);
      };

      const omit = JSON.stringify({ 'x-id': parseInt(xId, 10) || xId, 'x-token': xToken });
      const url = `${config.wsUrl}?__omit=${encodeURIComponent(omit)}`;
      const tempWs = new WebSocket(url, { headers: { Origin: 'https://logged.tg' }, handshakeTimeout: 10000 });
      const timer = setTimeout(() => finish(null), timeoutMs);

      tempWs.on('message', (raw) => {
        try {
          const msg = JSON.parse(raw.toString());
          if (msg.type === 'leaderboards') {
            const normal  = msg.omniData?.Normal  || msg.omniData?.normal  || [];
            const partial = msg.omniData?.Partial || msg.omniData?.partial || [];
            if (normal.length > 0 || partial.length > 0) {
              finish({ Normal: normal, Partial: partial, source: 'WS_LEADERBOARDS' });
            }
          }
          if (msg.type === 'omni') {
            const omniData = msg.omniData || msg.data || {};
            const partial  = omniData?.Partial || omniData?.partial || [];
            const normal   = omniData?.Normal  || omniData?.normal  || [];
            if (partial.length > 0 || normal.length > 0) {
              finish({ Normal: normal, Partial: partial, source: 'WS_OMNI' });
            }
          }
        } catch (_) {}
      });
      tempWs.on('error', () => finish(null));
      tempWs.on('close', () => finish(null));
    });
  }

  // ─── Open a personal WS with a USER's token, wait for their omni profile ───
  async _fetchPersonalStatsViaWs(xId, xToken, timeoutMs = 10000) {
    return new Promise((resolve) => {
      let done = false;
      const finish = (result) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        try { ws.close(); } catch (_) {}
        resolve(result);
      };

      const omit = JSON.stringify({ 'x-id': parseInt(xId, 10) || xId, 'x-token': xToken });
      const url = `${config.wsUrl}?__omit=${encodeURIComponent(omit)}`;
      const ws = new WebSocket(url, { headers: { Origin: 'https://logged.tg' }, handshakeTimeout: 10000 });
      const timer = setTimeout(() => finish(null), timeoutMs);

      ws.on('message', (raw) => {
        try {
          const msg = JSON.parse(raw.toString());
          // 'omni' is the personal profile message sent on connect
          if (msg.type === 'omni') {
            const omni = msg.omniData || msg.data || {};
            // Try to find stats in various known shapes
            const profile = omni.Profile || omni.profile || {};
            const normal  = omni.Normal  || omni.normal  || omni.Totals || omni.totals || {};
            const partial = omni.Partial || omni.partial || null;
            if (Object.keys(normal).length > 0 || profile.userName) {
              finish({ profile, normal, partial, raw: omni });
            }
          }
          // Some accounts send 'accounts' listing their own accounts with stats
          if (msg.type === 'accounts' && Array.isArray(msg.omniData) && msg.omniData.length > 0) {
            finish({ accounts: msg.omniData, raw: msg.omniData });
          }
        } catch (_) {}
      });
      ws.on('error', () => finish(null));
      ws.on('close', () => finish(null));
    });
  }

  async fetchPlayerStats({ discordId, username }) {
    const cacheKey = `stats:${discordId || username}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    // ── 0. FASTEST PATH: user is in partialUserStats (dualhook pool) ─────────
    // Check by Discord ID — this covers all 50 registered users instantly.
    // Avoids REST call (which returns 404) and all the WS fallbacks.
    if (discordId && this._ws) {
      const entry = this._ws.getPartialUserStatByDiscordId(String(discordId));
      if (entry) {
        const norm = {
          Balance:   entry.Data?.Balance  ?? 0,
          RAP:       entry.Data?.Rap      ?? 0,
          Hits:      entry.Data?.Accounts ?? 0,
          Visits:    entry.Data?.Visits   ?? 0,
          Clicks:    entry.Data?.Clicks   ?? 0,
          Summary:   entry.Data?.Summary  ?? 0,
          username:  entry.userName ?? username ?? 'Unknown',
          avatarUrl: entry.avatarUrl ?? null,
          source:    'PARTIAL_USERS_WS',
        };
        return this.cache.set(cacheKey, norm, 'stats'), norm;
      }
    }

    // ── 1. Public REST API by Discord ID ────────────────────────────────────
    if (discordId) {
      try {
        const res = await axios.get(`${config.apiBaseUrl}/v1/public/user`, {
          params: { userId: discordId },
          timeout: 8000,
          headers: {
            Accept: 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            Referer: 'https://injuries.to',
            Origin: 'https://injuries.to',
          },
        });
        const body = res.data;
        if (body && (body.Normal || body.Profile)) {
          const profile = body.Profile || {};
          const normal  = body.Normal  || {};
          const totals  = normal.Totals  || {};
          const highest = normal.Highest || {};
          const norm = {
            Balance:   totals.Balance  ?? highest.Balance  ?? 0,
            RAP:       totals.Rap      ?? highest.Rap      ?? 0,
            Hits:      totals.Accounts ?? 0,
            Visits:    totals.Visits   ?? 0,
            Clicks:    totals.Clicks   ?? 0,
            Summary:   totals.Summary  ?? 0,
            username:  profile.userName || username || 'Unknown',
            avatarUrl: profile.avatarUrl || null,
            source:    'REST_API',
            _raw:      body,
          };
          return this.cache.set(cacheKey, norm, 'stats'), norm;
        }
      } catch (err) {
        // 403 = account exists but is private / insufficient permissions
        if (err.response?.status === 403) {
          return { _forbidden: true, username, discordId };
        }
        // 404 = account not linked or no data yet — fall through to WS fallbacks
        logger.warn(`DataFetcher: REST stats failed for ${discordId}: ${err.message}`);
      }
    }

    // ── 2. Personal WS lookup using their token from ws_partial_users.json ──
    // This is the key path for dualhook users who are in the token pool
    if (discordId) {
      const token = this._getUserToken(discordId);
      if (token && String(token.xId) !== String(config.xId)) {
        // It's a user token (not the owner fallback) — open their personal WS
        try {
          const personal = await this._fetchPersonalStatsViaWs(token.xId, token.xToken, 10000);
          if (personal) {
            const norm = this._normalizePersonalWs(personal, username);
            if (norm) return this.cache.set(cacheKey, norm, 'stats'), norm;
          }
        } catch (err) {
          logger.warn(`DataFetcher: personal WS lookup failed for ${discordId}: ${err.message}`);
        }
      }
    }

    // ── 3. WS in-memory leaderboard cache search by username ────────────────
    const wsHit = this._findInWsCache(username);
    if (wsHit) return this.cache.set(cacheKey, wsHit, 'stats'), wsHit;

    // ── 4. Fresh leaderboard WS fetch then search ────────────────────────────
    const fresh = await this._fetchLeaderboardFresh();
    if (fresh) {
      const all = [...(fresh.Partial || []), ...(fresh.Normal || [])];
      const q = username?.toLowerCase();
      const entry = q && (
        all.find(u => u.userName?.toLowerCase() === q)
        || all.find(u => u.rootName?.toLowerCase() === q)
        || all.find(u => u.User?.userName?.toLowerCase() === q)
      );
      if (entry) {
        const norm = this._normalizeWsEntry(entry);
        return this.cache.set(cacheKey, norm, 'stats'), norm;
      }
    }

    // ── 5. Daily API fallback ────────────────────────────────────────────────
    const daily = await this.fetchDailyForUser(discordId);
    if (daily) {
      const data = Array.isArray(daily) ? daily : (daily.data || daily.Normal || []);
      const q = username?.toLowerCase();
      const dayEntry = q && data.find(e =>
        (e.rootName?.toLowerCase() === q) || (e.userName?.toLowerCase() === q)
      );
      if (dayEntry) {
        const norm = this._normalizeDailyEntry(dayEntry);
        return this.cache.set(cacheKey, norm, 'stats'), norm;
      }
    }

    return null;
  }

  async fetchLeaderboard() {
    const cached = this.cache.get('lb:full');
    if (cached) return cached;

    // ── PRIMARY: Real dualhook leaderboard from partial_users WS message ─────
    // The partial_users WS message sends ALL registered dualhook users with their
    // actual Data.Accounts stats. This is the correct source for !leaderboard.
    // leaderboards.Partial is a DIFFERENT (wrong) dataset — do not use it.
    if (this._ws) {
      const realPartial = this._ws.getPartialUserStats();
      if (realPartial.length > 0) {
        const normal = this._ws.getLeaderboard();
        const result = { Normal: normal, Partial: realPartial, source: 'PARTIAL_USERS' };
        this.cache.set('lb:full', result, 'lb');
        return result;
      }
    }

    // ── FALLBACK: authenticated daily (ref=ownerXId) for dualhook users ──────
    // Used before the WS partial_users message has arrived (e.g. first seconds after start)
    const dailyFallback = await this._fetchDailyWithRef();
    if (dailyFallback && dailyFallback.length > 0) {
      const normal = this._ws ? this._ws.getLeaderboard() : [];
      const result = { Normal: normal, Partial: dailyFallback, source: 'DAILY_REF' };
      this.cache.set('lb:full', result, 'lb');
      return result;
    }

    // ── LAST RESORT: Normal-only global leaderboard ───────────────────────────
    if (this._ws) {
      const normal = this._ws.getLeaderboard();
      if (normal.length > 0) {
        const result = { Normal: normal, Partial: [], source: 'WS_NORMAL_ONLY' };
        this.cache.set('lb:full', result, 'lb');
        return result;
      }
    }

    return null;
  }

  async fetchDaily() {
    const cached = this.cache.get('lb:daily');
    if (cached) return cached;
    try {
      const res = await axios.get(`${config.apiBaseUrl}/v2/daily`, { timeout: 8000 });
      if (res.data) {
        this.cache.set('lb:daily', res.data, 'daily');
        return res.data;
      }
    } catch (err) {
      logger.warn(`DataFetcher: daily fetch failed: ${err.message}`);
    }
    return null;
  }

  async fetchDailyAsUser() {
    return this.fetchDailyForUser(null);
  }

  getTokenForUser(discordId) {
    return this._getUserToken(discordId);
  }

  getTokenByXId(xId) {
    return this.tokens.getTokenByXId ? this.tokens.getTokenByXId(xId) : null;
  }

  async fetchDailyForUser(discordId, xId) {
    // Resolve token: user's own → owner fallback
    let token;
    if (xId) token = this.tokens.getTokenByXId ? this.tokens.getTokenByXId(xId) : null;
    if (!token && discordId) token = this._getUserToken(discordId);
    if (!token && config.xId && config.xToken) token = { xId: config.xId, xToken: config.xToken };

    if (!token) return this.fetchDaily();

    const cacheKey = `daily:${token.xId}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      const res = await axios.get(`${config.apiBaseUrl}/v2/daily?ref=${token.xId}`, {
        timeout: 8000,
        headers: { 'x-id': String(token.xId), 'x-token': token.xToken },
      });
      if (res.data) {
        this.cache.set(cacheKey, res.data, 'daily');
        return res.data;
      }
    } catch (err) {
      logger.warn(`DataFetcher: daily for xId ${token.xId} failed: ${err.message}`);
    }
    return this.fetchDaily();
  }

  // ─── Fetch daily leaderboard using owner credentials (dualhook referral) ───
  async _fetchDailyWithRef() {
    if (!config.xId || !config.xToken) return null;
    const cacheKey = `daily:ref:${config.xId}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      const res = await axios.get(`${config.apiBaseUrl}/v2/daily?ref=${config.xId}`, {
        timeout: 8000,
        headers: { 'x-id': String(config.xId), 'x-token': config.xToken },
      });
      if (res.data) {
        const list = Array.isArray(res.data) ? res.data : (res.data.data || res.data.Normal || []);
        if (list.length > 0) {
          this.cache.set(cacheKey, list, 'daily');
          return list;
        }
      }
    } catch (err) {
      logger.warn(`DataFetcher: _fetchDailyWithRef failed: ${err.message}`);
    }
    return null;
  }

  _findInWsCache(username) {
    if (!this._ws || !username) return null;
    const q = username.toLowerCase();
    const all = [...this._ws.getLeaderboard(), ...this._ws.getLeaderboardPartial()];
    const entry = all.find(u => u.userName?.toLowerCase() === q)
      || all.find(u => u.rootName?.toLowerCase() === q)
      || all.find(u => u.User?.userName?.toLowerCase() === q);
    return entry ? this._normalizeWsEntry(entry) : null;
  }

  async _fetchLeaderboardFresh() {
    if (this._pendingFresh) return this._pendingFresh;
    this._pendingFresh = this._doFetchLeaderboardFresh();
    try {
      return await this._pendingFresh;
    } finally {
      this._pendingFresh = null;
    }
  }

  async _doFetchLeaderboardFresh() {
    // IMPORTANT: do NOT write to 'lb:full' cache here.
    // Only fetchLeaderboard() owns that cache entry.
    // This function is only called as a fallback for stats username lookups.
    // If it wrote to lb:full, it would cache leaderboards.Partial (wrong dataset)
    // and poison the next !leaderboard call.
    if (config.xId && config.xToken) {
      try {
        const result = await this._openTempWs(config.xId, config.xToken, 12000);
        if (result && (result.Normal.length > 0 || result.Partial.length > 0)) {
          return result;
        }
      } catch (_) {}
    }
    // Fallback: try a random pool token
    for (let attempt = 0; attempt < 2; attempt++) {
      const token = this.tokens.getAnyToken();
      if (!token) break;
      try {
        const result = await this._openTempWs(token.xId, token.xToken, 10000);
        if (result && (result.Normal.length > 0 || result.Partial.length > 0)) {
          return result;
        }
        this.tokens.reportFailure(token.xId);
      } catch (_) {
        this.tokens.reportFailure(token.xId);
      }
    }
    return null;
  }

  async _fetchDailyAsUser() {
    if (!config.xId || !config.xToken) return null;
    try {
      const res = await axios.get(`${config.apiBaseUrl}/v2/daily?ref=${config.xId}`, {
        timeout: 8000,
        headers: { 'x-id': String(config.xId), 'x-token': config.xToken },
      });
      return res.data || null;
    } catch (err) {
      logger.warn(`DataFetcher: _fetchDailyAsUser failed: ${err.message}`);
      return null;
    }
  }

  _normalizePersonalWs(personal, fallbackUsername) {
    if (!personal) return null;

    // Shape: { profile, normal, partial, raw } from omni message
    const profile = personal.profile || {};
    const normal  = personal.normal  || {};
    const partial = personal.partial || null;
    const raw     = personal.raw     || {};

    // Try Totals subkey first, then flat
    const totals  = normal.Totals  || normal.totals  || normal;
    const highest = normal.Highest || normal.highest || {};
    const ptotals = partial?.Totals || partial?.totals || partial || {};

    const uname = profile.userName || raw.Profile?.userName || raw.userName || fallbackUsername || 'Unknown';

    return {
      Balance:   totals.Balance  ?? highest.Balance  ?? ptotals.Balance  ?? 0,
      RAP:       totals.Rap      ?? totals.RAP       ?? highest.Rap      ?? ptotals.Rap      ?? 0,
      Hits:      totals.Accounts ?? highest.Accounts ?? ptotals.Accounts ?? 0,
      Visits:    totals.Visits   ?? highest.Visits   ?? ptotals.Visits   ?? 0,
      Clicks:    totals.Clicks   ?? highest.Clicks   ?? ptotals.Clicks   ?? 0,
      Summary:   totals.Summary  ?? highest.Summary  ?? ptotals.Summary  ?? 0,
      username:  uname,
      avatarUrl: profile.avatarUrl || raw.Profile?.avatarUrl || null,
      source:    'PERSONAL_WS',
      _raw:      { Profile: profile, Normal: normal, Partial: partial },
    };
  }

  _normalizeWsEntry(entry) {
    if (!entry) return null;
    const t = entry.Data?.Totals || entry.Data || entry || {};
    return {
      Balance:   t.Balance  ?? entry.Balance  ?? 0,
      RAP:       t.RAP      ?? t.Rap          ?? entry.RAP ?? entry.Rap ?? 0,
      Hits:      t.Hits     ?? t.Accounts     ?? entry.Hits ?? entry.Accounts ?? 0,
      Visits:    t.Visits   ?? entry.Visits   ?? 0,
      Clicks:    t.Clicks   ?? entry.Clicks   ?? 0,
      Summary:   t.Summary  ?? entry.Summary  ?? 0,
      username:  entry.User?.userName ?? entry.userName ?? entry.rootName ?? 'Unknown',
      xId:       entry.xId  ?? entry.User?.xId ?? null,
      avatarUrl: entry.User?.avatarUrl ?? entry.avatarUrl ?? null,
      source: 'WS',
    };
  }

  _normalizeDailyEntry(entry) {
    if (!entry) return null;
    return {
      Balance: 0, RAP: 0, Summary: 0,
      Hits:    entry.Accounts ?? entry.accounts ?? entry.amount ?? entry.count ?? 0,
      Visits:  entry.Visits   ?? entry.visits   ?? 0,
      Clicks:  entry.Clicks   ?? entry.clicks   ?? 0,
      username: entry.rootName ?? entry.userName ?? entry.name ?? 'Unknown',
      xId:      entry.xId ?? null,
      avatarUrl: entry.avatarUrl ?? null,
      source: 'DAILY_REST',
    };
  }

  getHealth() {
    return {
      tokenPool:        this.tokens.size,
      validTokens:      this.tokens.validCount,
      cacheHits:        this.cache.hits,
      cacheMisses:      this.cache.misses,
      leaderboardNormal:  this._ws ? this._ws.getLeaderboard().length : 0,
      leaderboardPartial: this._ws ? this._ws.getLeaderboardPartial().length : 0,
    };
  }
}

module.exports = DataFetcher;
