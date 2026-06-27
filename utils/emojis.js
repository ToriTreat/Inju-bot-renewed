'use strict';

const externalEmojis = require('./externalEmojis');
const { getHeroGif, getPinnedBanner, getAvatarUrl } = require('./assets');
const { icon } = require('./iconMap');

const STATIC_EMOJI = {
  dot_green:  icon('DOT_GREEN'),
  dot_red:    icon('DOT_RED'),
  dot_yellow: icon('STATUS_WARNING'),
  dot_gray:   icon('DOT_GRAY'),
  arrow_up:   '▲',
  arrow_down: '▼',
  diamond:    icon('DIAMOND'),

  medal_1:    icon('MEDAL_1'),
  medal_2:    icon('MEDAL_2'),
  medal_3:    icon('MEDAL_3'),
  crown:      icon('MEDAL_1'),
  trident:    icon('CROWN_PURPLE'),
  bolt:       icon('STATUS_WARNING'),
  target:     icon('BTN_STATS'),
  star:       icon('MEDAL_3'),
  lastSeen:   icon('STATUS_LOADING'),
  check:      icon('STATUS_SUCCESS'),
  cross:      icon('STATUS_ERROR'),
  clock:      icon('STATUS_LOADING'),
  sword:      icon('CAT_MODERATION'),

  globe:        icon('CAT_SYSTEM'),
  rocket:       icon('BTN_ROCKET'),
  dash:         '',
  externalLink: icon('BTN_VIEW_GUIDE'),
  fire:         icon('CROWN_FLAME'),

  robux:     icon('ICON_BALANCE'),
  chart:     icon('CAT_STATS'),
  ltd:       icon('DIAMOND'),
  cookie:    icon('ICON_COOKIE'),
  visits:    icon('ICON_VISITS'),
  valPerHit: icon('CROWN_FLAME'),
  rank:      icon('MEDAL_1'),
  status:    icon('BTN_STATUS'),
};

const CUSTOM_DEFINITIONS = {
  greentick:     { custom: '<a:tickgreen:1511768108543774751>' },
  redcross:      { custom: '<a:tickred:1512051419019214849>' },
  spin:          { custom: '<a:maruloader:1512123812387356854>' },
  customfire:    { custom: '<a:OrangeCrown:1511763550505537536>' },
  crownCustom:   { custom: '<a:crown:1511764846474035403>' },
  OrangeCrown:   { custom: '<a:OrangeCrown:1511763550505537536>' },
  robuxCustom:   { custom: '<:robux:1510356862904569936>' },
  rocketCustom:  { custom: '<a:rocket:1493306783706386532>' },
  whitefire:     { custom: '<a:OrangeCrown:1511763550505537536>' },
  Admin:         { custom: '<:Moderator:1512131952898085077>' },
};

function _extractId(customStr) {
  if (typeof customStr !== 'string') return null;
  const m = customStr.match(/:(\d{17,20})>/);
  return m ? m[1] : null;
}

function _isAvailable(id) {
  if (!id) return false;
  if (typeof global === 'undefined' || !global.client) return false;
  try {
    return !!(global.client && global.client.emojis && global.client.emojis.cache && global.client.emojis.cache.has(id));
  } catch {
    return false;
  }
}

function resolveCustom(def) {
  const id = _extractId(def.custom);
  if (id && _isAvailable(id)) return def.custom;
  return '';
}

function buildEmoji() {
  const out = { ...STATIC_EMOJI };
  for (const [key, def] of Object.entries(CUSTOM_DEFINITIONS)) {
    out[key] = resolveCustom(def);
  }
  return out;
}

const EMOJI = buildEmoji();

function reResolve() {
  Object.assign(EMOJI, buildEmoji());
  return EMOJI;
}

module.exports = EMOJI;
module.exports.EMOJI = EMOJI;
module.exports.CUSTOM = EMOJI;
module.exports.reResolve = reResolve;
module.exports.icon = icon;
module.exports.STATIC_EMOJI = STATIC_EMOJI;
module.exports.CUSTOM_DEFINITIONS = CUSTOM_DEFINITIONS;
module.exports.getThumbnail = externalEmojis.getThumbnail;
module.exports.getHeroGif = getHeroGif;
module.exports.getPinnedBanner = getPinnedBanner;
module.exports.getAvatarUrl = getAvatarUrl;
module.exports.getHeroImage = require('./assets').getHeroImage;
module.exports.getRandomHero = require('./assets').getRandomHero;
module.exports.HERO_POOL = require('./assets').HERO_POOL;
