'use strict';

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const theme = require('../utils/theme');
const ui    = require('../utils/ui');
const { getHeroGif } = require('../utils/emojis');
const eb    = require('../utils/embedBuilder');

function buildAvatarEmbed(target, client) {
  return eb.avatarEmbed(target, { client });
}

function buildAvatarButtons(target) {
  return new ActionRowBuilder().addComponents(
    ...[64, 128, 256, 1024].map(size =>
      new ButtonBuilder()
        .setLabel(`${size}px`)
        .setStyle(ButtonStyle.Link)
        .setURL(target.displayAvatarURL({ extension: 'png', size }))
    )
  );
}

async function execute(message) {
  const target = message.mentions.users.first() ?? message.author;
  await message.reply({
    embeds:     [buildAvatarEmbed(target, message.client)],
    components: [buildAvatarButtons(target)],
  });
}

module.exports = { name: 'avatar', execute, buildAvatarEmbed, buildAvatarButtons };
