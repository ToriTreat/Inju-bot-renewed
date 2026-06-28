'use strict';

const fs     = require('fs');
const path   = require('path');
const { hasAnyStaffRole } = require('../config/roles');
const ui     = require('../utils/ui');
const logger = require('../utils/logger');

// ─── THREAD DEFINITIONS ───────────────────────────────────────────────────────
// This block is auto-populated the very first time !embed is run while the
// original Discord threads still exist. After that, the fetch logic is removed
// and this array holds the content permanently — no Discord threads needed.
// ─────────────────────────────────────────────────────────────────────────────
const THREADS = null; // will be replaced on first run

const THREAD_IDS = [
  { id: '1520368717534466149' },
  { id: '1520368792704782370' },
  { id: '1520368797062664334' },
  { id: '1520368801630261258' },
  { id: '1520368804599693322' },
  { id: '1520368806856233064' },
  { id: '1520368809242787850' },
  { id: '1520368811402985542' },
  { id: '1520368813533696134' },
  { id: '1520368815769125034' },
  { id: '1520368817623269456' },
  { id: '1520368837156016248' },
  { id: '1520368839466946754' },
];

// ─── FIRST-RUN: fetch thread content, rewrite this file, done ────────────────
async function bootstrapAndRewrite(client) {
  const fetched = [];

  for (const { id } of THREAD_IDS) {
    let thread;
    try {
      thread = await client.channels.fetch(id);
    } catch (err) {
      logger.warn(`embed bootstrap: could not fetch thread ${id}: ${err.message}`);
      fetched.push({ name: id, messages: ['*(thread not found)*'] });
      continue;
    }

    const name = thread.name ?? id;
    let msgs = [];

    try {
      const raw = await thread.messages.fetch({ limit: 100 });
      const sorted = [...raw.values()]
        .filter(m => !m.system && !m.author?.bot)
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp);

      for (const m of sorted) {
        const parts = [];
        if (m.content) parts.push(m.content);
        for (const [, att] of m.attachments) parts.push(att.url);
        if (parts.length) msgs.push(parts.join('\n'));
      }
    } catch (err) {
      logger.warn(`embed bootstrap: could not fetch messages for "${name}": ${err.message}`);
    }

    if (msgs.length === 0) msgs = ['*(no messages found)*'];
    fetched.push({ name, messages: msgs });

    await new Promise(r => setTimeout(r, 500));
  }

  // Build the hardcoded version of this file — no fetch logic, just the data
  const escape = s => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

  const threadEntries = fetched.map(t => {
    const msgLines = t.messages.map(m => `    \`${escape(m)}\`,`).join('\n');
    return `  {\n    name: \`${escape(t.name)}\`,\n    messages: [\n${msgLines}\n    ],\n  }`;
  });

  const hardcoded = `'use strict';

const { hasAnyStaffRole } = require('../config/roles');
const ui = require('../utils/ui');
const logger = require('../utils/logger');

// ─── THREAD DEFINITIONS (fetched and saved on first run) ──────────────────────
// Edit this array any time to change what !embed creates.
const THREADS = [
${threadEntries.join(',\n')}
];
// ──────────────────────────────────────────────────────────────────────────────

async function execute(message, args) {
  if (!hasAnyStaffRole(message.member)) {
    return message.reply({ embeds: [ui.noPerm(message.client, 'Staff')] });
  }

  // !embed            → current channel
  // !embed #channel   → mentioned channel
  // !embed 123456789  → channel by ID
  let targetChannel = message.mentions.channels.first() ?? null;

  if (!targetChannel && args[0]) {
    const rawId = args[0].replace(/[<#>]/g, '');
    if (/^\\d{17,20}$/.test(rawId)) {
      targetChannel = message.client.channels.cache.get(rawId)
        ?? await message.client.channels.fetch(rawId).catch(() => null);
    }
  }

  if (!targetChannel) targetChannel = message.channel;

  if (!targetChannel.isTextBased()) {
    return message.reply({ embeds: [ui.error(message.client, 'Invalid Channel', 'That must be a text channel.')] });
  }

  const statusMsg = await message.reply({
    content: \`⏳ Creating **\${THREADS.length}** threads in \${targetChannel}... please wait.\`,
  });

  let created = 0;
  let failed  = 0;

  for (const def of THREADS) {
    try {
      const thread = await targetChannel.threads.create({
        name: def.name,
        autoArchiveDuration: 10080,
        reason: \`!embed by \${message.author.tag}\`,
      }).catch(() => null);

      if (!thread) { failed++; continue; }

      for (const msgContent of def.messages) {
        for (let i = 0; i < msgContent.length; i += 1990) {
          await thread.send({ content: msgContent.slice(i, i + 1990) }).catch(() => {});
        }
        await new Promise(r => setTimeout(r, 600));
      }

      created++;
    } catch (err) {
      logger.error(\`embed: error creating thread "\${def.name}": \${err.message}\`);
      failed++;
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  await statusMsg.edit({
    content:
      \`✅ Done! Created **\${created}** thread\${created !== 1 ? 's' : ''} in \${targetChannel}\` +
      (failed > 0 ? \`, **\${failed}** failed — check bot permissions.\` : '.'),
  });
}

module.exports = { name: 'embed', execute };
`;

  fs.writeFileSync(path.join(__dirname, 'embed.js'), hardcoded, 'utf8');
  logger.info('embed: thread content fetched and saved. Fetch logic removed from embed.js.');
  return fetched;
}
// ─────────────────────────────────────────────────────────────────────────────

async function execute(message, args) {
  if (!hasAnyStaffRole(message.member)) {
    return message.reply({ embeds: [ui.noPerm(message.client, 'Staff')] });
  }

  // ── First run: THREADS is null → fetch content and rewrite this file ──────
  if (THREADS === null) {
    const statusMsg = await message.reply({
      content: `⏳ **First run detected.** Fetching thread content from Discord and saving it permanently... this takes about 15 seconds.`,
    });

    let fetched;
    try {
      fetched = await bootstrapAndRewrite(message.client);
    } catch (err) {
      logger.error(`embed bootstrap error: ${err.message}`);
      return statusMsg.edit({ content: `❌ Failed to fetch thread content: ${err.message}` });
    }

    await statusMsg.edit({
      content:
        `✅ **Content saved permanently** — fetched **${fetched.length}** threads.\n` +
        `You can now delete the original Discord threads.\n` +
        `Run \`!embed\` again (or \`!embed #channel\`) to create the threads wherever you want.`,
    });
    return;
  }

  // ── Normal run: create threads from hardcoded content ─────────────────────
  let targetChannel = message.mentions.channels.first() ?? null;

  if (!targetChannel && args[0]) {
    const rawId = args[0].replace(/[<#>]/g, '');
    if (/^\d{17,20}$/.test(rawId)) {
      targetChannel = message.client.channels.cache.get(rawId)
        ?? await message.client.channels.fetch(rawId).catch(() => null);
    }
  }

  if (!targetChannel) targetChannel = message.channel;

  if (!targetChannel.isTextBased()) {
    return message.reply({ embeds: [ui.error(message.client, 'Invalid Channel', 'That must be a text channel.')] });
  }

  const statusMsg = await message.reply({
    content: `⏳ Creating **${THREADS.length}** threads in ${targetChannel}... please wait.`,
  });

  let created = 0;
  let failed  = 0;

  for (const def of THREADS) {
    try {
      const thread = await targetChannel.threads.create({
        name: def.name,
        autoArchiveDuration: 10080,
        reason: `!embed by ${message.author.tag}`,
      }).catch(() => null);

      if (!thread) { failed++; continue; }

      for (const msgContent of def.messages) {
        for (let i = 0; i < msgContent.length; i += 1990) {
          await thread.send({ content: msgContent.slice(i, i + 1990) }).catch(() => {});
        }
        await new Promise(r => setTimeout(r, 600));
      }

      created++;
    } catch (err) {
      logger.error(`embed: error creating thread "${def.name}": ${err.message}`);
      failed++;
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  await statusMsg.edit({
    content:
      `✅ Done! Created **${created}** thread${created !== 1 ? 's' : ''} in ${targetChannel}` +
      (failed > 0 ? `, **${failed}** failed — check bot permissions.` : '.'),
  });
}

module.exports = { name: 'embed', execute };
