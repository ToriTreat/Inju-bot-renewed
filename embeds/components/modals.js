'use strict';

const { TicketReasonModal } = require('../modals/TicketReasonModal');
const { BanReasonModal } = require('../modals/BanReasonModal');
const { VouchMessageModal } = require('../modals/VouchMessageModal');

function buildModal(kind, opts = {}) {
  switch (kind) {
    case 'ticket': return TicketReasonModal(opts);
    case 'ban':    return BanReasonModal(opts);
    case 'vouch':  return VouchMessageModal(opts);
    default: throw new Error(`Unknown modal kind: ${kind}`);
  }
}

module.exports = {
  TicketReasonModal,
  BanReasonModal,
  VouchMessageModal,
  buildModal,
};
