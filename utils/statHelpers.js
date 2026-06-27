const EMOJI = require('./emojis');
const { iconUnicode } = require('./iconMap');

function fmtBalance(n) {
  return `$${(n ?? 0).toLocaleString('en-US')}`;
}

function fmtShort(n) {
  n = n ?? 0;
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n.toLocaleString('en-US')}`;
}

function fmtNum(n) {
  return (n ?? 0).toLocaleString('en-US');
}

function buildDeltaAnsi(delta, mode = 'short') {
  if (!delta || delta === 0) return '';
  const fmt = mode === 'short' ? fmtShort(Math.abs(delta)) : fmtNum(Math.abs(delta));
  const GREEN = '\u001b[32m';
  const RED = '\u001b[31m';
  const RESET = '\u001b[0m';
  if (delta > 0) return `${GREEN}${EMOJI.arrow_up} +${fmt}${RESET}`;
  return `${RED}${EMOJI.arrow_down} -${fmt}${RESET}`;
}

function buildDeltaPlain(delta) {
  if (!delta || delta === 0) return '';
  const fmt = fmtShort(Math.abs(delta));
  if (delta > 0) return `${EMOJI.dot_green} ${EMOJI.arrow_up} +${fmt}`;
  return `${EMOJI.dot_red} ${EMOJI.arrow_down} -${fmt}`;
}

function buildDeltaTag(delta, mode = 'short') {
  if (delta == null || delta === 0) return '';
  const value = mode === 'short' ? fmtShort(Math.abs(delta)) : fmtNum(Math.abs(delta));
  if (delta > 0) return `\`[ ▲ +${value} ]\``;
  return `\`[ ▼ -${value} ]\``;
}

function buildStatFieldValue(mainValue, delta = null, mode = 'short') {
  if (delta == null || delta === 0) return mainValue;
  return `${mainValue} ${buildDeltaTag(delta, mode)}`;
}

const RANK_TIERS = [
  { min: 0.90, id: 'S+', label: 'LEGEND', icon: iconUnicode('MEDAL_1'), color: 0xF4C84A },
  { min: 0.75, id: 'S',  label: 'APEX',   icon: iconUnicode('MEDAL_2'), color: 0xF4C84A },
  { min: 0.55, id: 'A+', label: 'ELITE',  icon: iconUnicode('MEDAL_3'), color: 0x9B7FE8 },
  { min: 0.35, id: 'A',  label: 'RANKED', icon: iconUnicode('CAT_STATS'), color: 0x7C5CBF },
  { min: 0.15, id: 'B',  label: 'RISING', icon: iconUnicode('BTN_REFRESH'), color: 0xC0C8D8 },
  { min: 0.00, id: 'C',  label: 'ROOKIE', icon: iconUnicode('STATUS_INFO'), color: 0xEAE8F5 },
];

function getRankTier(value, maxValue) {
  const pct = maxValue > 0 ? Math.min(value / maxValue, 1) : 0;
  return RANK_TIERS.find(r => pct >= r.min) || RANK_TIERS[RANK_TIERS.length - 1];
}

function formatLastSeen(timestamp) {
  if (!timestamp) return 'Unknown';
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

function getRankMedal(rank) {
  if (rank === 1) return iconUnicode('MEDAL_1');
  if (rank === 2) return iconUnicode('MEDAL_2');
  if (rank === 3) return iconUnicode('MEDAL_3');
  return `\`#${rank}\``;
}

module.exports = {
  fmtBalance,
  fmtShort,
  fmtNum,
  buildDeltaAnsi,
  buildDeltaPlain,
  buildDeltaTag,
  buildStatFieldValue,
  getRankTier,
  formatLastSeen,
  getRankMedal,
  RANK_TIERS,
};
