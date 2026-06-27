'use strict';

const { premiumEmbed, premiumDivider, ACCENT } = require('../theme/premium');
const { userAvatar } = require('../tokens/avatar');
const { icon } = require('../../utils/iconMap');

function TicketWelcome(client, user, categoryLabel, opts = {}) {
  const HDR_TICKET = icon('HDR_TICKET');

  const desc = [
    premiumDivider('Ticket Opened'),
    '',
    `${HDR_TICKET}  **TICKET OPENED**`,
    `> A staff member will be with you shortly.`,
    '',
    `**WELCOME**  ${user?.id ? `<@${user.id}>` : '`Unknown`'}`,
    `**CATEGORY**  \`${(categoryLabel || 'general').toUpperCase()}\``,
    '',
    '_# Be respectful, describe your issue in detail, and attach screenshots when relevant._',
    '',
    premiumDivider(),
  ].join('\n');

  const embed = premiumEmbed({
    palette: 'UTILITY',
    accentOverride: ACCENT.PREMIUM,
    client,
    authorTitle: 'Ticket Channel',
    authorIcon: userAvatar(user),
    description: desc,
    moduleName: 'TICKET',
    requester: user,
    gifKey: 'pinned',
  });

  return embed;
}

module.exports = { TicketWelcome };
