'use strict';

const { hasAnyStaffRole } = require('../config/roles');
const ui = require('../utils/ui');
const logger = require('../utils/logger');

// ─── DECORATIVE GIFS (top & bottom of every thread) ──────────────────────────
const TOP_GIF    = 'https://cdn.discordapp.com/attachments/1506434367491276812/1509399153321443388/image0_1.gif';
const BOTTOM_GIF = 'https://cdn.discordapp.com/attachments/1506434367491276812/1509394265141415936/1773637630733-5bee7763-8a95-48c0-8857-b9f2196e8d11.gif';

// ─── HARDCODED THREAD DEFINITIONS ─────────────────────────────────────────────
// Order matches the original channel thread list.
const THREADS = [
  // ── 1 ─────────────────────────────────────────────────────────────────────
  {
    name: 'ᴛɪᴋᴛᴏᴋ ʟɪᴠᴇ ʀᴇᴘʟᴀʏꜱ',
    messages: [
      TOP_GIF,
      `:InsanityPoint: **ᴘʟꜱ ᴅᴏɴᴀᴛᴇ:**
https://streamable.com/oo4auk

https://cdn.discordapp.com/attachments/1318617752474488893/1321545002899345428/vipAmandavip_vipamandavip_is_LIVE_-_TikTok_LIVE_2024-12-04_20-43-03_1.mp4

https://cdn.discordapp.com/attachments/1331244342899114056/1336963056462462987/ypqzp9zt_2.mp4

:InsanityPoint: **ᴀᴅᴏᴘᴛ ᴍᴇ:**
https://cdn.discordapp.com/attachments/1331008387831562270/1333082064034992229/lv_0_20250120003043.mp4
https://cdn.discordapp.com/attachments/1329545445520965642/1357751105676644484/JSPUF.mp4
https://cdn.discordapp.com/attachments/1329804728061661196/1334028238200111145/Rich_Livvy_sunnyy_adoptme_is_LIVE_-_TikTok_LIVE_2024-10-20_00-21-39.mp4

:InsanityPoint: **ᴍᴍ2:**
https://streamable.com/fjqo1x
https://cdn.discordapp.com/attachments/1329804728061661196/1334028231644286987/preppyxhanna_preppyxhannas_is_LIVE_-_TikTok_LIVE_2024-10-06_20-42-48.mp4

:InsanityPoint: **ʙʟᴏxꜰʀᴜɪᴛꜱ:**
https://streamable.com/godall

:InsanityPoint: **ɢᴀɢ:**
https://cdn.discordapp.com/attachments/1363585727979589823/1381334942885347398/op_asf_edited_replay_1.mp4`,
      BOTTOM_GIF,
    ],
  },

  // ── 2 ─────────────────────────────────────────────────────────────────────
  {
    name: 'ᴛɪᴋᴛᴏᴋ ʟɪᴠᴇ',
    messages: [
      TOP_GIF,
      `**─── TIKTOK LIVE ───**

**HOW IT WORKS:**
• YOU GO LIVE ON TIKTOK USING A FAKE ROBLOX GIVEAWAY VIDEO, AND TRY TO GET AS MANY VIEWERS AS POSSIBLE. YOU WILL HAVE A FAKE LINK IN YOUR TIKTOK BIO SO YOU GET ACCOUNTS

**REQUIREMENTS:**
• FOR PC LIVE YOU NEED TIKTOK ACCOUNT WITH LIVE STUDIO ACCESS
• FOR MOBILE LIVE YOU NEED TIKTOK ACCOUNT WITH MOBILE GAMING LIVE ACCESS
• ALSO THIS METHOD NEEDS SOME BRAIN, CAN'T BE A RETARD.

**HOW TO GET TIKTOK LIVE ACC:**
• GO TO ROBLOX CROSSTRADING SERVER AND TRADE FOR ONE.
• USE THIS FOLLOWER BOTTING SERVICE, TO BOT 1K FOLLOWERS ONLY FOR 2$: https://usurmin.net/
• OR USE THIS METHOD TO EASILY GET 1K FOLLOWERS IN 3 DAYS OR LESS: https://pastebin.com/jTcFollow-method

**CHOOSING LINK:**
• GO TO INSANITY SITES AND THEN PICK ONE OF THE TIKTOK LINKS
• ALWAYS REMEMBER TO TEST THE LINK BEFORE GOING LIVE
• IF LINK IS FLAGGED THEN TRY REMOVING THE WWW. OR HTTPS: FROM THE LINK
• USING BEACONAI? YOU CAN MAKE A BEACONAI BIOLINK TO MAKE IT LOOK MORE REALISTIC
• IF YOU CANT ADD LINK TO TIKTOK BIO THEN MAKE YOUR TIKTOK ACCOUNT INTO A BUSINESS ACCOUNT SO YOU CAN ADD BUSINESS LINK`,
      `**HOW TO GO LIVE / LOOP VIDEO:**
• ON PC YOU HAVE TO DOWNLOAD LIVE STUDIO AND THEN SET IT UP — JUST PICK A GOOD VIDEO AND GO LIVE
• ON MOBILE YOU HAVE TO LOOP THE VIDEO FROM GALLERY SETTINGS (AUTRAIT ON ANDROID)

**MUST REMEMBER THIS:**
• WHEN YOU GO LIVE ALWAYS REMEMBER TO MUTE YOUR MIC (CHECK TUTORIAL ON YT)
• PUT NOTIFICATIONS OFF
• REMEMBER TO BLACKLIST BAD WORDS

**PICKING GAME CATEGORY AND TITLE:**
• ON MOBILE YOUR LIVE GAME CATEGORY MUST BE SUBWAY SURFERS OR CLASH ROYALE. ON PC IT CAN BE ROBLOX
• TITLE CAN BE PRETTY MUCH ANYTHING BUT BE CAREFUL WITH WORDS LIKE "FREE" AND "GIVEAWAY" SINCE TIKTOK DOESNT ALWAYS LIKE THEM

**HOW LONG TO BE LIVE FOR:**
• NEVER BE LIVE FOR A LOT OF HOURS UNLESS YOUR LIVE IS STABLE (100+ VIEWERS FOR HOURS)
• WHEN YOU START LIVE YOU SHOULD DO IT ONLY FOR 20 MINS AND THEN CHECK WHETHER TO END OR NOT

**WHEN TO END / WHEN NOT TO:**
• IF AFTER 20 MINS YOUR VIEWERS ARE BELOW 10 → END YOUR LIVE
• IF THEYRE ABOVE 10 → SMALL CHANCE OF GOING VIRAL
• ABOVE 20 VIEWERS = GOOD CHANCE TO GO VIRAL
• ABOVE 40 VIEWERS = VERY GOOD, KEEP IT UP UNTIL THEY START DROPPING!!

**PUMPING METHOD:**
• BASICALLY JUST GO LIVE UNTIL VIEWERS GROW, AND WHEN THEY DROP BY A BIT JUST END THE LIVE IMMEDIATELY > THEN START LIVE AGAIN ALMOST IMMEDIATELY. REPEAT UNTIL YOU HAVE STABLE ASF LIVE WITH HUNDREDS OF VIEWERS!!

**TUTORIAL VIDS:**
https://www.youtube.com/watch?v=Bx2HnyfuTuI
https://www.youtube.com/watch?v=RGazJMbYpRqI`,
      BOTTOM_GIF,
    ],
  },

  // ── 3 ─────────────────────────────────────────────────────────────────────
  {
    name: 'ʙᴜʏɪɴɢ ꜱᴇʟʟɪɴɢ',
    messages: [
      TOP_GIF,
      `**─── BUYING/SELLING MTH ───**

You need to have a PC — it won't work on mobile because it doesn't let you hide the browser domain. The method:

→ Go into Discord Roblox Selling Servers and find an account you want
→ Act like you're going to buy it and ask if you can log in to check it
→ Tell them you'll do it on stream if they won't let you

**Hiding the Domain:**
⚠️ The top will say: apy./ — we don't want this!
→ Go to the address bar and type: \`roblox.com/login\`
→ Don't hit enter, just leave it there
→ Now proceed to log in

**If they have a PIN:**
→ Ask them for the PIN
→ Tell them: "I can't do anything bad because you have 2FA"
→ When they give it, the system automatically cracks it

**What to say:**
"Umm, is there any way I can login to the account on screenshare? I won't go in-game, just stay on homescreen. Once I'm in, give me 20s to send the money"

**Spam DMs with:**
"#1 if kortlos or heartless accounts willing to go first after I log in to see that it has email verified 2 step and all of the items. Also looking for mid accounts with 5k+ robux"

**Payments in:** Crypto, Cashapp, Paypal, ApplePay, Giftcards

**Servers to hit in:**
• https://discord.gg/Jq2YTzWtKA
• https://discord.gg/DN92bfYThS`,
      BOTTOM_GIF,
    ],
  },

  // ── 4 ─────────────────────────────────────────────────────────────────────
  {
    name: 'ᴅᴜᴀʟʜᴏᴏᴋ',
    messages: [
      TOP_GIF,
      `**─── DUALHOOK MTH ───**

**STEP 1:** CREATE A SERVER & THE DUALHOOK LINK IN THE WEBSITE WHERE YOU ARE TEACHING MEMBERS HOW TO GET HITS AT THE SAME TIME. YOU'LL BE STEALING THEIR HITS

**STEP 2:** HEAD OVER TO https://discord.com/template/CpjfG6AdH6ZvR
Doesn't have to be exactly like that but it does have to have the server aspects.

**STEP 3:** ONCE YOU'RE FINISHED WITH YOUR WHOLE SERVER, TRY TO PARTNER WITH AS MANY SERVERS AS YOU CAN, INVITE YOUR FRIENDS, AND EVEN STEAL MEMBERS OUT OF DIFFERENT SERVERS SECRETLY

**STEP 4:** KEEP YOUR SERVER ACTIVE — ADD MODS, ADMINS, AND MAYBE EVEN A CO-OWNER!!

**TUTORIAL:**
https://streamable.com/u89b0u`,
      BOTTOM_GIF,
    ],
  },

  // ── 5 ─────────────────────────────────────────────────────────────────────
  {
    name: 'ᴛɪᴋᴛᴏᴋ ɴᴏᴛ ʟɪᴠᴇ',
    messages: [
      TOP_GIF,
      `**─── TIKTOK (NOT LIVE) METH ───**

CREATE A TIKTOK ACCOUNT RELATED TO THE GAME YOU WANT

CHANGE YOUR ACCOUNT INTO A BUSINESS ACC SO YOU CAN PUT LINKS ON YOUR BIO

ENJOY, NO NEED TO LIVESTREAM`,
      BOTTOM_GIF,
    ],
  },

  // ── 6 ─────────────────────────────────────────────────────────────────────
  {
    name: 'ʀᴏʟɪᴍᴏɴꜱ ᴍᴇᴛʜᴏᴅ',
    messages: [
      TOP_GIF,
      `**HOW TO GET A LIMITED ROBLOX? THIS IS MY OLD METHOD**

Install this on your browser: https://chromewebstore.google.com/detail/ropro-enhance-your-roblox/adbacgifemdbhdkfppmeilbgppmhaobf

Visit this link: https://www.rolimons.com/trades and find the people you want to trade with.

Go to the Roblox profiles of the people you want to trade with and find their Discord. You can add them and create a message like "trading with SSHF, Valk, or anything else."`,
      BOTTOM_GIF,
    ],
  },

  // ── 7 ─────────────────────────────────────────────────────────────────────
  {
    name: 'ᴛɪᴋᴛᴏᴋ ʀᴇᴘʟʏ ᴄᴏᴍᴍᴇɴᴛꜱ ᴍᴇᴛʜᴏᴅ',
    messages: [
      TOP_GIF,
      `**─────────────────────────────────**
**Reply to TT Comments Method**
**─────────────────────────────────**

**Step 1:** Create a link — if you don't know how, check the tutorials

**Step 2:** Add the link to your TikTok bio

**Step 3:** Reply to comments with:
> IF YOU SEE THIS YOU CAN GET FREE PERM/GAME PASSES WITH THE LINK IN MY TIKTOK BIO

**─────────────────────────────────**

**Alternative Link Hiders:**
• https://linktr.ee/5l2f6
• https://linktr.ee/

**─────────────────────────────────**

**Notes:**
In some countries you can't create links — try using a VPN

**─────────────────────────────────**

**Create TikTok account with temp mail:**
https://temp-mail.org/uk`,
      BOTTOM_GIF,
    ],
  },

  // ── 8 ─────────────────────────────────────────────────────────────────────
  {
    name: 'ʙꜱꜱ ᴍᴇᴛʜᴏᴅ',
    messages: [
      TOP_GIF,
      `**─────────────────────────────────**
**BSS VERY OP METHOD (TWO ACCOUNTS WITH 18-20 HIVES PER DAY)**

1. Go to https://bssrvalues.com/

2. Look for rich people, give them a good overpay and tell them to add you on Discord

3. Once on Discord, say: "Just join my private server to trade" — then send the fake link

4. Get their account and stuff

**─────────────────────────────────**

**BSS TRADING SERVERS:**
https://discord.gg/sWNqqfr4B
https://discord.gg/invite/bss
https://discord.gg/invite/bsstrades-121317377536094908
https://discord.gg/servers/bee-swarm-simulator-trading-server-117903251844462090
https://discord.gg/invite/bee-swarm-simulator-values-119613386082457846
https://discord.gg/invite/sARUqUbuyi
https://discord.gg/bss-helping-609858765141835786

**─────────────────────────────────**

Easy hits — don't sleep on this!`,
      BOTTOM_GIF,
    ],
  },

  // ── 9 ─────────────────────────────────────────────────────────────────────
  {
    name: 'ᴅᴀʜᴏᴅ ᴍᴇᴛʜᴏᴅ',
    messages: [
      TOP_GIF,
      `**─────────────────────────────────**
**DAHOD OP METHOD (2 korblox per day)**

1. Find very rich people on server (with funny or dumb skin)

2. For example, he has Heaven Knife skin — say: "Did you get Heaven Knife?"

3. Victim says: "Yes I do"

4. Say: "My friend can give you a sword that is twice as expensive"

5. He agrees — tell him he needs to add your friend on Discord

6. He adds you on Discord — start a normal dialogue about the trade

7. Then send a fake link and get very expensive items + the account

**─────────────────────────────────**

Easy Korblox — just play it cool!`,
      BOTTOM_GIF,
    ],
  },

  // ── 10 ────────────────────────────────────────────────────────────────────
  {
    name: 'qʀ ᴄᴏᴅᴇ ᴍᴇᴛʜᴏᴅ',
    messages: [
      TOP_GIF,
      `**QR CODE SCAM METHOD**

First, you need to create the QR code. Go to Roblox, take a screenshot of an actual QR code (find where it is located in the settings).

Then, visit the website **qr.io** and insert your bait link (the link to your fake Roblox profile) there.

Using Photopea, replace the original Roblox QR code with your bait QR code on the screenshot, and you're all set.

**Tutorial:** https://www.youtube.com/watch?v=mhVWkLu4QHo
**Photopea:** https://www.photopea.com/
**Screenshot Tool:** https://app.prntscr.com/en/index.html`,
      BOTTOM_GIF,
    ],
  },

  // ── 11 ────────────────────────────────────────────────────────────────────
  {
    name: 'ᴍᴀɴɪᴘᴜʟᴀᴛɪᴏɴ ᴍᴇᴛʜᴏᴅ',
    messages: [
      TOP_GIF,
      `**Simple but very effective method:**

**How it works:**
→ Once you've hit someone using other methods
→ Tell them you will give their account back
→ Keep your personal hitter
→ When they beam an account, tell them the victim didn't login
→ They'll hit even more accounts
→ Continue this cycle and collect all the accounts

**Key:** Make them think their hitting isn't working so they try harder!`,
      BOTTOM_GIF,
    ],
  },

  // ── 12 ────────────────────────────────────────────────────────────────────
  {
    name: 'ʙᴜʏɪɴɢ ᴀɴᴅ ꜱᴇʟʟɪɴɢ ᴍᴇᴛʜᴏᴅ',
    messages: [
      TOP_GIF,
      `**Requirements:**
• PC (won't work on mobile — can't hide domain)

**Method:**
→ Go to Discord Roblox selling servers
→ Find an account you want to hit
→ Act like you're going to buy and ask to login to check it
→ Say: I'll do it on stream if you don't let me
→ They'll usually allow it

**Hiding the Domain:**
⚠️ The top will say: Roblox.ml — we don't want this!
→ Click on the address bar
→ Type: roblox.com/login
→ Don't hit enter, just leave it there
→ Now proceed to login

**If they have PIN:**
→ Ask them for the PIN
→ Tell them: I can't do anything bad because you have 2FA
→ When they give it, the system automatically cracks it
→ It will change the PIN to your entered PIN

**What to say:**
"Umm, is there any way I can login to the account on screenshare? I won't go in-game, just stay on homescreen. Once I'm in, give me 20s to send the money"

**Servers to hit in:**
• https://discord.gg/Jq2YTzWtKA
• https://discord.gg/DN92bfYThS`,
      BOTTOM_GIF,
    ],
  },

  // ── 13 ────────────────────────────────────────────────────────────────────
  {
    name: 'ʀᴀɴᴅᴏᴍ ᴍᴇᴛʜᴏᴅ',
    messages: [
      TOP_GIF,
      `https://pastebin.com/raw/kJVTvig0
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
https://pastebin.com/MKjLjJQLT`,
      BOTTOM_GIF,
    ],
  },
];
// ─────────────────────────────────────────────────────────────────────────────

async function execute(message, args) {
  if (!hasAnyStaffRole(message.member)) {
    return message.reply({ embeds: [ui.noPerm(message.client, 'Staff')] });
  }

  // !embed            → current channel
  // !embed #channel   → mentioned channel
  // !embed 123456789  → channel by ID
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
    content: `⏳ Creating **${THREADS.length}** threads in ${targetChannel}... please wait.`,
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

      for (const msgContent of def.messages) {
        // Respect Discord's 2000-char limit — chunk if somehow over
        for (let i = 0; i < msgContent.length; i += 1990) {
          await thread.send({ content: msgContent.slice(i, i + 1990) }).catch(() => {});
        }
        await new Promise(r => setTimeout(r, 600));
      }

      created++;
    } catch (err) {
      logger.error(`embed: error creating thread "${def.name}": ${err.message}`);
      failed++;
    }

    await new Promise(r => setTimeout(r, 1000));
  }

  await statusMsg.edit({
    content:
      `✅ Done! Created **${created}** thread${created !== 1 ? 's' : ''} in ${targetChannel}` +
      (failed > 0 ? `, **${failed}** failed — check bot permissions.` : '.'),
  });
}

module.exports = { name: 'embed', execute };
