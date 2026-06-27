'use strict';

const domains = require('./domains');

async function execute(message, args, client) {
  await domains.execute(message, args, client);
}

module.exports = { name: 'check-d', execute };
