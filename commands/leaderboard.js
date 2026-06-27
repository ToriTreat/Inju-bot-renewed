'use strict';

const { icon, iconUnicode } = require('../utils/iconMap');
const { fmtBalance, fmtNum, fmtShort } = require('../utils/statHelpers');
const eb = require('../utils/embedBuilder');
const ui = require('../utils/ui');
const assets = require('../utils/assets');
const data = require('../services/fetcher');

const TOP_N = 3;
const RULE = '━'.repeat(32);

const RANK_MEDALS = ['🥇', '🥈', '🥉'];
const RANK_LABELS = ['#1', '#2', '#3'];

function _pickUsername(entry) {
  return entry?.User?.userName ?? entry?.userName ?? entry?.Username ?? entry?.username ?? entry?.rootName ?? 'Unknown';
}

function _pickData(entry) {
  // Handles both partial_users shape { userName, Data } and legacy WS shape { User, Data }
  const d = entry?.Data || {};
  const t = d.Totals || d;
  return {
    accounts: t.Accounts ?? t.accounts ?? entry?.Accounts ?? entry?.accounts ?? 0,
    visits:   t.Visits   ?? t.visits   ?? entry?.Visits   ?? entry?.visits   ?? 0,
    balance:  t.Balance  ?? t.balance  ?? entry?.Balance  ?? entry?.balance  ?? 0,
    rap:      t.Rap      ?? t.rap      ?? t.RAP            ?? entry?.Rap     ?? entry?.RAP ?? 0,
    summary:  t.Summary  ?? t.summary  ?? entry?.Summary  ?? 0,
    clicks:   t.Clicks   ?? t.clicks   ?? entry?.Clicks   ?? 0,
  };
}

function buildLeaderboardEmbed(client, entries) {
  const top3 = entries.slice(0, TOP_N);
  const total = entries.length;
  const freshness = Math.floor(Date.now() / 1000);

  const blocks = top3.map((entry, i) => {
    const name = _pickUsername(entry);
    const d = _pickData(entry);
    const medal = RANK_MEDALS[i] ?? `#${i + 1}`;

    return [
      `${medal}  **${name}**`,
      `${icon('ICON_HITS')}  HITS       \`${fmtNum(d.accounts)}\``,
      `${icon('ICON_VISITS')}  VISITS     \`${fmtNum(d.visits)}\``,
      `${icon('ICON_BALANCE')}  ROBUX      \`${fmtBalance(d.balance)}\``,
      `${icon('ICON_RAP')}  RAP        \`$${fmtShort(d.rap)}\``,
    ].join('\n');
  });

  const description =
    `${icon('CROWN_PURPLE')}  **TOP 3 HITTERS**  ${icon('CROWN_PURPLE')}\n` +
    `${RULE}\n` +
    blocks.join(`\n${RULE}\n`) +
    `\n${RULE}\n` +
    `${iconUnicode('BTN_STATS')}  TOTAL PLAYERS  \`${total}\`\n` +
    `${iconUnicode('BTN_REFRESH')}  LAST UPDATED  <t:${freshness}:R>`;

  return eb.createEmbed({
    palette: 'UTILITY',
    client,
    authorTitle: 'TOP 3 HITTERS',
    description,
    useBotAvatarThumb: true,
    image: assets.getHeroGif(),
    footer: `${iconUnicode('STATUS_SUCCESS')}  LIVE  ·  ASTRAL V2`,
  });
}

async function execute(message) {
  const loadMsg = await message.channel.send({
    embeds: [ui.loading(message.client, 'LOCATING NETWORK RANKINGS')],
  });

  let lb;
  try {
    lb = await data.fetchLeaderboard();
  } catch {
    lb = null;
  }
  if (!lb) {
    return loadMsg.edit({
      embeds: [ui.error(message.client, 'FETCH FAILED', 'Could not retrieve leaderboard data.')],
    });
  }

  // Use the REAL dualhook users from the partial_users WS message.
  // These are sorted by Data.Accounts (all-time hits) descending.
  // lb.Normal = global injuries.to leaderboard (not your users).
  const entries = lb.Partial?.length
    ? lb.Partial
    : (lb.Normal?.length ? lb.Normal : []);

  if (entries.length === 0) {
    return loadMsg.edit({
      embeds: [ui.error(message.client, 'NO DATA', 'Leaderboard is empty.')],
    });
  }

  // Sort descending by hits/accounts in case the source isn't pre-sorted
  const sorted = [...entries].sort((a, b) => {
    const da = _pickData(a);
    const db = _pickData(b);
    return db.accounts - da.accounts;
  });

  const embed = buildLeaderboardEmbed(message.client, sorted);

  await loadMsg.edit({
    embeds: [embed],
    components: [],
  });
}

module.exports = {
  name: 'leaderboard',
  description: 'Top 3 hitters',
  buildLeaderboardEmbed,
  execute,
};
