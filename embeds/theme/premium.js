'use strict';

const { EmbedBuilder } = require('discord.js');
const { resolvePalette, PALETTES } = require('../tokens/colors');
const { buildAuthor } = require('../factories/author');
const { buildFooter } = require('../factories/footer');
const { botAvatar, isHttpUrl } = require('../tokens/avatar');
const { ZERO } = require('../tokens/zeroWidth');
const { icon, ICON_MAP } = require('../../utils/iconMap');
const { getPinnedBanner, getRandomHero, isValidGifUrl } = require('../../utils/assets');
const { toSmallCaps } = require('../../utils/smallCaps');

const PREMIUM = {
  GOLD:       0xFFD700,
  CYAN:       0x00D4FF,
  MAGENTA:    0x8A2BE2,
  AMBER:      0xFFB347,
  ROYAL:      0x6A0DAD,
  STEEL:      0x2C2F36,
  OBSIDIAN:   0x07060F,
  DIAMOND:    0xB9F2FF,
  CRIMSON:    0xFF3344,
  EMERALD:    0x00FF7F,
};

const ACCENT = {
  SUCCESS: PREMIUM.EMERALD,
  ERROR:   PREMIUM.CRIMSON,
  WARNING: PREMIUM.AMBER,
  ADMIN:   PREMIUM.CRIMSON,
  UTILITY: PREMIUM.CYAN,
  SYSTEM:  PREMIUM.MAGENTA,
  PREMIUM: PREMIUM.GOLD,
  ELITE:   PREMIUM.GOLD,
};

const RULE_GOLD = '━';

function premiumRule(label, width = 32) {
  if (!label) return RULE_GOLD.repeat(width);
  const labelText = `  ${String(label).toUpperCase()}  `;
  const sideLen = Math.max(3, Math.floor((width - labelText.length) / 2));
  return RULE_GOLD.repeat(sideLen) + labelText + RULE_GOLD.repeat(sideLen);
}

function premiumHeader(iconSlot, text) {
  const ic = iconSlot ? icon(iconSlot) : null;
  const prefix = ic ? `${ic}  ` : '';
  return `${prefix}**${String(text).toUpperCase()}**`;
}

function premiumField(name, value, inline = true) {
  if (value == null || value === '') return null;
  return { name: String(name || ZERO), value: String(value), inline };
}

function premiumFooter(client, moduleName, requester) {
  const baseFooter = buildFooter(client, moduleName, requester);
  baseFooter.text = baseFooter.text;
  return baseFooter;
}

function premiumDivider(label) {
  return premiumRule(label, 38);
}

function resolveAccent(palette) {
  if (!palette) return ACCENT.UTILITY;
  const upper = String(palette).toUpperCase();
  return ACCENT[upper] || ACCENT.UTILITY;
}

function resolveBaseColor(palette) {
  if (!palette) return PREMIUM.OBSIDIAN;
  const upper = String(palette).toUpperCase();
  if (ACCENT[upper]) return ACCENT[upper];
  const pal = PALETTES[upper];
  return pal?.bg ?? PREMIUM.OBSIDIAN;
}

function premiumEmbed(options = {}) {
  const {
    palette = 'UTILITY',
    color = null,
    client = null,
    title = null,
    authorTitle = null,
    authorIcon = null,
    description = null,
    fields = null,
    thumbnail = null,
    image = null,
    gifKey = undefined,
    moduleName = null,
    requester = null,
    timestamp = null,
    enforceBrand = true,
    autoThumbnail = true,
    premiumBanner = true,
    accentOverride = null,
  } = options;

  const accentColor = accentOverride != null ? accentOverride : resolveAccent(palette);

  const em = new EmbedBuilder()
    .setColor(0x07060F)
    .setTimestamp();

  em.data.accent_color = accentColor;

  const scTitle = toSmallCaps(title);
  const scAuthorTitle = toSmallCaps(authorTitle);
  const scDesc = toSmallCaps(description);
  const scFields = Array.isArray(fields) ? fields.map(f => ({
    name: toSmallCaps(f.name),
    value: toSmallCaps(f.value),
    inline: f.inline,
  })) : fields;

  if (enforceBrand) {
    em.setAuthor(buildAuthor(client, scAuthorTitle || scTitle, { iconURL: authorIcon }));
  } else if (scAuthorTitle) {
    em.setAuthor(buildAuthor(client, scAuthorTitle, { iconURL: authorIcon }));
  }

  if (scTitle) em.setTitle(scTitle);

  if (scDesc) {
    em.setDescription(scDesc);
  } else if (enforceBrand) {
    em.setDescription(ZERO);
  }

  if (Array.isArray(scFields) && scFields.length) em.addFields(scFields);

  const thumb = thumbnail || (autoThumbnail ? botAvatar(client) : null);
  if (isHttpUrl(thumb)) em.setThumbnail(thumb);

  const explicitImage = isHttpUrl(image);
  let bannerUrl = null;
  if (premiumBanner && !explicitImage) {
    if (gifKey === 'pinned' || gifKey === 'banner') {
      bannerUrl = getPinnedBanner();
    } else if (gifKey === false || gifKey === null) {
      bannerUrl = null;
    } else {
      bannerUrl = getRandomHero();
    }
  }

  if (explicitImage) {
    em.setImage(image);
  } else if (bannerUrl && isValidGifUrl(bannerUrl)) {
    em.setImage(bannerUrl);
  }

  em.setFooter(premiumFooter(client, moduleName, requester));

  if (timestamp === false) {
    /* skip */
  } else if (timestamp instanceof Date) {
    em.setTimestamp(timestamp);
  }

  return em;
}

module.exports = {
  PREMIUM,
  ACCENT,
  premiumRule,
  premiumDivider,
  premiumHeader,
  premiumField,
  premiumFooter,
  resolveAccent,
  resolveBaseColor,
  premiumEmbed,
  RULE_GOLD,
  ICON_MAP,
};
