'use strict';

const { icon } = require('../utils/iconMap');
const eb = require('../utils/embedBuilder');
const assets = require('../utils/assets');
const startTime = Date.now();

async function execute(message) {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  const cmdCount = global._baddiesCommandCount || 0;

  const lines = [
    `${icon('MEDAL_1')}  **BADDIES BOT**  \`ASTRAL V2\``,
    '',
    `${icon('STATUS_SUCCESS')}  **UPTIME**  <t:${Math.floor(startTime / 1000)}:R>`,
    `${icon('ICON_HITS')}  **COMMANDS**  \`${cmdCount}\` processed`,
  ];

  const embed = eb.createEmbed({
    palette: 'UTILITY',
    client: message.client,
    authorTitle: 'Bot Information',
    description: lines.join('\n'),
    thumbnail: message.client.user?.displayAvatarURL(),
    image: assets.getHeroGif(),
    footer: `ASTRAL V2  ·  ${uptime}s uptime`,
  });

  await message.reply({ embeds: [embed] });
}

module.exports = { name: 'botinfo', execute };
