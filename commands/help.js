'use strict';

const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const theme  = require('../utils/theme');
const EMOJI  = require('../utils/emojis');
const ui     = require('../utils/ui');
const eb     = require('../utils/embedBuilder');
const ce     = require('../utils/customEmojis');
const { icon, iconUnicode } = require('../utils/iconMap');

function safeUpper(value, fallback = 'UNKNOWN') {
  if (value === null || value === undefined) return fallback;
  return String(value).toUpperCase();
}

const CATEGORIES = {
  stats: {
    emoji:       iconUnicode('CAT_STATS'),
    glyph:       iconUnicode('CAT_STATS'),
    banner:      icon('CAT_STATS'),
    label:       'Stats & Rankings',
    description: 'Performance data, player cards',
    color:       theme.STATS,
    commands: [
      { name: '!stats [@user]', desc: 'Full player card with rank tier badge and live delta indicators' },
    ],
  },
  system: {
    emoji:       iconUnicode('CAT_SYSTEM'),
    glyph:       iconUnicode('CAT_SYSTEM'),
    banner:      icon('CAT_SYSTEM'),
    label:       'System',
    description: 'Diagnostics, domain checks, infrastructure status',
    color:       theme.DARK_BLUE,
    commands: [
      { name: '!check',              desc: 'Mission Control — live WebSocket, API, cache and bot health' },
      { name: '!domains',            desc: 'Full domain status dashboard for all tracked domains' },
      { name: '!check-d <domain>',   desc: 'Single domain health check with latency reading' },
      { name: '!check-s <service>',  desc: 'Service-specific status check' },
      { name: '!site',               desc: 'Dashboard link — opens the BADDIES web panel' },
    ],
  },
  social: {
    emoji:       iconUnicode('CAT_SOCIAL'),
    glyph:       iconUnicode('CAT_SOCIAL'),
    banner:      icon('CAT_SOCIAL'),
    label:       'Social & Reputation',
    description: 'Vouches, reputation tiers, community tools',
    color:       theme.BLUEBLACK,
    commands: [
      { name: '!vouch [@user] [note]', desc: 'Add a vouch to a member\'s reputation card' },
      { name: '!vouch [@user]',        desc: 'View someone\'s full vouch history and tier badge' },
      { name: '!ticket',               desc: 'Open a support ticket — category selector appears' },
      { name: '!support',              desc: 'Direct-link shortcut to open a support ticket' },
    ],
  },
  moderation: {
    emoji:       iconUnicode('CAT_MODERATION'),
    glyph:       iconUnicode('CAT_MODERATION'),
    banner:      icon('CAT_MODERATION'),
    label:       'Moderation',
    description: 'Ban management and member actions',
    color:       theme.DANGER,
    commands: [
      { name: '!ban @user [reason]',           desc: 'Ban a member — supports @mention or user ID' },
      { name: '!ban <userId> [reason]',        desc: 'Ban by raw user ID' },
      { name: '!unban @user [reason]',         desc: 'Unban a member — supports @mention or user ID' },
      { name: '!unban <userId> [reason]',      desc: 'Unban by raw user ID' },
      { name: '!kick @user [reason]',          desc: 'Kick a member from the server' },
      { name: '!timeout @user <min> [reason]', desc: 'Timeout a member for X minutes' },
      { name: '!warn @user <reason>',          desc: 'Issue a warning to a member' },
      { name: '!warnings [@user]',             desc: 'View warning history for a member' },
      { name: '!slowmode <seconds>',           desc: 'Set channel slowmode (0 = off)' },
      { name: '!lock',                         desc: 'Lock the current channel' },
      { name: '!unlock',                       desc: 'Unlock the current channel' },
      { name: '!say <message>',                desc: 'Send a message as the bot' },
      { name: '!role <add|remove> @user @role', desc: 'Add or remove a role from a member' },
    ],
  },
  tools: {
    emoji:       iconUnicode('CAT_TOOLS'),
    glyph:       iconUnicode('CAT_TOOLS'),
    banner:      icon('CAT_TOOLS'),
    label:       'Tools & Utilities',
    description: 'Formatting helpers, profile tools, messaging',
    color:       theme.DARK_BLUE,
    commands: [
      { name: '!avatar [@user]',         desc: 'High-res avatar card with download links for 4 sizes' },
      { name: '!userinfo [@user]',       desc: 'Discord profile card — ID, timestamps, roles, account age' },
      { name: '!serverinfo',             desc: 'Detailed server stats — members, channels, roles, boosts' },
      { name: '!botinfo',               desc: 'Bot version, uptime, health, command stats' },
      { name: '!info',                  desc: 'Server info — member count, creation date, boost level' },
      { name: '!hyperlink <url> <text>', desc: 'Generate a masked hyperlink — [text](url) format' },
      { name: '!dm @user <message>',    desc: 'Send a DM to a member via the bot' },
      { name: '!embed',                 desc: 'Create all method threads with their messages in this channel' },
    ],
  },
};

function _categoryList() {
  return Object.entries(CATEGORIES).map(([key, cat]) => ({
    value:       key,
    label:       cat.label,
    description: cat.description,
    emoji:       cat.emoji,
  }));
}

function buildCategoryEmbed(key) {
  const cat  = CATEGORIES[key];
  if (!cat) return eb.errorEmbed(null, 'Unknown Category', 'That category does not exist.');
  return eb.helpCategoryEmbed(null, cat.label, cat.commands, 1, 1, { client: null });
}

function buildHelpSelector() {
  const options = _categoryList();

  const menu = new StringSelectMenuBuilder()
    .setCustomId('help_category')
    .setPlaceholder('Select a category…')
    .addOptions(options);

  return new ActionRowBuilder().addComponents(menu);
}

function buildHubEmbed() {
  return eb.helpHubEmbed(null, { client: null, categories: _categoryList(), footerText: 'Help System' });
}

async function execute(message) {
  await message.reply({
    embeds:     [buildHubEmbed()],
    components: [buildHelpSelector()],
  });
}

module.exports = { name: 'help', execute, buildCategoryEmbed, buildHubEmbed, buildHelpSelector, CATEGORIES };
