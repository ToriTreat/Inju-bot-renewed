const axios = require('axios');
const config = require('../config/bot');
const logger = require('../utils/logger');

const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 429) logger.warn('API rate limited');
    return Promise.reject(err);
  }
);

async function fetchFast(url, timeoutMs = 5000) {
  try {
    const res = await api.get(url, { timeout: timeoutMs });
    return res.data;
  } catch (err) {
    logger.warn(`API fast fetch failed for ${url}: ${err.message}`);
    return null;
  }
}

async function getDomains() {
  const res = await fetchFast('/v2/domains');
  return res || null;
}

async function getServerConfig() {
  return await fetchFast('/v2/config');
}

module.exports = {
  api,
  getDomains,
  getServerConfig,
  fetchFast,
};
