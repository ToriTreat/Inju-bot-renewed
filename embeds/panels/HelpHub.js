'use strict';

const { premiumEmbed, premiumDivider, ACCENT } = require('../theme/premium');
const { section } = require('../factories/field');
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { icon, iconUnicode } = require('../../utils/iconMap');

function HelpHub(client, opts = {}) {
  const {
    categories = [],
    activeCategory = 'All',
    page = 1,
    totalPages = 1,
    commandCount = 0,
  } = opts;

  const HDR_CATEGORY = icon('HDR_CATEGORY');
  const HDR_PAGE     = icon('HDR_PAGE');
  const HDR_COMMANDS = icon('HDR_COMMANDS');

  const desc = [
    premiumDivider('Command Index'),
    '',
    section('Help Hub'),
    `> ${HDR_CATEGORY} **CATEGORY**  \`${activeCategory.toUpperCase()}\``,
    `> ${HDR_PAGE} **PAGE**  ${page} / ${totalPages}`,
    `> ${HDR_COMMANDS} **COMMANDS**  \`${commandCount}\``,
    '',
    premiumDivider(),
  ].join('\n');

  const embed = premiumEmbed({
    palette: 'UTILITY',
    accentOverride: ACCENT.UTILITY,
    client,
    authorTitle: 'Command Index',
    description: desc,
    moduleName: 'HELP',
    gifKey: 'pinned',
    timestamp: false,
  });

  const select = new StringSelectMenuBuilder()
    .setCustomId('sm:help:category')
    .setPlaceholder('[ SELECT A CATEGORY ]');

  for (const cat of categories.slice(0, 25)) {
    const slot = 'CAT_' + String(cat.value || cat.name || '').toUpperCase().replace(/[^A-Z0-9]/g, '_');
    const selectEmoji = cat.emoji || cat.glyph || iconUnicode(slot);
    select.addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel(cat.label || cat.name || 'Category')
        .setValue(cat.value || cat.name || 'all')
        .setDescription((cat.description || `Commands in ${cat.label || cat.name}`).slice(0, 100))
        .setEmoji(selectEmoji),
    );
  }

  const navRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`btn:help:page:${Math.max(1, page - 1)}`)
      .setLabel('◀ PREV')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page <= 1),
    new ButtonBuilder()
      .setCustomId(`btn:help:page:${Math.min(totalPages, page + 1)}`)
      .setLabel('NEXT ▶')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page >= totalPages),
  );

  return {
    embeds: [embed],
    components: [new ActionRowBuilder().addComponents(select), navRow],
  };
}

function HelpCategory(client, category, commands, page, totalPages, opts = {}) {
  const list = commands
    .map(cmd => {
      const usage = cmd.usage ? ` \`${cmd.usage}\`` : '';
      const desc = (cmd.desc || cmd.description || '').toUpperCase();
      return `**\`!${cmd.name}\`**${usage}\n${desc}`;
    })
    .join('\n\n');

  const HDR_CATEGORY = icon('HDR_CATEGORY');
  const HDR_PAGE     = icon('HDR_PAGE');

  const desc = [
    premiumDivider('Command Index'),
    '',
    `> ${HDR_CATEGORY} **CATEGORY**  \`${(category || 'All').toUpperCase()}\``,
    `> ${HDR_PAGE} **PAGE**  ${page} / ${totalPages}`,
    '',
    list || '`_No commands in this category._`',
    '',
    premiumDivider(),
  ].join('\n');

  const embed = premiumEmbed({
    palette: 'UTILITY',
    accentOverride: ACCENT.UTILITY,
    client,
    authorTitle: `Command Index — ${category}`,
    description: desc,
    moduleName: 'HELP',
    gifKey: 'pinned',
  });

  return { embeds: [embed] };
}

module.exports = { HelpHub, HelpCategory };
