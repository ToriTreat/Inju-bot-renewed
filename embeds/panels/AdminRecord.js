'use strict';

const { premiumEmbed, premiumDivider, ACCENT } = require('../theme/premium');
const { fieldKV, formatRow, blockquote, EMPTY } = require('../factories/field');
const { asciiRule } = require('../tokens/divider');
const { tsFull, tsRelative } = require('../tokens/timestamp');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { userAvatar } = require('../tokens/avatar');
const { icon, iconUnicode } = require('../../utils/iconMap');

const EMDASH = '—';

function AdminRecord(client, data = {}) {
  const {
    caseId = 'CASE-UNKNOWN',
    action = 'ACTION',
    target = null,
    moderator = null,
    reason = 'No reason provided',
    evidence = null,
    scope = 'GUILD',
    duration = EMDASH,
    appealable = true,
    requestedBy = null,
    timestamp = null,
  } = data;

  const targetMention = target?.id ? `<@${target.id}>` : '`Unknown`';
  const targetTag = target?.tag ? ` (${target.tag})` : '';
  const modMention = moderator?.id ? `<@${moderator.id}>` : '`Unknown`';
  const requesterMention = requestedBy?.id ? `<@${requestedBy.id}>` : null;

  const header = premiumDivider('ADMIN RECORD');
  const evidenceLine = evidence
    ? `**EVIDENCE**\n${blockquote(Array.isArray(evidence) ? evidence.join('\n') : String(evidence))}`
    : `**EVIDENCE**\n${blockquote('No evidence provided')}`;

  const desc = [
    header,
    '',
    `**CASE ID**    \`${caseId}\``,
    `**ACTION**     \`${String(action).toUpperCase()}\``,
    `**TARGET**     ${targetMention}${targetTag}`,
    `**MODERATOR**  ${modMention}`,
    '',
    `**REASON**`,
    blockquote(reason),
    '',
    evidenceLine,
    '',
    header,
  ].join('\n');

  const fields = [
    fieldKV('SCOPE', `\`${String(scope).toUpperCase()}\``, true),
    fieldKV('DURATION', `\`${duration}\``, true),
    fieldKV('APPEALABLE', `\`${appealable ? 'YES' : 'NO'}\``, true),
  ];

  const embed = premiumEmbed({
    palette: 'ADMIN',
    accentOverride: ACCENT.ADMIN,
    client,
    authorTitle: 'Termination Protocol',
    authorIcon: userAvatar(moderator),
    description: desc,
    moduleName: 'ADMIN',
    requester: requestedBy,
    timestamp: timestamp || new Date(),
    fields,
    gifKey: 'pinned',
  });

  const isPermanent = String(action).toLowerCase().includes('permanent') ||
                      String(duration).toLowerCase() === 'permanent';
  const isBan = String(action).toLowerCase().includes('ban');

  const unbanBtn = new ButtonBuilder()
    .setCustomId(`btn:moderation:unban:${target?.id || 'unknown'}`)
    .setLabel(`${iconUnicode('BTN_UNBAN')} ${isPermanent ? 'UNBAN (PERMANENT)' : 'UNBAN'}`)
    .setStyle(ButtonStyle.Success)
    .setDisabled(!isBan);

  const viewBtn = new ButtonBuilder()
    .setCustomId(`btn:moderation:view:${target?.id || 'unknown'}`)
    .setLabel(`${iconUnicode('BTN_VIEW_USER')} VIEW USER`)
    .setStyle(ButtonStyle.Secondary);

  const appealBtn = new ButtonBuilder()
    .setCustomId(`btn:moderation:appeal:${caseId}`)
    .setLabel(`${iconUnicode('BTN_APPEAL')} APPEAL`)
    .setStyle(ButtonStyle.Primary)
    .setDisabled(!appealable);

  const row = new ActionRowBuilder().addComponents(unbanBtn, viewBtn, appealBtn);

  return { embeds: [embed], components: [row] };
}

module.exports = { AdminRecord };
