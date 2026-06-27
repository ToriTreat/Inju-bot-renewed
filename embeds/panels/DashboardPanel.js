'use strict';

const { premiumEmbed, premiumDivider, premiumHeader, ACCENT } = require('../theme/premium');
const { openTicketBtn, dashLink, statusBtn, statsBtn, ticketMenuRow } = require('../components/buttons');
const { BRAND_URL } = require('../tokens/brand');
const { icon } = require('../../utils/iconMap');

function DashboardPanel(client, opts = {}) {
  const HDR_TICKET  = icon('HDR_TICKET');
  const HDR_CAT     = icon('HDR_CATEGORY');
  const HDR_PAGE    = icon('HDR_PAGE');
  const HDR_CMDS    = icon('HDR_COMMANDS');
  const BTN_STATS_I = icon('BTN_STATS');
  const BTN_STATUS_I= icon('BTN_STATUS');
  const DIAMOND_I   = icon('DIAMOND');

  const desc = [
    premiumDivider('Support Dashboard'),
    '',
    `${HDR_TICKET}  **SUPPORT DASHBOARD**`,
    `> Open a private ticket and our staff will respond shortly.`,
    '',
    premiumDivider('Actions'),
    `**\`[01]\`**  ${DIAMOND_I}  [OPEN TICKET]   · Launch a new support thread`,
    `**\`[02]\`**  ${DIAMOND_I}  [VIEW GUIDE]    · External documentation`,
    `**\`[03]\`**  ${DIAMOND_I}  [CATEGORY]      · Choose a support category below`,
    `**\`[04]\`**  ${BTN_STATUS_I}  [STATUS]        · View your open tickets`,
    `**\`[05]\`**  ${BTN_STATS_I}  [STATS]         · View support throughput`,
    '',
    premiumDivider('Live State'),
    `${HDR_CAT}  **CATEGORY**  \`PICK BELOW\``,
    `${BTN_STATUS_I}  **STATUS**  \`READY\``,
    `${DIAMOND_I}  **PRIORITY**  \`STANDARD\``,
    '',
    `${icon('STATUS_SUCCESS')}  *Elite support concierge · 24/7 dispatch*  ${icon('STATUS_SUCCESS')}`,
  ].join('\n');

  const embed = premiumEmbed({
    palette: 'UTILITY',
    accentOverride: ACCENT.PREMIUM,
    client,
    authorTitle: 'Support Dashboard',
    description: desc,
    moduleName: 'DASHBOARD',
    fields: [
      { name: '\u200B', value: '\u200B', inline: false },
      { name: `${HDR_CAT} CATEGORY`, value: '`PICK BELOW`', inline: true },
      { name: `${BTN_STATUS_I} STATUS`, value: '`READY`', inline: true },
      { name: `${DIAMOND_I} PRIORITY`, value: '`STANDARD`', inline: true },
    ],
    gifKey: 'pinned',
  });

  const row1 = new (require('discord.js').ActionRowBuilder)().addComponents(
    openTicketBtn('btn:support:open'),
    dashLink('VIEW GUIDE', opts.guideUrl || BRAND_URL),
  );

  const row2 = new (require('discord.js').ActionRowBuilder)().addComponents(
    statusBtn(), statsBtn(),
  );

  return {
    embeds: [embed],
    components: [row1, ticketMenuRow(), row2],
  };
}

module.exports = { DashboardPanel };
