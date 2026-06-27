'use strict';

const ICON_MAP = Object.freeze({
  STATUS_SUCCESS:   '<a:tickgreen:1511768108543774751>',
  STATUS_ERROR:     '<a:tickred:1512051419019214849>',
  STATUS_WARNING:   '<:warning:1512123376255238206>',
  STATUS_INFO:      '<:info:1512123534841745547>',
  STATUS_LOADING:   '<a:maruloader:1512123812387356854>',

  DOT_GREEN:        '<a:GreenDot:1512123952556933210>',
  DOT_RED:          '<a:RedDot:1512124108534714599>',
  DOT_GRAY:         '<a:GreenDot:1512123952556933210>',

  MEDAL_1:          '<a:OrangeCrown:1511763550505537536>',
  MEDAL_2:          '<a:slatcentralcrown:1511763596223447192>',
  MEDAL_3:          '<a:crown:1511764846474035403>',

  BTN_TICKET_OPEN:  '<:ticket:1512124394229600356>',
  BTN_VIEW_GUIDE:   '<:Books:1512124621879513190>',
  BTN_STATUS:       '<:stats_icon_white:1512125040093691998>',
  BTN_STATS:        '<:stats:1512130788554969179>',
  BTN_CLAIM:        '<:Gift:1512125159572766791>',
  BTN_CLOSE:        '<:Lock:1512125307379781843>',
  BTN_TRANSCRIPT:   '<:better_scroll:1512127154710642818>',
  BTN_REOPEN:       '<:Unlock:1512127379261231194>',
  BTN_REFRESH:      '<:Refresh:1512128096923422770>',
  BTN_UNBAN:        '<:unban_hammer:1512128247914168520>',
  BTN_VIEW_USER:    '<:member:1512128427648356612>',
  BTN_APPEAL:       '<:Scales:1512128672327405690>',
  BTN_ROCKET:       '<a:rocket:1493306783706386532>',

  HDR_CATEGORY:     '<:category:1512128934920065108>',
  HDR_PAGE:         '<:paper:1512129497514774638>',
  HDR_COMMANDS:     '<:supports_commands:1512129670337003673>',
  HDR_TICKET:       '<:ticket:1512124394229600356>',

  CAT_STATS:        '<:stats:1512130788554969179>',
  CAT_SYSTEM:       '<a:spinningsettingslogo:1512131109088133230>',
  CAT_SOCIAL:       '<:Discord:1512131265799786746>',
  CAT_MODERATION:   '<:Moderator:1512131952898085077>',
  CAT_TOOLS:        '<:Tools_Blurple:1512132192250106030>',

  CROWN_RED:        '<a:slatcentralcrown:1511763596223447192>',
  CROWN_GREY:       '<a:crown_grey:1511765299551146034>',
  CROWN_GOLD:       '<a:crown:1511764846474035403>',
  CROWN_PURPLE:     '<a:crown_purple:1513171242054717550>',
  CROWN_FLAME:      '<a:OrangeCrown:1511763550505537536>',

  ICON_HITS:        '<:Users:1513173315433271406>',
  ICON_VISITS:      '<:Users:1513187705708740648>',
  ICON_BALANCE:     '<:robux:1510356862904569936>',
  ICON_RAP:         '<:valk:1513176780393939165>',
  ICON_COOKIE:      '<:minecraft_cookie:1513176166729646211>',
  ICON_CHANNELS:    '<:channel_text:1513818784014532729>',
  ICON_ROLES:       '<:Last_Meadow_Badge:1513819132468924417>',
  ICON_BOOSTS:      '<a:NitroBooster:1513819435335680060>',

  DIAMOND:          '<a:diamondgem:1513171989597126847>',
});

const ICON_URL_MAP = Object.freeze({
  STATUS_SUCCESS:   'https://cdn3.emoji.gg/emojis/9887-green-tick.gif',
  STATUS_ERROR:     'https://cdn3.emoji.gg/emojis/2413-red-tick.gif',
  STATUS_WARNING:   'https://cdn3.emoji.gg/emojis/943832-alertastaff2000.gif',
  STATUS_INFO:      'https://cdn3.emoji.gg/emojis/54269-info.png',
  STATUS_LOADING:   'https://cdn3.emoji.gg/emojis/6594-loading.gif',

  DOT_GREEN:        'https://cdn3.emoji.gg/emojis/29423-greendot.gif',
  DOT_RED:          'https://cdn3.emoji.gg/emojis/89675-reddot.gif',
  DOT_GRAY:         'https://cdn3.emoji.gg/emojis/29423-greendot.gif',

  MEDAL_1:          'https://cdn3.emoji.gg/emojis/29160-crown-yellow.gif',
  MEDAL_2:          'https://cdn3.emoji.gg/emojis/21124-crown-orange.gif',
  MEDAL_3:          'https://cdn3.emoji.gg/emojis/84480-crown-red.gif',

  BTN_TICKET_OPEN:  'https://cdn3.emoji.gg/emojis/437007-ticket.gif',
  BTN_VIEW_GUIDE:   'https://cdn3.emoji.gg/emojis/44562-bluebook.png',
  BTN_STATUS:       'https://cdn3.emoji.gg/emojis/49198-online1.gif',
  BTN_STATS:        'https://cdn3.emoji.gg/emojis/3457-stats.png',
  BTN_CLAIM:        'https://cdn3.emoji.gg/emojis/282966-gift.png',
  BTN_CLOSE:        'https://cdn3.emoji.gg/emojis/414779-lock.png',
  BTN_TRANSCRIPT:   'https://cdn3.emoji.gg/emojis/398041-book.png',
  BTN_REOPEN:       'https://cdn3.emoji.gg/emojis/685116-unlock.png',
  BTN_REFRESH:      'https://cdn3.emoji.gg/emojis/11768-refresh.png',
  BTN_UNBAN:        'https://cdn3.emoji.gg/emojis/7191_unban_hammer.png',
  BTN_VIEW_USER:    'https://cdn3.emoji.gg/emojis/928205-membericon.png',
  BTN_APPEAL:       'https://cdn3.emoji.gg/emojis/5298-scales.png',
  BTN_ROCKET:       'https://cdn3.emoji.gg/emojis/103-rocket.png',

  HDR_CATEGORY:     'https://cdn3.emoji.gg/emojis/895134-category.png',
  HDR_PAGE:         'https://cdn3.emoji.gg/emojis/78639-reading.gif',
  HDR_COMMANDS:     'https://cdn3.emoji.gg/emojis/21730-supports-commands.png',
  HDR_TICKET:       'https://cdn3.emoji.gg/emojis/437007-ticket.gif',

  CAT_STATS:        'https://cdn3.emoji.gg/emojis/3457-stats.png',
  CAT_SYSTEM:       'https://cdn3.emoji.gg/emojis/705556-spinningsettingslogo.gif',
  CAT_SOCIAL:       'https://cdn3.emoji.gg/emojis/888046-discord.png',
  CAT_MODERATION:   'https://cdn3.emoji.gg/emojis/26487-moderator.png',
  CAT_TOOLS:        'https://cdn3.emoji.gg/emojis/3193-tools-blurple.png',

  CROWN_RED:        'https://cdn3.emoji.gg/emojis/84480-crown-red.gif',
  CROWN_GREY:       'https://cdn3.emoji.gg/emojis/84480-crown-red.gif',
  CROWN_GOLD:       'https://cdn3.emoji.gg/emojis/29160-crown-yellow.gif',
  CROWN_PURPLE:     'https://cdn3.emoji.gg/emojis/84480-crown-red.gif',
  CROWN_FLAME:      'https://cdn3.emoji.gg/emojis/21124-crown-orange.gif',

  ICON_HITS:        'https://cdn3.emoji.gg/emojis/44562-bluebook.png',
  ICON_VISITS:      'https://cdn3.emoji.gg/emojis/44562-bluebook.png',
  ICON_BALANCE:     'https://cdn3.emoji.gg/emojis/3457-stats.png',
  ICON_RAP:         'https://cdn3.emoji.gg/emojis/3457-stats.png',
  ICON_COOKIE:      'https://cdn3.emoji.gg/emojis/3457-stats.png',
  ICON_CHANNELS:    'https://cdn3.emoji.gg/emojis/3457-stats.png',
  ICON_ROLES:       'https://cdn3.emoji.gg/emojis/3457-stats.png',
  ICON_BOOSTS:      'https://cdn3.emoji.gg/emojis/3457-stats.png',

  DIAMOND:          'https://cdn3.emoji.gg/emojis/29160-crown-yellow.gif',
});

const ICON_SLOTS = Object.freeze(Object.keys(ICON_MAP));
const ICON_URL_SLOTS = Object.freeze(Object.keys(ICON_URL_MAP));

function icon(slot) {
  if (!slot) return null;
  return Object.prototype.hasOwnProperty.call(ICON_MAP, slot) ? ICON_MAP[slot] : null;
}

function iconUrl(slot) {
  if (!slot) return null;
  return Object.prototype.hasOwnProperty.call(ICON_URL_MAP, slot) ? ICON_URL_MAP[slot] : null;
}

function iconUnicode(slot) {
  if (!slot) return null;
  return Object.prototype.hasOwnProperty.call(ICON_MAP, slot) ? ICON_MAP[slot] : null;
}

function hasIcon(slot) {
  return icon(slot) != null;
}

function listIcons() {
  return ICON_SLOTS.slice();
}

function listIconUrls() {
  return ICON_URL_SLOTS.slice();
}

module.exports = {
  ICON_MAP,
  ICON_SLOTS,
  ICON_URL_MAP,
  ICON_URL_SLOTS,
  icon,
  iconUrl,
  iconUnicode,
  hasIcon,
  listIcons,
  listIconUrls,
};
