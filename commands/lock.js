'use strict';

const { PermissionFlagsBits } = require('discord.js');
const ui = require('../utils/ui');
const { hasAnyStaffRole } = require('../config/roles');

async function execute(message) {
  if (!hasAnyStaffRole(message.member)) {
    return message.reply({ embeds: [ui.noPerm(message.client, 'Staff')] });
  }

  try {
    await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
      SendMessages: false,
    });
    await message.reply({ embeds: [ui.success(message.client, 'Channel Locked', 'This channel has been **locked**. Staff only.')] });
  } catch (err) {
    await message.reply({ embeds: [ui.error(message.client, 'Lock Failed', err.message)] });
  }
}

module.exports = { name: 'lock', execute };
