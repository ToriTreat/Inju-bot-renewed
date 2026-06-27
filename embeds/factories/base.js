'use strict';

const { EmbedBuilder } = require('discord.js');
const { resolvePalette, SURFACE } = require('../tokens/colors');
const { buildAuthor } = require('./author');
const { buildFooter } = require('./footer');
const { botAvatar, isHttpUrl } = require('../tokens/avatar');
const { ZERO } = require('../tokens/zeroWidth');
const { toSmallCaps } = require('../../utils/smallCaps');

const DEFAULT_GIF_KEY = 'default';

function _truthy(value) {
  return value != null && value !== '' && value !== undefined;
}

function _resolveGifUrl(gifKey) {
  if (gifKey === false) return null;
  const key = gifKey || DEFAULT_GIF_KEY;
  try {
    const assets = require('../../utils/assets');
    const url = assets.getHeroGif ? assets.getHeroGif(key) : null;
    return isHttpUrl(url) ? url : null;
  } catch (_) {
    return null;
  }
}

function baseEmbed(options = {}) {
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
  } = options;

  const pal = resolvePalette(palette);

  const em = new EmbedBuilder().setColor(0x07060F);

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
  const gifUrl = _resolveGifUrl(gifKey);
  if (explicitImage) {
    em.setImage(image);
  } else if (gifUrl) {
    em.setImage(gifUrl);
  }

  em.setFooter(buildFooter(client, moduleName, requester));

  if (timestamp === false) {
    /* no timestamp */
  } else if (timestamp instanceof Date) {
    em.setTimestamp(timestamp);
  } else {
    em.setTimestamp();
  }

  return em;
}

module.exports = { baseEmbed, SURFACE, DEFAULT_GIF_KEY };
