'use strict';

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const theme = require('../utils/theme');
const { icon, iconUnicode } = require('../utils/iconMap');
const eb = require('../utils/embedBuilder');
const assets = require('../utils/assets');

const DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://aslsite.vercel.app/';

function buildSiteEmbed() {
  const CROWN = icon('CROWN_GREY');
  const BOLT = iconUnicode('STATUS_SUCCESS');

  return eb.createEmbed({
    palette: 'UTILITY',
    client: null,
    authorName: 'ASTRAL BEAMS  ·  #1 SITES',
    image: assets.getHeroGif(),
    useBotAvatarThumb: true,
    description:
      `${CROWN}  ASTRAL BEAMS  ·  #1 SITES\n` +
      `> ${iconUnicode('HDR_CATEGORY')}  **1** ACTIVE DOMAIN\n` +
      `> ${icon('CROWN_PURPLE')}  Blazing-fast, feature-loaded infrastructure`,
    fields: [{
      name: `${icon('CROWN_PURPLE')}  PROS`,
      value:
        `${iconUnicode('BTN_TICKET_OPEN')}  NO ${icon('STATUS_ERROR')} account stealing\n` +
        `${icon('STATUS_SUCCESS')}  Frequent updates & bug fixes\n` +
        `${icon('STATUS_SUCCESS')}  Fastest login speed\n` +
        `${icon('STATUS_SUCCESS')}  Security from data breaches`,
      inline: false,
    }, {
      name: `${icon('CROWN_PURPLE')}  BRAND`,
      value:
        `${icon('ICON_BALANCE')}  Premium infrastructure\n` +
        `${CROWN}  Sub-second response times\n` +
        `${icon('CAT_MODERATION')}  Operator-grade moderation tools`,
      inline: false,
    }],
    footer: `${BOLT}  ASTRAL V2  ·  SITE`,
  });
}

function buildSiteButton() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('OPEN DASHBOARD')
      .setStyle(ButtonStyle.Link)
      .setURL(DASHBOARD_URL)
      .setEmoji(icon('BTN_ROCKET'))
  );
}

async function execute(message) {
  await message.reply({
    embeds: [buildSiteEmbed()],
    components: [buildSiteButton()],
  });
}

module.exports = { name: 'site', execute, buildSiteEmbed, buildSiteButton };
