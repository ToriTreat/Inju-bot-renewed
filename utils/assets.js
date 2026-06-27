'use strict';

const HERO_POOL = [
  'https://media.tenor.com/0lO6ZgMWkM4AAAAC/choso-geto.gif',
  'https://media.tenor.com/YShFpL68wa4AAAAC/gojo-vs-sukuna-sukuna-vs-gojo.gif',
  'https://media.tenor.com/6sF80JnxnzoAAAAC/mahoraga-cursed-energy.gif',
  'https://media.tenor.com/2O86U24dq1AAAAAC/gojo-vs-sukuna-sukuna-vs-gojo.gif',
  'https://media.tenor.com/tPQ8UEW2SfUAAAAC/kashimo-jujutsu-kaisen.gif',
  'https://media.tenor.com/GXmkKqKUdX0AAAAC/ryomen-sukuna-sukuna-ryomen.gif',
  'https://media.tenor.com/nzwkSTwG3ToAAAAC/gojo-satoru-sukuna.gif',
  'https://media.tenor.com/Pi5w2UFZWO0AAAAC/hakari-kinji-kinji-hakari.gif',
  'https://media.tenor.com/GLIZz0wBD4gAAAAC/sukuna-manga-manga-animation.gif',
  'https://media.tenor.com/lviRPgFV-R0AAAAC/satoru-gojo-gojo-vs-sukuna.gif',
  'https://media.tenor.com/aYMfjRBWKaIAAAAC/gojo-satoru-gojo.gif',
];

const HERO_POOL_SIZE = HERO_POOL.length;

const PINNED_BANNER = HERO_POOL[0];

let _lastGifIndex = -1;

function getRandomHero() {
  const size = HERO_POOL.length;
  let idx;
  do {
    idx = Math.floor(Math.random() * size);
  } while (idx === _lastGifIndex && size > 1);
  _lastGifIndex = idx;
  return HERO_POOL[idx];
}

function getHeroGif(_key) {
  if (_key === 'pinned' || _key === 'banner') return PINNED_BANNER;
  return getRandomHero();
}

function getPinnedBanner() {
  return PINNED_BANNER;
}

function getHeroImage() {
  return getRandomHero();
}

function getAvatarUrl(user, size = 4096) {
  if (!user) return null;
  return user.displayAvatarURL({ size, dynamic: true, format: 'png' });
}

function getGuildIconUrl(guild, size = 4096) {
  return guild?.iconURL({ size, dynamic: true, format: 'png' }) ?? null;
}

function getUserBannerUrl(user, size = 4096) {
  if (!user) return null;
  if (typeof user.bannerURL !== 'function') return null;
  return user.bannerURL({ size, dynamic: true, format: 'png' });
}

function isValidGifUrl(url) {
  if (typeof url !== 'string') return false;
  return (
    url.endsWith('.gif') ||
    url.endsWith('.png') ||
    url.includes('media.giphy.com') ||
    url.includes('giphy.com') ||
    url.includes('media.tenor.com') ||
    url.includes('media1.tenor.com') ||
    url.includes('media4.giphy.com') ||
    url.includes('i.pinimg.com') ||
    url.includes('tenor.com') ||
    url.includes('cdn3.emoji.gg') ||
    url.includes('emoji.gg')
  );
}

module.exports = {
  HERO_POOL,
  HERO_POOL_SIZE,
  PINNED_BANNER,
  getHeroGif,
  getPinnedBanner,
  getRandomHero,
  getHeroImage,
  getAvatarUrl,
  getGuildIconUrl,
  getUserBannerUrl,
  isValidGifUrl,
};
