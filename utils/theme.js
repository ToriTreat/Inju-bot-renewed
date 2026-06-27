'use strict';

const { PALETTES } = require('../embeds/tokens/colors');
const { PREMIUM, ACCENT } = require('../embeds/theme/premium');

const VOID = PREMIUM.OBSIDIAN;

const SURF = {
  VOID:      VOID,
  DEEP:      VOID,
  DARK_BLUE: VOID,
  DEEP_BLUE: VOID,
  BLUEBLACK: VOID,
  MIDNIGHT:  VOID,
  NAVY:      VOID,
  ELEVATED:  VOID,
  HAIRLINE:  VOID,
};

const COLORS = {
  ...SURF,
  SUCCESS:     ACCENT.SUCCESS,
  ERROR:       ACCENT.ERROR,
  WARNING:     ACCENT.WARNING,
  DANGER:      ACCENT.ERROR,
  MUTED:       VOID,
  LEADERBOARD: ACCENT.UTILITY,
  STATS:       ACCENT.ELITE,
  SYSTEM:      ACCENT.SYSTEM,
};

const ALIASES = {
  VOID:           VOID,
  DEEP:           VOID,
  DARK_BLUE:      VOID,
  DEEP_BLUE:      VOID,
  BLUEBLACK:      VOID,
  MIDNIGHT:       VOID,
  NAVY:           VOID,
  CYAN:           PREMIUM.CYAN,
  CYAN_GLOW:      PREMIUM.CYAN,
  ELECTRIC:       PREMIUM.CYAN,
  BLUE_BLADE:     PREMIUM.CYAN,
  PURPLE:         PREMIUM.MAGENTA,
  PURPLE_BRIGHT:  PREMIUM.MAGENTA,
  NEBULA:         PREMIUM.ROYAL,
  ASTRAL_FLARE:   PREMIUM.CYAN,
  GOLD:           PREMIUM.GOLD,
  LEGENDARY:      PREMIUM.GOLD,
  SILVER:         PREMIUM.STEEL,
  BRONZE:         PREMIUM.AMBER,
  PLATINUM:       PREMIUM.DIAMOND,
  STARLIGHT:      PREMIUM.DIAMOND,
  GREEN:          ACCENT.SUCCESS,
  RED:            ACCENT.ERROR,
  WHITE:          0xffffff,
  ELITE_GOLD:     PREMIUM.GOLD,
  TITANIUM:       PREMIUM.STEEL,
  BLURPLE:        PREMIUM.ROYAL,
  OPERATIVE_GREEN: ACCENT.SUCCESS,
  ALERT_RED:      ACCENT.ERROR,
  WARNING_AMBER:  ACCENT.WARNING,
  VOID_BLACK:     VOID,
  NEON_CYAN:      PREMIUM.CYAN,
  BRAND:          ACCENT.UTILITY,
  BRAND_DIM:      PREMIUM.STEEL,
  STATS_ELITE:    ACCENT.ELITE,
  STATS_NEG:      ACCENT.ERROR,
  TICKET_OPEN:    ACCENT.UTILITY,
  TICKET_CLOSED:  PREMIUM.STEEL,
  VOUCH:          ACCENT.WARNING,
  VOUCH_HIGH:     ACCENT.ELITE,
  USERINFO:       ACCENT.UTILITY,
  SERVER:         ACCENT.SYSTEM,
  SYSTEM_OK:      ACCENT.SUCCESS,
  SYSTEM_WARN:    ACCENT.WARNING,
  SYSTEM_DOWN:    ACCENT.ERROR,
  HYPERLINK:      ACCENT.UTILITY,
  VERIFY:         ACCENT.SUCCESS,
  SETTOKEN:       ACCENT.UTILITY,
  SITE:           ACCENT.ELITE,
  SUPPORT:        ACCENT.UTILITY,
  AVATAR:         ACCENT.UTILITY,
  HELP:           ACCENT.UTILITY,
  DM:             ACCENT.UTILITY,
  ASTRA_VOID:     VOID,
  ASTRA_BLADE:    PREMIUM.CYAN,
  ASTRA_ENERGY:   ACCENT.WARNING,
  ASTRAL_PRIMARY: ACCENT.UTILITY,
  ASTRAL_GLOW:    PREMIUM.CYAN,
  ASTRAL_CORE:    ACCENT.SYSTEM,
  ASTRAL_DIVINE:  PREMIUM.GOLD,
};

const COLOR_ALIAS = { ...COLORS, ...ALIASES };

const proxy = new Proxy({}, {
  get(_t, key) {
    if (key === 'COLORS') return COLORS;
    if (key === 'ALIASES') return ALIASES;
    if (key === '__esModule') return false;
    if (typeof key === 'string' && key in COLOR_ALIAS) return COLOR_ALIAS[key];
    if (key === 'resolvePalette') return require('../embeds/tokens/colors').resolvePalette;
    if (key === 'PALETTES') return PALETTES;
    if (key === 'SURFACE') return SURF;
    if (key === 'PREMIUM') return PREMIUM;
    if (key === 'ACCENT') return ACCENT;
    return undefined;
  },
  has(_t, key) {
    if (typeof key !== 'string') return false;
    return key in COLOR_ALIAS || key === 'COLORS' || key === 'ALIASES' || key === 'PALETTES' || key === 'SURFACE' || key === 'PREMIUM' || key === 'ACCENT';
  },
});

module.exports = proxy;
module.exports.default = proxy;
module.exports.COLORS = COLORS;
module.exports.PREMIUM = PREMIUM;
module.exports.ACCENT = ACCENT;
