const cache = new Map();

function recordAndDiff(xId, newStats) {
  const key = String(xId);
  const prev = cache.get(key);
  cache.set(key, { stats: { ...newStats }, timestamp: Date.now() });
  if (!prev) return null;

  return {
    balance:  (newStats.balance  ?? 0) - (prev.stats.balance  ?? 0),
    rap:      (newStats.rap      ?? 0) - (prev.stats.rap      ?? 0),
    summary:  (newStats.summary  ?? 0) - (prev.stats.summary  ?? 0),
    hits:     (newStats.hits     ?? 0) - (prev.stats.hits     ?? 0),
    visits:   (newStats.visits   ?? 0) - (prev.stats.visits   ?? 0),
  };
}

function flush(xId) {
  cache.delete(String(xId));
}

module.exports = { recordAndDiff, flush };
