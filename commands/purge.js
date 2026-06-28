'use strict';

const { PermissionFlagsBits } = require('discord.js');
const ui = require('../utils/ui');

async function execute(message, args) {
  if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
    return message.reply({ embeds: [ui.noPerm(message.client, 'Manage Messages')] });
  }

  // ── Mode 1: Reply to a message → purge everything AFTER that message ────
  if (message.reference?.messageId) {
    const refId = message.reference.messageId;

    let refMsg;
    try {
      refMsg = await message.channel.messages.fetch(refId);
    } catch {
      return message.reply({ embeds: [ui.error(message.client, 'Not Found', 'Could not find the message you replied to.')] });
    }

    // Fetch up to 100 messages sent AFTER the referenced message
    // Discord's { after: id } returns messages newer than that ID (oldest → newest)
    const fetched = await message.channel.messages.fetch({ after: refId, limit: 100 }).catch(() => null);
    if (!fetched || fetched.size === 0) {
      const reply = await message.channel.send({ embeds: [ui.info(message.client, 'Nothing to Delete', 'No messages found after that message.')] });
      setTimeout(() => reply.delete().catch(() => {}), 3000);
      return;
    }

    // Also include the command message itself so it gets cleaned up
    fetched.set(message.id, message);

    // bulkDelete only works on messages ≤ 14 days old
    const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
    const deletable = fetched.filter(m => m.createdTimestamp > cutoff);

    if (deletable.size === 0) {
      const reply = await message.channel.send({ embeds: [ui.error(message.client, 'Too Old', 'Messages older than 14 days cannot be bulk-deleted.')] });
      setTimeout(() => reply.delete().catch(() => {}), 4000);
      return;
    }

    try {
      const deleted = await message.channel.bulkDelete(deletable, true);
      const reply = await message.channel.send({
        embeds: [ui.success(message.client, 'Purge Complete', `Deleted **${deleted.size}** message${deleted.size !== 1 ? 's' : ''} after the selected message.`)],
      });
      setTimeout(() => reply.delete().catch(() => {}), 3000);
    } catch (err) {
      message.channel.send({ embeds: [ui.error(message.client, 'Purge Failed', err.message)] }).catch(() => {});
    }
    return;
  }

  // ── Mode 2: !purge <amount> → delete last N messages (original behaviour) ─
  const amount = parseInt(args[0], 10);
  if (isNaN(amount) || amount < 1 || amount > 100) {
    return message.reply({
      embeds: [ui.error(message.client, 'Invalid Usage',
        'Use `!purge <1-100>` to delete by count, or **reply to a message** with `!purge` to delete everything after it.')],
    });
  }

  try {
    // +1 to also delete the command message itself
    const deleted = await message.channel.bulkDelete(amount + 1, true);
    const reply = await message.channel.send({
      embeds: [ui.success(message.client, 'Purge Complete', `Deleted **${Math.max(0, deleted.size - 1)}** message${deleted.size !== 2 ? 's' : ''}.`)],
    });
    setTimeout(() => reply.delete().catch(() => {}), 3000);
  } catch (err) {
    message.channel.send({ embeds: [ui.error(message.client, 'Purge Failed', err.message)] }).catch(() => {});
  }
}

module.exports = { name: 'purge', execute };
