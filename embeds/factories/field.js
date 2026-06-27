'use strict';

const { ZERO } = require('../tokens/zeroWidth');

const EMPTY = '—';

function fieldKV(name, value, inline = true) {
  if (value == null || value === '' || value === EMPTY) return null;
  return { name: String(name), value: String(value), inline };
}

function section(title) {
  if (!title) return `\n${ZERO}\n`;
  return `\n__**${String(title).toUpperCase()}**__\n`;
}

function dividerLabel(text) {
  if (!text) return `\n${ZERO}\n`;
  return `\n__${String(text)}__\n`;
}

function formatRow(label, value) {
  return `**${String(label).toUpperCase()}**  ${value == null || value === '' ? '`' + EMPTY + '`' : value}`;
}

function blockquote(text) {
  const lines = String(text || '').split('\n');
  return lines.map(l => `> ${l}`).join('\n');
}

module.exports = { fieldKV, section, dividerLabel, formatRow, blockquote, EMPTY };
