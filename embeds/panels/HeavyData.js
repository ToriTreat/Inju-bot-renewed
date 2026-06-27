'use strict';

const { premiumEmbed, premiumDivider, ACCENT } = require('../theme/premium');
const { formatTable } = require('../tokens/table');
const { asciiRule, thinRule } = require('../tokens/divider');
const { tsRelative, tsFull } = require('../tokens/timestamp');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { userAvatar } = require('../tokens/avatar');
const { section, EMPTY } = require('../factories/field');
const { icon, iconUnicode } = require('../../utils/iconMap');

function _fmt(n) {
  if (n == null || isNaN(n)) return '—';
  return Number(n).toLocaleString('en-US');
}

function _medal(rank) {
  if (rank === 1) return icon('MEDAL_1');
  if (rank === 2) return icon('MEDAL_2');
  if (rank === 3) return icon('MEDAL_3');
  return `\`#${rank}\``;
}

function HeavyData(client, data = {}) {
  const {
    title = 'Combat Telemetry',
    subject = null,
    sections = [],
    metrics = [],
    progress = [],
    pagination = null,
    cachedAt = new Date(),
    requester = null,
    moduleName = 'TELEMETRY',
    image = null,
    color = null,
    gifKey = 'pinned',
  } = data;

  const descParts = [];
  descParts.push(premiumDivider('Heavy Data'));
  descParts.push('');
  if (subject) {
    const subLine = subject.tag
      ? `**SUBJECT**  ${subject.mention || `<@${subject.id}>`}  \`(${subject.tag})\``
      : `**SUBJECT**  ${subject.mention || '`—`'}`;
    descParts.push(subLine);
  }

  if (sections.length) {
    for (const sec of sections) {
      descParts.push(section(sec.title));
      descParts.push(sec.body || EMPTY);
    }
  }

  if (metrics.length) {
    descParts.push(section('Metrics'));
    const rows = metrics.map(m => [
      m.label || EMPTY,
      `\`${_fmt(m.value)}\``,
      m.delta != null ? (m.delta > 0 ? ` ▲+${_fmt(m.delta)}` : ` ▼${_fmt(m.delta)}`) : '',
    ]);
    descParts.push('```yaml\n' + formatTable(rows) + '\n```');
  }

  if (progress.length) {
    descParts.push(section('Progress'));
    const lines = progress.map(p => {
      const label = p.label || 'Progress';
      const value = p.value || 0;
      const max = p.max || 100;
      const style = p.style || 'block';
      return `**${label}**  \`${_fmt(value)}/${_fmt(max)}\``;
    });
    descParts.push(lines.join('\n'));
  }

  descParts.push('');
  descParts.push(`__**CACHED AT**__  ${tsRelative(cachedAt)}`);
  descParts.push(premiumDivider());

  const embed = premiumEmbed({
    palette: 'UTILITY',
    accentOverride: color || ACCENT.UTILITY,
    client,
    authorTitle: title,
    authorIcon: subject ? userAvatar(subject) : null,
    description: descParts.join('\n'),
    moduleName,
    requester,
    gifKey,
    image,
    timestamp: false,
  });

  const components = [];
  if (pagination) {
    const prev = new ButtonBuilder()
      .setCustomId(`btn:${(moduleName || 'data').toLowerCase()}:page:${(pagination.page || 1) - 1}`)
      .setLabel('◀ PREV')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(!(pagination.page > 1));
    const next = new ButtonBuilder()
      .setCustomId(`btn:${(moduleName || 'data').toLowerCase()}:page:${(pagination.page || 1) + 1}`)
      .setLabel('NEXT ▶')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(!(pagination.page < pagination.totalPages));
    const refresh = new ButtonBuilder()
      .setCustomId(`btn:${(moduleName || 'data').toLowerCase()}:refresh`)
      .setLabel(`${iconUnicode('BTN_REFRESH')} REFRESH`)
      .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder().addComponents(prev, refresh, next);
    components.push(row);
  }

  return { embeds: [embed], components };
}

module.exports = { HeavyData };
