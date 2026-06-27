'use strict';

const RULE = '━';
const WIDE = 42;

function asciiRule(label, width = WIDE) {
  const safeLabel = label == null ? '' : String(label).toUpperCase().trim();
  if (!safeLabel) return RULE.repeat(Math.max(0, width));
  const side = Math.max(0, Math.floor((width - safeLabel.length - 2) / 2));
  const left = RULE.repeat(side);
  const right = RULE.repeat(Math.max(0, width - side - safeLabel.length - 2));
  return `${left}  ${safeLabel}  ${right}`;
}

function thinRule(width = 24) {
  return RULE.repeat(Math.max(1, width | 0));
}

module.exports = { asciiRule, thinRule };
