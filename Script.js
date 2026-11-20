'use strict';

/* =========================================================
   1. EDIT THESE FIRST
   ========================================================= */
const CONFIG = {
  // WhatsApp number: country code + number, digits only (no + or spaces)
  whatsapp: '91XXXXXXXXXX',
  // Shown on the page and used for the "call" link
  phoneDisplay: '+91 9229526967',
  phoneLink: '+91-9229526967',
  instagram: 'https://www.instagram.com/ujjwal5032mishra/',
  defaultLang: 'en'
};

/* Sample reels. For each one, fill in ONE of these:
   - type 'mp4'       -> src: 'videos/my-reel.mp4' (file you upload next to index.html)
   - type 'instagram' -> src: 'ABC123xyz' (the code from instagram.com/p/ABC123xyz/ or /reel/ABC123xyz/)
   If src is empty, the card opens a "coming soon" box with your Instagram link. */
const REELS = [
  { art: '🍬', g1: '#FF4F87', g2: '#FFC857', type: 'mp4', src: '',
    title: { hi: 'मिठाई की दुकान का त्योहार ऑफर', en: 'Festival offer for a sweet shop' } },
  { art: '🩺', g1: '#49D6C7', g2: '#BFAEFF', type: 'mp4', src: '',
    title: { hi: 'स्थानीय क्लिनिक की सेहत टिप', en: 'Health tip from a local clinic' } },
  { art: '🏰', g1: '#FFC857', g2: '#FF718C', type: 'mp4', src: '',
    title: { hi: 'कक्षा 3 के लिए इतिहास का पाठ', en: 'History lesson for class 3' } },
  { art: '🛍️', g1: '#BFAEFF', g2: '#FF4F87', type: 'mp4', src: '',
    title: { hi: 'ऑनलाइन सेलर का प्रोडक्ट लॉन्च', en: 'Product launch for an online seller' } }
];

/* =========================================================
   2. HINDI TEXT (English text lives in index.html)
   ========================================================= */
const HI = {
  nav_demo: 'सैंपल रील', nav_plans: 'दाम', nav_how: 'कैसे काम करता है', nav_contact: 'संपर्क', nav_wa: 'WhatsApp',
  hero_h1: 'AI से बने हिंदी वीडियो, ज़्यादा ग्राहक। 48 घंटे में तैयार।',
  hero_sub: 'दुकान, क्लिनिक, स्कूल और ऑनलाइन सेलर के लिए कार्टून और एनिमे रील। आप WhatsApp पर आइडिया भेजिए, वीडियो हम बनाएँगे।',
  cta_wa: 'WhatsApp पर बात करें', cta_demo: 'सैंपल रील देखें',
  proof1: 'हिंदी आवाज़ और कैप्शन', proof2: 'कार्टून या एनिमे स्टाइल', proof3: 'Instagram और WhatsApp पर पोस्ट करने के लिए तैयार',
  sticker: '48 घंटे में तैयार',
  demo_h2: 'पैसे देने से पहले वीडियो देखिए',
  demo_lead: 'रील पर टैप करके देखिए। हर वीडियो AI से, हिंदी में बना है।',
  plans_h2: 'सीधे और साफ़ मासिक दाम',
  plans_lead: 'एक पैकेज चुनिए और हर महीने भुगतान कीजिए। कुछ अलग चाहिए? हमें मैसेज कीजिए।',
  best_value: 'सबसे किफ़ायती', per_month: '/महीना', plan_cta: 'इस पैकेज के बारे में पूछें',
  f_voice: 'हिंदी आवाज़ और कैप्शन', f_style: 'कार्टून या एनिमे स्टाइल', f_48: '48 घंटे में डिलीवरी',
  p1_for: 'एक दुकान या क्लिनिक की शुरुआत के लिए', p1_f1: 'हर महीने 8 AI रील',
  p2_for: 'जो रोज़ पोस्ट करना चाहते हैं', p2_f1: 'हर महीने 16 AI रील', p2_f2: 'महीने का पोस्टिंग कैलेंडर',
  p2_f3: 'त्योहार और ऑफर की रील पहले से प्लान', p2_f4: 'Starter की सारी सुविधाएँ',
  p3_name: 'स्कूल पैक', p3_for: 'स्कूल और ट्यूशन सेंटर के लिए', p3_per: '/महीना, प्रति विषय',
  p3_f1: 'विषय के अनुसार पाठ के वीडियो', p3_f2: 'नर्सरी से कक्षा 5 तक के कार्टून पाठ',
  p3_f3: 'हिंदी या अंग्रेज़ी में', p3_f4: 'क्लास में चलाइए या अभिभावकों को भेजिए',
  about_h2: 'हमने बच्चों के इतिहास से शुरुआत की',
  about_p1: 'हमारा Instagram पेज history.in.60 नर्सरी से कक्षा 5 तक के बच्चों को AI से बने कार्टून और एनिमे वीडियो में इतिहास सिखाता है।',
  about_p2: 'किसी बच्चे को वीडियो आख़िर तक दिखाना आसान नहीं है। यही हुनर हम आपके ग्राहकों के लिए इस्तेमाल करते हैं।',
  ig_desc: 'बच्चों के लिए AI इतिहास वीडियो, नर्सरी से कक्षा 5', about_cta: '@history.in.60 को फ़ॉलो करें',
  st1: 'फ़ॉलोअर', st2: 'पोस्ट किए वीडियो', st3: 'कुल व्यूज़',
  contact_h2: 'बताइए आप क्या बेचते हैं',
  contact_lead: 'WhatsApp पर मैसेज कीजिए या फ़ॉर्म भरिए। हम आपके बिज़नेस के लिए एक सैंपल रील का आइडिया भेजेंगे।',
  f_name: 'आपका नाम', f_biz: 'बिज़नेस का नाम या प्रकार', f_plan: 'कौन सा पैकेज चाहिए',
  o0: 'अभी तय नहीं', o3: 'स्कूल पैक', f_msg: 'आपका संदेश', f_send: 'WhatsApp पर भेजें',
  f_note: 'इससे WhatsApp खुलेगा और आपकी जानकारी पहले से लिखी होगी।',
  foot: '© 2026 Reelwala. भारत के छोटे बिज़नेस के लिए AI वीडियो।'
};

/* Text used only by scripts (both languages) */
const TXT = {
  title: { hi: 'Reelwala | आपके बिज़नेस के लिए AI हिंदी वीडियो', en: 'Reelwala | AI videos in Hindi for your business' },
  busy: { hi: 'आपकी रील बन रही है…', en: 'Making your reel…' },
  done: { hi: 'पोस्ट के लिए तैयार ✓', en: 'Ready to post ✓' },
  play: { hi: 'वीडियो चलाइए: ', en: 'Play video: ' },
  soon: { hi: 'यह सैंपल वीडियो जल्द आएगा। तब तक हमारा Instagram देखिए।', en: 'This sample video is coming soon. See our Instagram meanwhile.' },
  ig: { hi: 'Instagram खोलें', en: 'Open Instagram' },
  close: { hi: 'बंद करें', en: 'Close' }
};

const MSG = {
  general: {
    hi: 'नमस्ते, मुझे अपने बिज़नेस के लिए AI वीडियो के बारे में जानना है।',
    en: 'Hi, I want to know about AI videos for my business.'
  },
  plan: {
    hi: p => `नमस्ते, मुझे ${p} पैकेज के बारे में जानना है।`,
    en: p => `Hi, I want to know more about the ${p} plan.`
  },
  form: {
    hi: (n, b, p, m) => `नमस्ते, मेरा नाम ${n} है।\nबिज़नेस: ${b || '-'}\nपैकेज: ${p}\n${m}`.trim(),
    en: (n, b, p, m) => `Hi, my name is ${n}.\nBusiness: ${b || '-'}\nPlan: ${p}\n${m}`.trim()
  }
};

const HERO_SCENES = [
  { art: '🍬', cls: 's1', cap: { hi: 'दिवाली ऑफर! सारी मिठाइयों पर ₹100 की छूट।', en: 'Festival offer! ₹100 off on all sweets.' } },
  { art: '🩺', cls: 's2', cap: { hi: 'सर्दी-खाँसी हो तो देर न करें, आज ही दिखाइए।', en: 'Cough or cold? Do not wait. Get checked today.' } },
  { art: '🏰', cls: 's3', cap: { hi: 'बहुत समय पहले एक भव्य किला हुआ करता था…', en: 'Long ago, there stood a grand fort…' } }
];

/* =========================================================
   3. SCRIPT
   ========================================================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lang = 'en';

/* ----- Language ----- */
const i18nNodes = $$('[data-i18n]');
i18nNodes.forEach(n => { n.dataset.en = n.innerHTML; }); // remember the English original

function applyLang(next) {
  lang = 'en';
  document.documentElement.lang = lang;
  i18nNodes.forEach(n => {
    n.innerHTML = n.dataset.en;
  });
  $('#playerClose').setAttribute('aria-label', TXT.close[lang]);
  document.title = TXT.title[lang];
  renderReels();
  updateLinks();
  restartHero();
}



/* ----- WhatsApp, phone and Instagram links ----- */
function waUrl(text) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
}

function updateLinks() {
  $$('[data-wa]').forEach(a => {
    a.href = CONFIG.instagram;
    a.target = '_blank';
    a.rel = 'noopener';
  });
  $$('[data-phone]').forEach(a => { a.href = `tel:${CONFIG.phoneLink}`; });
  $$('[data-phone-text]').forEach(s => { s.textContent = CONFIG.phoneDisplay; });
  $$('[data-ig]').forEach(a => { a.href = CONFIG.instagram; });
}

/* ----- Demo reels + player ----- */
const reelsEl = $('#reels');
const player = $('#player');
const playerBody = $('#playerBody');

function renderReels() {
  reelsEl.innerHTML = '';
  REELS.forEach(r => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'reel';
    b.style.setProperty('--g1', r.g1);
    b.style.setProperty('--g2', r.g2);
    b.setAttribute('aria-label', TXT.play[lang] + r.title[lang]);
    b.innerHTML =
      `<span class="reel__art" aria-hidden="true">${r.art}</span>` +
      `<span class="reel__play" aria-hidden="true"></span>` +
      `<span class="reel__title">${r.title[lang]}</span>`;
    b.addEventListener('click', () => openPlayer(r));

    b.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      const rect = b.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      b.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`);
      b.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`);
    });
    b.addEventListener('pointerleave', () => {
      b.style.setProperty('--rx', '0deg');
      b.style.setProperty('--ry', '0deg');
    });
    reelsEl.appendChild(b);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.disconnect();
        }
      });
    }, { threshold: .25 });
    observer.observe(reelsEl);
  } else {
    reelsEl.classList.add('is-visible');
  }

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    reelsEl.addEventListener('pointermove', e => {
      const proximity = 120;
      const cards = reelsEl.querySelectorAll('.reel');

      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        card.classList.toggle('is-near', distance < proximity);
      });
    });

    reelsEl.addEventListener('pointerleave', () => {
      reelsEl.querySelectorAll('.reel.is-near').forEach(card => card.classList.remove('is-near'));
    });
  }
}

function openPlayer(r) {
  playerBody.innerHTML = '';
  if (r.src && r.type === 'instagram') {
    const f = document.createElement('iframe');
    f.className = 'player__media player__media--ig';
    f.src = `https://www.instagram.com/p/${encodeURIComponent(r.src)}/embed`;
    f.title = r.title[lang];
    f.allow = 'autoplay; encrypted-media';
    playerBody.appendChild(f);
  } else if (r.src) {
    const v = document.createElement('video');
    v.className = 'player__media';
    v.src = r.src;
    v.controls = true;
    v.autoplay = true;
    v.playsInline = true;
    playerBody.appendChild(v);
  } else {
    const d = document.createElement('div');
    d.className = 'player__empty';
    d.innerHTML =
      `<p>${TXT.soon[lang]}</p>` +
      `<a class="btn btn--sm btn--sun" href="${CONFIG.instagram}" target="_blank" rel="noopener">${TXT.ig[lang]}</a>`;
    playerBody.appendChild(d);
  }
  player.showModal();
}

$('#playerClose').addEventListener('click', () => player.close());
player.addEventListener('close', () => { playerBody.innerHTML = ''; }); // stops playback
player.addEventListener('click', e => { if (e.target === player) player.close(); });

/* ----- Hero: "reel being made" moment ----- */
const sceneEl = $('#scene');
const artEl = $('#sceneArt');
const fillEl = $('#genFill');
const genTxt = $('#genTxt');
const capEl = $('#caption');
let heroTimer = null;
let typeTimer = null;
let sceneIdx = 0;

function graphemes(text) {
  if (window.Intl && Intl.Segmenter) {
    return Array.from(new Intl.Segmenter(lang, { granularity: 'grapheme' }).segment(text), s => s.segment);
  }
  return Array.from(text);
}

function showScene(i, animate) {
  const s = HERO_SCENES[i];
  const parts = graphemes(s.cap[lang]);

  clearInterval(typeTimer);
  clearTimeout(heroTimer);

  sceneEl.className = 'scene ' + s.cls;
  artEl.textContent = s.art;
  artEl.style.animation = 'none';
  void artEl.offsetWidth; // restart the pop animation
  artEl.style.animation = '';

  fillEl.style.transition = 'none';
  fillEl.style.width = '0%';
  void fillEl.offsetWidth;

  if (!animate) {
    capEl.textContent = parts.join('');
    fillEl.style.width = '100%';
    genTxt.textContent = TXT.done[lang];
    return;
  }

  genTxt.textContent = TXT.busy[lang];
  capEl.textContent = '';
  fillEl.style.transition = 'width 3.2s linear';
  fillEl.style.width = '100%';

  let n = 0;
  typeTimer = setInterval(() => {
    n += 1;
    capEl.textContent = parts.slice(0, n).join('');
    if (n >= parts.length) clearInterval(typeTimer);
  }, 70);

  heroTimer = setTimeout(() => {
    genTxt.textContent = TXT.done[lang];
    heroTimer = setTimeout(() => {
      sceneIdx = (sceneIdx + 1) % HERO_SCENES.length;
      showScene(sceneIdx, true);
    }, 1500);
  }, 3300);
}

function restartHero() { showScene(sceneIdx, !reduceMotion); }

/* ----- Contact form: stores entries and exports an Excel-compatible sheet ----- */
const LEADS_STORAGE_KEY = 'reelwala-leads';

function getStoredLeads() {
  try {
    return JSON.parse(localStorage.getItem(LEADS_STORAGE_KEY) || '[]');
  } catch (error) {
    return [];
  }
}

function escapeCsv(value) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadLeadsExcel() {
  const leads = getStoredLeads();
  const headers = ['Submitted At', 'Name', 'Contact', 'Business', 'Plan', 'Message'];
  const rows = leads.map(lead => [
    lead.submittedAt,
    lead.name,
    lead.contact,
    lead.business,
    lead.plan,
    lead.message
  ]);
  const csv = [headers, ...rows].map(row => row.map(escapeCsv).join(',')).join('\r\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `reelwala-leads-${date}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

$('#leadForm').addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(e.target);
  const lead = {
    submittedAt: new Date().toLocaleString(),
    name: String(d.get('name') || '').trim(),
    contact: String(d.get('contact') || '').trim(),
    business: String(d.get('biz') || '').trim(),
    plan: String(d.get('plan') || '').trim(),
    message: String(d.get('msg') || '').trim()
  };

  const leads = getStoredLeads();
  leads.push(lead);
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  downloadLeadsExcel();

  window.open(CONFIG.instagram, '_blank', 'noopener');
  e.target.reset();
});

/* ----- Animated brand name ----- */
const brandName = $('.brand__name');

if (brandName) {
  brandName.innerHTML = Array.from(brandName.textContent).map(letter =>
    letter === ' ' ? ' ' : `<span aria-hidden="true">${letter}</span>`
  ).join('');
  brandName.setAttribute('aria-label', 'Reelwala');
}

/* ----- Navigation dropdown ----- */
const navDropdown = $('.nav__dropdown');
const navMenuButton = $('.nav__menu');

if (navDropdown && navMenuButton) {
  navMenuButton.addEventListener('click', () => {
    const isOpen = navDropdown.classList.toggle('is-open');
    navMenuButton.setAttribute('aria-expanded', String(isOpen));
  });

  navDropdown.querySelectorAll('.nav__menu-list a').forEach(link => {
    link.addEventListener('click', () => {
      navDropdown.classList.remove('is-open');
      navMenuButton.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', event => {
    if (!navDropdown.contains(event.target)) {
      navDropdown.classList.remove('is-open');
      navMenuButton.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ----- How it works: reveal the connecting rail on scroll ----- */
const howSection = $('.hiw');
if (howSection && 'IntersectionObserver' in window) {
  howSection.classList.add('hiw--armed');
  const howObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      howSection.classList.add('is-in');
      howObserver.disconnect();
    }
  }, { threshold: .3 });
  howObserver.observe(howSection);
}

/* ----- Start ----- */
applyLang(CONFIG.defaultLang);
