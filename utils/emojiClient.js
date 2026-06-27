'use strict';

const API_URL = 'https://emoji.gg/api';
let cache = null;
let cachePromise = null;

async function fetchAll() {
  if (cache) return cache;
  if (cachePromise) return cachePromise;

  cachePromise = fetch(API_URL, { signal: AbortSignal.timeout(15000) })
    .then(r => r.json())
    .then(data => {
      cache = data;
      cachePromise = null;
      return cache;
    })
    .catch(err => {
      cachePromise = null;
      throw err;
    });

  return cachePromise;
}

function findByTitle(title) {
  if (!cache) return null;
  const lower = title.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cache.find(e => e.title.toLowerCase().replace(/[^a-z0-9]/g, '') === lower) || null;
}

function getImageUrl(title) {
  const match = findByTitle(title);
  return match ? match.image : null;
}

function getCDN(...titles) {
  for (const t of titles) {
    const url = getImageUrl(t);
    if (url) return url;
  }
  return null;
}

module.exports = { fetchAll, findByTitle, getImageUrl, getCDN };
