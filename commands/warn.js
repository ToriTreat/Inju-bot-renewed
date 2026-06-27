'use strict';

const mongoose = require('mongoose');
const ui = require('../utils/ui');
const { hasAnyStaffRole } = require('../config/roles');
const Log = require('../database/models/Log');

async function execute(message, args) {
  if (!hasAnyStaffRole(message.member)) {
    return message.reply({ embeds: [ui.noPerm(message.client, 'Staff')] });
  }

  const target = message.mentions.users.first();
  const reason = args.slice(1).join(' ') || null;

  if (!target || !reason) {
    return message.reply({ embeds: [ui.error(message.client, 'Invalid Args', 'Usage: `!warn @user <reason>`')] });
  }

  if (mongoose.connection.readyState !== 1) {
    return message.reply({ embeds: [ui.error(message.client, 'DB Offline', 'Cannot save warning.')] });
  }

  try {
    await Log.create({
      action: 'warn',
      userId: target.id,
      moderatorId: message.author.id,
      reason,
      details: { userTag: target.tag },
      guildId: message.guild.id,
    });
    await message.reply({ embeds: [ui.success(message.client, 'Warning Issued', `**${target.tag}** was warned.\nReason: \`${reason}\``)] });
  } catch (err) {
    await message.reply({ embeds: [ui.error(message.client, 'Warn Failed', err.message)] });
  }
}

module.exports = { name: 'warn', execute };
