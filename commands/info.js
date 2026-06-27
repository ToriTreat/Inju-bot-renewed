'use strict';

const { buildServerInfoEmbed } = require('./userinfo');

async function execute(message) {
  await message.reply({ embeds: [buildServerInfoEmbed(message.guild, message.client)] });
}

module.exports = { name: 'info', execute };
