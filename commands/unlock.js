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
      SendMessages: null,
    });
    await message.reply({ embeds: [ui.success(message.client, 'Channel Unlocked', 'This channel has been **unlocked**.')] });
  } catch (err) {
    await message.reply({ embeds: [ui.error(message.client, 'Unlock Failed', err.message)] });
  }
}

module.exports = { name: 'unlock', execute };
