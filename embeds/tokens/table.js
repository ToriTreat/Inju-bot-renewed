'use strict';

const PAD = ' ';

function _width(value) {
  if (value == null) return 0;
  return String(value).length;
}

function _pad(s, n) {
  s = String(s == null ? '' : s);
  if (s.length >= n) return s;
  return s + PAD.repeat(n - s.length);
}

function alignRight(s, n) {
  s = String(s == null ? '' : s);
  if (s.length >= n) return s;
  return PAD.repeat(n - s.length) + s;
}

function computeWidths(rows) {
  if (!rows.length) return [];
  const cols = Math.max(...rows.map(r => r.length));
  const widths = new Array(cols).fill(0);
  for (const row of rows) {
    for (let i = 0; i < cols; i++) {
      const w = _width(row[i]);
      if (w > widths[i]) widths[i] = w;
    }
  }
  return widths;
}

function formatTable(rows, opts = {}) {
  if (!Array.isArray(rows) || rows.length === 0) return '';
  const sep = opts.separator || '  ';
  const widths = computeWidths(rows);
  return rows.map(row => {
    const cells = [];
    for (let i = 0; i < widths.length; i++) {
      const cell = row[i] == null ? '' : String(row[i]);
      const last = i === widths.length - 1;
      cells.push(last ? cell : _pad(cell, widths[i]));
    }
    return cells.join(sep);
  }).join('\n');
}

module.exports = { formatTable, alignRight, computeWidths };
