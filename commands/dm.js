'use strict';

const ui = require('../utils/ui');

async function execute(message, args) {
  const target = message.mentions.users.first();
  const text   = args.slice(1).join(' ');

  if (!target || !text) {
    return message.reply({
      embeds: [ui.error('Missing Arguments', 'Usage: `!dm @user <message>`')]
    });
  }

  await message.delete().catch(() => {});

  try {
    await target.send(text);
  } catch (err) {
    // silently fail — no channel trace left
  }
}

module.exports = { name: 'dm', execute };
