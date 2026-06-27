'use strict';

const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { icon, iconUnicode } = require('../../utils/iconMap');

function btn(id, label, style, opts = {}) {
  const b = new ButtonBuilder().setCustomId(id).setLabel(label);
  const styleMap = {
    primary: ButtonStyle.Primary,
    secondary: ButtonStyle.Secondary,
    success: ButtonStyle.Success,
    danger: ButtonStyle.Danger,
    link: ButtonStyle.Link,
  };
  b.setStyle(typeof style === 'string' ? (styleMap[style.toLowerCase()] || ButtonStyle.Secondary) : (style || ButtonStyle.Secondary));
  if (opts.disabled) b.setDisabled(true);
  if (opts.url) b.setURL(opts.url);
  return b;
}

function primary(id, label, opts = {}) { return btn(id, label, 'primary', opts); }
function secondary(id, label, opts = {}) { return btn(id, label, 'secondary', opts); }
function successBtn(id, label, opts = {}) { return btn(id, label, 'success', opts); }
function danger(id, label, opts = {}) { return btn(id, label, 'danger', opts); }
function linkBtn(url, label) {
  return new ButtonBuilder().setLabel(label).setStyle(ButtonStyle.Link).setURL(url);
}

function row(...buttons) {
  return new ActionRowBuilder().addComponents(...buttons);
}

function confirmRow(confirmId, cancelId, opts = {}) {
  return row(
    danger(confirmId || 'confirm', `${iconUnicode('STATUS_WARNING')} ${opts.confirmLabel || 'AUTHORIZE'}`),
    secondary(cancelId || 'cancel', `${iconUnicode('BTN_CLOSE')} ${opts.cancelLabel || 'ABORT'}`),
  );
}

function closeRow(id = 'btn:support:close') {
  return row(
    danger(id, `${iconUnicode('BTN_CLOSE')} CLOSE`),
  );
}

function verifyRow() {
  return row(
    successBtn('btn:verify:start', `${iconUnicode('STATUS_SUCCESS')} VERIFY`),
  );
}

function dashRow(url) {
  return row(
    linkBtn(url, `${iconUnicode('BTN_STATUS')} OPEN DASHBOARD`),
  );
}

function navRow(prevId, nextId, page, totalPages) {
  return row(
    secondary(prevId, '◀ PREV', { disabled: page <= 1 }),
    secondary(nextId, 'NEXT ▶', { disabled: page >= totalPages }),
  );
}

function ticketMenuRow() {
  const { ticketCategoryMenu } = require('./selectMenus');
  return ticketCategoryMenu();
}

function statusBtn() {
  return secondary('btn:support:status', `${iconUnicode('BTN_STATUS')} STATUS`);
}

function statsBtn() {
  return secondary('btn:support:stats', `${iconUnicode('BTN_STATS')} STATS`);
}

function dashLink(label = 'VIEW GUIDE', url) {
  return linkBtn(url || 'https://injuries.to', `${iconUnicode('BTN_VIEW_GUIDE')} ${label}`);
}

function refreshBtn(customId) {
  return secondary(customId || 'btn:refresh', `${iconUnicode('BTN_REFRESH')} REFRESH`);
}

function claimBtn(customId) {
  return successBtn(customId, `${iconUnicode('BTN_CLAIM')} CLAIM`);
}

function reopenBtn(customId) {
  return primary(customId, `${iconUnicode('BTN_REOPEN')} REOPEN`);
}

function transcriptBtn(customId) {
  return secondary(customId, `${iconUnicode('BTN_TRANSCRIPT')} TRANSCRIPT`);
}

function unbanBtn(customId) {
  return successBtn(customId, `${iconUnicode('BTN_UNBAN')} UNBAN`);
}

function viewUserBtn(customId) {
  return secondary(customId, `${iconUnicode('BTN_VIEW_USER')} VIEW USER`);
}

function appealBtn(customId, url) {
  return new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(`${iconUnicode('BTN_APPEAL')} APPEAL`)
    .setStyle(ButtonStyle.Primary);
}

function openTicketBtn(customId) {
  return primary(customId, `${iconUnicode('BTN_TICKET_OPEN')} OPEN TICKET`);
}

module.exports = {
  btn, primary, secondary, successBtn, danger, linkBtn,
  row, confirmRow, closeRow, verifyRow, dashRow, navRow,
  ticketMenuRow, statusBtn, statsBtn, dashLink,
  refreshBtn, claimBtn, reopenBtn, transcriptBtn,
  unbanBtn, viewUserBtn, appealBtn, openTicketBtn,
  icon, iconUnicode,
};
