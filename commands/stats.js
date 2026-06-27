'use strict';

const axios = require('axios');
const { icon, iconUnicode } = require('../utils/iconMap');
const { fmtNum, fmtShort } = require('../utils/statHelpers');
const assets = require('../utils/assets');
const eb = require('../utils/embedBuilder');
const ui = require('../utils/ui');

const RULE = '━'.repeat(32);
const API_BASE = 'https://api.injuries.to';

function safeUpper(v, fallback = 'UNKNOWN') {
  return v == null ? fallback : String(v).toUpperCase();
}

// Resolve target Discord ID + display name.
// Supports: !stats @mention  |  !stats 123456789012345678  |  !stats (own)
async function resolveTarget(message, args) {
  // 1. @mention
  const mentioned = message.mentions.users.first();
  if (mentioned) return { id: mentioned.id, name: mentioned.username };

  // 2. Raw Discord ID passed as first argument (17-20 digit number)
  const rawId = args[0]?.replace(/\D/g, '');
  if (rawId && rawId.length >= 17 && rawId.length <= 20) {
    // Try to fetch the Discord user so we have a display name
    try {
      const user = await message.client.users.fetch(rawId);
      return { id: user.id, name: user.username };
    } catch {
      // User not found in Discord — still look them up by ID on the API
      return { id: rawId, name: rawId };
    }
  }

  // 3. Fallback — caller's own stats
  return { id: message.author.id, name: message.author.username };
}

function buildStatsEmbed(body, fallbackUsername) {
  const profile = body.Profile  || {};
  const normal  = body.Normal   || {};
  const partial = body.Partial  || null;
  const totals  = normal.Totals  || {};
  const highest = normal.Highest || {};

  const uname = safeUpper(profile.userName || fallbackUsername || 'UNKNOWN');

  const lines = [
    RULE,
    `**ALL-TIME STATS**`,
    RULE,
    `${icon('ICON_HITS')}  HITS        \`${fmtNum(totals.Accounts ?? 0)}\``,
    `${icon('ICON_VISITS')}  VISITS      \`${fmtNum(totals.Visits   ?? 0)}\``,
    `${icon('ICON_BALANCE')}  ROBUX       \`${fmtNum(totals.Balance  ?? 0)}\``,
    `${icon('ICON_RAP')}  RAP         \`${fmtShort(totals.Rap     ?? 0)}\``,
    `${icon('BTN_STATS')}  SUMMARY     \`${fmtNum(totals.Summary  ?? 0)}\``,
    `${icon('BTN_REFRESH')}  CLICKS      \`${fmtNum(totals.Clicks   ?? 0)}\``,
    ``,
    `**BIGGEST SINGLE HIT**`,
    RULE,
    `${icon('ICON_BALANCE')}  ROBUX       \`${fmtNum(highest.Balance ?? 0)}\``,
    `${icon('ICON_RAP')}  RAP         \`${fmtShort(highest.Rap   ?? 0)}\``,
    `${icon('BTN_STATS')}  SUMMARY     \`${fmtNum(highest.Summary ?? 0)}\``,
  ];

  if (partial) {
    const pt = partial.Totals  || {};
    const ph = partial.Highest || {};
    lines.push(
      ``,
      `**DUALHOOK STATS**`,
      RULE,
      `${icon('ICON_HITS')}  HITS        \`${fmtNum(pt.Accounts ?? 0)}\``,
      `${icon('ICON_VISITS')}  VISITS      \`${fmtNum(pt.Visits   ?? 0)}\``,
      `${icon('ICON_BALANCE')}  ROBUX       \`${fmtNum(pt.Balance  ?? 0)}\``,
      `${icon('ICON_RAP')}  RAP         \`${fmtShort(pt.Rap     ?? 0)}\``,
      `${icon('BTN_STATS')}  SUMMARY     \`${fmtNum(pt.Summary  ?? 0)}\``,
      `${icon('ICON_HITS')}  USERS       \`${fmtNum(pt.Users    ?? 0)}\``,
      ``,
      `**DUALHOOK BIGGEST HIT**`,
      RULE,
      `${icon('ICON_BALANCE')}  ROBUX       \`${fmtNum(ph.Balance ?? 0)}\``,
      `${icon('ICON_RAP')}  RAP         \`${fmtShort(ph.Rap    ?? 0)}\``,
      `${icon('BTN_STATS')}  SUMMARY     \`${fmtNum(ph.Summary ?? 0)}\``,
    );
  }

  return eb.createEmbed({
    palette: 'UTILITY',
    client: null,
    authorName: uname,
    description: lines.join('\n'),
    useBotAvatarThumb: true,
    image: assets.getHeroGif(),
    footer: `${iconUnicode('STATUS_SUCCESS')}  LIVE  ·  ASTRAL V2  ·  STATS`,
  });
}

async function execute(message, args) {
  const target = await resolveTarget(message, args);

  const loadMsg = await message.channel.send({
    embeds: [ui.loading(message.client, `LOCATING ${safeUpper(target.name, 'PLAYER')}`)],
  });

  let body;
  try {
    const res = await axios.get(`${API_BASE}/v1/public/user`, {
      params:  { userId: target.id },
      timeout: 10000,
      headers: {
        Accept:       'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Referer:      'https://injuries.to',
        Origin:       'https://injuries.to',
      },
    });
    body = res.data;
  } catch (err) {
    const status = err.response?.status;

    if (status === 403) {
      return loadMsg.edit({
        embeds: [eb.warningEmbed(null, 'PRIVATE ACCOUNT',
          `**${target.name}**'s account stats are private.`)],
      });
    }

    return loadMsg.edit({
      embeds: [eb.warningEmbed(null, 'NOT FOUND',
        target.id === message.author.id
          ? `Your Discord account isn't linked to injuries.to yet, or you have no recorded activity.`
          : `**${target.name}** hasn't linked their injuries.to account yet, or has no recorded activity.`)],
    });
  }

  if (!body?.success && !body?.Normal && !body?.Profile) {
    return loadMsg.edit({
      embeds: [eb.warningEmbed(null, 'NO DATA', `No stats found for **${target.name}**.`)],
    });
  }

  await loadMsg.edit({ embeds: [buildStatsEmbed(body, target.name)] });
}

module.exports = {
  name: 'stats',
  description: 'Player statistics from injuries.to',
  execute,
};
