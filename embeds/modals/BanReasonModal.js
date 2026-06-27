'use strict';

const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

function _row(component) {
  return new ActionRowBuilder().addComponents(component);
}

function BanReasonModal(opts = {}) {
  const modal = new ModalBuilder()
    .setCustomId(opts.customId || `mdl:moderation:ban:${opts.targetId || ''}`)
    .setTitle((opts.title || 'Ban Reason').slice(0, 45));

  const reason = new TextInputBuilder()
    .setCustomId('ban_reason')
    .setLabel('Reason')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMinLength(8)
    .setMaxLength(512)
    .setPlaceholder('Justify the ban action');
  if (opts.reason) reason.setValue(String(opts.reason).slice(0, 512));

  const duration = new TextInputBuilder()
    .setCustomId('ban_duration')
    .setLabel('Duration (blank = permanent)')
    .setStyle(TextInputStyle.Short)
    .setRequired(false)
    .setMaxLength(16)
    .setPlaceholder('e.g. 7d, 24h, 30m');
  if (opts.duration) duration.setValue(String(opts.duration).slice(0, 16));

  const evidence = new TextInputBuilder()
    .setCustomId('ban_evidence')
    .setLabel('Evidence links (optional)')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false)
    .setMaxLength(1024)
    .setPlaceholder('https://discord.com/channels/…');
  if (opts.evidence) evidence.setValue(String(opts.evidence).slice(0, 1024));

  modal.addComponents(_row(reason), _row(duration), _row(evidence));
  return modal;
}

module.exports = { BanReasonModal };
