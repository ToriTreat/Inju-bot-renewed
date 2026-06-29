'use strict';

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const theme = require('../utils/theme');

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
  const avatarURL = target.displayAvatarURL({ extension: 'png', size: 1024 });

  const embed = new EmbedBuilder()
    .setColor(theme.ASTRAL_CORE ?? 0x2B2D31)
    .setAuthor({ name: target.tag, iconURL: avatarURL })
    .setImage(avatarURL)
    .setFooter({ text: `ID: ${target.id}` });

  await message.reply({
    embeds:     [embed],
    components: [buildAvatarButtons(target)],
  });
}

module.exports = { name: 'avatar', execute, buildAvatarButtons };
