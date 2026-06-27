'use strict';

const mongoose = require('mongoose');
const ui = require('../utils/ui');
const eb = require('../utils/embedBuilder');
const Log = require('../database/models/Log');

async function execute(message, args) {
  const target = message.mentions.users.first() || message.author;

  if (mongoose.connection.readyState !== 1) {
    return message.reply({ embeds: [ui.error(message.client, 'DB Offline', 'Cannot fetch warnings.')] });
  }

  try {
    const warns = await Log.find({ action: 'warn', userId: target.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    if (warns.length === 0) {
      return message.reply({ embeds: [ui.info(message.client, 'Warnings', `**${target.tag}** has no warnings.`)] });
    }

    const lines = warns.map((w, i) =>
      `**#${i + 1}** — ${w.reason || 'No reason'}\n> By <@${w.moderatorId}> · <t:${Math.floor(new Date(w.createdAt).getTime() / 1000)}:R>`
    );

    return message.reply({
      embeds: [eb.createEmbed({
        palette: 'UTILITY',
        client: message.client,
        authorTitle: `Warnings — ${target.tag}`,
        description: lines.join('\n\n'),
        footer: `Total: ${warns.length}`,
      })],
    });
  } catch (err) {
    await message.reply({ embeds: [ui.error(message.client, 'Fetch Failed', err.message)] });
  }
}

module.exports = { name: 'warnings', execute };
