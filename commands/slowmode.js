'use strict';

const { PermissionFlagsBits } = require('discord.js');
const ui = require('../utils/ui');
const { hasAnyStaffRole } = require('../config/roles');

async function execute(message, args) {
  if (!hasAnyStaffRole(message.member)) {
    return message.reply({ embeds: [ui.noPerm(message.client, 'Staff')] });
  }

  const seconds = parseInt(args[0], 10);

  if (isNaN(seconds) || seconds < 0 || seconds > 21600) {
    return message.reply({ embeds: [ui.error(message.client, 'Invalid Args', 'Usage: `!slowmode <0-21600>` (0 = off)')] });
  }

  try {
    await message.channel.setRateLimitPerUser(seconds);
    await message.reply({
      embeds: [ui.success(message.client, 'Slowmode Set', seconds === 0
        ? 'Slowmode has been **disabled** for this channel.'
        : `Slowmode set to **${seconds}s** for this channel.`)],
    });
  } catch (err) {
    await message.reply({ embeds: [ui.error(message.client, 'Slowmode Failed', err.message)] });
  }
}

module.exports = { name: 'slowmode', execute };
