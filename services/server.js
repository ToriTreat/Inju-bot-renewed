const express = require('express');
const config = require('../config/bot');
const { router: oauthRouter, setClient } = require('../oauth');
const logger = require('../utils/logger');

function startServer(client) {
  const app = express();

  app.use(express.json());
  app.use(oauthRouter);

  if (client) setClient(client);

  app.get('/health', (req, res) => {
    res.json({ status: 'astral', version: '2.0', timestamp: new Date().toISOString() });
  });

  app.listen(config.port, () => {
    logger.info(`Express server running on port ${config.port}`);
  });
}

module.exports = { startServer };
