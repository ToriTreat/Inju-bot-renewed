'use strict';

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { premiumEmbed, ACCENT } = require('../theme/premium');
const { buildAuthor } = require('../factories/author');
const { buildFooter } = require('../factories/footer');
const { userAvatar, isHttpUrl } = require('../tokens/avatar');
const { icon, iconUnicode } = require('../../utils/iconMap');
const EMOJI = require('../../utils/emojis');

function _delta(delta) {
  if (delta == null || delta === 0) return '';
  if (delta > 0) return ` \`▲ +${delta.toLocaleString('en-US')}\``;
  return ` \`▼ ${delta.toLocaleString('en-US')}\``;
}

function _row(emojis, metrics) {
  return emojis.map((e, i) => {
    const m = metrics[i] || { label: 'UNKNOWN', value: '`' + 'N/A' + '`', delta: null };
    return `**${m.label}**  ${m.value}${_delta(m.delta)}`;
  }).join('  ·  ');
}

function _identity(icon_, label, value) {
  return `**${label}**  ${value || '`' + '—' + '`'}`;
}

function PlayerCard(client, data = {}) {
  const {
    username = 'Unknown',
    avatarURL = null,
    rank = null,
    status = null,
    lastSeen = null,
    metrics = [],
    progress = null,
    pagination = null,
    moduleName = 'STATS',
    requester = null,
    gifKey = 'pinned',
    color = ACCENT.ELITE,
  } = data;

  const descParts = [];

  const rankEmoji = icon('MEDAL_1') || icon('DIAMOND') || '';
  const statusEmoji = (status && status.isVerified)
    ? icon('STATUS_SUCCESS')
    : icon('STATUS_WARNING');
  const seenEmoji = iconUnicode('BTN_REFRESH') || '⟳';

  const tierText = (rank && rank.badge)
    ? `${rankEmoji}  ${rank.badge}`
    : (rank && rank.tier ? `${rankEmoji}  \`${rank.tier}\`` : '`UNRANKED`');

  const statusText = (status && status.label)
    ? `${statusEmoji}  \`${status.label}\``
    : (status && status.isVerified ? `${statusEmoji}  \`VERIFIED\`` : `${statusEmoji}  \`UNVERIFIED\``);

  const seenText = lastSeen
    ? `<t:${Math.floor(lastSeen / 1000)}:R>`
    : '`—`';

  descParts.push('━'.repeat(28));
  descParts.push(
    `${rankEmoji}  ${_identity(rankEmoji, 'RANK', tierText)}  ·  ` +
    `${statusEmoji}  ${_identity(statusEmoji, 'STATUS', statusText)}  ·  ` +
    `${seenEmoji}  ${_identity(seenEmoji, 'LAST SEEN', seenText)}`
  );
  descParts.push('');

  if (metrics.length) {
    const half = Math.ceil(metrics.length / 2);
    const row1 = metrics.slice(0, half);
    const row2 = metrics.slice(half);

    const row1Emojis = row1.map(m => m.emoji || icon('DIAMOND') || '');
    const row2Emojis = row2.map(m => m.emoji || icon('DIAMOND') || '');

    descParts.push('━'.repeat(28));
    descParts.push(_row(row1Emojis, row1));
    descParts.push(_row(row2Emojis, row2));
  }

  if (progress && progress.value != null) {
    descParts.push('');
    descParts.push('━'.repeat(28));
    descParts.push(
      `**${String(progress.label || 'TIER PROGRESS').toUpperCase()}**  ` +
      `\`${progress.value}/${progress.max || 100}\``
    );
  }

  const thumb = avatarURL && isHttpUrl(avatarURL) ? avatarURL : null;

  const embed = premiumEmbed({
    palette: 'UTILITY',
    accentOverride: color,
    client,
    authorTitle: String(username).toUpperCase(),
    authorIcon: thumb,
    description: descParts.join('\n'),
    moduleName,
    requester,
    gifKey,
    timestamp: false,
    autoThumbnail: false,
  });

  const components = [];
  if (pagination) {
    const ctx = pagination.context || 'default';
    const prev = new ButtonBuilder()
      .setCustomId(`stats_prev_${ctx}`)
      .setEmoji(icon('BTN_REFRESH') || '⟳')
      .setLabel('Prev')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(!pagination.hasPrev);
    const next = new ButtonBuilder()
      .setCustomId(`stats_next_${ctx}`)
      .setLabel('Next  ▶')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(!pagination.hasNext);
    const row = new ActionRowBuilder().addComponents(prev, next);
    components.push(row);
  }

  return { embeds: [embed], components };
}

module.exports = { PlayerCard };
