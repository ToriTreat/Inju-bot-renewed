'use strict';

const { icon, iconUnicode } = require('../utils/iconMap');
const eb = require('../utils/embedBuilder');
const assets = require('../utils/assets');

async function execute(message) {
  const guild = message.guild;
  await guild.members.fetch().catch(() => {});

  const total = guild.memberCount;
  const bots = guild.members.cache.filter(m => m.user.bot).size;
  const humans = total - bots;
  const channels = guild.channels.cache.size;
  const roles = guild.roles.cache.size;
  const boosts = guild.premiumSubscriptionCount || 0;
  const owner = await guild.fetchOwner().catch(() => null);

  const freshness = Math.floor(Date.now() / 1000);

  const lines = [
    `${icon('MEDAL_1')}  **OWNER**  ${owner ? `\`${owner.user.tag}\`` : 'Unknown'}`,
    '',
    `${icon('ICON_HITS')}  **MEMBERS**  \`${total}\` (${humans} users, ${bots} bots)`,
    `${icon('ICON_CHANNELS')}  **CHANNELS**  \`${channels}\``,
    `${icon('ICON_ROLES')}  **ROLES**  \`${roles}\``,
    `${icon('ICON_BOOSTS')}  **BOOSTS**  \`${boosts}\``,
    '',
    `${iconUnicode('BTN_REFRESH')}  **CREATED**  <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
    `${iconUnicode('BTN_STATS')}  **ID**  \`${guild.id}\``,
  ];

  const embed = eb.createEmbed({
    palette: 'UTILITY',
    client: message.client,
    authorTitle: guild.name,
    description: lines.join('\n') + `\n\n${'━'.repeat(32)}\n<t:${freshness}:R>`,
    thumbnail: guild.iconURL({ size: 256 }),
    image: assets.getHeroGif(),
    footer: 'ASTRAL V2',
  });

  await message.reply({ embeds: [embed] });
}

module.exports = { name: 'serverinfo', execute };
