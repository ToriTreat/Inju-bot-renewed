'use strict';

const { premiumEmbed, premiumDivider, ACCENT } = require('../theme/premium');
const { fieldKV, formatRow, blockquote, EMPTY } = require('../factories/field');
const { userAvatar } = require('../tokens/avatar');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { icon, iconUnicode } = require('../../utils/iconMap');
const { claimBtn, transcriptBtn, reopenBtn } = (() => {
  const b = require('../components/buttons');
  return {
    claimBtn: b.claimBtn,
    transcriptBtn: b.transcriptBtn,
    reopenBtn: b.reopenBtn,
  };
})();

function TicketPanel(client, ticket, opener, opts = {}) {
  const isOpen = (ticket.status || 'open') === 'open';
  const palette = isOpen ? 'UTILITY' : 'SYSTEM';
  const accent = isOpen ? ACCENT.EMERALD : ACCENT.MAGENTA;
  const DOT_OPEN   = icon('DOT_GREEN');
  const DOT_CLOSED = icon('DOT_RED');

  const desc = [
    premiumDivider(`Ticket ${ticket.ticketId || ''}`),
    '',
    `**STATUS**  ${isOpen ? DOT_OPEN + ' `OPEN`' : DOT_CLOSED + ' `CLOSED`'}`,
    `**RESPONSE**  ${isOpen ? '`PENDING`' : '`COMPLETED`'}`,
    '',
    ticket.subject ? `**SUBJECT**\n${blockquote(ticket.subject)}` : null,
    '',
    premiumDivider(),
  ].filter(Boolean).join('\n');

  const fields = [
    fieldKV('CATEGORY', `\`${ticket.category || 'general'}\``, true),
    fieldKV('USER', opener?.id ? `<@${opener.id}>` : '`Unknown`', true),
    fieldKV('CHANNEL', ticket.channelId ? `<#${ticket.channelId}>` : '`—`', true),
    fieldKV('CASE ID', `\`${ticket.ticketId || ticket._id || '—'}\``, true),
    fieldKV('CREATED', ticket.createdAt ? `<t:${Math.floor(new Date(ticket.createdAt).getTime() / 1000)}:R>` : '`—`', true),
    fieldKV('UPDATED', ticket.updatedAt ? `<t:${Math.floor(new Date(ticket.updatedAt).getTime() / 1000)}:R>` : '`—`', true),
  ];

  const embed = premiumEmbed({
    palette,
    accentOverride: accent,
    client,
    authorTitle: `Ticket ${ticket.ticketId || ''}`.trim(),
    authorIcon: userAvatar(opener),
    description: desc,
    moduleName: 'TICKET',
    requester: opts.requester,
    fields,
    timestamp: false,
    gifKey: opts.gifKey,
    premiumBanner: !!opts.gifKey,
  });

  const row = new ActionRowBuilder();

  if (isOpen) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`btn:support:claim:${ticket.ticketId || ''}`)
        .setLabel(`${iconUnicode('BTN_CLAIM')} CLAIM`)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`btn:support:close:${ticket.ticketId || ''}`)
        .setLabel(`${iconUnicode('BTN_CLOSE')} CLOSE`)
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId(`btn:support:transcript:${ticket.ticketId || ''}`)
        .setLabel(`${iconUnicode('BTN_TRANSCRIPT')} TRANSCRIPT`)
        .setStyle(ButtonStyle.Secondary),
    );
  } else {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`btn:support:reopen:${ticket.ticketId || ''}`)
        .setLabel(`${iconUnicode('BTN_REOPEN')} REOPEN`)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`btn:support:transcript:${ticket.ticketId || ''}`)
        .setLabel(`${iconUnicode('BTN_TRANSCRIPT')} TRANSCRIPT`)
        .setStyle(ButtonStyle.Secondary),
    );
  }

  return { embeds: [embed], components: [row] };
}

module.exports = { TicketPanel };
