'use strict';

const { EmbedBuilder } = require('discord.js');
const theme = require('../utils/theme');
const ui    = require('../utils/ui');
const eb    = require('../utils/embedBuilder');
const { hasAnyStaffRole } = require('../config/roles');

const pending = new Map();

function setPending(msgId, data) {
  pending.set(msgId, data);
  setTimeout(() => pending.delete(msgId), 60_000);
}
function getPending(msgId) { return pending.get(msgId) ?? null; }
function clearPending(msgId) { pending.delete(msgId); }

function buildUnbanResultEmbed(target, moderator, reason) {
  return eb.banResultEmbed(target, moderator, reason, 'unban');
}

async function execute(message, args) {
  if (!hasAnyStaffRole(message.member)) {
    return message.reply({ embeds: [ui.noPerm(message.client, 'Staff')] });
  }

  const targetId = args[0]?.replace(/[<@!>]/g, '');
  if (!targetId) {
    return message.reply({ embeds: [ui.error(message.client, 'No Target', 'You must provide a user ID to unban.', '!unban <userId> [reason]')] });
  }

  let targetUser;
  try {
    targetUser = await message.client.users.fetch(targetId);
  } catch {
    return message.reply({ embeds: [ui.error('User Not Found', 'Could not fetch that user.')] });
  }

  const reason = args.slice(1).join(' ') || null;
  const prompt = ui.confirmPrompt(
    message.client,
    'Confirm Unban',
    `You are about to **unban** ${targetUser.tag}\n\n` +
    `Reason: \`${reason || 'No reason provided'}\`\n> This action will be logged.`,
    `mod_confirm_${message.id}`,
    `mod_cancel_${message.id}`,
  );

  const sent = await message.reply(prompt);

  setPending(sent.id, {
    target: targetUser,
    reason,
    moderator: message.author,
    action: 'unban',
  });
}

module.exports = { name: 'unban', execute, buildUnbanResultEmbed, getPending, clearPending };
