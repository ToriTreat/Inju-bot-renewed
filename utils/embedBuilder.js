'use strict';

const shim = require('./embeds');

const reExports = {
  EmbedBuilder: require('discord.js').EmbedBuilder,
  ButtonBuilder: require('discord.js').ButtonBuilder,
  ButtonStyle: require('discord.js').ButtonStyle,
  ActionRowBuilder: require('discord.js').ActionRowBuilder,
  StringSelectMenuBuilder: require('discord.js').StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder: require('discord.js').StringSelectMenuOptionBuilder,
};

const CORE = {
  ...shim,
  ...reExports,
  COMPONENTS: shim.COMPONENTS,
};

function _pick(name) {
  return shim[name];
}

const PROXIED = new Proxy(CORE, {
  get(target, key) {
    if (key in target) return target[key];
    if (typeof key === 'string' && key in shim) return shim[key];
    return undefined;
  },
  has(target, key) {
    return key in target || (typeof key === 'string' && key in shim);
  },
});

module.exports = PROXIED;
module.exports.default = PROXIED;
module.exports.createEmbed = shim.createEmbed;
module.exports.checkEmbed = shim.checkEmbed;
module.exports.banEmbed = shim.banEmbed;
module.exports.banResultEmbed = shim.banResultEmbed;
module.exports.vouchEmbed = shim.vouchEmbed;
module.exports.ticketPanelEmbed = shim.ticketPanelEmbed;
module.exports.ticketWelcomeEmbed = shim.ticketWelcomeEmbed;
module.exports.ticketCloseConfirmEmbed = shim.ticketCloseConfirmEmbed;
module.exports.helpHubEmbed = shim.helpHubEmbed;
module.exports.helpCategoryEmbed = shim.helpCategoryEmbed;
module.exports.userInfoEmbed = shim.userInfoEmbed;
module.exports.userinfoEmbed = shim.userinfoEmbed;
module.exports.serverInfoEmbed = shim.serverInfoEmbed;
module.exports.credentialsEmbed = shim.credentialsEmbed;
module.exports.warningEmbed = shim.warningEmbed;
module.exports.domainsEmbed = shim.domainsEmbed;
module.exports.apiStatusEmbed = shim.apiStatusEmbed;
module.exports.domainCheckEmbed = shim.domainCheckEmbed;
module.exports.hyperlinkEmbed = shim.hyperlinkEmbed;
module.exports.setTokenEmbed = shim.setTokenEmbed;
module.exports.siteEmbed = shim.siteEmbed;
module.exports.supportEmbed = shim.supportEmbed;
module.exports.avatarEmbed = shim.avatarEmbed;
module.exports.errorEmbed = shim.errorEmbed;
module.exports.successEmbed = shim.successEmbed;
module.exports.loadingEmbed = shim.loadingEmbed;
module.exports.infoEmbed = shim.infoEmbed;
module.exports.cooldownEmbed = shim.cooldownEmbed;
module.exports.noPermEmbed = shim.noPermEmbed;
module.exports.securityAlertEmbed = shim.securityAlertEmbed;
module.exports.dmEmbed = shim.dmEmbed;
module.exports.botAvatar = shim.botAvatar;
module.exports.userAvatar = shim.userAvatar;
module.exports.guildIcon = shim.guildIcon;
module.exports.footer = shim.systemFooter;
module.exports.COMPONENTS = shim.COMPONENTS;
