'use strict';

const { baseEmbed } = require('../factories/base');
const { PALETTES } = require('../tokens/colors');
const { icon } = require('../../utils/iconMap');

const ICON = icon('STATUS_SUCCESS');

function success(client, title, body, opts = {}) {
  const pal = PALETTES.SUCCESS;
  const desc = body
    ? `${ICON} **${String(title || 'SUCCESS').toUpperCase()}**\n\u200B\n${body}`
    : `${ICON} **${String(title || 'SUCCESS').toUpperCase()}**`;
  return baseEmbed({
    palette: 'SUCCESS',
    client,
    authorTitle: title,
    description: desc,
    moduleName: opts.moduleName || 'STATUS',
    requester: opts.requester,
    gifKey: opts.gifKey,
    image: opts.image,
  });
}

module.exports = { success };
