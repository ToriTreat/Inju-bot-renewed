'use strict';

const { PermissionFlagsBits } = require('discord.js');
const ui = require('../utils/ui');
const { hasAnyStaffRole } = require('../config/roles');

async function execute(message, args) {
  if (!hasAnyStaffRole(message.member)) {
    return message.reply({ embeds: [ui.noPerm(message.client, 'Staff')] });
  }

  const action = args[0]?.toLowerCase();
  const target = message.mentions.members.first();
  const role = message.mentions.roles.first() || (args[2] ? message.guild.roles.cache.get(args[2]) : null);

  if (!['add', 'remove'].includes(action) || !target || !role) {
    return message.reply({ embeds: [ui.error(message.client, 'Invalid Args', 'Usage: `!role <add|remove> @user @role`')] });
  }

  const botMember = await message.guild.members.fetchMe();
  if (role.position >= botMember.roles.highest.position) {
    return message.reply({ embeds: [ui.error(message.client, 'Cannot Manage', 'That role is higher than my highest role.')] });
  }

  try {
    if (action === 'add') {
      await target.roles.add(role);
      await message.reply({ embeds: [ui.success(message.client, 'Role Added', `Added ${role} to **${target.user.tag}**.`)] });
    } else {
      await target.roles.remove(role);
      await message.reply({ embeds: [ui.success(message.client, 'Role Removed', `Removed ${role} from **${target.user.tag}**.`)] });
    }
  } catch (err) {
    await message.reply({ embeds: [ui.error(message.client, 'Role Failed', err.message)] });
  }
}

module.exports = { name: 'role', execute };
