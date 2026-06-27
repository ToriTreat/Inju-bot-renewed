'use strict';

const { baseEmbed } = require('../factories/base');
const { icon } = require('../../utils/iconMap');

const ICON = icon('STATUS_INFO');

function info(client, title, body, opts = {}) {
  const safeTitle = String(title || 'INFO').toUpperCase();
  const desc = body
    ? `${ICON} **${safeTitle}**\n\u200B\n${body}`
    : `${ICON} **${safeTitle}**`;
  return baseEmbed({
    palette: 'UTILITY',
    client,
    authorTitle: title,
    description: desc,
    moduleName: opts.moduleName || 'INFO',
    requester: opts.requester,
    fields: opts.fields,
    gifKey: opts.gifKey,
    image: opts.image,
  });
}

module.exports = { info };
