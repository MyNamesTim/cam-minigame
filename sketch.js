// Bait Buster: CyberHeros game 3 (recognize and report phishing)
// Raise $600 online to buy the Scam Eradicator 2000 before midnight.
// Real giveaways and sign-ups pay out. Falling for a scam costs you.
// Reporting a scam earns a bounty. Baitlyn is watching.

const WEBSITE_URL = "https://magickansh.github.io/camGames-CyberherosWebsite/";

const C = {
  night: "#140f2e", night2: "#211a4a", night3: "#2e2566",
  cream: "#fff4dc", muted: "#b8afdc",
  violet: "#9b6bff", sun: "#ffcf3d", aqua: "#33e1e8", pink: "#ff4f9a", lime: "#8ee05a",
};
const PIXEL = "Silkscreen";
const BODY = "Chakra Petch";
const MONO = "monospace"; // addresses and links need 1 vs l and 0 vs O to be easy to tell apart

const QUOTA = 600;        // price of the Scam Eradicator 2000
const BOUNTY = 40;        // reward for reporting a scam message
const POPUP_BOUNTY = 20;  // reward for reporting a scam pop-up
const FALSE_REPORT = 10;  // cost of reporting a real message
const GAME_SECONDS = 360; // 6:00 PM to midnight, one game minute per real second
const ARRIVE_EVERY = 14;  // seconds between new messages

// ---------- Messages ----------

const REAL = [
  {
    from: "Riverside Library", addr: "events@riversidelibrary.org", ch: "Email",
    subj: "Book cover design contest",
    body: "Our fall art contest is open! Design a new cover for your favorite book. Winners get a $75 gift card. Entry is free, and the rules are on our website.",
    link: "riversidelibrary.org/contest", url: "https://riversidelibrary.org/contest",
    action: "Enter contest", prize: 75,
    why: "The sender and the link both match the library's real website. It's free to enter and doesn't ask for passwords or payment.",
  },
  {
    from: "Hilltop PTA", addr: "pta@hilltopschool.edu", ch: "Email",
    subj: "Fun Run sponsor sign-up",
    body: "Thanks for joining the Hilltop Fun Run fundraiser! Sign up on the school site and a local business will match what you raise, up to $60.",
    link: "hilltopschool.edu/funrun", url: "https://hilltopschool.edu/funrun",
    action: "Sign up", prize: 60,
    why: "It comes from your school's real address (hilltopschool.edu), and the link goes to the same site. Nobody is asking for money or secrets.",
  },
  {
    from: "Streamly", addr: "news@streamly.com", ch: "Email",
    subj: "Movie night sweepstakes",
    body: "Enter for a chance to win a movie night package worth $80. No purchase necessary. You can also find this sweepstakes in the Streamly app under Rewards.",
    link: "streamly.com/sweepstakes", url: "https://streamly.com/sweepstakes",
    action: "Enter sweepstakes", prize: 80,
    why: "The address and link use the real streamly.com, it's free, and you can confirm it in the app yourself.",
  },
  {
    from: "Maple Town Rec", addr: "rec@mapletown.gov", ch: "Email",
    subj: "Pumpkin carving contest",
    body: "Bring your best pumpkin to the Town Green on Saturday! Prizes up to $50. Register online or at the rec center front desk.",
    link: "mapletown.gov/pumpkins", url: "https://mapletown.gov/pumpkins",
    action: "Register", prize: 50,
    why: "A .gov address with a matching link, a real place you can visit, and a way to sign up in person. No fees, no pressure.",
  },
  {
    from: "Mom", addr: "Saved contact", ch: "Text",
    subj: "Leaf raking job?",
    body: "Mrs. Patel next door says she'll pay you $40 to help rake her leaves Saturday morning. Want me to tell her yes?",
    link: null, url: null,
    action: "Say yes", prize: 40,
    why: "It's from a saved contact you know, about a neighbor you know, and you're being paid instead of asked to pay.",
  },
  {
    from: "BlockBuild Team", addr: "contests@blockbuild.com", ch: "Email",
    subj: "Fall build contest",
    body: "Show us your best haunted castle! Top builds win $70 in store credit. Submit a screenshot from the Contests page inside the game.",
    link: "blockbuild.com/contests", url: "https://blockbuild.com/contests",
    action: "Enter build", prize: 70,
    why: "It's from the real blockbuild.com, and you only submit a screenshot. It never asks for your password.",
  },
  {
    from: "WKID Radio", addr: "contest@wkidradio.com", ch: "Email",
    subj: "Trivia night prize",
    body: "You signed up for Trivia Night alerts. Tonight's prize is $100! Answer three questions on our website to enter.",
    link: "wkidradio.com/trivia", url: "https://wkidradio.com/trivia",
    action: "Play trivia", prize: 100,
    why: "You signed up for these alerts, the link matches the sender, and entering just means answering trivia.",
  },
  {
    from: "Hilltop Science Club", addr: "science@hilltopschool.edu", ch: "Email",
    subj: "Science fair mini-grant",
    body: "Applications for the $90 science fair mini-grant are open. Fill out the one-page form on the club page by Friday. Ask Ms. Ortiz if you have questions.",
    link: "hilltopschool.edu/science", url: "https://hilltopschool.edu/science",
    action: "Apply", prize: 90,
    why: "Same school address as the PTA email, a teacher you can ask in person, and a normal deadline instead of a panic countdown.",
  },
];

const SCAMS = [
  {
    from: "ParcelPaI Delivery", addr: "alerts@parcelpal-delivery-help.co", ch: "Text",
    subj: "Package on hold!!",
    body: "URGENT: Your package is stuck at our warehouse. Pay a $1.99 redelivery fee within 1 hour or it will be returned!",
    link: "parcelpal.com/track", url: "http://parcelpal.track-fee.co/pay",
    action: "Pay fee", loss: 60,
    flags: [
      "The link says parcelpal.com but really goes to track-fee.co.",
      "\"ParcelPaI\" uses a capital I instead of a lowercase l.",
      "A 1-hour deadline is pressure to stop you from thinking.",
    ],
  },
  {
    from: "BlockBuild Support", addr: "blockbuild.support.team@gmail.com", ch: "Email",
    subj: "FREE 10,000 gems!!!",
    body: "You've been chosen for 10,000 free gems! Log in with your username and password below to claim them before they expire.",
    link: "blockbuild.com/free-gems", url: "http://blockbuiid-gems.net/login",
    action: "Log in", loss: 50,
    flags: [
      "Real companies don't email from free gmail addresses.",
      "The link goes to \"blockbuiid\", not blockbuild.",
      "Free stuff that needs your password is a trap.",
    ],
  },
  {
    from: "Prize Department", addr: "winner@mega-prize-claims.biz", ch: "Email",
    subj: "YOU WON $5,000!!",
    body: "Congratulations!! You are our grand prize winner of $5,000! To release your money, just pay a small $25 processing fee today.",
    link: "mega-prize-claims.biz/claim", url: "http://mega-prize-claims.biz/claim",
    action: "Pay to claim", loss: 70,
    flags: [
      "You can't win a contest you never entered.",
      "Real prizes never make you pay to collect them.",
      "A huge prize and lots of exclamation points: too good to be true.",
    ],
  },
  {
    from: "Unknown number", addr: "+1 (555) 019-2834", ch: "Text",
    subj: "hey its jay, new phone",
    body: "hey it's Jay! got a new phone lol. I accidentally sent my login code to your number. can u text it back to me real quick?",
    link: null, url: null,
    action: "Send the code", loss: 60,
    flags: [
      "Never share a login code with anyone, even a friend.",
      "It's an unknown number claiming to be someone you know.",
      "Check by calling Jay's real number or asking in person.",
    ],
  },
  {
    from: "Streamly Billing", addr: "billing@streamly-account-verify.com", ch: "Email",
    subj: "Account suspended",
    body: "We could not process your payment. Your account will be deleted in 24 hours unless you verify your card details now.",
    link: "streamly.com/account", url: "https://streamly-account-verify.com/card",
    action: "Verify card", loss: 70,
    flags: [
      "The real site is streamly.com. This sender adds \"-account-verify\".",
      "The link secretly goes to that fake site too.",
      "Threats and deadlines are classic phishing. Open the app yourself to check.",
    ],
  },
  {
    from: "Principal Grant", addr: "principal.grant.hilltop@outlook.com", ch: "Email",
    subj: "Quick favor",
    body: "Are you free? I'm stuck in a meeting and need 4 gift cards for a staff surprise. Buy them and send me the codes. Please keep this between us!",
    link: null, url: null,
    action: "Buy gift cards", loss: 80,
    flags: [
      "School emails come from hilltopschool.edu, not outlook.com.",
      "Scammers love gift card codes because they can't be traced or refunded.",
      "\"Keep this secret\" is a big red flag. Tell a trusted adult.",
    ],
  },
  {
    from: "Help Kids Now Fund", addr: "donate@helpkidsnow-fund.net", ch: "Email",
    subj: "Donate TODAY ONLY",
    body: "Children need your help RIGHT NOW. We only accept gift cards or crypto. Our donation page closes at midnight!",
    link: "helpkidsnow-fund.net/give", url: "http://helpkidsnow-fund.net/give",
    action: "Donate", loss: 60,
    flags: [
      "Real charities take normal payments, not only gift cards or crypto.",
      "Guilt plus a deadline is pressure, not proof.",
      "Look up a charity yourself before giving.",
    ],
  },
  {
    from: "0fficial_StarGamer", addr: "Direct message", ch: "DM",
    subj: "FREE console giveaway",
    body: "Thx for being a fan!! I'm giving consoles to my first 50 followers. You're #12! Just pay $9.99 shipping at my link.",
    link: "stargamer-giveaway.shop", url: "http://stargamer-giveaway.shop/pay",
    action: "Pay shipping", loss: 50,
    flags: [
      "\"0fficial\" starts with a zero. Copycat accounts pretend to be real creators.",
      "A giveaway that makes you pay isn't free.",
      "Real giveaways are announced on the creator's verified page.",
    ],
  },
  {
    from: "Easy Fundraiser Pro", addr: "jobs@easy-cash-fundraiser.biz", ch: "Email",
    subj: "Raise $500 a day from home!",
    body: "Need money for your fundraiser? Our members raise $500 a DAY! Just send $40 for your starter kit and start earning tonight.",
    link: "easy-cash-fundraiser.biz/join", url: "http://easy-cash-fundraiser.biz/join",
    action: "Buy starter kit", loss: 60,
    flags: [
      "Paying money to start earning money is a common scam.",
      "$500 a day from home is too good to be true.",
      "You never asked for this. It found you.",
    ],
  },
  {
    from: "Hilltop School Office", addr: "office@hi1ltopschool.edu", ch: "Email",
    subj: "Your report card",
    body: "Your report card is ready. Open the attached file to view your grades. Attachment: Report_Card.pdf.exe",
    link: null, url: null,
    action: "Open attachment", loss: 50,
    flags: [
      "\"hi1ltop\" uses the number 1 instead of an l.",
      "A file ending in .exe is a program, not a PDF.",
      "Schools post grades in the school portal, not as surprise attachments.",
    ],
  },
];

const POPUPS = [
  { title: "WARNING!!!", text: "VIRUS DETECTED! 37 viruses found on your computer. Click to clean NOW!", btn: "Clean now", loss: 40,
    flag: "Fake virus warnings scare you into clicking. Real security tools don't live in pop-up ads." },
  { title: "WINNER!!!", text: "You are visitor #1,000,000! Claim your FREE tablet before time runs out!", btn: "Claim tablet", loss: 40,
    flag: "You can't win a prize you never entered. Close it with the X." },
  { title: "Update required", text: "Your browser is out of date! Download UpdateNow.exe to keep browsing.", btn: "Download", loss: 40,
    flag: "Only update from your settings or app store, never from a pop-up." },
  { title: "Gem Generator", text: "Unlimited free BlockBuild gems! Type your username and password to start.", btn: "Get gems", loss: 40,
    flag: "Gem generators steal accounts. Never type your password into a pop-up." },
];

const GLOATS = ["Hook, line and sinker!", "Thanks for the snack money!", "Too easy. Next!", "Another bite! Yum."];
const GRUMBLES = ["Hey! That was my best bait!", "Reported?! So rude.", "Fine. I've got plenty more.", "Ugh. A hero who reads."];

// ---------- Pixel sprites (same style as the CyberHeros website) ----------

const PALETTE = { k: C.night, w: C.cream, u: C.violet, y: C.sun, c: C.aqua, p: C.pink, a: "#a9a3c9", d: "#4a5fc1" };

const HERO = [
  "...kkkkkk...",
  "..kxxxxxxk..",
  ".kxxxxxxxxk.",
  ".kkkkkkkkkk.",
  ".kkwkkkkwkk.",
  ".kwwwwwwwwk.",
  ".kwkwwwwkwk.",
  ".kwwkkkkwwk.",
  "..kwwwwwwk..",
  "...kkkkkk...",
  "..kxxyyxxk..",
  ".kxxxxxxxxk.",
];
const BAITLYN = [
  "......yyy...",
  ".....y...y..",
  "........y...",
  "...kkkkkk...",
  "..kcccccck..",
  ".kcwwccwwck.",
  ".kcwkccwkck.",
  ".kcccccccck.",
  "", "", // mouth rows, filled in by baitlyn(mood)
  "..kcccccck..",
  "..kccyycck..",
  "...kk..kk...",
];
const MOUTHS = {
  happy: [".kcpccccpck.", ".kccppppcck."],
  sad: [".kccppppcck.", ".kcpccccpck."],
};
const BUILDINGS = [90, 150, 70, 190, 120, 80, 165, 110, 135, 60, 140, 95];

// ---------- State ----------

let scene = "title";   // title, play, ending
let queue = [];        // messages that haven't arrived yet
let inbox = [];        // messages waiting in the inbox
let openMsg = null;    // the message being read
let feedback = null;   // result panel shown after an action
let popup = null;      // the scam pop-up on screen, if any
let toast = null;      // short notice above the taskbar
let taunt = null;      // Baitlyn peeking in with a comment
let moneyFx = null;    // floating +$ / -$ on the taskbar
let money = 0;
let stats = {};
let startMs = 0, lastArrive = 0, nextPopup = 0;
let won = false, endReason = "", endStart = 0;
let spots = [];        // clickable areas, rebuilt every frame (last one drawn is on top)

function setup() {
  createCanvas(960, 600);
  document.fonts.load(`16px ${PIXEL}`);
  document.fonts.load(`16px "${BODY}"`);
}

function draw() {
  spots = [];
  if (scene === "title") drawTitle();
  else if (scene === "play") drawPlay();
  else drawEnding();
  scanlines();
  const top = topSpot();
  cursor(top && !top.blocker ? HAND : ARROW);
}

function mousePressed() {
  const spot = topSpot();
  if (spot) spot.onClick();
}

function topSpot() {
  for (let i = spots.length - 1; i >= 0; i--) if (over(spots[i])) return spots[i];
  return null;
}

function newGame() {
  queue = shuffle([
    ...REAL.map(m => ({ ...m, scam: false, unread: true })),
    ...SCAMS.map(m => ({ ...m, scam: true, unread: true })),
  ]);
  inbox = queue.splice(0, 3);
  money = 0;
  openMsg = feedback = popup = toast = taunt = moneyFx = null;
  stats = { reported: 0, fell: 0, won: 0, popups: 0 };
  startMs = millis();
  lastArrive = 0;
  nextPopup = 35;
  scene = "play";
}

function elapsed() {
  return (millis() - startMs) / 1000;
}

function changeMoney(d) {
  money = max(0, money + d);
  if (d !== 0) moneyFx = { d, t: millis() };
}

function showToast(text, color, seconds = 3) {
  toast = { text, color, until: millis() + seconds * 1000 };
}

function say(lines) {
  taunt = { text: random(lines), until: millis() + 3000 };
}

function act(kind) {
  const m = openMsg;
  if (!m) return;
  inbox = inbox.filter(x => x !== m);
  openMsg = null;

  if (m.scam) {
    if (kind === "take") {
      changeMoney(-m.loss); stats.fell++; say(GLOATS);
      feedback = { title: "You took the bait!", color: C.pink, delta: -m.loss, lines: m.flags };
    } else if (kind === "report") {
      changeMoney(BOUNTY); stats.reported++; say(GRUMBLES);
      feedback = { title: "Scam reported! Bounty earned.", color: C.lime, delta: BOUNTY, lines: m.flags };
    } else {
      say(["Phew. At least you didn't report it."]);
      feedback = { title: "Deleted. Safe, but no bounty.", color: C.sun, delta: 0,
        lines: [`Reporting it would have earned a $${BOUNTY} bounty and helped shut it down.`, ...m.flags.slice(0, 2)] };
    }
  } else {
    if (kind === "take") {
      changeMoney(m.prize); stats.won++;
      feedback = { title: "It was real. You won!", color: C.lime, delta: m.prize, lines: [m.why] };
    } else if (kind === "report") {
      changeMoney(-FALSE_REPORT);
      feedback = { title: "That one was real!", color: C.sun, delta: -FALSE_REPORT,
        lines: [m.why, "Reporting real messages wastes everyone's time, and you missed the prize."] };
    } else {
      feedback = { title: "Deleted. That was a real one.", color: C.sun, delta: 0,
        lines: [m.why, `You missed out on $${m.prize}.`] };
    }
  }
}

function openPopup() {
  popup = { ...random(POPUPS), x: random(120, 500), y: random(70, 290) };
}

function closePopup(kind) {
  const p = popup;
  if (kind === "lure") {
    changeMoney(-p.loss); say(GLOATS);
    showToast(`-$${p.loss}. ${p.flag}`, C.pink, 5);
  } else if (kind === "report") {
    changeMoney(POPUP_BOUNTY); stats.popups++; say(GRUMBLES);
    showToast(`+$${POPUP_BOUNTY} pop-up reported! ${p.flag}`, C.lime, 5);
  } else {
    showToast(`Closed safely with the X. ${p.flag}`, C.aqua, 5);
  }
  popup = null;
  nextPopup = elapsed() + random(25, 40);
}

function endGame(win, reason) {
  won = win;
  endReason = reason;
  endStart = millis();
  popup = null;
  scene = "ending";
  if (win) {
    try { localStorage.setItem("lockdown-thwarted-phishing", "1"); } catch (e) {}
  }
}

// ---------- Scenes ----------

function drawTitle() {
  background(C.night);
  drawSkyline();
  brand();
  bigTitle("Bait", 60, 60, 64);
  bigTitle("Buster", 60, 134, 64);

  fill(C.cream); textFont(BODY); textSize(18); textAlign(LEFT, TOP);
  const y = para(`Raise $${QUOTA} online to buy the Scam Eradicator 2000 and shut Baitlyn down for good. Real giveaways and sign-ups pay out. Scams cost you money. Report a scam and you earn a $${BOUNTY} bounty. You have until midnight.`, 60, 226, 480, 26);
  fill(C.aqua); textFont(MONO); textSize(15);
  text("Tip: hover over links to see where they really go.", 60, y + 6);
  button("Start", 60, y + 46, 180, 56, newGame);

  bubble("Check your inbox, hero. I left you some... presents.", 610, 170, 300);
  drawSprite(baitlyn("happy"), 680, 270 - bob(), 10);
}

function drawPlay() {
  const t = elapsed();
  if (queue.length && t - lastArrive >= ARRIVE_EVERY) {
    lastArrive = t;
    const m = queue.shift();
    inbox.unshift(m);
    showToast(`New ${m.ch === "DM" ? "DM" : m.ch.toLowerCase()} from ${m.from}`, C.aqua);
  }
  if (!popup && t >= nextPopup) openPopup();
  if (t >= GAME_SECONDS) endGame(false, "Midnight! Time to log off.");
  else if (!queue.length && !inbox.length && !feedback && money < QUOTA) {
    endGame(false, "You ran out of messages before reaching the goal.");
  }

  drawDesktop();
  drawInbox();
  drawReader();
  drawShop();
  drawTaskbar();
  drawTaunt();
  drawToast();
  if (popup) drawPopup();
}

function drawDesktop() {
  background(C.night2);
  noStroke(); fill(C.night3);
  for (let y = 10; y < 550; y += 40) {
    for (let x = (y / 40) % 2 ? 30 : 10; x < width; x += 40) rect(x, y, 4, 4);
  }
}

function drawInbox() {
  const x = 20, y = 20, w = 330, h = 520;
  windowFrame(`Inbox (${inbox.length})`, x, y, w, h, C.aqua);
  if (!inbox.length) {
    fill(C.muted); textFont(BODY); textSize(16); textAlign(LEFT, TOP);
    para("Inbox empty. New messages arrive soon.", x + 20, y + 50, w - 40, 22);
    return;
  }
  inbox.slice(0, 8).forEach((m, i) => {
    const box = { x: x + 8, y: y + 38 + i * 56, w: w - 16, h: 50 };
    const sel = m === openMsg;
    const hot = over(box);
    stroke(sel ? C.aqua : C.night3); strokeWeight(2);
    fill(sel || hot ? C.night3 : C.night); rect(box.x, box.y, box.w, box.h);
    noStroke();
    if (m.unread) { fill(C.sun); rect(box.x + 8, box.y + 21, 8, 8); }
    tag(m.ch, box.x + box.w - 62, box.y + 7);
    fill(C.cream); textFont(BODY); textSize(16); textAlign(LEFT, TOP);
    if (m.unread) textStyle(BOLD);
    text(fit(m.from, box.w - 100), box.x + 24, box.y + 5);
    textStyle(NORMAL);
    fill(C.muted); textSize(14);
    text(fit(m.subj, box.w - 34), box.x + 24, box.y + 27);
    spots.push({ ...box, onClick: () => { openMsg = m; m.unread = false; feedback = null; } });
  });
  if (inbox.length > 8) {
    fill(C.muted); textFont(BODY); textSize(14); textAlign(LEFT, TOP);
    text(`+${inbox.length - 8} more below`, x + 16, y + h - 26);
  }
}

function drawReader() {
  const x = 370, y = 20, w = 570, h = 380;
  const left = x + 20, inner = w - 40;
  windowFrame("Message", x, y, w, h, C.aqua);

  if (feedback) return drawFeedback(x, y, w, h);

  if (!openMsg) {
    fill(C.cream); textFont(PIXEL); textSize(18); textAlign(LEFT, TOP);
    text("Pick a message", left, y + 48);
    textFont(BODY); textSize(16);
    let ty = para("Baitlyn hid scams in your inbox. For each message, take the offer, report it as a scam, or delete it.", left, y + 82, inner, 23) + 8;
    fill(C.aqua);
    for (const tip of [
      "Check the sender's address, letter by letter.",
      "Hover over links to see where they really go.",
      "Never share passwords or login codes.",
      "Real prizes never make you pay a fee.",
      "Watch out for rush, secrets and gift cards.",
    ]) ty = para("> " + tip, left, ty, inner, 23);
    statusBar(x, y, w, h, "Hover over a link to see where it really goes.", C.muted);
    return;
  }

  const m = openMsg;
  textAlign(LEFT, TOP); noStroke();
  fill(C.cream); textFont(BODY); textSize(19); textStyle(BOLD);
  text(fit(m.from, inner - 80), left, y + 40);
  textStyle(NORMAL);
  tag(m.ch, x + w - 82, y + 44);
  fill(C.muted); textFont(MONO); textSize(15); text(m.addr, left, y + 68);
  fill(C.cream); textFont(BODY); textSize(16); text(fit("Subject: " + m.subj, inner), left, y + 92);
  fill(C.night3); rect(left, y + 120, inner, 2);
  fill(C.cream); textSize(16);
  const by = para(m.body, left, y + 132, inner, 23);

  let status = m.link ? "Hover over the link to see where it really goes." : "No link in this message. Read it carefully.";
  let statusColor = C.muted;
  if (m.link) {
    textFont(BODY); textSize(17);
    const lw = textWidth(m.link);
    const box = { x: left, y: by + 6, w: lw, h: 24 };
    const hot = over(box);
    fill(hot ? C.sun : C.aqua); text(m.link, left, by + 6); rect(left, by + 28, lw, 2);
    if (hot) { status = "Link goes to: " + m.url; statusColor = C.sun; }
    spots.push({ ...box, onClick: () => act("take") });
  }

  const bY = y + h - 86;
  smallBtn(m.action, left, bY, 200, 40, C.sun, () => act("take"));
  smallBtn("Report scam", left + 216, bY, 170, 40, C.lime, () => act("report"));
  smallBtn("Delete", left + 402, bY, 128, 40, C.muted, () => act("delete"));
  statusBar(x, y, w, h, status, statusColor);
}

function drawFeedback(x, y, w, h) {
  const fb = feedback, left = x + 20, inner = w - 40;
  textAlign(LEFT, TOP); noStroke();
  fill(fb.color); textFont(PIXEL); textSize(19); text(fb.title, left, y + 44);
  const d = fb.delta;
  textAlign(RIGHT, TOP); textSize(24);
  text(d > 0 ? `+$${d}` : d < 0 ? `-$${-d}` : "$0", x + w - 20, y + 42);
  textAlign(LEFT, TOP);
  fill(C.cream); textFont(PIXEL); textSize(13); text(fb.color === C.lime ? "Why it was right:" : "What to look for:", left, y + 86);
  textFont(BODY); textSize(16);
  let ly = y + 110;
  for (const line of fb.lines) ly = para("> " + line, left, ly, inner, 23) + 6;
  smallBtn("Next >", x + w - 160, y + h - 60, 140, 40, C.sun, () => { feedback = null; });
}

function drawShop() {
  const x = 370, y = 415, w = 570, h = 125;
  windowFrame("HeroMart", x, y, w, h, C.violet);
  drawEradicator(392, 456, 1.3);
  noStroke(); fill(C.cream); textFont(PIXEL); textSize(15); textAlign(LEFT, TOP);
  text("Scam Eradicator 2000", 470, y + 38);
  fill(C.muted); textFont(BODY); textSize(14);
  text(`Shuts down every scam in town. Price: $${QUOTA}`, 470, y + 60);
  const pct = min(1, money / QUOTA);
  fill(C.night); rect(470, y + 86, 290, 18);
  fill(pct >= 1 ? C.lime : C.aqua); rect(470, y + 86, 290 * pct, 18);
  fill(C.cream); textFont(PIXEL); textSize(12); textAlign(CENTER, CENTER);
  text(`$${money} / $${QUOTA}`, 615, y + 95);
  const ready = money >= QUOTA;
  smallBtn(ready ? "Buy it!" : "Need more $", 784, y + 54, 140, 46, ready ? C.lime : C.night3,
    () => { changeMoney(-QUOTA); endGame(true, "The Scam Eradicator 2000 is online."); }, ready);
}

function drawTaskbar() {
  noStroke(); fill(C.night); rect(0, 552, width, 48);
  fill(C.violet); rect(0, 552, width, 3);
  fill(C.sun); rect(12, 561, 110, 32);
  fill(C.night); textFont(PIXEL); textSize(14); textAlign(CENTER, CENTER); text("HeroNet", 67, 577);

  fill(C.aqua); textAlign(LEFT, CENTER); textSize(16);
  text(`Fund: $${money}`, 144, 577);
  fill(C.muted); textSize(13); text(`Goal: $${QUOTA}`, 300, 578);

  if (moneyFx) {
    const age = (millis() - moneyFx.t) / 1000;
    if (age > 1.4) moneyFx = null;
    else {
      fill(moneyFx.d > 0 ? C.lime : C.pink); textSize(18);
      text(moneyFx.d > 0 ? `+$${moneyFx.d}` : `-$${-moneyFx.d}`, 190, 548 - age * 40);
    }
  }

  // Baitlyn's eye: she's always watching
  const blink = frameCount % 150 < 8;
  fill(C.pink); textSize(12); textAlign(RIGHT, CENTER); text("Baitlyn is watching", 700, 578);
  fill(C.cream); rect(712, 570, 22, 14);
  fill(blink ? C.cream : C.night); rect(719 + sin(frameCount / 20) * 4, 573, 8, 8);
  if (blink) { fill(C.pink); rect(712, 576, 22, 3); }

  const left = GAME_SECONDS - elapsed();
  fill(left < 60 && frameCount % 40 < 20 ? C.pink : C.cream);
  textSize(16); textAlign(RIGHT, CENTER); text(clockText(), 944, 577);
}

function drawPopup() {
  const p = popup, w = 340, h = 190;
  spots.push({ x: p.x, y: p.y, w, h, blocker: true, onClick: () => {} });
  stroke(C.pink); strokeWeight(3); fill(C.cream); rect(p.x, p.y, w, h);
  noStroke(); fill(C.pink); rect(p.x, p.y, w, 28);
  fill(C.cream); textFont(PIXEL); textSize(14); textAlign(LEFT, CENTER); text(p.title, p.x + 10, p.y + 14);

  const xBox = { x: p.x + w - 26, y: p.y + 4, w: 20, h: 20 };
  fill(over(xBox) ? C.sun : C.night); rect(xBox.x, xBox.y, xBox.w, xBox.h);
  fill(over(xBox) ? C.night : C.cream); textAlign(CENTER, CENTER); textSize(13); text("x", xBox.x + 10, xBox.y + 9);
  spots.push({ ...xBox, onClick: () => closePopup("close") });

  fill(C.night); textFont(BODY); textSize(17); textAlign(LEFT, TOP);
  para(p.text, p.x + 16, p.y + 40, w - 32, 22);
  smallBtn(p.btn, p.x + 16, p.y + h - 54, 180, 40, frameCount % 30 < 15 ? C.lime : C.sun, () => closePopup("lure"));
  smallBtn("Report", p.x + w - 118, p.y + h - 54, 102, 40, C.aqua, () => closePopup("report"));
}

function drawToast() {
  if (!toast) return;
  if (millis() > toast.until) { toast = null; return; }
  textFont(BODY); textSize(15);
  const lines = wrapCount(toast.text, 400);
  const h = 16 + lines * 20;
  const y = 548 - h;
  stroke(toast.color); strokeWeight(2); fill(C.night); rect(380, y, 420, h);
  noStroke(); fill(C.cream); textAlign(LEFT, TOP);
  para(toast.text, 390, y + 8, 400, 20);
}

function drawTaunt() {
  if (!taunt) return;
  if (millis() > taunt.until) { taunt = null; return; }
  bubble(taunt.text, 120, 400, 210, 60);
  drawSprite(baitlyn(taunt.text.startsWith("Hey") || GRUMBLES.includes(taunt.text) ? "sad" : "happy"), 270, 482, 5);
}

function drawEnding() {
  background(C.night);
  drawSkyline(0.45);
  brand();
  const te = (millis() - endStart) / 1000;

  if (won) {
    drawSprite(HERO, 30, 214, 7, { x: C.aqua });
    drawEradicator(120, 110, 4.4);
    noStroke(); fill(C.cream); textFont(PIXEL); textSize(13); textAlign(CENTER, TOP);
    text("Scam Eradicator 2000", 208, 320);
    if (te < 2.5) {
      if (frameCount % 6 < 4) {
        fill(C.aqua); rect(300, 196, 350, 14);
        fill(C.cream); rect(300, 201, 350, 4);
      }
      if (te < 1.2 || frameCount % 8 < 4) drawSprite(baitlyn("sad"), 650, 120, 10);
    } else if (te < 3.5) {
      fill(random([C.aqua, C.sun, C.pink]));
      for (let i = 0; i < 14; i++) rect(660 + random(110), 130 + random(120), 8, 8);
    } else {
      fill(C.lime); textFont(PIXEL); textSize(22); textAlign(CENTER, CENTER);
      text("ZAPPED!", 710, 190);
    }
  } else {
    drawSprite(baitlyn("happy"), 410, 90 - bob(), 12);
    bubble("Thanks for all the snack money, hero!", 600, 70, 300);
  }

  const title = won ? ["Baitlyn is thwarted!", C.lime] : ["Baitlyn kept fishing.", C.pink];
  noStroke(); textAlign(CENTER, TOP);
  fill(title[1]); textFont(PIXEL); textSize(26); text(title[0], 480, 350);
  fill(C.cream); textFont(BODY); textSize(19); text(endReason, 480, 392);
  fill(C.muted); textSize(17);
  text(`Scams reported: ${stats.reported} of ${SCAMS.length}    Scams you fell for: ${stats.fell}    Prizes won: ${stats.won}`, 480, 424);
  fill(C.aqua); textSize(16);
  para("Report scams for real: use your email's Report phishing button, tell your school or work IT, and forward scam texts to 7726 (SPAM).", 480, 456, 760, 22);

  button("Play again", 250, 520, 210, 56, newGame);
  button("All games", 500, 520, 210, 56, () => { window.location.href = WEBSITE_URL; });
}

// ---------- Drawing helpers ----------

function windowFrame(title, x, y, w, h, accent) {
  stroke(accent); strokeWeight(3); fill(C.night2); rect(x, y, w, h);
  noStroke(); fill(accent); rect(x, y, w, 28);
  fill(C.night); textFont(PIXEL); textSize(14); textAlign(LEFT, CENTER); text(title, x + 10, y + 14);
  for (let i = 0; i < 3; i++) rect(x + w - 22 - i * 16, y + 9, 10, 10);
}

function statusBar(x, y, w, h, msg, color) {
  noStroke(); fill(C.night); rect(x + 3, y + h - 34, w - 6, 31);
  fill(color); textFont(MONO); textSize(14); textAlign(LEFT, CENTER);
  text(fit(msg, w - 30), x + 14, y + h - 18);
}

function tag(label, x, y) {
  const col = { Email: C.aqua, Text: C.sun, DM: C.pink }[label] || C.muted;
  noStroke(); fill(col); rect(x, y, 54, 18);
  fill(C.night); textFont(PIXEL); textSize(11); textAlign(CENTER, CENTER); text(label, x + 27, y + 9);
  textAlign(LEFT, TOP);
}

function smallBtn(label, x, y, w, h, col, onClick, enabled = true) {
  const hot = enabled && over({ x, y, w, h });
  const down = hot && mouseIsPressed ? 2 : 0;
  noStroke();
  if (enabled) { fill(C.pink); rect(x + 4, y + 4, w, h); }
  stroke(enabled ? C.cream : C.night3); strokeWeight(2);
  fill(hot ? C.cream : col); rect(x + down, y + down, w, h);
  noStroke(); fill(enabled ? C.night : C.muted); textFont(PIXEL); textSize(14); textAlign(CENTER, CENTER);
  text(label, x + down + w / 2, y + down + h / 2);
  if (enabled) spots.push({ x, y, w, h, onClick });
}

function drawEradicator(x, y, s) {
  noStroke();
  fill(C.muted); rect(x + 18 * s, y, 4 * s, 10 * s);                    // antenna
  fill(C.aqua); rect(x + 12 * s, y - 4 * s, 16 * s, 6 * s);             // dish
  fill(C.night3); rect(x, y + 10 * s, 40 * s, 30 * s);                  // body
  fill(C.violet); rect(x, y + 10 * s, 40 * s, 4 * s);
  fill(C.aqua); rect(x + 6 * s, y + 17 * s, 28 * s, 11 * s);            // screen
  fill(C.night); rect(x + 8 * s, y + 19 * s, 24 * s, 7 * s);
  fill(frameCount % 20 < 10 ? C.lime : C.sun);
  rect(x + 10 * s, y + 21 * s, 4 * s, 3 * s); rect(x + 18 * s, y + 21 * s, 4 * s, 3 * s); rect(x + 26 * s, y + 21 * s, 4 * s, 3 * s);
  fill(C.pink); rect(x + 5 * s, y + 32 * s, 7 * s, 4 * s);
  fill(C.sun); rect(x + 16 * s, y + 32 * s, 7 * s, 4 * s);
  fill(C.lime); rect(x + 27 * s, y + 32 * s, 7 * s, 4 * s);
  fill(C.cream); rect(x + 4 * s, y + 40 * s, 8 * s, 4 * s); rect(x + 28 * s, y + 40 * s, 8 * s, 4 * s); // feet
}

function drawSprite(grid, x, y, px, extra = {}) {
  const colors = { ...PALETTE, ...extra };
  noStroke();
  grid.forEach((row, r) => [...row].forEach((ch, col) => {
    if (colors[ch]) { fill(colors[ch]); rect(x + col * px, y + r * px, px, px); }
  }));
}

function baitlyn(mood) {
  return [...BAITLYN.slice(0, 8), ...MOUTHS[mood], ...BAITLYN.slice(10)];
}

function bob() {
  return floor(frameCount / 30) % 2 * 6; // choppy two-frame hop, like the website
}

function drawSkyline(scale = 1) {
  const w = width / BUILDINGS.length;
  noStroke();
  BUILDINGS.forEach((fullH, i) => {
    const h = fullH * scale;
    fill(i % 3 === 0 ? C.night3 : C.night2);
    rect(i * w, height - h, w - 4, h);
    for (let wy = height - h + 14; wy < height - 10; wy += 22) {
      for (let wx = i * w + 10; wx < i * w + w - 14; wx += 18) {
        if ((wx + wy + i) % 3 === 0) { fill((wx / 2 + i) % 2 ? C.sun : C.aqua); rect(wx, wy, 5, 6); }
      }
    }
  });
}

function scanlines() {
  stroke(0, 0, 0, 26); strokeWeight(1);
  for (let y = 0; y < height; y += 4) line(0, y, width, y);
  noStroke();
}

function brand() {
  noStroke(); fill(C.muted); textFont(PIXEL); textSize(14); textAlign(LEFT, TOP);
  text("CyberHeros: game 3", 24, 20);
}

function bigTitle(str, x, y, size) {
  textFont(PIXEL); textStyle(BOLD); textSize(size); textAlign(LEFT, TOP); noStroke();
  const o = size * 0.06;
  fill(C.violet); text(str, x + 2 * o, y + 2 * o);
  fill(C.aqua); text(str, x + o, y + o);
  fill(C.cream); text(str, x, y);
  textStyle(NORMAL);
}

function bubble(str, x, y, w, h = 64) {
  textFont(BODY); textSize(17);
  noStroke(); fill(C.cream); rect(x, y, w, h);
  triangle(x + w / 2 - 10, y + h, x + w / 2 + 10, y + h, x + w / 2, y + h + 16);
  fill(C.night); textAlign(LEFT, TOP); para(str, x + 14, y + 10, w - 28, 22);
}

function button(label, x, y, w, h, onClick) {
  const down = over({ x, y, w, h }) && mouseIsPressed ? 3 : 0;
  noStroke(); fill(C.pink); rect(x + 5, y + 5, w, h);
  stroke(C.cream); strokeWeight(3); fill(C.sun); rect(x + down, y + down, w, h);
  noStroke(); fill(C.night); textFont(PIXEL); textSize(17); textAlign(CENTER, CENTER);
  text(label, x + down + w / 2, y + down + h / 2);
  spots.push({ x, y, w, h, onClick });
}

function clockText() {
  const mins = min(floor(elapsed()), GAME_SECONDS);
  const h24 = 18 + floor(mins / 60);
  if (h24 >= 24) return "12:00 AM";
  return `${h24 - 12}:${nf(mins % 60, 2)} PM`;
}

// Shortens text with "..." so it fits in w pixels (uses the current font and size).
function fit(str, w) {
  if (textWidth(str) <= w) return str;
  while (str.length && textWidth(str + "...") > w) str = str.slice(0, -1);
  return str + "...";
}

// Counts how many lines para() would use, without drawing.
function wrapCount(str, w) {
  let line = "", n = 1;
  for (const word of str.split(" ")) {
    const test = line ? line + " " + word : word;
    if (line && textWidth(test) > w) { n++; line = word; } else line = test;
  }
  return n;
}

// Draws word-wrapped text and returns the y just below it.
function para(str, x, y, w, leading) {
  let line = "";
  for (const word of str.split(" ")) {
    const test = line ? line + " " + word : word;
    if (line && textWidth(test) > w) { text(line, x, y); y += leading; line = word; }
    else line = test;
  }
  text(line, x, y);
  return y + leading;
}

function over(s) {
  return mouseX > s.x && mouseX < s.x + s.w && mouseY > s.y && mouseY < s.y + s.h;
}
