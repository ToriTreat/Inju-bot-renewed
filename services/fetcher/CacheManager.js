const NodeCache = require('node-cache');

const TTL = {
  stats: 30,
  lb: 30,
  daily: 15,
  top: 30,
  domains: 120,
};

class CacheManager {
  constructor() {
    this.cache = new NodeCache({ stdTTL: 30, checkperiod: 60, useClones: false });
    this.hits = 0;
    this.misses = 0;
  }

  get(key) {
    const val = this.cache.get(key);
    if (val !== undefined) { this.hits++; return val; }
    this.misses++;
    return null;
  }

  set(key, value, type = 'stats') {
    this.cache.set(key, value, TTL[type] || 30);
  }

  del(key) { this.cache.del(key); }
  flush() { this.cache.flushAll(); }

  stats() {
    return {
      hits: this.hits,
      misses: this.misses,
      keys: this.cache.keys().length,
      ...this.cache.getStats(),
    };
  }
}

module.exports = CacheManager;
