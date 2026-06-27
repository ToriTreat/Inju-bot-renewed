'use strict';

const { icon, iconUnicode, ICON_MAP, ICON_SLOTS } = require('./iconMap');

const DISCORD_EMOJI = {
  GREEN_TICK:  '<a:tickgreen:1511768108543774751>',
  RED_CROSS:   '<a:tickred:1512051419019214849>',
  SPIN:        '<a:maruloader:1512123812387356854>',
  CROWN:       '<a:crown:1511764846474035403>',
  COOKIE:      '<:cookie:1493307158610051213>',
  SHIELD:      '<:Moderator:1512131952898085077>',
  ONLINE:      '<a:GreenDot:1512123952556933210>',
  STAR:        '<:star:1493307158610051213>',
  ROBUX:       '<:robux:1510356862904569936>',
};

const EMOJI = { ...DISCORD_EMOJI };

function reResolve() {
  Object.assign(EMOJI, DISCORD_EMOJI);
  return EMOJI;
}

function premiumDivider(label) {
  if (!label) return '━'.repeat(38);
  const labelText = `  ${String(label).toUpperCase()}  `;
  const sideLen = Math.max(2, Math.floor((38 - labelText.length) / 2));
  return '━'.repeat(sideLen) + labelText + '━'.repeat(sideLen);
}

module.exports = {
  DISCORD_EMOJI,
  EMOJI,
  reResolve,
  premiumDivider,
  icon,
  ICON_MAP,
  ICON_SLOTS,
  iconUnicode,
};
