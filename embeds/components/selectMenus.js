'use strict';

const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
const { icon } = require('../../utils/iconMap');

const CATEGORIES = [
  { value: 'general',   label: 'General Support',  emoji: icon('CAT_SOCIAL'),   description: 'General questions & help' },
  { value: 'account',   label: 'Account Issues',   emoji: icon('BTN_APPEAL'),  description: 'Login, tokens, verification' },
  { value: 'billing',   label: 'Billing & Payment', emoji: icon('ICON_BALANCE'), description: 'Payments, refunds, invoices' },
  { value: 'technical', label: 'Technical Issue',  emoji: icon('CAT_TOOLS'),   description: 'Bugs, errors, integrations' },
  { value: 'other',     label: 'Other',            emoji: icon('HDR_PAGE'),    description: 'Anything else' },
];

function _build(customId, placeholder, options) {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder(placeholder || '[ SELECT AN OPTION ]')
    .setMinValues(1)
    .setMaxValues(1);

  for (const o of options.slice(0, 25)) {
    const emojiVal = o.emoji || icon('DIAMOND');
    menu.addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel(String(o.label).slice(0, 100))
        .setValue(String(o.value))
        .setDescription(String(o.description || '').slice(0, 100))
        .setEmoji(emojiVal),
    );
  }
  return new ActionRowBuilder().addComponents(menu);
}

function ticketCategoryMenu(opts = {}) {
  const cats = opts.categories || CATEGORIES;
  return _build(
    opts.customId || 'sm:support:category',
    opts.placeholder || '[ SELECT A SUPPORT CATEGORY ]',
    cats,
  );
}

function settingsMenu(options = [], opts = {}) {
  return _build(
    opts.customId || 'sm:settings:main',
    opts.placeholder || '[ SELECT A SETTING ]',
    options,
  );
}

function helpCategoryMenu(categories = []) {
  return _build(
    'sm:help:category',
    '[ SELECT A HELP CATEGORY ]',
    categories.map(c => ({
      label: c.label || c.name || 'Category',
      value: c.value || c.name || 'all',
      description: c.description || `Commands in ${c.label || c.name || 'category'}`,
      emoji: c.emoji || icon('DIAMOND'),
    })),
  );
}

function vouchTypeMenu() {
  return _build(
    'sm:vouch:type',
    '[ SELECT A VOUCH TYPE ]',
    [
      { value: 'positive', label: 'Positive', emoji: icon('STATUS_SUCCESS'), description: 'Genuine praise' },
      { value: 'neutral',  label: 'Neutral',  emoji: icon('DOT_GRAY'),     description: 'Mixed experience' },
    ],
  );
}

module.exports = { ticketCategoryMenu, settingsMenu, helpCategoryMenu, vouchTypeMenu, CATEGORIES };
