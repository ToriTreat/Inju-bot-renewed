'use strict';

const { hasRole, ROLES } = require('../config/roles');
const ui     = require('../utils/ui');
const logger = require('../utils/logger');
const { icon } = require('../utils/iconMap');

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const TOP_GIF    = 'https://cdn.discordapp.com/attachments/1506434367491276812/1509399153321443388/image0_1.gif';
const BOTTOM_GIF = 'https://cdn.discordapp.com/attachments/1506434367491276812/1509394265141415936/1773637630733-5bee7763-8a95-48c0-8857-b9f2196e8d11.gif';
const COLOR      = 0x2B2D31;   // dark embed colour — blends with Discord dark mode

// ─── MESSAGE TYPE HELPERS ─────────────────────────────────────────────────────
// gif(url)      → embed with just an image (top/bottom gif banners)
// box(text)     → rich embed with description text
// hdr(text)     → plain-text message (section header + optional streamable URL)
// vid(url)      → single video/file URL — sent as its own message with a longer wait
const gif = url  => ({ t: 'gif', url });
const box = body => ({ t: 'embed', body });
const hdr = body => ({ t: 'text',  body });
const vid = url  => ({ t: 'video', url });

// ─── THREAD DEFINITIONS ───────────────────────────────────────────────────────
const THREADS = [

  // 1 ── ᴛɪᴋᴛᴏᴋ ʟɪᴠᴇ ʀᴇᴘʟᴀʏꜱ ──────────────────────────────────────────────
  // Each category header is a separate message; each video is its own message
  // so Discord embeds the preview UNDER its own text, not at the bottom of a wall.
  {
    name: 'ᴛɪᴋᴛᴏᴋ ʟɪᴠᴇ ʀᴇᴘʟᴀʏꜱ',
    msgs: [
      gif(TOP_GIF),
      hdr(':InsanityPoint: **ᴘʟꜱ ᴅᴏɴᴀᴛᴇ:**\nhttps://streamable.com/oo4auk'),
      vid('https://cdn.discordapp.com/attachments/1318617752474488893/1321545002899345428/vipAmandavip_vipamandavip_is_LIVE_-_TikTok_LIVE_2024-12-04_20-43-03_1.mp4'),
      vid('https://cdn.discordapp.com/attachments/1331244342899114056/1336963056462462987/ypqzp9zt_2.mp4'),
      hdr(':InsanityPoint: **ᴀᴅᴏᴘᴛ ᴍᴇ:**'),
      vid('https://cdn.discordapp.com/attachments/1331008387831562270/1333082064034992229/lv_0_20250120003043.mp4'),
      vid('https://cdn.discordapp.com/attachments/1329545445520965642/1357751105676644484/JSPUF.mp4'),
      vid('https://cdn.discordapp.com/attachments/1329804728061661196/1334028238200111145/Rich_Livvy_sunnyy_adoptme_is_LIVE_-_TikTok_LIVE_2024-10-20_00-21-39.mp4'),
      hdr(':InsanityPoint: **ᴍᴍ2:**\nhttps://streamable.com/fjqo1x'),
      vid('https://cdn.discordapp.com/attachments/1329804728061661196/1334028231644286987/preppyxhanna_preppyxhannas_is_LIVE_-_TikTok_LIVE_2024-10-06_20-42-48.mp4'),
      hdr(':InsanityPoint: **ʙʟᴏxꜰʀᴜɪᴛꜱ:**\nhttps://streamable.com/godall'),
      hdr(':InsanityPoint: **ɢᴀɢ:**'),
      vid('https://cdn.discordapp.com/attachments/1363585727979589823/1381334942885347398/op_asf_edited_replay_1.mp4'),
      gif(BOTTOM_GIF),
    ],
  },

  // 2 ── ᴛɪᴋᴛᴏᴋ ʟɪᴠᴇ ────────────────────────────────────────────────────────
  {
    name: 'ᴛɪᴋᴛᴏᴋ ʟɪᴠᴇ',
    msgs: [
      gif(TOP_GIF),
      box(`**─── TIKTOK LIVE ───**

**HOW IT WORKS:**
• YOU GO LIVE ON TIKTOK USING A FAKE ROBLOX GIVEAWAY VIDEO AND TRY TO GET AS MANY VIEWERS AS POSSIBLE. YOU WILL HAVE A FAKE LINK IN YOUR TIKTOK BIO SO YOU GET ACCOUNTS

**REQUIREMENTS:**
• FOR PC LIVE YOU NEED TIKTOK ACCOUNT WITH LIVE STUDIO ACCESS
• FOR MOBILE LIVE YOU NEED TIKTOK ACCOUNT WITH MOBILE GAMING LIVE ACCESS
• ALSO THIS METHOD NEEDS SOME BRAIN, CAN'T BE A RETARD.

**HOW TO GET TIKTOK LIVE ACC:**
• GO TO ROBLOX CROSSTRADING SERVER AND TRADE FOR ONE
• USE THIS FOLLOWER BOTTING SERVICE — BOT 1K FOLLOWERS FOR 2$: https://usurmin.net/
• OR USE THIS METHOD TO GET 1K FOLLOWERS IN 3 DAYS: https://pastebin.com/jTcFollow-method

**CHOOSING LINK:**
• GO TO INSANITY SITES AND PICK ONE OF THE TIKTOK LINKS
• ALWAYS TEST THE LINK BEFORE GOING LIVE
• IF LINK IS FLAGGED, TRY REMOVING THE WWW. OR HTTPS: FROM THE LINK
• USING BEACONAI? MAKE A BEACONAI BIOLINK TO LOOK MORE REALISTIC — TAKE INSPIRATION AND ADD IT TO YOUR TIKTOK BIO
• IF YOU CAN'T ADD LINK TO BIO, CONVERT YOUR ACCOUNT TO A BUSINESS ACCOUNT`),
      box(`**HOW TO GO LIVE / LOOP VIDEO:**
• ON PC: DOWNLOAD LIVE STUDIO, SET IT UP, PICK A GOOD VIDEO AND GO LIVE
• ON MOBILE: LOOP THE VIDEO FROM GALLERY SETTINGS (AUTRAIT ON ANDROID)

**MUST REMEMBER:**
• ALWAYS MUTE YOUR MIC WHEN GOING LIVE (FIND A YT TUTORIAL)
• PUT NOTIFICATIONS OFF
• BLACKLIST BAD WORDS

**PICKING GAME CATEGORY & TITLE:**
• ON MOBILE: GAME CATEGORY MUST BE SUBWAY SURFERS OR CLASH ROYALE. ON PC IT CAN BE ROBLOX
• TITLE CAN BE ANYTHING — BE CAREFUL WITH WORDS LIKE "FREE" AND "GIVEAWAY"

**HOW LONG TO BE LIVE:**
• DON'T BE LIVE FOR HOURS UNLESS STABLE (100+ VIEWERS)
• START WITH ONLY 20 MINS, THEN DECIDE TO END OR KEEP GOING

**WHEN TO END / KEEP GOING:**
• BELOW 10 VIEWERS AFTER 20 MINS → END
• ABOVE 10 → SMALL CHANCE GOING VIRAL
• ABOVE 20 → GOOD CHANCE GOING VIRAL
• ABOVE 40 → VERY GOOD — KEEP IT UP UNTIL THEY START DROPPING!!

**PUMPING METHOD:**
• GO LIVE UNTIL VIEWERS GROW. WHEN THEY DROP A BIT, END IMMEDIATELY → START AGAIN. REPEAT UNTIL YOU HAVE STABLE ASF LIVE WITH HUNDREDS OF VIEWERS!!

**TUTORIAL VIDS:**
https://www.youtube.com/watch?v=Bx2HnyfuTuI
https://www.youtube.com/watch?v=RGazJMbYpRqI`),
      gif(BOTTOM_GIF),
    ],
  },

  // 3 ── ʙᴜʏɪɴɢ ꜱᴇʟʟɪɴɢ ───────────────────────────────────────────────────
  {
    name: 'ʙᴜʏɪɴɢ ꜱᴇʟʟɪɴɢ',
    msgs: [
      gif(TOP_GIF),
      box(`**─── BUYING/SELLING MTH ───**

You need a PC — it won't work on mobile because it doesn't let you hide the browser domain.

→ Go into Discord Roblox Selling Servers and find an account you want
→ Act like you're going to buy it and ask to log in to check it
→ If they won't let you: tell them you'll do it on stream

**Hiding the Domain:**
⚠️ The top will say \`apy./\` — we don't want that!
→ Click the address bar and type: \`roblox.com/login\`
→ Do NOT hit enter — just leave it there
→ Now proceed to log in

**If they have a PIN:**
→ Ask them for the PIN
→ Say: "I can't do anything bad because you have 2FA"
→ When they give it, the system automatically cracks it

**What to say:**
*"Umm, is there any way I can log in to the account on screenshare? I won't go in-game, just stay on homescreen. Once I'm in, give me 20s to send the money"*

**Spam DMs with:**
*"#1 if kortlos or heartless accounts willing to go first after I log in to see it has email verified 2 step and all items. Also looking for mid accounts with 5k+ robux"*

**Payments:** Crypto, Cashapp, Paypal, ApplePay, Giftcards

**Servers to hit in:**
• https://discord.gg/Jq2YTzWtKA
• https://discord.gg/DN92bfYThS`),
      gif(BOTTOM_GIF),
    ],
  },

  // 4 ── ᴅᴜᴀʟʜᴏᴏᴋ ───────────────────────────────────────────────────────────
  {
    name: 'ᴅᴜᴀʟʜᴏᴏᴋ',
    msgs: [
      gif(TOP_GIF),
      box(`**─── DUALHOOK MTH ───**

**STEP 1:** CREATE A SERVER & THE DUALHOOK LINK IN THE WEBSITE WHERE YOU ARE TEACHING MEMBERS HOW TO GET HITS AT THE SAME TIME — YOU'LL BE STEALING THEIR HITS

**STEP 2:** HEAD OVER TO https://discord.com/template/CpjfG6AdH6ZvR
Doesn't have to be exactly that, but it needs to have the server aspects.

**STEP 3:** ONCE YOUR SERVER IS DONE, PARTNER WITH AS MANY SERVERS AS YOU CAN, INVITE YOUR FRIENDS, AND STEAL MEMBERS FROM DIFFERENT SERVERS SECRETLY

**STEP 4:** KEEP YOUR SERVER ACTIVE — ADD MODS, ADMINS, AND MAYBE EVEN A CO-OWNER!!

**TUTORIAL:**
https://streamable.com/u89b0u`),
      gif(BOTTOM_GIF),
    ],
  },

  // 5 ── ᴛɪᴋᴛᴏᴋ ɴᴏᴛ ʟɪᴠᴇ ──────────────────────────────────────────────────
  {
    name: 'ᴛɪᴋᴛᴏᴋ ɴᴏᴛ ʟɪᴠᴇ',
    msgs: [
      gif(TOP_GIF),
      box(`**─── TIKTOK (NOT LIVE) METH ───**

**CREATE** a TikTok account related to the game you want

**CHANGE** your account into a Business account so you can put links in your bio

**ENJOY** — no need to livestream`),
      gif(BOTTOM_GIF),
    ],
  },

  // 6 ── ʀᴏʟɪᴍᴏɴꜱ ᴍᴇᴛʜᴏᴅ ────────────────────────────────────────────────
  {
    name: 'ʀᴏʟɪᴍᴏɴꜱ ᴍᴇᴛʜᴏᴅ',
    msgs: [
      gif(TOP_GIF),
      box(`**HOW TO GET A LIMITED ROBLOX — OLD METHOD**

**Step 1:** Install this browser extension:
https://chromewebstore.google.com/detail/ropro-enhance-your-roblox/adbacgifemdbhdkfppmeilbgppmhaobf

**Step 2:** Visit https://www.rolimons.com/trades and find people you want to trade with

**Step 3:** Go to their Roblox profile, find their Discord, add them and send a message like:
*"trading with SSHF, Valk, or anything else"*`),
      gif(BOTTOM_GIF),
    ],
  },

  // 7 ── ᴛɪᴋᴛᴏᴋ ʀᴇᴘʟʏ ᴄᴏᴍᴍᴇɴᴛꜱ ᴍᴇᴛʜᴏᴅ ────────────────────────────────
  {
    name: 'ᴛɪᴋᴛᴏᴋ ʀᴇᴘʟʏ ᴄᴏᴍᴍᴇɴᴛꜱ ᴍᴇᴛʜᴏᴅ',
    msgs: [
      gif(TOP_GIF),
      box(`**─── REPLY TO TT COMMENTS METHOD ───**

**Step 1:** Create a link — if you don't know how, check the tutorials

**Step 2:** Add the link to your TikTok bio

**Step 3:** Reply to comments with:
> IF YOU SEE THIS YOU CAN GET FREE PERM/GAME PASSES WITH THE LINK IN MY TIKTOK BIO

**Alternative Link Hiders:**
• https://linktr.ee/5l2f6
• https://linktr.ee/

**Notes:**
In some countries you can't create links — try using a VPN

**Create TikTok account with temp mail:**
https://temp-mail.org/uk`),
      gif(BOTTOM_GIF),
    ],
  },

  // 8 ── ʙꜱꜱ ᴍᴇᴛʜᴏᴅ ──────────────────────────────────────────────────────
  {
    name: 'ʙꜱꜱ ᴍᴇᴛʜᴏᴅ',
    msgs: [
      gif(TOP_GIF),
      box(`**─── BSS VERY OP METHOD ───**
*(Two accounts with 18–20 hives per day)*

**1.** Go to https://bssrvalues.com/

**2.** Find rich people, give them a good overpay and tell them to add you on Discord

**3.** Once on Discord, say: *"Just join my private server to trade"* — then send the fake link

**4.** Get their account and stuff

**BSS TRADING SERVERS:**
https://discord.gg/sWNqqfr4B
https://discord.gg/invite/bss
https://discord.gg/invite/bsstrades-121317377536094908
https://discord.gg/servers/bee-swarm-simulator-trading-server-117903251844462090
https://discord.gg/invite/bee-swarm-simulator-values-119613386082457846
https://discord.gg/invite/sARUqUbuyi
https://discord.gg/bss-helping-609858765141835786

Easy hits — don't sleep on this!`),
      gif(BOTTOM_GIF),
    ],
  },

  // 9 ── ᴅᴀʜᴏᴅ ᴍᴇᴛʜᴏᴅ ─────────────────────────────────────────────────────
  {
    name: 'ᴅᴀʜᴏᴅ ᴍᴇᴛʜᴏᴅ',
    msgs: [
      gif(TOP_GIF),
      box(`**─── DAHOD OP METHOD ───**
*(2 korblox per day)*

**1.** Find very rich people on the server (funny or dumb skin)

**2.** He has Heaven Knife skin — say: *"Did you get Heaven Knife?"*

**3.** Victim says: *"Yes I do"*

**4.** Say: *"My friend can give you a sword that is twice as expensive"*

**5.** He agrees — tell him he needs to add your friend on Discord

**6.** He adds you on Discord — start a normal dialogue about the trade

**7.** Send a fake link and get very expensive items + the account

Easy Korblox — just play it cool!`),
      gif(BOTTOM_GIF),
    ],
  },

  // 10 ── qʀ ᴄᴏᴅᴇ ᴍᴇᴛʜᴏᴅ ──────────────────────────────────────────────────
  {
    name: 'qʀ ᴄᴏᴅᴇ ᴍᴇᴛʜᴏᴅ',
    msgs: [
      gif(TOP_GIF),
      box(`**─── QR CODE SCAM METHOD ───**

**Step 1:** Go to Roblox and take a screenshot of an actual QR code (find it in the settings)

**Step 2:** Visit **qr.io** and insert your bait link (link to your fake Roblox profile)

**Step 3:** Using Photopea, replace the original QR code with your bait QR code on the screenshot — done!

**Tutorial:** https://www.youtube.com/watch?v=mhVWkLu4QHo
**Photopea:** https://www.photopea.com/
**Screenshot Tool:** https://app.prntscr.com/en/index.html`),
      gif(BOTTOM_GIF),
    ],
  },

  // 11 ── ᴍᴀɴɪᴘᴜʟᴀᴛɪᴏɴ ᴍᴇᴛʜᴏᴅ  (no gifs — text only thread) ──────────────
  {
    name: 'ᴍᴀɴɪᴘᴜʟᴀᴛɪᴏɴ ᴍᴇᴛʜᴏᴅ',
    msgs: [
      box(`**Simple but very effective method:**

**How it works:**
→ Once you've hit someone using other methods, tell them you will give their account back
→ Keep your personal hitter
→ When they beam an account, tell them the victim didn't login
→ They'll hit even more accounts trying to prove themselves
→ Continue this cycle and collect all the accounts

**Key:** Make them think their hitting isn't working so they try harder!`),
    ],
  },

  // 12 ── ʙᴜʏɪɴɢ ᴀɴᴅ ꜱᴇʟʟɪɴɢ ᴍᴇᴛʜᴏᴅ  (no gifs — text only thread) ────────
  {
    name: 'ʙᴜʏɪɴɢ ᴀɴᴅ ꜱᴇʟʟɪɴɢ ᴍᴇᴛʜᴏᴅ',
    msgs: [
      box(`**Requirements:**
• PC (won't work on mobile — can't hide domain)

**Method:**
→ Go to Discord Roblox selling servers
→ Find an account you want to hit
→ Act like you're going to buy and ask to login to check it
→ Say: *"I'll do it on stream if you don't let me"*
→ They'll usually allow it

**Hiding the Domain:**
⚠️ The top will say: \`Roblox.ml\` — we don't want this!
→ Click on the address bar
→ Type: \`roblox.com/login\`
→ Don't hit enter, just leave it there
→ Now proceed to login

**If they have a PIN:**
→ Ask them for the PIN
→ Tell them: *"I can't do anything bad because you have 2FA"*
→ When they give it, the system automatically cracks it and changes the PIN

**What to say:**
*"Umm, is there any way I can login to the account on screenshare? I won't go in-game, just stay on homescreen. Once I'm in, give me 20s to send the money"*

**Servers to hit in:**
• https://discord.gg/Jq2YTzWtKA
• https://discord.gg/DN92bfYThS`),
    ],
  },

  // 13 ── ʀᴀɴᴅᴏᴍ ᴍᴇᴛʜᴏᴅ  (plain text — no embed, no gifs) ─────────────────
  {
    name: 'ʀᴀɴᴅᴏᴍ ᴍᴇᴛʜᴏᴅ',
    msgs: [
      hdr(`https://pastebin.com/raw/kJVTvig0
https://pastebin.com/uud4m5KU
https://pastebin.com/Yi9jKTvt
https://pastebin.com/RdnbMsxe
https://pastebin.com/LDpi2uqv
https://pastebin.com/RNwVVZHA
https://pastebin.com/ATV0TwPK
https://pastebin.com/SRKrnn0R
https://pastebin.com/77jVLKrg
https://pastebin.com/cWZEb4sQ
https://pastebin.com/Mv2jbKZA
https://pastebin.com/ddLppdjn
https://pastebin.com/4mZcU16i
https://pastebin.com/ijbp6v09
https://pastebin.com/MKjLjJQLT`),
    ],
  },
];

// ─── SEND HELPER ──────────────────────────────────────────────────────────────
const delay = ms => new Promise(r => setTimeout(r, ms));

async function sendMsg(thread, msg) {
  switch (msg.t) {
    case 'gif':
      // Gif banner — embed with image only (dark bg to blend with Discord)
      await thread.send({ embeds: [{ color: COLOR, image: { url: msg.url } }] });
      await delay(800);
      break;

    case 'embed':
      // Rich embed with description text
      await thread.send({ embeds: [{ color: COLOR, description: msg.body }] });
      await delay(800);
      break;

    case 'text':
      // Plain text message (section header, may include a URL to auto-embed)
      await thread.send({ content: msg.body });
      await delay(1000);
      break;

    case 'video':
      // Single video/file URL — own message + long wait so Discord renders
      // it before the next message arrives (prevents videos stacking at bottom)
      await thread.send({ content: msg.url });
      await delay(3500);
      break;
  }
}

// ─── COMMAND ─────────────────────────────────────────────────────────────────
async function execute(message, args) {
  if (!hasRole(message.member, ROLES.FOUNDER)) {
    return message.reply({ embeds: [ui.noPerm(message.client, 'Founder')] });
  }

  // Resolve target channel: !embed / !embed #channel / !embed <id>
  let targetChannel = message.mentions.channels.first() ?? null;

  if (!targetChannel && args[0]) {
    const rawId = args[0].replace(/[<#>]/g, '');
    if (/^\d{17,20}$/.test(rawId)) {
      targetChannel =
        message.client.channels.cache.get(rawId) ??
        (await message.client.channels.fetch(rawId).catch(() => null));
    }
  }

  if (!targetChannel) targetChannel = message.channel;

  if (!targetChannel.isTextBased()) {
    return message.reply({
      embeds: [ui.error(message.client, 'Invalid Channel', 'That must be a text channel.')],
    });
  }

  const statusMsg = await message.reply({
    content: `${icon('STATUS_LOADING')} Creating **${THREADS.length}** threads in ${targetChannel}…`,
  });

  let created = 0;
  let failed  = 0;

  for (const def of THREADS) {
    try {
      const thread = await targetChannel.threads
        .create({
          name: def.name,
          autoArchiveDuration: 10080,
          reason: `!embed by ${message.author.tag}`,
        })
        .catch(() => null);

      if (!thread) { failed++; continue; }

      for (const msg of def.msgs) {
        await sendMsg(thread, msg).catch(err => {
          logger.error(`embed: message failed in "${def.name}": ${err.message}`);
        });
      }

      created++;
    } catch (err) {
      logger.error(`embed: thread create failed "${def.name}": ${err.message}`);
      failed++;
    }

    // Brief gap between threads
    await delay(1200);
  }

  await statusMsg.edit({
    content:
      `${icon('STATUS_SUCCESS')} Done! Created **${created}** thread${created !== 1 ? 's' : ''} in ${targetChannel}` +
      (failed ? `, **${failed}** failed — check bot permissions.` : '.'),
  });
}

module.exports = { name: 'embed', execute };
