'use strict';

const emojiClient = require('./emojiClient');

const SYMBOL = {
  crown:    '\u25C6',
  fire:     '\u25C6',
  star:     '\u25C6',
  shield:   '\u25C6',
  check:    '\u2714',
  cross:    '\u2718',
  loading:  '\u25C6',
  robux:    '\u25C6',
  ban:      '\u25C6',
  money:    '\u25C6',
  diamond:  '\u25C6',
  cookie:   '\u25C6',
  eye:      '\u25C6',
  chart:    '\u25C6',
  ticket:   '\u25C6',
  support:  '\u25C6',
  trophy:   '\u25C6',
  unlock:   '\u25C6',
  lock:     '\u25C6',
  rocket:   '\u25C6',
  sword:    '\u25C6',
  clock:    '\u25C6',
  bolt:     '\u25C6',
  target:   '\u25C6',
  signal:   '\u25C6',
  online:   '\u25C6',
  offline:  '\u25C6',
  warn:     '\u25C6',
  medal:    '\u25C6',
};

const KEYWORDS = {
  crown:    ['crown'],
  fire:     ['Fire', 'BlobFire'],
  star:     ['star'],
  shield:   ['DiscordShield', 'SHIELD'],
  check:    ['CheckMark', 'CheckMark_Win10'],
  cross:    [],
  loading:  ['loading', 'thinkloading'],
  robux:    [],
  ban:      ['BanHammer4', 'banhammer3', 'banned', 'banhammer'],
  money:    ['gamemoney', 'goodmoney'],
  diamond:  ['DiamondAnimated', 'miningfordiamonds'],
  cookie:   ['rengecookie', 'cookie'],
  eye:      [],
  chart:    ['up_graph', 'down_graph'],
  ticket:   ['pingTicket'],
  support:  ['Support', 'earlysupporter'],
  trophy:   ['trophyping', 'trophy'],
  unlock:   [],
  lock:     [],
  rocket:   ['Rocketleague', 'rocket'],
  sword:    ['minecraftsword', 'sword'],
  clock:    [],
  bolt:     [],
  target:   [],
  signal:   ['WifiChan'],
  online:   ['OnlineDOT', 'online'],
  offline:  ['OfflineDOT', 'offline'],
  warn:     ['Warning', 'WarningPC'],
  medal:    ['gold', 'RedditSilver'],
};

function getThumbnail(key) {
  const candidates = KEYWORDS[key];
  if (candidates && candidates.length > 0) {
    const url = emojiClient.getCDN(...candidates);
    if (url) return url;
  }
  return null;
}

function inline(key) {
  return SYMBOL[key] || '\u25C6';
}

async function init() {
  try {
    await emojiClient.fetchAll();
  } catch (e) {
    console.warn('emoji.gg API unavailable');
  }
}

module.exports = { getThumbnail, inline, init };
