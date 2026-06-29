'use strict';

const ui    = require('../utils/ui');
const eb    = require('../utils/embedBuilder');
const { hasAnyStaffRole } = require('../config/roles');

// Share the pending Map with ban.js so interactionCreate.js can find entries
// regardless of whether !ban or !unban triggered the confirmation prompt.
const { setPending } = require('./ban');

async function execute(message, args) {
  if (!hasAnyStaffRole(message.member)) {
    return message.reply({ embeds: [ui.noPerm(message.client, 'Staff')] });
  }

  // Support both @mention and raw user ID
  let targetUser = message.mentions.users.first();

  if (!targetUser) {
    const rawId = (args[0] || '').replace(/[<@!>]/g, '');
    if (!rawId) {
      return message.reply({
        embeds: [ui.error(message.client, 'No Target', 'You must @mention a user or provide a user ID to unban.', '!unban @user [reason] OR !unban <userId> [reason]')],
      });
    }
    try {
      targetUser = await message.client.users.fetch(rawId);
    } catch {
      return message.reply({
        embeds: [ui.error(message.client, 'User Not Found', `Could not find a user with ID \`${rawId}\`.`, '!unban @user [reason] OR !unban <userId> [reason]')],
      });
    }
  }

  const reasonArgs = args.slice(1);
  const reason = reasonArgs.join(' ') || null;

  const prompt = ui.confirmPrompt(
    message.client,
    'Confirm Unban',
    `You are about to **unban** ${targetUser.tag}\n\n` +
    `Reason: \`${reason || 'No reason provided'}\`\n> This action will be logged.`,
    `mod_confirm_${message.id}`,
    `mod_cancel_${message.id}`,
  );

  const sent = await message.reply(prompt);

  // Store in ban.js's shared pending Map so interactionCreate.js can resolve it
  setPending(sent.id, {
    target: targetUser,
    reason,
    moderator: message.author,
    action: 'unban',
  });
}

module.exports = { name: 'unban', execute };
