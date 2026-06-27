'use strict';

const { baseEmbed } = require('../factories/base');
const { icon } = require('../../utils/iconMap');

const ICON = icon('STATUS_LOADING');

function system(client, title, body, opts = {}) {
  const safeTitle = String(title || 'PROCESSING').toUpperCase();
  const desc = body
    ? `${ICON} **${safeTitle}**\n\u200B\n${body}`
    : `${ICON} **${safeTitle}**\n\u200B\n> Awaiting response…`;
  return baseEmbed({
    palette: 'SYSTEM',
    client,
    authorTitle: title || 'PROCESSING',
    description: desc,
    moduleName: opts.moduleName || 'SYSTEM',
    requester: opts.requester,
    gifKey: opts.gifKey,
    image: opts.image,
  });
}

function processing(client, label, opts = {}) {
  return system(client, 'PROCESSING', label || 'Initiating link…', opts);
}

module.exports = { system, processing };
