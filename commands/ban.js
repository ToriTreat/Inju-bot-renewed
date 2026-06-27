'use strict';

const { EmbedBuilder } = require('discord.js');
const theme = require('../utils/theme');
const ui    = require('../utils/ui');
const eb    = require('../utils/embedBuilder');
const ce    = require('../utils/customEmojis');
const { hasAnyStaffRole } = require('../config/roles');

const pending = new Map();

function setPending(msgId, data) {
  pending.set(msgId, data);
  setTimeout(() => pending.delete(msgId), 60_000);
}
function getPending(msgId) { return pending.get(msgId) ?? null; }
function clearPending(msgId) { pending.delete(msgId); }

function buildBanResultEmbed(target, moderator, reason, action = 'ban') {
  return eb.banResultEmbed(target, moderator, reason, action);
}

async function execute(message, args) {
  if (!hasAnyStaffRole(message.member)) {
    return message.reply({ embeds: [ui.noPerm(message.client, 'Staff')] });
  }

  const target = message.mentions.users.first();
  if (!target) {
    return message.reply({ embeds: [ui.error(message.client, 'No Target', 'You must @mention a user to ban.', '!ban @user [reason]')] });
  }

  const reason = args.slice(1).join(' ') || null;
  const prompt = ui.confirmPrompt(
    message.client,
    'Confirm Ban',
    `You are about to **ban** ${target.tag}\n\n` +
    `Reason: \`${reason || 'No reason provided'}\`\n> This action will be logged.`,
    `mod_confirm_${message.id}`,
    `mod_cancel_${message.id}`,
  );

  const sent = await message.reply(prompt);

  setPending(sent.id, {
    target,
    reason,
    moderator: message.author,
    action: 'ban',
  });
}

module.exports = { name: 'ban', execute, buildBanResultEmbed, getPending, clearPending };
