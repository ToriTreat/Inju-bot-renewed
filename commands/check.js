'use strict';

const ui     = require('../utils/ui');
const assets = require('../utils/assets');
const api    = require('../services/api');
const data   = require('../services/fetcher');
const { icon } = require('../utils/iconMap');

const PROS = [
  { ok: false, text: 'account stealing' },
  { ok: true,  text: 'Frequent updates & bug fixes' },
  { ok: true,  text: 'Fastest login speed' },
  { ok: true,  text: 'Security from data breaches' },
];

const BRAND = [
  { slot: 'MEDAL_1',        text: 'Premium infrastructure' },
  { slot: 'CROWN_GREY',     text: 'Sub-second response times' },
  { slot: 'CAT_MODERATION', text: 'Operator-grade moderation tools' },
];

const FALLBACK = [
  { name: 'astralv2.com', available: true },
];

function _prosLine(p) {
  const tick = p.ok ? icon('STATUS_SUCCESS') : icon('STATUS_ERROR');
  const label = p.ok ? '' : 'NO  ';
  return `• ${tick}  **${label}${p.text}**`;
}

function _brandLine(b) {
  const ic = icon(b.slot) || icon('DIAMOND') || '';
  return `• ${ic}  **${b.text}**`;
}

function _norm(list) {
  return list.map(d => {
    if (typeof d === 'string') return { name: d, available: true };
    return { name: d.name || d.domain || d.url || 'unknown', available: d.available !== false };
  });
}

async function _fetchDomains() {
  try {
    const data = await api.getDomains();
    if (Array.isArray(data)) return _norm(data);
    if (data && Array.isArray(data.domains)) return _norm(data.domains);
    if (data && Array.isArray(data.data)) return _norm(data.data);
    return FALLBACK;
  } catch {
    return FALLBACK;
  }
}

function buildCheckEmbed(client, domains, health) {
  const orangeCrown = icon('MEDAL_1');
  const greenDot    = icon('DOT_GREEN');
  const flameCrown  = icon('CROWN_FLAME');
  const greyCrown   = icon('CROWN_GREY');

  const available = (domains || FALLBACK).filter(d => d.available);
  const n = available.length;
  const list = available.slice(0, 5).map(d => `> • \`${d.name}\``).join('\n');

  const lines = [];
  lines.push('━'.repeat(32));
  lines.push(`${greyCrown}  **ASTRAL BEAMS  ·  #1 SITES**`);
  lines.push('');
  lines.push(`${greenDot}  **${n} ACTIVE DOMAIN${n === 1 ? '' : 'S'}**`);
  lines.push(`${flameCrown}  Blazing-fast, feature-loaded infrastructure`);
  if (list) lines.push(list);
  lines.push('');
  lines.push('━'.repeat(32));
  lines.push(`${orangeCrown}  **PROS**`);
  lines.push(PROS.map(_prosLine).join('\n'));
  lines.push('');
  lines.push('━'.repeat(32));
  lines.push(`${orangeCrown}  **BRAND**`);
  lines.push(BRAND.map(_brandLine).join('\n'));

  if (health) {
    lines.push('');
    lines.push('━'.repeat(32));
    lines.push(`${orangeCrown}  **FETCHER HEALTH**`);
    lines.push(`• ${icon('STATUS_SUCCESS')}  Token Pool: \`${health.tokenPool}\``);
    lines.push(`• ${icon('STATUS_SUCCESS')}  Valid Tokens: \`${health.validTokens}\``);
    lines.push(`• ${icon('STATUS_SUCCESS')}  Cache Hits: \`${health.cacheHits}\``);
    lines.push(`• ${icon('STATUS_SUCCESS')}  Cache Misses: \`${health.cacheMisses}\``);
    lines.push(`• ${icon('STATUS_SUCCESS')}  WS Entries: \`${health.leaderboardCached}\``);
  }

  return ui.sleekEmbed(client, 'SITE STATUS', `ASTRAL BEAMS · #1 SITES`,
    lines.join('\n'),
    'site'
  );
}

async function execute(message, _args, client) {
  const loadMsg = await message.reply({ embeds: [ui.loading(client, 'CHECKING SITE STATUS…')] });
  const domains = await _fetchDomains();
  const health = data.getHealth();
  await loadMsg.edit({ embeds: [buildCheckEmbed(client, domains, health)], components: [] });
}

module.exports = { name: 'check', description: 'Site status', execute, buildCheckEmbed };
