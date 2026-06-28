'use strict';

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const mongoose = require('mongoose');
const Vouch = require('../database/models/Vouch');
const theme = require('../utils/theme');
const EMOJI = require('../utils/emojis');
const ui    = require('../utils/ui');
const { getHeroGif } = require('../utils/emojis');
const eb    = require('../utils/embedBuilder');
const ce    = require('../utils/customEmojis');
const assets = require('../utils/assets');

const PAGE_SIZE = 5;

const VOUCH_TIERS = [
  { min: 50, id: 5, label: 'Legendary', slot: 'CROWN_GOLD',   color: theme.GOLD          },
  { min: 25, id: 4, label: 'Trusted',   slot: 'CROWN_PURPLE', color: theme.LEGENDARY     },
  { min: 10, id: 3, label: 'Respected', slot: 'CROWN_RED',    color: theme.MIDNIGHT      },
  { min: 5,  id: 2, label: 'Known',     slot: 'MEDAL_2',      color: theme.NAVY          },
  { min: 0,  id: 1, label: 'New',       slot: 'DIAMOND',      color: theme.PLATINUM      },
];

function getVouchTier(count) {
  return VOUCH_TIERS.find(t => count >= t.min) ?? VOUCH_TIERS[VOUCH_TIERS.length - 1];
}

function buildVouchEmbed(targetUser, vouches, page = 0, client) {
  return eb.vouchEmbed(targetUser, vouches, {
    client,
    page,
    totalPages: Math.max(1, Math.ceil(vouches.length / PAGE_SIZE)),
  });
}

// requesterId is embedded in the customId so the interaction handler
// can verify only that person can flip pages.
function buildVouchButtons(page, totalPages, targetId, requesterId = null) {
  const rid = requesterId ?? 'any';
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`vouch_prev_${page}_${targetId}_${rid}`)
      .setLabel('◀  Prev')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page === 0),
    new ButtonBuilder()
      .setCustomId(`vouch_next_${page}_${targetId}_${rid}`)
      .setLabel('Next  ▶')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page >= totalPages - 1),
  );
}

function dbOK() { return mongoose.connection.readyState === 1; }

async function execute(message, args) {
  const target = message.mentions.users.first() ?? message.author;
  const requesterId = message.author.id;

  const isAdding = !!message.mentions.users.first() && args.length > 1;

  const loadMsg = await message.reply({ embeds: [ui.loading(message.client, 'Loading reputation card…')] });

  try {
    let vouches = [];
    if (dbOK()) {
      const docs = await Vouch.find({ targetUserId: target.id }).sort({ createdAt: -1 }).lean().catch(() => []);
      vouches = docs.map(d => ({
        vouchedBy: d.authorUserId || d.vouchedBy,
        timestamp: d.createdAt?.getTime?.() || d.timestamp || Date.now(),
        note:      d.message || d.note || null,
      }));
    }

    if (isAdding) {
      const noteStart = message.content.indexOf(args[1]);
      const note = message.content.slice(noteStart).trim().slice(0, 200);

      if (dbOK()) {
        await Vouch.create({
          authorUserId: message.author.id,
          authorUser: message.author.username,
          targetUserId: target.id,
          targetUser: target.username,
          message: note || null,
        });
        const docs = await Vouch.find({ targetUserId: target.id }).sort({ createdAt: -1 }).lean().catch(() => []);
        vouches = docs.map(d => ({
          vouchedBy: d.authorUserId || d.vouchedBy,
          timestamp: d.createdAt?.getTime?.() || d.timestamp || Date.now(),
          note:      d.message || d.note || null,
        }));
      }

      const refreshedTotalPages = Math.max(1, Math.ceil(vouches.length / PAGE_SIZE));
      const refreshedPage = Math.max(0, refreshedTotalPages - 1);
      await loadMsg.edit({
        embeds: [buildVouchEmbed(target, vouches, refreshedPage, message.client)],
        components: [buildVouchButtons(refreshedPage, refreshedTotalPages, target.id, requesterId)],
      });
      return;
    }

    const totalPages = Math.max(1, Math.ceil(vouches.length / PAGE_SIZE));
    await loadMsg.edit({
      embeds:     [buildVouchEmbed(target, vouches, 0, message.client)],
      components: [buildVouchButtons(0, totalPages, target.id, requesterId)],
    });
  } catch (err) {
    await loadMsg.edit({
      embeds: [ui.error(message.client, 'Failed to load vouches', err.message)],
      components: [],
    });
  }
}

module.exports = { name: 'vouch', execute, buildVouchEmbed, buildVouchButtons, getVouchTier, VOUCH_TIERS, PAGE_SIZE };
