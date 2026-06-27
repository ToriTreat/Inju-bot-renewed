'use strict';

const { baseEmbed } = require('../factories/base');
const { icon } = require('../../utils/iconMap');

const ICON = icon('BTN_CLOSE');

function noPerm(client, required = 'Administrator', opts = {}) {
  const req = String(required || 'Administrator');
  const desc = `${ICON} You need **${req}** permissions to use this command.`;
  return baseEmbed({
    palette: 'ERROR',
    client,
    authorTitle: 'Access Denied',
    description: desc,
    moduleName: opts.moduleName || 'ACCESS',
    requester: opts.requester,
    gifKey: opts.gifKey,
    image: opts.image,
  });
}

module.exports = { noPerm };
