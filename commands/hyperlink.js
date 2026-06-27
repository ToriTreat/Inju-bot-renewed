'use strict';

const { EmbedBuilder } = require('discord.js');
const theme = require('../utils/theme');
const ui    = require('../utils/ui');
const eb    = require('../utils/embedBuilder');
const ce    = require('../utils/customEmojis');
const assets = require('../utils/assets');

async function execute(message, args) {
  const url  = args[0];
  const text = args.slice(1).join(' ');

  if (!url || !text) {
    return message.reply({
      embeds: [ui.error('Missing Arguments', 'Usage: `!hyperlink <url> <display text>`')]
    });
  }

  try { new URL(url); } catch {
    return message.reply({ embeds: [ui.error('Invalid URL', 'The URL you provided is not valid.')] });
  }

  const masked = `[${text}](${url})`;

  const embed = eb.hyperlinkEmbed(masked, url, {});
  await message.reply({ embeds: [embed] });
}

module.exports = { name: 'hyperlink', execute };
