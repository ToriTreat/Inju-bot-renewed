'use strict';

const { baseEmbed } = require('../factories/base');
const { icon } = require('../../utils/iconMap');

const ICON = icon('STATUS_LOADING');

function cooldown(client, command, seconds, opts = {}) {
  const cmd = String(command || 'command').replace(/^!/, '');
  const secs = Number(seconds) || 0;
  const desc = `${ICON} **COMMAND REJECTED**\n\u200B\nCooldown active for \`!${cmd}\`. Resets in **${secs}s**.`;
  return baseEmbed({
    palette: 'WARNING',
    client,
    authorTitle: 'Command Rejected',
    description: desc,
    moduleName: opts.moduleName || 'COOLDOWN',
    requester: opts.requester,
    gifKey: opts.gifKey,
    image: opts.image,
  });
}

module.exports = { cooldown };
