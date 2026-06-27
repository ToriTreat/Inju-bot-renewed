'use strict';

const ui    = require('../utils/ui');
const { icon } = require('../utils/iconMap');
const api   = require('../services/api');

async function fetchDomainList() {
  try {
    const data = await api.getDomains();
    if (Array.isArray(data) && data.length > 0) return data;
    return null;
  } catch {
    return null;
  }
}

function ratingStars(n) {
  const full = Math.round((n || 0) / 20);
  return '★'.repeat(full) + '☆'.repeat(Math.max(0, 5 - full));
}

function domainRow(d, i) {
  return `**${i + 1}.** \`${d.domain}\`  ${ratingStars(d.rating)}  **${d.rating}%**`;
}

function buildDomainsEmbed(list, client) {
  const total = list.length;
  const avg = Math.round(list.reduce((s, d) => s + (d.rating || 0), 0) / total);

  const body =
    `> ${icon('STATUS_SUCCESS')} **${total} DOMAINS TRACKED**\n` +
    `> ${icon('MEDAL_1')} **AVG RATING:** \`${avg}%\`\n\n` +
    `${list.map((d, i) => domainRow(d, i)).join('\n')}`;

  return ui.sleekEmbed(client, 'DOMAIN TOPOLOGY', '', body, 'domains');
}

async function execute(message, _args, client) {
  const list = await fetchDomainList();
  if (!list) {
    return message.reply({ embeds: [ui.error(client, 'FETCH ERROR', 'COULD NOT RETRIEVE DOMAIN LIST.')] });
  }
  await message.reply({ embeds: [buildDomainsEmbed(list, client)] });
}

module.exports = {
  name: 'domains',
  description: 'Available domains list',
  execute,
};
