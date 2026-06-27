'use strict';

const { PermissionFlagsBits } = require('discord.js');
const ui = require('../utils/ui');

async function execute(message, args) {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
    return message.reply({ embeds: [ui.noPerm(message.client, 'Manage Messages')] });
  }

  const amount = parseInt(args[0], 10);
  if (isNaN(amount) || amount < 1 || amount > 100) {
    return message.reply({ embeds: [ui.error('Invalid Number', 'Usage: `!purge <1-100>`')] });
  }

  try {
    const deleted = await message.channel.bulkDelete(amount, true);
    const reply = await message.channel.send({
      embeds: [ui.success('Purge Complete', `Deleted **${deleted.size}** messages.`)],
    });
    setTimeout(() => reply.delete().catch(() => {}), 3000);
  } catch (err) {
    message.reply({ embeds: [ui.error('Purge Failed', err.message)] });
  }
}

module.exports = { name: 'purge', execute };
