const cooldowns = new Map();

module.exports = {
  check(userId, command, duration = 5000) {
    const key = `${userId}-${command}`;
    const now = Date.now();
    if (cooldowns.has(key)) {
      const expiry = cooldowns.get(key);
      if (now < expiry) {
        const remaining = ((expiry - now) / 1000).toFixed(1);
        return { onCooldown: true, remaining };
      }
    }
    cooldowns.set(key, now + duration);
    return { onCooldown: false, remaining: 0 };
  },

  clear() {
    cooldowns.clear();
  },
};
