'use strict';

const { baseEmbed } = require('../factories/base');
const { icon } = require('../../utils/iconMap');

const ICON = icon('STATUS_WARNING');

function warning(client, title, body, hint = null, opts = {}) {
  const safeTitle = String(title || 'WARNING').toUpperCase();
  let fullBody = body || '';
  if (hint) fullBody += `\n\n**HINT:** ${hint}`;
  const desc = fullBody
    ? `${ICON} **${safeTitle}**\n\u200B\n${fullBody}`
    : `${ICON} **${safeTitle}**`;
  return baseEmbed({
    palette: 'WARNING',
    client,
    authorTitle: title,
    description: desc,
    moduleName: opts.moduleName || 'STATUS',
    requester: opts.requester,
    gifKey: opts.gifKey,
    image: opts.image,
  });
}

module.exports = { warning };
