'use strict';

const ui     = require('../utils/ui');
const theme  = require('../utils/theme');
const assets = require('../utils/assets');
const eb     = require('../utils/embedBuilder');
const ce     = require('../utils/customEmojis');
const { icon } = require('../utils/iconMap');

function accountAgeTier(days) {
  if (days >= 365 * 3)  return `${icon('STATUS_SUCCESS')} \`VETERAN\``;
  if (days >= 365)      return `${icon('STATUS_WARNING')} \`MEMBER\``;
  if (days >= 90)       return `${icon('STATUS_WARNING')} \`REGULAR\``;
  return                       `${icon('STATUS_ERROR')} \`NEW\``;
}

function buildUserInfoEmbed(member, client) {
  const user         = member.user ?? member;
  const isGuildMember = !!member.joinedTimestamp;

  const createdDays = Math.floor((Date.now() - user.createdTimestamp) / 86_400_000);
  const joinedDays  = isGuildMember ? Math.floor((Date.now() - member.joinedTimestamp) / 86_400_000) : null;

  const avatarUrl = user.displayAvatarURL ? user.displayAvatarURL({ size: 4096, dynamic: true, format: 'png' }) : null;

  const body = `> ${icon('BTN_VIEW_USER')} **USER INTEL:** <@${user.id}>\n> ${icon('STATUS_LOADING')} **ACCOUNT AGE:** ${createdDays} DAYS AGO\n\n` +
    `${ce.premiumDivider('CHRONOLOGY')}\n` +
    `${icon('STATUS_INFO')} **CREATED:** <t:${Math.floor((user.createdTimestamp || Date.now()) / 1000)}:D>\n` +
    `${icon('BTN_STATUS')} **TIER:** ${accountAgeTier(createdDays)}\n\n` +
    `${ce.premiumDivider('SERVER LINK')}\n` +
    `${icon('HDR_PAGE')} **JOINED:** ${isGuildMember ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:D> (\`${joinedDays} DAYS\`)` : '`NOT IN SERVER`'}\n` +
    `${icon('CAT_MODERATION')} **ROLES:** ${isGuildMember ? `\`${(member.roles?.cache?.size || 0) - 1} ROLES\`` : '\`N/A\`'}`;

  const embed = eb.createEmbed({
    color: theme.USERINFO,
    client,
    authorName: `${icon('CROWN_FLAME')}  USER INTELLIGENCE`,
    authorIcon: avatarUrl,
    image: assets.getHeroGif('user'),
    useBotAvatarThumb: true,
    description: body,
  });

  return embed;
}

function buildServerInfoEmbed(guild, client) {
  return eb.serverInfoEmbed(guild, { client });
}

async function execute(message, args, client) {
  if (message.content.toLowerCase().startsWith('!info')) {
    const embed = buildServerInfoEmbed(message.guild, client);
    return message.reply({ embeds: [embed] });
  }

  let targetId = message.author.id;
  if (message.mentions.users.size > 0) {
    targetId = message.mentions.users.first().id;
  } else if (args[0]) {
    targetId = args[0].replace(/[<@!>]/g, '');
  }

  try {
    let member = message.guild.members.cache.get(targetId);
    if (!member) {
      member = await message.guild.members.fetch(targetId);
    }
    const embed = buildUserInfoEmbed(member, client);
    return message.reply({ embeds: [embed] });
  } catch (err) {
    try {
      const user = await client.users.fetch(targetId);
      const embed = buildUserInfoEmbed(user, client);
      return message.reply({ embeds: [embed] });
    } catch {
      return message.reply({ embeds: [ui.error(client, 'LOOKUP FAILED', 'COULD NOT LOCATE TARGET IN MAINFRAME.')] });
    }
  }
}

module.exports = { name: 'userinfo', description: 'User / Server info cards', execute, buildUserInfoEmbed, buildServerInfoEmbed };
