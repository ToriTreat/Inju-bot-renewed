'use strict';

const { baseEmbed } = require('../factories/base');
const { icon } = require('../../utils/iconMap');

const ICON = icon('STATUS_ERROR');

function error(client, title, reason, hint = null, opts = {}) {
  const safeTitle = String(title || 'ERROR').toUpperCase();
  let body = reason || 'An unknown error occurred.';
  if (hint) body += `\n\n**HINT:** ${hint}`;
  const desc = `${ICON} **${safeTitle}**\n\u200B\n${body}`;
  return baseEmbed({
    palette: 'ERROR',
    client,
    authorTitle: title,
    description: desc,
    moduleName: opts.moduleName || 'STATUS',
    requester: opts.requester,
    gifKey: opts.gifKey,
    image: opts.image,
  });
}

module.exports = { error };
