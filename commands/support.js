'use strict';

const ticket = require('./ticket');

async function execute(message) {
  await ticket.execute(message);
}

module.exports = { name: 'support', execute };
