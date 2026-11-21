// ── Language switcher ──
const LANGS = ['en','fr','ar'];
function setLang(l) {
  document.documentElement.lang = l;
  document.body.setAttribute('data-lang', l);
  document.querySelectorAll('.lb').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
  localStorage.setItem('eylea-lang', l);
  if (l === 'ar') document.body.style.direction = 'rtl';
  else document.body.style.direction = 'ltr';
}
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('eylea-lang') || 'en';
  setLang(saved);
  document.querySelectorAll('.lb').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

  // Mobile nav
  const toggle = document.querySelector('.nav-mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) toggle.addEventListener('click', () => navLinks.classList.toggle('open'));

  // Active nav link
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
  });
});

// ── Ticker ──
const TICKER_PAIRS = [
  ['USD/CAD','1.3575',true],['EUR/USD','1.0832',true],['GBP/USD','1.2710',false],
  ['USD/AED','3.6725',false],['USD/MAD','10.012',true],['USD/PKR','278.40',false],
  ['EUR/CAD','1.4702',true],['GBP/CAD','1.7280',true],['USD/SAR','3.7501',false],
  ['USD/DZD','135.12',true],['USD/INR','83.24',false],['CAD/EUR','0.6820',false],
  ['USD/TND','3.1240',false],['USD/CNY','7.2640',true],['USD/JPY','149.80',true]
];
function buildTicker() {
  const el = document.getElementById('ticker-track');
  if (!el) return;
  const items = [...TICKER_PAIRS,...TICKER_PAIRS]
    .map(([p,v,u]) => `<span class="t-item"><span class="t-pair">${p}</span><span class="${u?'t-up':'t-down'}">${u?'▲':'▼'} ${v}</span></span>`)
    .join('');
  el.innerHTML = items;
}

// ── Currency Converter ──
const RATES = {
  CAD:{USD:0.7365,EUR:0.6820,GBP:0.5830,AED:2.7043,SAR:2.7619,MAD:7.3420,
    DZD:99.42,TND:2.2710,PKR:204.80,INR:61.25,CNY:5.3420,JPY:109.32,
    CHF:0.6720,BRL:3.6810,MXN:12.650,TRY:23.85,NGN:1105.4,EGP:36.20,CAD:1}
};
const FLAGS = {USD:'🇺🇸',CAD:'🇨🇦',EUR:'🇪🇺',GBP:'🇬🇧',AED:'🇦🇪',SAR:'🇸🇦',
  MAD:'🇲🇦',DZD:'🇩🇿',TND:'🇹🇳',PKR:'🇵🇰',INR:'🇮🇳',CNY:'🇨🇳',JPY:'🇯🇵',
  CHF:'🇨🇭',BRL:'🇧🇷',MXN:'🇲🇽',TRY:'🇹🇷',NGN:'🇳🇬',EGP:'🇪🇬'};

function getRate(f, t) {
  if (f === t) return 1;
  if (RATES[f] && RATES[f][t]) return RATES[f][t];
  if (RATES[t] && RATES[t][f]) return 1 / RATES[t][f];
  if (RATES.CAD[t] && RATES.CAD[f]) return RATES.CAD[t] / RATES.CAD[f];
  return 1;
}
function populateSelect(el, val) {
  el.innerHTML = Object.keys(FLAGS).map(c =>
    `<option value="${c}"${c===val?' selected':''}>${FLAGS[c]} ${c}</option>`
  ).join('');
}
function doConvert() {
  const fc = document.getElementById('from-cur');
  const tc = document.getElementById('to-cur');
  const fa = document.getElementById('from-amt');
  const ta = document.getElementById('to-amt');
  const crA = document.getElementById('cr-amount');
  const crN = document.getElementById('cr-note');
  if (!fc||!tc||!fa) return;
  const f = fc.value, t = tc.value;
  const amt = parseFloat(fa.value) || 0;
  const rate = getRate(f, t);
  const result = (amt * rate).toFixed(2);
  if (ta) ta.value = result;
  if (crA) crA.textContent = parseFloat(result).toLocaleString('en',{minimumFractionDigits:2,maximumFractionDigits:2}) + ' ' + t;
  if (crN) crN.textContent = `1 ${f} = ${rate.toFixed(4)} ${t}`;
}
function swapCurrencies() {
  const fc = document.getElementById('from-cur');
  const tc = document.getElementById('to-cur');
  if (!fc||!tc) return;
  [fc.value, tc.value] = [tc.value, fc.value];
  doConvert();
}
function initConverter() {
  const fc = document.getElementById('from-cur');
  const tc = document.getElementById('to-cur');
  if (!fc || !tc) return;
  populateSelect(fc, 'CAD');
  populateSelect(tc, 'USD');
  fc.addEventListener('change', doConvert);
  tc.addEventListener('change', doConvert);
  document.getElementById('from-amt')?.addEventListener('input', doConvert);
  document.querySelector('.swap-btn')?.addEventListener('click', swapCurrencies);
  doConvert();
}

// ── Contact Form ──
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.textContent = '✓ Message sent!';
    btn.style.background = '#2e7d32';
    setTimeout(() => { btn.textContent = 'Send message'; btn.style.background = ''; form.reset(); }, 3500);
  });
}

// ── Rates Table Search ──
function initRateSearch() {
  const inp = document.getElementById('rate-search');
  if (!inp) return;
  inp.addEventListener('input', () => {
    const q = inp.value.toLowerCase();
    document.querySelectorAll('.rates-table tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  buildTicker();
  initConverter();
  initContactForm();
  initRateSearch();
});
