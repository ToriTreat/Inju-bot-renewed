'use strict';

const OBSIDIAN = 0x07060F;

const SURFACE = {
  VOID: OBSIDIAN,
  DEEP: OBSIDIAN,
  NAVY: OBSIDIAN,
  ELEVATED: OBSIDIAN,
  HAIRLINE: OBSIDIAN,
};

const PALETTES = {
  SUCCESS: { bg: OBSIDIAN, hex: '#00FF7F', label: 'SUCCESS' },
  ERROR:   { bg: OBSIDIAN, hex: '#FF3344', label: 'ERROR'   },
  ADMIN:   { bg: OBSIDIAN, hex: '#FF3344', label: 'ADMIN'   },
  UTILITY: { bg: OBSIDIAN, hex: '#00D4FF', label: 'UTILITY' },
  SYSTEM:  { bg: OBSIDIAN, hex: '#8A2BE2', label: 'SYSTEM'  },
};

const ACCENT_HEX = {
  SUCCESS: '#00FF7F',
  ERROR: '#FF3344',
  ADMIN: '#FF3344',
  UTILITY: '#00D4FF',
  SYSTEM: '#8A2BE2',
};

const PALETTE_KEYS = Object.freeze(Object.keys(PALETTES));

function resolvePalette(key) {
  if (!key) return PALETTES.UTILITY;
  const upper = String(key).toUpperCase();
  return PALETTES[upper] || PALETTES.UTILITY;
}

function isValidHex(value) {
  if (value == null) return false;
  if (typeof value === 'number') return value >= 0 && value <= 0xFFFFFF;
  if (typeof value === 'string') return /^#?[0-9a-fA-F]{6}$/.test(value);
  return false;
}

module.exports = {
  SURFACE,
  PALETTES,
  ACCENT_HEX,
  PALETTE_KEYS,
  resolvePalette,
  isValidHex,
};
