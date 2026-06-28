const { ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const mongoose = require('mongoose');
const { baseEmbed, COLORS, createTerminal, formatRow, ts, statusLabel, BTN, ticketWelcomeEmbed, ticketCloseConfirmEmbed } = require('../utils/embeds');
const { icon } = require('../utils/iconMap');
const { toSmallCaps } = require('../utils/smallCaps');
const { tryClaim } = require('../utils/dedup');
const Ticket = require('../database/models/Ticket');
const Log = require('../database/models/Log');
const config = require('../config/bot');
const theme = require('../utils/theme');
const { hasAnyStaffRole } = require('../config/roles');
const logger = require('../utils/logger');
const ui = require('../utils/ui');

const { buildCategoryEmbed } = require('../commands/help');
const { buildVouchEmbed, buildVouchButtons, PAGE_SIZE: VOUCH_PAGE_SIZE } = require('../commands/vouch');
const { getPending, clearPending, buildBanResultEmbed } = require('../commands/ban');

if (!global._baddiesInteractions) global._baddiesInteractions = new Map();

const INTERACTION_TTL_MS = 30000;
const INTERACTION_CLEANUP_MS = 60000;

// Track who clicked the "CLOSE TICKET" button, keyed by channel ID.
// This lets ticket_close_confirm and ticket_close_cancel verify it's the same person.
const ticketClosePending = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [id, ts] of global._baddiesInteractions) {
    if (now - ts > INTERACTION_TTL_MS) global._baddiesInteractions.delete(id);
  }
  // Also clean up stale ticket-close sessions (60 s TTL)
  for (const [channelId, entry] of ticketClosePending) {
    if (now - entry.ts > 60_000) ticketClosePending.delete(channelId);
  }
}, INTERACTION_CLEANUP_MS).unref();

function dbOK() { return mongoose.connection.readyState === 1; }

// Shared auth helper for ticket channels:
// returns true if the user is staff OR is the ticket author.
async function canManageTicket(guild, interaction) {
  const member = await guild.members.fetch(interaction.user.id).catch(() => null);
  if (!member) return false;
  if (hasAnyStaffRole(member)) return true;

  // DB lookup
  if (dbOK()) {
    const ticket = await Ticket.findOne({ channelId: interaction.channel?.id, status: 'open' }).catch(() => null);
    if (ticket && String(ticket.userId) === interaction.user.id) return true;
  }

  // Fallback: channel name contains username slug
  const channelName = interaction.channel?.name ?? '';
  const slug = interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const slug2 = interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, '');
  return channelName.includes(slug) || channelName.includes(slug2);
}

const LEGACY_CATEGORIES = [
  { label: 'General Support', value: 'general', emoji: '\u2753' },
  { label: 'Account Issue',   value: 'account', emoji: '\uD83D\uDD10' },
  { label: 'Billing',         value: 'billing', emoji: '\uD83D\uDCB3' },
  { label: 'Report',          value: 'report',  emoji: '\uD83D\uDEA8' },
  { label: 'Other',           value: 'other',   emoji: '\uD83D\uDCDD' },
];

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    try {
      const { customId, user, channel, guild } = interaction;
      if (global._baddiesInteractions.has(interaction.id)) return;
      global._baddiesInteractions.set(interaction.id, Date.now());
      const claimed = await tryClaim(interaction.id);
      if (!claimed) return;
      if (!guild) return interaction.reply({ content: 'This command is only available in servers.', ephemeral: true });

      const msg = { client: interaction.client, author: user, guild };
      const client = interaction.client;

      if (interaction.isButton()) {

        // ── Ban / Unban confirmation ──────────────────────────────────────────
        if (customId.startsWith('mod_confirm_') || customId.startsWith('mod_cancel_')) {
          const msgId = interaction.message.id;
          const data = getPending(msgId);

          // Check BEFORE deferring so we can still send an ephemeral reply
          if (!data) {
            return interaction.reply({ embeds: [ui.error(client, 'Expired', 'This confirmation has expired or was already used.')], ephemeral: true });
          }

          // Only the moderator who triggered the command can use these buttons
          if (interaction.user.id !== data.moderator.id) {
            return interaction.reply({
              embeds: [ui.error(client, 'Not Yours', 'Only the moderator who ran this command can confirm or cancel it.')],
              ephemeral: true,
            });
          }

          await interaction.deferUpdate();
          clearPending(msgId);

          if (customId.startsWith('mod_cancel_')) {
            await interaction.editReply({ embeds: [ui.info(client, 'Cancelled', 'Action was cancelled.')], components: [] });
            return;
          }

          try {
            if (data.action === 'ban') {
              await guild.members.ban(data.target.id, { reason: data.reason ?? undefined });
            } else {
              await guild.bans.remove(data.target.id, data.reason ?? undefined);
            }

            if (dbOK()) {
              await Log.create({
                action: data.action,
                userId: data.target.id,
                moderatorId: data.moderator.id,
                reason: data.reason || null,
                details: { userTag: data.target.tag },
                guildId: guild.id,
              }).catch(() => {});
            }

            await interaction.editReply({
              embeds: [buildBanResultEmbed(data.target, data.moderator, data.reason, data.action)],
              components: [],
            });
          } catch (err) {
            await interaction.editReply({
              embeds: [ui.error(client, 'Action Failed', err.message, 'Check bot permissions.')],
              components: [],
            });
          }
          return;
        }

        // ── Vouch pagination ──────────────────────────────────────────────────
        // customId format: vouch_<dir>_<page>_<targetId>_<requesterId>
        if (customId.startsWith('vouch_')) {
          const parts = customId.split('_');
          const dir         = parts[1];
          const curPage     = parseInt(parts[2], 10) || 0;
          const targetId    = parts[3];
          const requesterId = parts[4] ?? null;

          // Lock pagination to the person who ran !vouch
          if (requesterId && interaction.user.id !== requesterId) {
            return interaction.reply({
              embeds: [ui.error(client, 'Not Yours', 'Only the person who ran this command can flip the pages.')],
              ephemeral: true,
            });
          }

          await interaction.deferUpdate();

          const target = await interaction.client.users.fetch(targetId).catch(() => null);
          if (!target) {
            await interaction.editReply({ embeds: [ui.error(client, 'User not found', 'Could not resolve that user.')] });
            return;
          }

          let vouches = [];
          if (mongoose.connection.readyState === 1) {
            const VouchModel = require('../database/models/Vouch');
            const docs = await VouchModel.find({ targetUserId: targetId }).sort({ createdAt: -1 }).lean().catch(() => []);
            vouches = docs.map(d => ({
              vouchedBy: d.authorUserId || d.vouchedBy,
              timestamp: d.createdAt?.getTime?.() || d.timestamp || Date.now(),
              note: d.message || d.note || null,
            }));
          }

          const totalPages = Math.max(1, Math.ceil(vouches.length / VOUCH_PAGE_SIZE));
          const nextPage = dir === 'prev' ? Math.max(0, curPage - 1) : Math.min(totalPages - 1, curPage + 1);

          await interaction.editReply({
            embeds: [buildVouchEmbed(target, vouches, nextPage, client)],
            components: [buildVouchButtons(nextPage, totalPages, targetId, requesterId)],
          });
          return;
        }

        // ── Ticket: show close-confirmation prompt ────────────────────────────
        if (customId === 'ticket_close') {
          // Auth check BEFORE replying — ephemeral error if not allowed
          const allowed = await canManageTicket(guild, interaction);
          if (!allowed) {
            return interaction.reply({
              embeds: [ui.error(client, 'Permission Denied', 'Only the ticket owner or staff can close this ticket.')],
              ephemeral: true,
            });
          }

          // Record who clicked so confirm/cancel can verify the same person
          ticketClosePending.set(interaction.channel.id, { clickerId: interaction.user.id, ts: Date.now() });

          const confirmRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('ticket_close_confirm')
              .setLabel('CONFIRM')
              .setEmoji(icon('STATUS_SUCCESS'))
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId('ticket_close_cancel')
              .setLabel('CANCEL')
              .setEmoji(icon('STATUS_ERROR'))
              .setStyle(ButtonStyle.Secondary),
          );
          await interaction.reply({
            embeds: [ticketCloseConfirmEmbed()],
            components: [confirmRow],
          });
          return;
        }

        // ── Ticket: confirm close ─────────────────────────────────────────────
        if (customId === 'ticket_close_confirm') {
          // Check auth BEFORE deferring
          const allowed = await canManageTicket(guild, interaction);
          if (!allowed) {
            return interaction.reply({
              embeds: [ui.error(client, 'Permission Denied', 'Only the ticket owner or staff can close this ticket.')],
              ephemeral: true,
            });
          }

          // Ensure it's the same person who clicked the initial close button (staff override allowed)
          const closePending = ticketClosePending.get(interaction.channel.id);
          const member = await guild.members.fetch(interaction.user.id).catch(() => null);
          const isStaff = member && hasAnyStaffRole(member);

          if (closePending && closePending.clickerId !== interaction.user.id && !isStaff) {
            return interaction.reply({
              embeds: [ui.error(client, 'Not Yours', 'Only the person who initiated the close can confirm it.')],
              ephemeral: true,
            });
          }

          ticketClosePending.delete(interaction.channel.id);

          await interaction.deferReply();

          let ticket = null;
          if (dbOK()) {
            ticket = await Ticket.findOne({ channelId: interaction.channel?.id, status: 'open' }).catch(() => null);
          }

          if (ticket) {
            ticket.status = 'closed';
            ticket.closedAt = new Date();
            ticket.closedBy = interaction.user.id;

            const messages = await interaction.channel.messages.fetch({ limit: 100 }).catch(() => []);
            ticket.transcript = messages.reverse().map((m) => ({
              author: m.author?.tag || 'Unknown',
              content: m.content || '[embed/sticker]',
              timestamp: m.createdAt,
            }));
            await ticket.save().catch(() => {});
          }

          if (dbOK()) {
            await Log.create({
              action: 'ticket_close',
              userId: ticket?.userId ?? interaction.user.id,
              moderatorId: interaction.user.id,
              details: { ticketId: ticket?.ticketId ?? 'unknown', channelId: interaction.channel?.id },
              guildId: guild.id,
            }).catch(() => {});
          }

          await interaction.editReply({
            embeds: [baseEmbed(msg, theme.ASTRAL_CORE)
              .setTitle(`${icon('BTN_CLOSE')} ${toSmallCaps('TICKET CLOSING')}`)
              .setDescription(toSmallCaps('**This channel will be deleted in 5 seconds.**\n> Transcript saved.'))],
          });
          setTimeout(() => interaction.channel?.delete().catch(() => {}), 5000);
          return;
        }

        // ── Ticket: cancel close ──────────────────────────────────────────────
        if (customId === 'ticket_close_cancel') {
          // Only the person who clicked close (or staff) can cancel
          const closePending = ticketClosePending.get(interaction.channel.id);
          const member = await guild.members.fetch(interaction.user.id).catch(() => null);
          const isStaff = member && hasAnyStaffRole(member);

          if (closePending && closePending.clickerId !== interaction.user.id && !isStaff) {
            return interaction.reply({
              embeds: [ui.error(client, 'Not Yours', 'Only the person who initiated the close can cancel it.')],
              ephemeral: true,
            });
          }

          ticketClosePending.delete(interaction.channel.id);

          await interaction.reply({
            embeds: [ui.info(client, 'Cancelled', 'Ticket closure cancelled.')],
            ephemeral: true,
          });
          return;
        }

        // ── Verify click ──────────────────────────────────────────────────────
        if (customId === 'verify_click') {
          if (!dbOK()) {
            return interaction.reply({ content: 'Database unavailable.', ephemeral: true });
          }

          const VerificationSession = require('../database/models/VerificationSession');
          const crypto = require('crypto');

          const state = crypto.randomBytes(16).toString('hex');

          await VerificationSession.create({
            discordId: interaction.user.id,
            state,
            guildId: guild.id,
          }).catch(() => {});

          const params = new URLSearchParams({ state, guildId: guild.id });
          const oauthURL = config.redirectUri.replace('/callback', '/login') + '?' + params;

          await interaction.reply({
            embeds: [baseEmbed(msg, COLORS.VERIFY).setDescription(toSmallCaps(`${icon('BTN_APPEAL')} **One-click verification**\n\n[**Authorize with Discord →**](${oauthURL})`))],
            ephemeral: true,
          });
          return;
        }

        // ── Ticket panel open ─────────────────────────────────────────────────
        if (customId === 'ticket_open_panel') {
          const { buildTicketSelector } = require('../commands/ticket');
          await interaction.reply({
            embeds: [baseEmbed(msg, theme.ASTRAL_CORE)
              .setDescription('**Select your mission type below:**')],
            components: [buildTicketSelector()],
            ephemeral: true,
          });
          return;
        }

        // ── Legacy silent handlers ────────────────────────────────────────────
        if (customId.startsWith('help_') || customId.startsWith('pg_') || customId.startsWith('ban_') || customId.startsWith('hl_') || customId.startsWith('tkt_') || customId.startsWith('lb_')) {
          return;
        }
      }

      if (interaction.isStringSelectMenu()) {

        // ── Help category selector ────────────────────────────────────────────
        if (customId === 'help_category') {
          await interaction.deferUpdate();
          const key = interaction.values[0];
          const { buildCategoryEmbed, buildHelpSelector, CATEGORIES } = require('../commands/help');
          if (!CATEGORIES[key]) {
            await interaction.editReply({ embeds: [ui.error(client, 'Unknown Category', 'That category does not exist.')] });
            return;
          }
          await interaction.editReply({
            embeds: [buildCategoryEmbed(key)],
            components: [interaction.message.components[0]],
          });
          return;
        }

        // ── Ticket creation ───────────────────────────────────────────────────
        if (customId === 'ticket_category_select') {
          const { buildTicketConfirmEmbed, TICKET_CATEGORIES } = require('../commands/ticket');

          await interaction.deferUpdate();

          const category = interaction.values[0];
          const user = interaction.user;
          const guild = interaction.guild;

          const cat = TICKET_CATEGORIES.find(c => c.value === category) ?? TICKET_CATEGORIES[0];
          const catSlug = category.replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 20);
          const channelName = `ticket-${user.username.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${catSlug}`.slice(0, 100);

          const existing = guild.channels.cache.find(
            c => c.name === channelName && c.isTextBased()
          );
          if (existing) {
            await interaction.followUp({
              embeds: [ui.warning(client, 'Ticket Exists', `You already have an open ticket: ${existing}`)],
              ephemeral: true,
            });
            return;
          }

          try {
            const staffOverwrites = config.supportRoleId ? [
              { id: config.supportRoleId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ReadMessageHistory] },
            ] : [];

            const channel = await guild.channels.create({
              name: channelName,
              type: ChannelType.GuildText,
              parent: interaction.channel?.parentId ?? null,
              topic: `Support ticket for ${user.tag} — ${cat.label}`,
              permissionOverwrites: [
                { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AttachFiles] },
                ...staffOverwrites,
              ],
            });

            // Save ticket to DB so close confirmation can find it later
            const ticketId = 'TKT-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 4).toUpperCase();
            if (dbOK()) {
              await Ticket.create({
                ticketId,
                channelId: channel.id,
                guildId: guild.id,
                userId: user.id,
                username: user.username,
                status: 'open',
              }).catch(() => {});
            }

            const closeRow = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId('ticket_close')
                .setLabel('CLOSE TICKET')
                .setEmoji(icon('BTN_CLOSE'))
                .setStyle(ButtonStyle.Danger),
            );

            await channel.send({
              content: `<@${user.id}>`,
              embeds: [ticketWelcomeEmbed(user, cat.label)],
              components: [closeRow],
            });

            await interaction.editReply({
              embeds: [buildTicketConfirmEmbed(channel, cat.label)],
              components: [],
            });
          } catch (err) {
            await interaction.editReply({
              embeds: [ui.error(client, 'Ticket Failed', err.message, 'Check bot channel permissions.')],
              components: [],
            });
          }
          return;
        }

        // ── Legacy ticket creation ────────────────────────────────────────────
        if (customId === 'ticket_create') {
          if (!dbOK()) {
            return interaction.reply({ content: 'Database unavailable.', ephemeral: true });
          }

          const category = LEGACY_CATEGORIES.find(c => c.value === interaction.values[0]);
          if (!category) return;

          const existing = await Ticket.findOne({ userId: user.id, status: 'open' });
          if (existing) {
            return interaction.reply({
              embeds: [baseEmbed(msg, COLORS.ERROR).setDescription('You already have an open ticket: <#' + existing.channelId + '>')],
              ephemeral: true,
            });
          }

          await interaction.deferReply({ ephemeral: true });

          const ticketId = 'TKT-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 4).toUpperCase();
          const channelName = `ticket-${user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

          const ticketChannel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: channel?.parent?.id || null,
            permissionOverwrites: [
              { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
              { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
              { id: interaction.client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageChannels] },
            ],
          });

          await Ticket.create({
            ticketId, channelId: ticketChannel.id, guildId: guild.id,
            userId: user.id, username: user.username, status: 'open',
          });

          const embed = baseEmbed(msg, COLORS.TICKET_OPEN)
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setDescription('-# Your support channel is ready. Staff will assist you shortly.')
            .addFields(
              { name: '? Opened By', value: `**${user.tag}**`, inline: true },
              { name: '? Category', value: `${category.emoji} **${category.label}**`, inline: true },
              { name: '? Created', value: `${ts()}`, inline: true },
            );

          const row = new ActionRowBuilder().addComponents(
            BTN.danger('tkt_close', 'Close Ticket'),
          );

          await ticketChannel.send({ content: `${user}`, embeds: [embed], components: [row] });
          await interaction.editReply({
            embeds: [baseEmbed(msg, COLORS.TICKET_OPEN).setThumbnail(interaction.client.user.displayAvatarURL()).setDescription('? Ticket created: ' + ticketChannel)],
          });
          return;
        }
      }
    } catch (err) {
      logger.error(`Interaction error: ${err.message}`);
      logger.error(err.stack);
      if (!interaction.replied && !interaction.deferred) {
        interaction.reply({ content: 'An error occurred.', ephemeral: true }).catch(() => {});
      } else if (interaction.deferred) {
        interaction.followUp({ content: 'An error occurred.', ephemeral: true }).catch(() => {});
      }
    }
  },
};
