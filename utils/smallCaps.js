'use strict';

const SMALL_CAPS = {
  'A': 'ᴀ', 'B': 'ʙ', 'C': 'ᴄ', 'D': 'ᴅ', 'E': 'ᴇ', 'F': 'ꜰ', 'G': 'ɢ',
  'H': 'ʜ', 'I': 'ɪ', 'J': 'ᴊ', 'K': 'ᴋ', 'L': 'ʟ', 'M': 'ᴍ', 'N': 'ɴ',
  'O': 'ᴏ', 'P': 'ᴘ', 'Q': 'ǫ', 'R': 'ʀ', 'S': 'ꜱ', 'T': 'ᴛ', 'U': 'ᴜ',
  'V': 'ᴠ', 'W': 'ᴡ', 'X': 'ᵡ', 'Y': 'ʏ', 'Z': 'ᴢ',
  'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 'g': 'ɢ',
  'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ',
  'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 'ꜱ', 't': 'ᴛ', 'u': 'ᴜ',
  'v': 'ᴠ', 'w': 'ᴡ', 'x': 'ᵡ', 'y': 'ʏ', 'z': 'ᴢ',
};

const PROTECTED = /https?:\/\/[^\s)]+|<[^>]+>/g;

function toSmallCaps(text) {
  if (!text || typeof text !== 'string') return text;

  const tokens = [];
  const cleaned = text.replace(PROTECTED, (m) => {
    tokens.push(m);
    return `\x00${tokens.length - 1}\x00`;
  });

  let result = '';
  for (const ch of cleaned) {
    result += SMALL_CAPS[ch] || ch;
  }

  return result.replace(/\x00(\d+)\x00/g, (_, i) => tokens[+i]);
}

module.exports = { toSmallCaps };
