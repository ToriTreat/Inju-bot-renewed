'use strict';

const { icon, iconUnicode } = require('../utils/iconMap');
const eb = require('../utils/embedBuilder');
const ui = require('../utils/ui');
const assets = require('../utils/assets');
const data = require('../services/fetcher');

const TOP_N = 3;
const RULE = '━'.repeat(32);

function _pickUsername(entry) {
  return entry?.User?.userName ?? entry?.username ?? entry?.userName ?? entry?.rootName ?? 'Unknown';
}

function _pickValue(entry) {
  const t = entry?.Data?.Totals || entry || {};
  return t.Accounts ?? t.accounts
    ?? entry?.Accounts ?? entry?.accounts
    ?? entry?.amount
    ?? t.Clicks ?? t.clicks
    ?? entry?.Clicks ?? entry?.clicks
    ?? 0;
}

function _diamondRow(count) {
  if (count <= 0) return '';
  return icon('DIAMOND') + ' '.repeat(count > 1 ? 1 : 0) + Array.from({ length: count }, () => icon('DIAMOND')).join(' ').trim();
}

function _topRowBlock(entry, rankIdx) {
  const username = _pickUsername(entry);
  const value = _pickValue(entry);
  const crownSlot = rankIdx === 0 ? 'CROWN_RED' : rankIdx === 1 ? 'CROWN_GREY' : 'CROWN_GOLD';
  const crown = icon(crownSlot);
  const diamonds = _diamondRow(TOP_N - rankIdx);
  return { username, value, crown, diamonds };
}

function buildDailyEmbed(entries, client) {
  const top3 = entries.slice(0, TOP_N);
  const total = entries.length;
  const freshness = Math.floor(Date.now() / 1000);

  const authorName = 'DAILY HITTERS';

  const blocks = top3.map((entry, i) => {
    const { username, value, crown, diamonds } = _topRowBlock(entry, i);
    return `${diamonds}\n${crown}  **${username}**\n${icon('ICON_HITS')} \`${value}\``;
  });

  const description =
    `${icon('CROWN_PURPLE')}  ${authorName}  ${icon('CROWN_PURPLE')}\n` +
    `${RULE}\n` +
    blocks.join(`\n${RULE}\n`) +
    `\n${RULE}\n` +
    `${iconUnicode('BTN_STATS')}  TOTAL PLAYERS  \`${total}\`\n` +
    `${iconUnicode('BTN_REFRESH')}  LAST UPDATED  <t:${freshness}:R>`;

  return eb.createEmbed({
    palette: 'UTILITY',
    client,
    authorTitle: authorName,
    description,
    useBotAvatarThumb: true,
    image: assets.getHeroGif(),
    footer: `${iconUnicode('STATUS_SUCCESS')}  LIVE  ·  ASTRAL V2`,
  });
}

async function execute(message) {
  const loadMsg = await message.channel.send({
    embeds: [ui.loading(message.client, 'FETCHING DAILY RANKINGS')],
  });

  let raw;
  try {
    raw = await data.fetchDailyForUser(message.author.id);
  } catch {
    raw = null;
  }
  if (!raw) {
    return loadMsg.edit({
      embeds: [ui.error(message.client, 'FETCH FAILED', 'Could not retrieve daily leaderboard data.')],
    });
  }

  const list = Array.isArray(raw) ? raw : (raw.data || raw.Normal || []);
  if (!Array.isArray(list) || list.length === 0) {
    return loadMsg.edit({
      embeds: [ui.error(message.client, 'NO DATA', 'No daily entries found.')],
    });
  }

  const sorted = [...list].sort((a, b) => _pickValue(b) - _pickValue(a));
  const embed = buildDailyEmbed(sorted, message.client);
  await loadMsg.edit({ embeds: [embed], components: [] });
}

module.exports = {
  name: 'daily',
  description: 'Today top hitters (Accounts)',
  buildDailyEmbed,
  execute,
};
