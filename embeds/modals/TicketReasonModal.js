'use strict';

const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

function _row(component) {
  return new ActionRowBuilder().addComponents(component);
}

function TicketReasonModal(opts = {}) {
  const modal = new ModalBuilder()
    .setCustomId(opts.customId || `mdl:support:open:${opts.ticketId || ''}`)
    .setTitle((opts.title || 'Open Support Ticket').slice(0, 45));

  const subject = new TextInputBuilder()
    .setCustomId('ticket_subject')
    .setLabel('Subject')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMinLength(3)
    .setMaxLength(80)
    .setPlaceholder('Brief one-line summary');
  if (opts.subject) subject.setValue(String(opts.subject).slice(0, 80));

  const reason = new TextInputBuilder()
    .setCustomId('ticket_reason')
    .setLabel('Describe your issue')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMinLength(30)
    .setMaxLength(1024)
    .setPlaceholder('Provide as much detail as possible (min 30 chars)…');
  if (opts.reason) reason.setValue(String(opts.reason).slice(0, 1024));

  modal.addComponents(_row(subject), _row(reason));
  return modal;
}

module.exports = { TicketReasonModal };
