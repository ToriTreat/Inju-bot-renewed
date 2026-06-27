'use strict';

const { botAvatar, isHttpUrl } = require('../tokens/avatar');
const { footerText, requesterTag } = require('../tokens/brand');

function buildFooter(client, moduleName, requester) {
  const base = footerText(moduleName);
  const text = requester ? `${base}  ·  REQUESTER ${requesterTag(requester)}` : base;
  const icon = botAvatar(client);
  const out = { text };
  if (isHttpUrl(icon)) out.iconURL = icon;
  return out;
}

module.exports = { buildFooter };
