'use strict';

const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

function _row(component) {
  return new ActionRowBuilder().addComponents(component);
}

function VouchMessageModal(opts = {}) {
  const modal = new ModalBuilder()
    .setCustomId(opts.customId || `mdl:vouch:submit:${opts.targetId || ''}`)
    .setTitle((opts.title || 'Submit Vouch').slice(0, 45));

  const message = new TextInputBuilder()
    .setCustomId('vouch_message')
    .setLabel('Your vouch')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMinLength(10)
    .setMaxLength(280)
    .setPlaceholder('Why are you vouching?');
  if (opts.message) message.setValue(String(opts.message).slice(0, 280));

  modal.addComponents(_row(message));
  return modal;
}

module.exports = { VouchMessageModal };
