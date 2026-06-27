'use strict';

const ui = require('../utils/ui');
const { hasAnyStaffRole } = require('../config/roles');

async function execute(message, args) {
  if (!hasAnyStaffRole(message.member)) {
    return message.reply({ embeds: [ui.noPerm(message.client, 'Staff')] });
  }

  const text = args.join(' ');
  if (!text) {
    return message.reply({ embeds: [ui.error(message.client, 'No Message', 'Usage: `!say <message>`')] });
  }

  await message.delete().catch(() => {});
  await message.channel.send(text);
}

module.exports = { name: 'say', execute };
