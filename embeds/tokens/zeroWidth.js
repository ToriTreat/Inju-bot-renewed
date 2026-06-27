'use strict';

const ZW = '\u200B';

const SEP = { name: ZW, value: ZW, inline: false };
const PAD = { name: ZW, value: ZW, inline: true };
const ZERO = ZW;

function spacer(n = 1) {
  return ZW.repeat(Math.max(1, n | 0));
}

function padRow(currentInlineCount) {
  if ((currentInlineCount % 3) === 0) return null;
  return PAD;
}

module.exports = { ZW, SEP, PAD, ZERO, spacer, padRow };
