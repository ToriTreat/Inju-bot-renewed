'use strict';

const DASH = '-';

function _stamp(date) {
  if (!date) return Math.floor(Date.now() / 1000);
  if (date instanceof Date) return Math.floor(date.getTime() / 1000);
  if (typeof date === 'number') {
    return date > 1e12 ? Math.floor(date / 1000) : date;
  }
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return Math.floor(Date.now() / 1000);
  return Math.floor(parsed.getTime() / 1000);
}

function tsRelative(date) {
  return `<t:${_stamp(date)}:R>`;
}

function tsDate(date) {
  return `<t:${_stamp(date)}:D>`;
}

function tsTime(date) {
  return `<t:${_stamp(date)}:T>`;
}

function tsFull(date) {
  return `<t:${_stamp(date)}:F>`;
}

function tsNow() {
  return `<t:${Math.floor(Date.now() / 1000)}:R>`;
}

function isoDate(date) {
  const d = date ? new Date(date) : new Date();
  if (isNaN(d.getTime())) return DASH;
  return d.toISOString().slice(0, 10);
}

module.exports = { tsRelative, tsDate, tsTime, tsFull, tsNow, isoDate };
