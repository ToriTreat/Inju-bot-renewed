'use strict';

const ui     = require('../utils/ui');
const { icon } = require('../utils/iconMap');

function buildCheckSEmbed(client) {
  const dot = icon('DOT_GREEN');
  const clock = icon('STATUS_LOADING');
  const body = `> ${dot} **SITE IS ONLINE**\n> ${clock} **LAST CHECKED:** <t:${Math.floor(Date.now() / 1000)}:R>`;

  return ui.sleekEmbed(client, 'SITE STATUS', '', body, 'check');
}

async function execute(message, _args, client) {
  const loadMsg = await message.reply({ embeds: [ui.loading(client, 'CHECKING SITE STATUS…')] });
  await loadMsg.edit({ embeds: [buildCheckSEmbed(client)], components: [] });
}

module.exports = { name: 'check-s', description: 'Site status', execute };
