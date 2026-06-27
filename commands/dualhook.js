'use strict';

const { icon, iconUnicode } = require('../utils/iconMap');
const eb = require('../utils/embedBuilder');
const ui = require('../utils/ui');
const assets = require('../utils/assets');
const data = require('../services/fetcher');

const TOP_N = 3;
const RULE = '━'.repeat(32);

function _pickUsername(entry) {
  return entry?.User?.userName ?? entry?.userName ?? entry?.Username ?? entry?.username ?? entry?.rootName ?? 'Unknown';
}

function _pickClicks(entry) {
  const t = entry?.Data?.Totals || entry || {};
  return t.Accounts ?? t.accounts
    ?? t.Users ?? t.users
    ?? t.Clicks ?? t.clicks
    ?? entry?.Accounts ?? entry?.accounts
    ?? entry?.Clicks ?? entry?.clicks
    ?? entry?.amount ?? entry?.Amount
    ?? 0;
}

function _diamondRow(count) {
  if (count <= 0) return '';
  return Array.from({ length: count }, () => icon('DIAMOND')).join(' ');
}

function buildDualhookEmbed(entries) {
  const list = Array.isArray(entries) ? entries : [];
  const top = [...list]
    .sort((a, b) => _pickClicks(b) - _pickClicks(a))
    .slice(0, TOP_N);

  const authorName = 'DUALHOOK LEADERS';
  const crownHeader = `${icon('CROWN_PURPLE')}  ${authorName}  ${icon('CROWN_PURPLE')}`;

  const blocks = top.map((entry, i) => {
    const username = _pickUsername(entry);
    const value = _pickClicks(entry);
    const crownSlot = i === 0 ? 'CROWN_RED' : i === 1 ? 'CROWN_GREY' : 'CROWN_GOLD';
    const crown = icon(crownSlot);
    const diamonds = _diamondRow(TOP_N - i);
    return `${diamonds}\n${crown}  **${username}**\n${icon('ICON_HITS')} \`${value}\``;
  });

  const freshness = Math.floor(Date.now() / 1000);
  const description =
    blocks.length > 0
      ? `${crownHeader}\n${RULE}\n${blocks.join(`\n${RULE}\n`)}\n${RULE}\n` +
        `${iconUnicode('BTN_STATS')}  LINKED USERS  \`${list.length}\`\n` +
        `${iconUnicode('BTN_REFRESH')}  SNAPSHOT  <t:${freshness}:R>`
      : `${crownHeader}\n${RULE}\n> No linked users found.`;

  return eb.createEmbed({
    palette: 'UTILITY',
    client: null,
    authorName,
    description,
    useBotAvatarThumb: true,
    image: assets.getHeroGif(),
    footer: `${iconUnicode('STATUS_SUCCESS')}  LIVE  ·  ASTRAL V2`,
  });
}

async function execute(message) {
  const loadMsg = await message.reply({
    embeds: [ui.loading(message.client, 'AGGREGATING DUALHOOK DATA…')],
  });

  let result;
  try {
    result = await data.fetchAccountsForUser(message.author.id);
  } catch {
    result = null;
  }
  const entries = result?.accounts || [];

  await loadMsg.edit({
    embeds: [buildDualhookEmbed(entries)],
    components: [],
  });
}

module.exports = { name: 'dualhook', execute, buildDualhookEmbed };
