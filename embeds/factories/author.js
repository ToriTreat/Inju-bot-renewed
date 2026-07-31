'use strict';

const { botAvatar, isHttpUrl } = require('../tokens/avatar');
const { BRAND_URL } = require('../tokens/brand');
const { toSmallCaps } = require('../../utils/smallCaps');

function buildAuthor(client, title, opts = {}) {
  const upper = title ? String(title).toUpperCase().trim() : 'INFO';
  const name = opts.name || `[ ${toSmallCaps(upper)} ]`;
  const icon = opts.iconURL || botAvatar(client);
  const url = opts.url || BRAND_URL;
  const out = { name };
  if (isHttpUrl(icon)) out.iconURL = icon;
  if (isHttpUrl(url)) out.url = url;
  return out;
}
module.exports = { buildAuthor };
