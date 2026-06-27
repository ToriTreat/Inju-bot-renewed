'use strict';

const FALLBACK_AVATAR = process.env.BOT_AVATAR_URL || null;

function isHttpUrl(value) {
  return typeof value === 'string' && /^https?:\/\//.test(value);
}

function botAvatar(client) {
  if (client && client.user && typeof client.user.displayAvatarURL === 'function') {
    return client.user.displayAvatarURL({ size: 1024, dynamic: true, format: 'png' });
  }
  return FALLBACK_AVATAR;
}

function userAvatar(user, size = 1024) {
  if (!user) return null;
  if (typeof user.displayAvatarURL === 'function') {
    return user.displayAvatarURL({ size, dynamic: true, format: 'png' });
  }
  if (typeof user.avatarURL === 'string' && isHttpUrl(user.avatarURL)) {
    return user.avatarURL;
  }
  if (typeof user.avatar === 'string' && isHttpUrl(user.avatar)) {
    return user.avatar;
  }
  return null;
}

function guildIcon(guild, size = 1024) {
  if (!guild) return null;
  if (typeof guild.iconURL === 'function') {
    return guild.iconURL({ size, dynamic: true, format: 'png' });
  }
  if (typeof guild.icon === 'string' && isHttpUrl(guild.icon)) {
    return guild.icon;
  }
  return null;
}

module.exports = { botAvatar, userAvatar, guildIcon, isHttpUrl };
