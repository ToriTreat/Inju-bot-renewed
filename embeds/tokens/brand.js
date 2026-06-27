'use strict';

const BOT_NAME = 'BADDIES';
const BRAND_DOMAIN = 'ASTRAL V2';
const BRAND_URL = 'https://injuries.to';

function footerText(moduleName) {
  if (!moduleName) return `${BOT_NAME}  ·  ${BRAND_DOMAIN}`;
  return `${BOT_NAME}  ·  ${BRAND_DOMAIN}  ·  ${String(moduleName).toUpperCase()}`;
}

function requesterTag(user) {
  if (!user) return 'Unknown';
  return user.tag || user.username || `User#${user.discriminator || '0000'}`;
}

module.exports = { BOT_NAME, BRAND_DOMAIN, BRAND_URL, footerText, requesterTag };
