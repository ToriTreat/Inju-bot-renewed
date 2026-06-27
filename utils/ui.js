'use strict';

const embeds = require('../embeds');
const { botAvatar } = embeds.tokens.avatar;
const { footerText } = embeds.tokens.brand;

function isClient(v) {
  return v && typeof v === 'object' && (v.user !== undefined || v.guilds !== undefined);
}

function isDiscordLike(v) {
  return v && typeof v === 'object' && (
    v.user !== undefined ||
    v.guilds !== undefined ||
    v.readyAt !== undefined ||
    typeof v.channels?.fetch === 'function'
  );
}

function resolveClient(firstArg) {
  return isClient(firstArg) ? firstArg : null;
}

function footer(extraOrClient, extra) {
  let client = null;
  let extraText = '';
  if (isClient(extraOrClient)) {
    client = extraOrClient;
    extraText = extra || '';
  } else {
    extraText = typeof extraOrClient === 'string' ? extraOrClient : (extra || '');
  }
  const text = footerText(extraText || undefined);
  const icon = botAvatar(client);
  const out = { text };
  if (typeof icon === 'string' && /^https?:\/\//.test(icon)) out.iconURL = icon;
  return out;
}

function getBotAvatar(client) {
  return botAvatar(client);
}

function _safeShift(first, title, body, fnName) {
  if (isClient(first)) {
    return { client: first, t: title, b: body };
  }
  if (first != null && typeof first === 'object' && !Array.isArray(first)) {
    if (process.env.UI_DEBUG) {
      console.warn(`[ui.${fnName}] First arg was an object that is not a Discord client — shifting args. ` +
        `Object keys: ${Object.keys(first).slice(0, 5).join(',')}`);
    }
    return { client: null, t: title, b: body };
  }
  return { client: null, t: first, b: title };
}

function success(first, title, body) {
  const { client, t, b } = _safeShift(first, title, body, 'success');
  return embeds.success(client, t, b);
}

function error(first, title, reason, hint = null) {
  if (isClient(first)) {
    return embeds.error(first, title, reason, hint);
  }
  if (first != null && typeof first === 'object' && !Array.isArray(first)) {
    if (process.env.UI_DEBUG) {
      console.warn(`[ui.error] First arg was an object that is not a Discord client — shifting args. ` +
        `Object keys: ${Object.keys(first).slice(0, 5).join(',')}`);
    }
    return embeds.error(null, title, reason, hint);
  }
  return embeds.error(null, first, title, reason);
}

function info(first, title, body) {
  const { client, t, b } = _safeShift(first, title, body, 'info');
  return embeds.info(client, t, b);
}

function warning(first, title, body) {
  const { client, t, b } = _safeShift(first, title, body, 'warning');
  return embeds.warning(client, t, b);
}

function cooldown(first, cmd, secs) {
  if (isClient(first)) return embeds.cooldown(first, cmd, secs);
  if (first != null && typeof first === 'object' && !Array.isArray(first)) {
    if (process.env.UI_DEBUG) {
      console.warn(`[ui.cooldown] First arg was an object that is not a Discord client — shifting args. ` +
        `Object keys: ${Object.keys(first).slice(0, 5).join(',')}`);
    }
    return embeds.cooldown(null, cmd, secs);
  }
  return embeds.cooldown(null, first, cmd);
}

function noPerm(first, required = 'Administrator') {
  if (isClient(first)) return embeds.noPerm(first, required);
  if (first != null && typeof first === 'object' && !Array.isArray(first)) {
    if (process.env.UI_DEBUG) {
      console.warn(`[ui.noPerm] First arg was an object that is not a Discord client — shifting args. ` +
        `Object keys: ${Object.keys(first).slice(0, 5).join(',')}`);
    }
    return embeds.noPerm(null, required);
  }
  return embeds.noPerm(null, first);
}

function confirmPrompt(first, title, body, confirmId, cancelId) {
  if (isClient(first)) {
    return embeds.confirmPrompt(first, title, body, confirmId, cancelId);
  }
  if (first != null && typeof first === 'object' && !Array.isArray(first)) {
    if (process.env.UI_DEBUG) {
      console.warn(`[ui.confirmPrompt] First arg was an object that is not a Discord client — shifting args. ` +
        `Object keys: ${Object.keys(first).slice(0, 5).join(',')}`);
    }
    return embeds.confirmPrompt(null, title, body, confirmId, cancelId);
  }
  return embeds.confirmPrompt(null, first, title, body, confirmId);
}

function loading(first, label) {
  if (isClient(first)) {
    return embeds.processing(first, label || 'INITIATING LINK...');
  }
  if (first != null && typeof first === 'object' && !Array.isArray(first)) {
    if (process.env.UI_DEBUG) {
      console.warn(`[ui.loading] First arg was an object that is not a Discord client — shifting args. ` +
        `Object keys: ${Object.keys(first).slice(0, 5).join(',')}`);
    }
    return embeds.processing(null, label || 'INITIATING LINK...');
  }
  return embeds.processing(null, first || 'INITIATING LINK...');
}

function sleekEmbed(client, type, title, body, gifKey) {
  const paletteMap = {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    WARNING: 'WARNING',
    INFO: 'UTILITY',
    'RATE LIMIT': 'WARNING',
    'ACCESS DENIED': 'ERROR',
    'SYSTEM DIAGNOSTICS': 'SYSTEM',
    'AUTHORIZATION REQUIRED': 'WARNING',
    PROCESSING: 'SYSTEM',
    'USER INTELLIGENCE': 'UTILITY',
    'SERVER INTELLIGENCE': 'UTILITY',
    LEADERBOARD: 'UTILITY',
    VERIFICATION: 'UTILITY',
    TICKET: 'UTILITY',
    'DOMAIN TOPOLOGY': 'UTILITY',
    'API STATUS': 'UTILITY',
    SITE: 'UTILITY',
    SUPPORT: 'UTILITY',
    HELP: 'UTILITY',
    'COMMAND HUB': 'UTILITY',
    STATS: 'UTILITY',
    CHECK: 'UTILITY',
    DOMAINS: 'UTILITY',
    USERINFO: 'UTILITY',
  };
  const safeType = (type == null ? 'INFO' : String(type)).toUpperCase();
  const safeClient = isClient(client) ? client : null;
  return embeds.factories.base.baseEmbed({
    palette: paletteMap[safeType] || 'UTILITY',
    client: safeClient,
    authorTitle: title || safeType,
    description: body || null,
    moduleName: safeType,
    gifKey: gifKey || null,
  });
}

module.exports = {
  footer, getBotAvatar,
  loading, success, error, info, warning,
  cooldown, noPerm, confirmPrompt,
  sleekEmbed,
  isClient,
  isDiscordLike,
};
