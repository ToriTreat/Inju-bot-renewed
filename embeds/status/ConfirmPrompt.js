'use strict';

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { system } = require('./System');
const { icon, iconUnicode } = require('../../utils/iconMap');

const ICON = icon('STATUS_WARNING');

function confirmPrompt(client, title, body, confirmId = 'confirm', cancelId = 'cancel', opts = {}) {
  const safeTitle = String(title || 'CONFIRM ACTION').toUpperCase();
  const desc = body
    ? `${ICON} **${safeTitle}**\n\u200B\n${body}`
    : `${ICON} **${safeTitle}**`;

  const embed = system(client, title, body ? body : null, {
    moduleName: opts.moduleName || 'AUTHORIZE',
    requester: opts.requester,
    gifKey: opts.gifKey,
  });
  embed.setDescription(desc);

  const confirm = new ButtonBuilder()
    .setCustomId(confirmId)
    .setLabel(opts.confirmLabel || 'AUTHORIZE')
    .setEmoji(opts.confirmEmoji || iconUnicode('STATUS_WARNING'))
    .setStyle(opts.confirmStyle || ButtonStyle.Danger);

  const cancel = new ButtonBuilder()
    .setCustomId(cancelId)
    .setLabel(`${iconUnicode('BTN_CLOSE')} ${opts.cancelLabel || 'ABORT'}`)
    .setStyle(opts.cancelStyle || ButtonStyle.Secondary);

  const row = new ActionRowBuilder().addComponents(confirm, cancel);

  return { embeds: [embed], components: [row] };
}

module.exports = { confirmPrompt };
