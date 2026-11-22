// =====================================================================
//  CasaMea – aplicație gratuită de design interior (MVP)
//  Totul rulează în browser: nu ai nevoie de server, cont sau plată.
//  Proiectul se salvează automat în browserul vizitatorului (localStorage).
// =====================================================================

const $ = (s) => document.querySelector(s);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);

// Face o culoare mai închisă (amt < 0) sau mai deschisă (amt > 0)
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => clamp(v + amt, 0, 255);
  return '#' + ((1 << 24) + (c(n >> 16) << 16) + (c((n >> 8) & 255) << 8) + c(n & 255)).toString(16).slice(1);
}

// ---------------------------------------------------------------------
// 1. CATALOGUL DE MOBILIER
//    vb   = dimensiunea desenului 2D (lățime, înălțime)
//    w2d  = lățimea implicită pe poză, în % din lățimea pozei
//    svg  = desenul 2D (vedere din față), colorat cu culoarea aleasă
//    Ca să adaugi o piesă nouă: copiază un bloc și modifică-l.
// ---------------------------------------------------------------------
const DARK = '#3b2f2a';
const CATALOG = {
  canapea: { name: 'Sofa', color: '#5b7c99', vb: [200, 110], w2d: 34, svg: (c) => `
    <rect x="0" y="38" width="30" height="56" rx="10" fill="${shade(c, -25)}"/>
    <rect x="170" y="38" width="30" height="56" rx="10" fill="${shade(c, -25)}"/>
    <rect x="18" y="8" width="164" height="52" rx="14" fill="${c}"/>
    <rect x="22" y="56" width="156" height="36" rx="8" fill="${shade(c, 18)}"/>
    <rect x="22" y="92" width="8" height="16" fill="${DARK}"/><rect x="170" y="92" width="8" height="16" fill="${DARK}"/>` },
  fotoliu: { name: 'Armchair', color: '#c08a5b', vb: [120, 110], w2d: 16, svg: (c) => `
    <rect x="0" y="38" width="26" height="56" rx="10" fill="${shade(c, -25)}"/>
    <rect x="94" y="38" width="26" height="56" rx="10" fill="${shade(c, -25)}"/>
    <rect x="12" y="6" width="96" height="54" rx="14" fill="${c}"/>
    <rect x="18" y="56" width="84" height="36" rx="8" fill="${shade(c, 18)}"/>
    <rect x="18" y="92" width="7" height="16" fill="${DARK}"/><rect x="95" y="92" width="7" height="16" fill="${DARK}"/>` },
  masa: { name: 'Table', color: '#8a6142', vb: [200, 100], w2d: 26, svg: (c) => `
    <rect x="34" y="22" width="7" height="66" fill="${shade(c, -45)}"/><rect x="159" y="22" width="7" height="66" fill="${shade(c, -45)}"/>
    <rect x="0" y="10" width="200" height="13" rx="3" fill="${c}"/>
    <rect x="10" y="23" width="180" height="8" fill="${shade(c, -20)}"/>
    <rect x="12" y="23" width="10" height="76" fill="${shade(c, -30)}"/><rect x="178" y="23" width="10" height="76" fill="${shade(c, -30)}"/>` },
  scaun: { name: 'Chair', color: '#8a6142', vb: [80, 140], w2d: 7, svg: (c) => `
    <rect x="12" y="0" width="56" height="60" rx="6" fill="${c}"/>
    <rect x="16" y="60" width="6" height="16" fill="${shade(c, -30)}"/><rect x="58" y="60" width="6" height="16" fill="${shade(c, -30)}"/>
    <rect x="4" y="74" width="72" height="12" rx="3" fill="${shade(c, 15)}"/>
    <rect x="8" y="86" width="7" height="54" fill="${shade(c, -30)}"/><rect x="65" y="86" width="7" height="54" fill="${shade(c, -30)}"/>` },
  pat: { name: 'Bed', color: '#7b8f6a', vb: [220, 120], w2d: 38, svg: (c) => `
    <rect x="10" y="0" width="200" height="64" rx="8" fill="${shade(c, -30)}"/>
    <rect x="6" y="44" width="208" height="40" rx="6" fill="#f3efe8"/>
    <ellipse cx="62" cy="50" rx="34" ry="10" fill="#ffffff"/><ellipse cx="158" cy="50" rx="34" ry="10" fill="#ffffff"/>
    <rect x="6" y="62" width="208" height="34" rx="6" fill="${c}"/>
    <rect x="6" y="94" width="208" height="16" rx="3" fill="${shade(c, -45)}"/>
    <rect x="12" y="110" width="8" height="10" fill="${DARK}"/><rect x="200" y="110" width="8" height="10" fill="${DARK}"/>` },
  dulap: { name: 'Wardrobe', color: '#d9cbb5', vb: [120, 200], w2d: 16, svg: (c) => `
    <rect x="0" y="0" width="120" height="192" rx="3" fill="${shade(c, -20)}"/>
    <rect x="6" y="6" width="52" height="180" rx="2" fill="${c}"/><rect x="62" y="6" width="52" height="180" rx="2" fill="${c}"/>
    <rect x="50" y="80" width="4" height="30" rx="2" fill="#8d8d8d"/><rect x="66" y="80" width="4" height="30" rx="2" fill="#8d8d8d"/>
    <rect x="6" y="192" width="10" height="8" fill="${DARK}"/><rect x="104" y="192" width="10" height="8" fill="${DARK}"/>` },
  planta: { name: 'Plant', color: '#c9b8a6', vb: [100, 160], w2d: 8, svg: (c) => `
    <ellipse cx="50" cy="55" rx="22" ry="50" fill="#4f7d3a"/>
    <ellipse cx="28" cy="70" rx="16" ry="40" fill="#5f9145" transform="rotate(-25 28 70)"/>
    <ellipse cx="72" cy="70" rx="16" ry="40" fill="#5f9145" transform="rotate(25 72 70)"/>
    <path d="M24 108 L76 108 L68 158 L32 158 Z" fill="${c}"/>
    <rect x="20" y="104" width="60" height="8" rx="2" fill="${shade(c, -20)}"/>` },
  lampa: { name: 'Floor lamp', color: '#e8d9b0', vb: [80, 200], w2d: 6, svg: (c) => `
    <rect x="38" y="58" width="4" height="132" fill="#444"/>
    <ellipse cx="40" cy="193" rx="22" ry="6" fill="#333"/>
    <path d="M20 8 L60 8 L74 62 L6 62 Z" fill="${c}"/>` },
  covor: { name: 'Rug', color: '#b5643c', vb: [240, 70], w2d: 36, svg: (c) => `
    <ellipse cx="120" cy="35" rx="118" ry="33" fill="${c}"/>
    <ellipse cx="120" cy="35" rx="100" ry="25" fill="none" stroke="${shade(c, 40)}" stroke-width="4"/>` },
  tv: { name: 'TV stand', color: '#f0ebe3', vb: [200, 160], w2d: 26, svg: (c) => `
    <rect x="30" y="0" width="140" height="82" rx="4" fill="#1d1f24"/>
    <rect x="36" y="6" width="128" height="70" fill="#34495e"/>
    <rect x="94" y="82" width="12" height="10" fill="#1d1f24"/>
    <rect x="0" y="92" width="200" height="58" rx="4" fill="${c}"/>
    <line x1="67" y1="98" x2="67" y2="144" stroke="${shade(c, -35)}" stroke-width="2"/>
    <line x1="133" y1="98" x2="133" y2="144" stroke="${shade(c, -35)}" stroke-width="2"/>
    <rect x="8" y="150" width="8" height="10" fill="${DARK}"/><rect x="184" y="150" width="8" height="10" fill="${DARK}"/>` },
};

// Dimensiunile reale (lățime × adâncime, în metri) și desenul văzut de sus, pentru plan.
// Spătarul / tăblia sunt mereu sus, ca în modul 3D.
const TOP = {
  canapea: { size: [2.1, 0.9], svg: (c) => `
    <rect width="210" height="90" rx="8" fill="${shade(c, -25)}"/>
    <rect x="18" y="20" width="86" height="66" rx="5" fill="${shade(c, 18)}"/><rect x="106" y="20" width="86" height="66" rx="5" fill="${shade(c, 18)}"/>` },
  fotoliu: { size: [0.85, 0.85], svg: (c) => `
    <rect width="85" height="85" rx="10" fill="${shade(c, -25)}"/>
    <rect x="17" y="18" width="51" height="63" rx="5" fill="${shade(c, 18)}"/>` },
  masa: { size: [1.6, 0.9], svg: (c) => `
    <rect width="160" height="90" rx="4" fill="${c}"/><rect x="6" y="6" width="148" height="78" rx="3" fill="none" stroke="${shade(c, 30)}" stroke-width="2"/>` },
  scaun: { size: [0.45, 0.45], svg: (c) => `
    <rect y="4" width="45" height="41" rx="5" fill="${shade(c, 15)}"/><rect width="45" height="7" rx="2" fill="${c}"/>` },
  pat: { size: [1.6, 2.0], svg: (c) => `
    <rect width="160" height="200" rx="4" fill="${shade(c, -30)}"/><rect x="4" y="8" width="152" height="188" rx="4" fill="#f3efe8"/>
    <rect x="14" y="16" width="58" height="30" rx="8" fill="#fff" stroke="#ddd"/><rect x="88" y="16" width="58" height="30" rx="8" fill="#fff" stroke="#ddd"/>
    <rect x="4" y="70" width="152" height="126" rx="4" fill="${c}"/>` },
  dulap: { size: [1.2, 0.6], svg: (c) => `
    <rect width="120" height="60" fill="${c}" stroke="${shade(c, -40)}" stroke-width="3"/><line x1="60" y1="0" x2="60" y2="60" stroke="${shade(c, -40)}" stroke-width="2"/>` },
  planta: { size: [0.6, 0.6], svg: () => `
    <circle cx="30" cy="30" r="29" fill="#4f7d3a"/><circle cx="22" cy="24" r="12" fill="#5f9145"/><circle cx="38" cy="36" r="10" fill="#5f9145"/>` },
  lampa: { size: [0.5, 0.5], svg: (c) => `
    <circle cx="25" cy="25" r="24" fill="${c}" stroke="${shade(c, -40)}" stroke-width="2"/><circle cx="25" cy="25" r="5" fill="#444"/>` },
  covor: { size: [2.0, 1.4], svg: (c) => `
    <rect width="200" height="140" rx="8" fill="${c}" opacity=".85"/><rect x="12" y="12" width="176" height="116" rx="6" fill="none" stroke="${shade(c, 40)}" stroke-width="4"/>` },
  tv: { size: [1.6, 0.4], svg: (c) => `
    <rect width="160" height="40" rx="3" fill="${c}" stroke="${shade(c, -40)}" stroke-width="2"/><rect x="25" y="8" width="110" height="6" fill="#1d1f24"/>` },
};

function topURL(type, color) {
  const [w, d] = TOP[type].size;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w * 100} ${d * 100}">${TOP[type].svg(color)}</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function svgURL(type, color) {
  const d = CATALOG[type];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${d.vb[0]} ${d.vb[1]}">${d.svg(color)}</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function loadImg(src) {
  return new Promise((ok, fail) => {
    const im = new Image();
    im.onload = () => ok(im);
    im.onerror = fail;
    im.src = src;
  });
}

// Mesaje scurte în partea de jos a ecranului
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 2600);
}

// Salvare sigură în browser (unele browsere o blochează)
function store(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
function recall(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}

let mode = 'plan';

// =====================================================================
// 2. MODUL „PE POZA TA” (2D)
// =====================================================================
const stage = $('#stage');
const S2 = { photo: null, isDemo: true, items: [], sel: null };

// Desenează o cameră demonstrativă, ca aplicația să meargă și fără poză
function demoRoom() {
  const cv = document.createElement('canvas');
  cv.width = 1600; cv.height = 1000;
  const g = cv.getContext('2d');
  const wall = g.createLinearGradient(0, 0, 0, 640);
  wall.addColorStop(0, '#efeae2'); wall.addColorStop(1, '#e2dacd');
  g.fillStyle = wall; g.fillRect(0, 0, 1600, 640);
  g.fillStyle = '#d8cdbd'; g.fillRect(0, 620, 1600, 20);          // plintă
  g.fillStyle = '#c9a27e'; g.fillRect(0, 640, 1600, 360);         // podea
  g.strokeStyle = 'rgba(90,60,40,.18)'; g.lineWidth = 3;
  for (let x = -800; x < 2400; x += 140) {                         // parchet în perspectivă
    g.beginPath(); g.moveTo(800 + (x - 800) * 0.55, 640); g.lineTo(x, 1000); g.stroke();
  }
  g.fillStyle = '#cfe3ee'; g.fillRect(1020, 120, 340, 380);        // fereastră
  g.strokeStyle = '#ffffff'; g.lineWidth = 16; g.strokeRect(1020, 120, 340, 380);
  g.beginPath(); g.moveTo(1190, 120); g.lineTo(1190, 500); g.stroke();
  return cv.toDataURL('image/jpeg', 0.85);
}

async function setPhoto(url, isDemo) {
  S2.photo = url;
  S2.isDemo = isDemo;
  const im = await loadImg(url);
  stage.style.setProperty('--ratio', (im.naturalWidth / im.naturalHeight).toFixed(4));
  stage.style.backgroundImage = `url(${url})`;
  $('#demoHint').hidden = !isDemo;
}

function save2D() {
  const ok = store('casamea-2d', {
    photo: S2.isDemo ? null : S2.photo,
    items: S2.items,
  });
  if (!ok) toast('This photo is too large to save automatically. Your furniture will stay only until you close the page.');
}

function styleItem(el, it) {
  el.style.left = it.x + '%';
  el.style.top = it.y + '%';
  el.style.width = it.w + '%';
  el.style.transform = `translate(-50%, -50%) rotate(${it.rot}deg)`;
}

function render2D() {
  stage.querySelectorAll('.item').forEach((e) => e.remove());
  for (const it of S2.items) {
    const d = CATALOG[it.type];
    const el = document.createElement('div');
    el.className = 'item';
    el._item = it;
    el.style.aspectRatio = `${d.vb[0]} / ${d.vb[1]}`;
    el.innerHTML = `<img src="${svgURL(it.type, it.color)}" alt="${d.name}" draggable="false"
      style="transform:scaleX(${it.flip ? -1 : 1})"><span class="h-resize"></span><span class="h-rotate"></span>`;
    styleItem(el, it);
    el.addEventListener('pointerdown', (e) => startDrag2D(e, it, el));
    stage.appendChild(el);
  }
  markSelected2D();
}

function markSelected2D() {
  stage.querySelectorAll('.item').forEach((el) => el.classList.toggle('selected', el._item === S2.sel));
  updateControls();
}

function startDrag2D(e, it, el) {
  e.stopPropagation();
  e.preventDefault();
  S2.sel = it;
  markSelected2D();
  const r = stage.getBoundingClientRect();
  const cls = e.target.classList;
  const action = cls.contains('h-resize') ? 'resize' : cls.contains('h-rotate') ? 'rotate' : 'move';
  const start = { x: e.clientX, y: e.clientY, ix: it.x, iy: it.y, iw: it.w };
  const cx = r.left + (it.x / 100) * r.width;
  const cy = r.top + (it.y / 100) * r.height;
  el.setPointerCapture(e.pointerId);

  const move = (ev) => {
    if (action === 'move') {
      it.x = clamp(start.ix + ((ev.clientX - start.x) / r.width) * 100, 0, 100);
      it.y = clamp(start.iy + ((ev.clientY - start.y) / r.height) * 100, 0, 100);
    } else if (action === 'resize') {
      const d0 = Math.hypot(start.x - cx, start.y - cy) || 1;
      const d1 = Math.hypot(ev.clientX - cx, ev.clientY - cy);
      it.w = clamp(start.iw * (d1 / d0), 3, 150);
    } else {
      let deg = Math.round((Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180) / Math.PI + 90);
      if (Math.abs(deg % 90) < 5) deg = Math.round(deg / 90) * 90; // se „lipește” de 0/90/180°
      it.rot = deg;
    }
    styleItem(el, it);
  };
  const up = () => {
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerup', up);
    el.removeEventListener('pointercancel', up);
    save2D();
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
}

stage.addEventListener('pointerdown', (e) => {
  if (e.target === stage) { S2.sel = null; markSelected2D(); }
});

function add2D(type) {
  const d = CATALOG[type];
  const it = { type, color: d.color, x: clamp(50 + rand(-8, 8), 5, 95), y: 68, w: d.w2d, rot: 0, flip: false };
  S2.items.push(it);
  S2.sel = it;
  render2D();
  save2D();
}

function delete2D() {
  if (!S2.sel) return;
  S2.items = S2.items.filter((i) => i !== S2.sel);
  S2.sel = null;
  render2D();
  save2D();
}

// Încărcarea pozei: o micșorăm la max. 1600 px ca să meargă și pe calculatoare slabe
$('#photoInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  const url = URL.createObjectURL(file);
  try {
    const im = await loadImg(url);
    const k = Math.min(1, 1600 / Math.max(im.naturalWidth, im.naturalHeight));
    const cv = document.createElement('canvas');
    cv.width = Math.round(im.naturalWidth * k);
    cv.height = Math.round(im.naturalHeight * k);
    cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
    await setPhoto(cv.toDataURL('image/jpeg', 0.85), false);
    save2D();
    toast('Photo uploaded. Now add furniture from the left.');
  } catch {
    toast("Couldn't read the photo. Try a JPG or PNG file.");
  } finally {
    URL.revokeObjectURL(url);
  }
});

$('#btnDelete2d').onclick = delete2D;
$('#btnFlip2d').onclick = () => { if (S2.sel) { S2.sel.flip = !S2.sel.flip; render2D(); save2D(); } };
$('#btnFront2d').onclick = () => {
  if (!S2.sel) return;
  S2.items = S2.items.filter((i) => i !== S2.sel).concat(S2.sel);
  render2D(); save2D();
};

// Exportă poza cu mobilierul la rezoluția originală
$('#btnExport2d').onclick = async () => {
  const bg = await loadImg(S2.photo);
  const W = bg.naturalWidth, H = bg.naturalHeight;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  g.drawImage(bg, 0, 0, W, H);
  for (const it of S2.items) {
    const d = CATALOG[it.type];
    const im = await loadImg(svgURL(it.type, it.color));
    const w = (it.w / 100) * W;
    const h = (w * d.vb[1]) / d.vb[0];
    g.save();
    g.translate((it.x / 100) * W, (it.y / 100) * H);
    g.rotate((it.rot * Math.PI) / 180);
    g.scale(it.flip ? -1 : 1, 1);
    g.shadowColor = 'rgba(0,0,0,.25)'; g.shadowBlur = w * 0.04; g.shadowOffsetY = w * 0.03;
    g.drawImage(im, -w / 2, -h / 2, w, h);
    g.restore();
  }
  showModal(cv.toDataURL('image/jpeg', 0.9));
};

// =====================================================================
// 3. MODUL „PLANUL CASEI” (vedere de sus, la scară reală)
//    Pozițiile sunt păstrate ca fracții din plan (u, v între 0 și 1),
//    iar mărimile mobilei în metri. Așa, dacă refaci scara, nimic nu „fuge”.
// =====================================================================
const PDFJS = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/';
const planStage = $('#planStage');
const planSvg = $('#planSvg');
const P = {
  img: null, natW: 0, natH: 0, mpp: null,   // mpp = metri per pixel din plan
  isDemo: true, walls: [], items: [], sel: null,
  tool: 'select', calib: [], chain: null, hover: null,
};
const planW = () => P.natW * P.mpp;  // lățimea planului, în metri
const planH = () => P.natH * P.mpp;

// Un plan demonstrativ (12 × 8 m), ca aplicația să poată fi încercată imediat
function demoPlan() {
  const cv = document.createElement('canvas');
  cv.width = 1200; cv.height = 800;               // 1 pixel = 1 cm
  const g = cv.getContext('2d');
  g.fillStyle = '#fff'; g.fillRect(0, 0, 1200, 800);
  g.strokeStyle = '#2b2622'; g.lineWidth = 14; g.lineCap = 'square';
  const line = (a, b, c, d) => { g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke(); };
  g.strokeRect(40, 40, 1120, 720);
  line(620, 40, 620, 380); line(620, 470, 620, 760);
  line(620, 420, 800, 420); line(890, 420, 1160, 420);
  g.lineWidth = 2; g.strokeStyle = '#999';
  g.beginPath(); g.arc(620, 380, 90, 0, Math.PI / 2); g.stroke();
  g.beginPath(); g.arc(800, 420, 90, -Math.PI / 2, 0); g.stroke();
  g.fillStyle = '#7a7068'; g.font = '600 28px system-ui, sans-serif'; g.textAlign = 'center';
  g.fillText('LIVING ROOM', 330, 300); g.fillText('BEDROOM', 890, 230); g.fillText('KITCHEN', 890, 600);
  g.font = '22px system-ui, sans-serif';
  line(47, 20, 1153, 20);
  g.fillText('11.20 m', 600, 16);
  return cv.toDataURL('image/png');
}
const DEMO_WALLS = [
  [40, 40, 1160, 40], [1160, 40, 1160, 760], [1160, 760, 40, 760], [40, 760, 40, 40],
  [620, 40, 620, 380], [620, 470, 620, 760], [620, 420, 800, 420], [890, 420, 1160, 420],
].map(([a, b, c, d]) => [a / 1200, b / 800, c / 1200, d / 800]);
const DEMO_ITEMS = [
  { type: 'canapea', color: '#5b7c99', u: 330 / 1200, v: 690 / 800, rot: Math.PI },
  { type: 'covor', color: '#b5643c', u: 330 / 1200, v: 540 / 800, rot: 0 },
  { type: 'tv', color: '#f0ebe3', u: 330 / 1200, v: 70 / 800, rot: 0 },
  { type: 'pat', color: '#7b8f6a', u: 890 / 1200, v: 150 / 800, rot: 0 },
  { type: 'masa', color: '#8a6142', u: 890 / 1200, v: 600 / 800, rot: 0 },
];

async function setPlanImage(url, natW, natH) {
  P.img = url; P.natW = natW; P.natH = natH;
  planStage.style.setProperty('--ratio', (natW / natH).toFixed(4));
  planStage.style.backgroundImage = `url(${url})`;
}

function savePlan() {
  const ok = store('casamea-plan', {
    img: P.isDemo ? null : P.img, natW: P.natW, natH: P.natH, mpp: P.mpp,
    walls: P.walls, items: P.items, isDemo: P.isDemo,
  });
  if (!ok) toast('This plan is too large to save automatically. Your work will stay only until you close the page.');
}

// Transformă un fișier (imagine sau PDF) într-o imagine de max. 2000 px
async function planFileToImage(file) {
  let source;
  if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
    const pdfjs = await import(PDFJS + 'pdf.min.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.mjs';
    const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    const page = await doc.getPage(1);                       // prima pagină din PDF
    const base = page.getViewport({ scale: 1 });
    const vp = page.getViewport({ scale: 2000 / Math.max(base.width, base.height) });
    source = document.createElement('canvas');
    source.width = Math.round(vp.width); source.height = Math.round(vp.height);
    const ctx = source.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, source.width, source.height);
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
  } else {
    const url = URL.createObjectURL(file);
    try { source = await loadImg(url); } finally { URL.revokeObjectURL(url); }
  }
  const sw = source.naturalWidth || source.width, sh = source.naturalHeight || source.height;
  const k = Math.min(1, 2000 / Math.max(sw, sh));
  const cv = document.createElement('canvas');
  cv.width = Math.round(sw * k); cv.height = Math.round(sh * k);
  const g = cv.getContext('2d');
  g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height);
  g.drawImage(source, 0, 0, cv.width, cv.height);
  return { url: cv.toDataURL('image/jpeg', 0.9), w: cv.width, h: cv.height };
}

$('#planInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  toast('Loading the floor plan…');
  try {
    const im = await planFileToImage(file);
    await setPlanImage(im.url, im.w, im.h);
    Object.assign(P, { mpp: null, isDemo: false, walls: [], items: [], sel: null, chain: null, calib: [] });
    setTool('scale');
    renderPlan();
    savePlan();
    toast('Floor plan loaded. Now set the scale.');
  } catch (err) {
    console.error(err);
    toast("Couldn't read the file. Try JPG, PNG or PDF.");
  }
});

// ---- Instrumente: selectare, scară, pereți ----
function setTool(t) {
  P.tool = P.tool === t && t !== 'select' ? 'select' : t;  // al doilea click oprește instrumentul
  P.calib = []; P.chain = null; P.hover = null;
  $('#scaleForm').hidden = true;
  $('#toolScale').classList.toggle('active', P.tool === 'scale');
  $('#toolWall').classList.toggle('active', P.tool === 'wall');
  planStage.classList.toggle('drawing', P.tool !== 'select');
  if (P.tool !== 'select') { P.sel = null; markPlanSel(); }
  renderWalls();
  updatePlanHint();
}
$('#toolScale').onclick = () => setTool('scale');
$('#toolWall').onclick = () => {
  if (!P.mpp) { toast('Set the scale first.'); setTool('scale'); return; }
  setTool('wall');
};

function updatePlanHint() {
  let h;
  if (P.tool === 'scale') {
    h = P.calib.length === 0 ? '📏 Click one end of a wall (or dimension line) whose length you know.'
      : P.calib.length === 1 ? '📏 Now click the other end.'
      : '📏 Type the real length and press OK.';
  } else if (P.tool === 'wall') {
    h = '✏️ Click at every corner. Nearly straight lines straighten themselves. Double-click or Esc = done.';
  } else if (!P.mpp) {
    h = 'Step 1: press “📏 Set scale” so furniture appears at its real size.';
  } else if (P.isDemo) {
    h = 'Sample floor plan (scale already set). Upload your own plan or add furniture from the left.';
  } else if (!P.walls.length) {
    h = 'Step 2 (optional): “✏️ Draw walls” so the walls appear in 3D. Then add furniture from the left.';
  } else {
    h = 'Add furniture from the left. Every piece is shown at its real size.';
  }
  $('#planHint').textContent = h;
  $('#scaleInfo').textContent = P.mpp ? `Plan size ≈ ${planW().toFixed(1)} × ${planH().toFixed(1)} m` : 'Scale not set';
}

function planPoint(e) {
  const r = planStage.getBoundingClientRect();
  return { u: clamp((e.clientX - r.left) / r.width, 0, 1), v: clamp((e.clientY - r.top) / r.height, 0, 1) };
}

// Îndreaptă peretele (orizontal/vertical) și îl lipește de capetele existente
function snapWall(p) {
  let { u, v } = p;
  const ends = P.walls.flatMap((w) => [[w[0], w[1]], [w[2], w[3]]]);
  const near = ends.find(([a, b]) => Math.hypot((a - u) * P.natW, (b - v) * P.natH) < P.natW * 0.012);
  if (near) return { u: near[0], v: near[1] };
  if (P.chain) {
    const dx = (u - P.chain[0]) * P.natW, dy = (v - P.chain[1]) * P.natH;
    const ang = Math.abs((Math.atan2(dy, dx) * 180) / Math.PI);
    if (ang < 8 || ang > 172) v = P.chain[1];
    else if (Math.abs(ang - 90) < 8) u = P.chain[0];
  }
  return { u, v };
}

function renderWalls() {
  const ns = (u, v) => `${u * 100},${v * 100}`;
  let s = P.walls.map((w) =>
    `<line x1="${w[0] * 100}" y1="${w[1] * 100}" x2="${w[2] * 100}" y2="${w[3] * 100}" stroke="#b5643c" stroke-width="6" stroke-linecap="round" opacity=".75" vector-effect="non-scaling-stroke"/>`).join('');
  if (P.chain && P.hover) {
    s += `<polyline points="${ns(P.chain[0], P.chain[1])} ${ns(P.hover.u, P.hover.v)}" stroke="#b5643c" stroke-width="3" stroke-dasharray="6 4" fill="none" vector-effect="non-scaling-stroke"/>`;
  }
  const pts = [...P.calib];
  if (P.tool === 'scale' && P.calib.length === 1 && P.hover) pts.push(P.hover);
  if (pts.length === 2) {
    s += `<line x1="${pts[0].u * 100}" y1="${pts[0].v * 100}" x2="${pts[1].u * 100}" y2="${pts[1].v * 100}" stroke="#1f6feb" stroke-width="3" vector-effect="non-scaling-stroke"/>`;
  }
  planSvg.innerHTML = s;
  // punctele de calibrare: cercuri desenate ca elemente HTML, ca să rămână rotunde
  planStage.querySelectorAll('.cal-dot').forEach((d) => d.remove());
  for (const p of P.calib) {
    const d = document.createElement('div');
    d.className = 'cal-dot';
    d.style.cssText = `position:absolute;left:${p.u * 100}%;top:${p.v * 100}%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:#1f6feb;border:2px solid #fff;pointer-events:none`;
    planStage.appendChild(d);
  }
}

planStage.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.pitem') && P.tool === 'select') return;
  const p = planPoint(e);
  if (P.tool === 'scale') {
    if (P.calib.length >= 2) P.calib = [];
    P.calib.push(p);
    if (P.calib.length === 2) {
      $('#scaleForm').hidden = false;
      setTimeout(() => $('#scaleLen').focus(), 0);
    }
    renderWalls(); updatePlanHint();
  } else if (P.tool === 'wall') {
    const q = snapWall(p);
    if (P.chain) {
      const len = Math.hypot((q.u - P.chain[0]) * P.natW, (q.v - P.chain[1]) * P.natH);
      if (len > 4) { P.walls.push([P.chain[0], P.chain[1], q.u, q.v]); savePlan(); }
    }
    P.chain = [q.u, q.v];
    renderWalls();
  } else {
    P.sel = null; markPlanSel();
  }
});
planStage.addEventListener('pointermove', (e) => {
  if (P.tool === 'wall' && P.chain) { P.hover = snapWall(planPoint(e)); renderWalls(); }
  if (P.tool === 'scale' && P.calib.length === 1) { P.hover = planPoint(e); renderWalls(); }
});
planStage.addEventListener('dblclick', () => { if (P.tool === 'wall') { P.chain = null; P.hover = null; renderWalls(); } });

function applyScale() {
  const len = parseFloat(String($('#scaleLen').value).replace(',', '.'));
  if (!(len > 0) || P.calib.length < 2) { toast('Enter a length in metres, for example 4.20'); return; }
  const [a, b] = P.calib;
  const px = Math.hypot((b.u - a.u) * P.natW, (b.v - a.v) * P.natH);
  if (px < 5) { toast('The points are too close together. Pick a longer wall.'); return; }
  P.mpp = len / px;
  P.isDemo = false;
  $('#scaleLen').value = '';
  setTool('select');
  renderPlan();
  savePlan();
  toast(`Done! The plan is ≈ ${planW().toFixed(1)} × ${planH().toFixed(1)} m.`);
}
$('#scaleOk').onclick = applyScale;
$('#scaleLen').addEventListener('keydown', (e) => { if (e.key === 'Enter') applyScale(); });
$('#scaleCancel').onclick = () => setTool('select');
$('#btnUndoWall').onclick = () => {
  if (!P.walls.length) return;
  P.walls.pop(); P.chain = null; renderWalls(); savePlan(); updatePlanHint();
};

// ---- Mobilierul pe plan ----
function stylePItem(el, it) {
  el.style.left = it.u * 100 + '%';
  el.style.top = it.v * 100 + '%';
  el.style.width = (TOP[it.type].size[0] / planW()) * 100 + '%';
  el.style.transform = `translate(-50%, -50%) rotate(${-it.rot}rad)`;
}

function renderPlan() {
  planStage.querySelectorAll('.pitem').forEach((e) => e.remove());
  if (P.mpp) {
    for (const it of P.items) {
      const [w, d] = TOP[it.type].size;
      const el = document.createElement('div');
      el.className = 'pitem';
      el._item = it;
      el.style.aspectRatio = `${w} / ${d}`;
      el.title = `${CATALOG[it.type].name} – ${w} × ${d} m`;
      el.innerHTML = `<img src="${topURL(it.type, it.color)}" alt="" draggable="false"><span class="h-rotate"></span>`;
      stylePItem(el, it);
      el.addEventListener('pointerdown', (e) => dragPlan(e, it, el));
      planStage.appendChild(el);
    }
  }
  renderWalls();
  markPlanSel();
  updatePlanHint();
}

function markPlanSel() {
  planStage.querySelectorAll('.pitem').forEach((el) => el.classList.toggle('selected', el._item === P.sel));
  updateControls();
}

function dragPlan(e, it, el) {
  if (P.tool !== 'select') return;
  e.stopPropagation();
  e.preventDefault();
  P.sel = it;
  markPlanSel();
  const r = planStage.getBoundingClientRect();
  const rotating = e.target.classList.contains('h-rotate');
  const start = { x: e.clientX, y: e.clientY, u: it.u, v: it.v };
  const cx = r.left + it.u * r.width, cy = r.top + it.v * r.height;
  el.setPointerCapture(e.pointerId);
  const move = (ev) => {
    if (rotating) {
      const deg = (Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180) / Math.PI + 90;
      it.rot = -(Math.round(deg / 15) * 15 * Math.PI) / 180;   // pași de 15°
    } else {
      it.u = clamp(start.u + (ev.clientX - start.x) / r.width, 0, 1);
      it.v = clamp(start.v + (ev.clientY - start.y) / r.height, 0, 1);
    }
    stylePItem(el, it);
  };
  const up = () => {
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerup', up);
    el.removeEventListener('pointercancel', up);
    savePlan();
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
}

function addPlan(type) {
  if (!P.mpp) { toast('Set the floor plan scale first.'); setTool('scale'); return; }
  const it = { type, color: CATALOG[type].color, u: clamp(0.5 + rand(-0.05, 0.05), 0, 1), v: clamp(0.5 + rand(-0.05, 0.05), 0, 1), rot: 0 };
  P.items.push(it);
  P.sel = it;
  renderPlan();
  savePlan();
}

function deletePlan() {
  if (!P.sel) return;
  P.items = P.items.filter((i) => i !== P.sel);
  P.sel = null;
  renderPlan();
  savePlan();
}
$('#btnDeletePlan').onclick = deletePlan;
$('#btnRotatePlan').onclick = () => {
  if (!P.sel) return;
  P.sel.rot = (P.sel.rot + Math.PI / 2) % (Math.PI * 2);
  renderPlan(); savePlan();
};
$('#btnPlan3d').onclick = () => {
  if (!P.mpp) { toast('Set the floor plan scale first.'); return; }
  S3.source = 'plan';
  $('.tab[data-mode="3d"]').click();
};

$('#btnExportPlan').onclick = async () => {
  const bg = await loadImg(P.img);
  const W = P.natW, H = P.natH;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  g.drawImage(bg, 0, 0, W, H);
  g.strokeStyle = 'rgba(181,100,60,.75)'; g.lineCap = 'round'; g.lineWidth = Math.max(3, W * 0.005);
  for (const w of P.walls) { g.beginPath(); g.moveTo(w[0] * W, w[1] * H); g.lineTo(w[2] * W, w[3] * H); g.stroke(); }
  if (P.mpp) {
    for (const it of P.items) {
      const [mw, md] = TOP[it.type].size;
      const im = await loadImg(topURL(it.type, it.color));
      const w = mw / P.mpp, h = md / P.mpp;
      g.save();
      g.translate(it.u * W, it.v * H);
      g.rotate(-it.rot);
      g.drawImage(im, -w / 2, -h / 2, w, h);
      g.restore();
    }
  }
  showModal(cv.toDataURL('image/jpeg', 0.92));
};

// =====================================================================
// 4. MODUL „VEDERE 3D” (Three.js, încărcat doar la nevoie)
//    Sursa poate fi planul casei sau o cameră simplă cu dimensiuni date.
// =====================================================================
const S3 = { ready: false, loading: null, source: 'plan', room: { w: 4, l: 5 }, items: [], sel: null, built: null };
let T, scene, camera, renderer, controls, envGroup, raycaster, pointer, floorPlane;
const spawned = new Set();

const list3D = () => (S3.source === 'plan' ? P.items : S3.items);
const bounds3D = () => (S3.source === 'plan' ? { w: planW(), l: planH() } : S3.room);
function getXZ(it) {
  return S3.source === 'plan' ? { x: (it.u - 0.5) * planW(), z: (it.v - 0.5) * planH() } : { x: it.x, z: it.z };
}
function setXZ(it, x, z) {
  const b = bounds3D();
  x = clamp(x, -b.w / 2, b.w / 2); z = clamp(z, -b.l / 2, b.l / 2);
  if (S3.source === 'plan') { it.u = x / b.w + 0.5; it.v = z / b.l + 0.5; } else { it.x = x; it.z = z; }
}
const saveActive = () => (S3.source === 'plan' ? savePlan() : save3D());

function init3D() {
  if (!S3.loading) S3.loading = setup3D();
  return S3.loading;
}

async function setup3D() {
  const box = $('#canvas3d');
  let OrbitControls;
  try {
    T = await import('three');
    ({ OrbitControls } = await import('three/addons/controls/OrbitControls.js'));
  } catch {
    box.innerHTML = '<p class="err">Couldn\'t load the 3D engine (Three.js). Check your internet connection and reload the page.</p>';
    return false;
  }
  box.innerHTML = '';
  renderer = new T.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // limitat, pentru calculatoare slabe
  box.appendChild(renderer.domElement);

  scene = new T.Scene();
  scene.background = new T.Color('#eef1f4');
  camera = new T.PerspectiveCamera(50, 1, 0.1, 200);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI / 2.05; // nu lasă camera să intre sub podea

  scene.add(new T.HemisphereLight(0xffffff, 0xb8a58f, 1.3));
  const sun = new T.DirectionalLight(0xffffff, 1.4);
  sun.position.set(3, 8, 4);
  scene.add(sun);

  raycaster = new T.Raycaster();
  pointer = new T.Vector2();
  floorPlane = new T.Plane(new T.Vector3(0, 1, 0), 0);

  const saved = recall('casamea-3d');
  if (saved) { S3.room = saved.room || S3.room; S3.items = saved.items || []; }
  $('#roomW').value = S3.room.w;
  $('#roomL').value = S3.room.l;

  new ResizeObserver(resize3D).observe(box);
  resize3D();
  // „capture: true” = noi decidem primii dacă atingerea mută mobila sau rotește camera
  box.addEventListener('pointerdown', onDown3D, true);
  renderer.setAnimationLoop(() => {
    if (mode !== '3d') return; // nu consumăm procesor când modul 3D e ascuns
    controls.update();
    renderer.render(scene, camera);
  });
  S3.ready = true;
  return true;
}

function resize3D() {
  const box = $('#canvas3d');
  const w = box.clientWidth, h = box.clientHeight;
  if (!w || !h || !renderer) return;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

// Reconstruiește scena: podeaua, pereții și mobila sursei active
function rebuild3D() {
  if (S3.source === 'plan' && !P.mpp) S3.source = 'room';
  const sameSource = S3.built === S3.source;
  spawned.forEach((g) => scene.remove(g)); // scoate toată mobila veche, inclusiv din planuri anterioare
  spawned.clear();
  if (envGroup) scene.remove(envGroup);
  envGroup = new T.Group();
  const H = $('#lowWalls').checked ? 0.9 : 2.6;
  const wallMat = new T.MeshStandardMaterial({ color: '#f2ede6', roughness: 1 });
  const { w, l } = bounds3D();

  if (S3.source === 'plan') {
    const tex = new T.TextureLoader().load(P.img);
    tex.colorSpace = T.SRGBColorSpace;
    const floor = new T.Mesh(new T.PlaneGeometry(w, l), new T.MeshStandardMaterial({ map: tex, roughness: 1 }));
    floor.rotation.x = -Math.PI / 2;
    envGroup.add(floor);
    for (const s of P.walls) {
      const x1 = (s[0] - 0.5) * w, z1 = (s[1] - 0.5) * l, x2 = (s[2] - 0.5) * w, z2 = (s[3] - 0.5) * l;
      const len = Math.hypot(x2 - x1, z2 - z1);
      const m = new T.Mesh(new T.BoxGeometry(len + 0.12, H, 0.12), wallMat);
      m.position.set((x1 + x2) / 2, H / 2, (z1 + z2) / 2);
      m.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
      envGroup.add(m);
    }
  } else {
    const floor = new T.Mesh(new T.PlaneGeometry(w, l), new T.MeshStandardMaterial({ color: '#c9a27e', roughness: 0.9 }));
    floor.rotation.x = -Math.PI / 2;
    const back = new T.Mesh(new T.BoxGeometry(w + 0.1, H, 0.1), wallMat);
    back.position.set(-0.05, H / 2, -l / 2 - 0.05);
    const left = new T.Mesh(new T.BoxGeometry(0.1, H, l), wallMat);
    left.position.set(-w / 2 - 0.05, H / 2, 0);
    envGroup.add(floor, back, left);
  }
  scene.add(envGroup);
  list3D().forEach(spawn3D);
  S3.sel = null;

  if (!sameSource) {
    const m = Math.max(w, l);
    if (S3.source === 'plan') camera.position.set(0, m * 0.85, l * 0.75);
    else camera.position.set(w * 0.8, m * 0.8 + 1.6, l * 1.05);
    controls.target.set(0, 0.4, 0);
  }
  S3.built = S3.source;

  $('#srcPlan').classList.toggle('active', S3.source === 'plan');
  $('#srcRoom').classList.toggle('active', S3.source === 'room');
  $('#srcPlan').disabled = !P.mpp;
  $('#srcPlan').title = P.mpp ? '' : 'Set the floor plan scale first';
  $('#roomFields').hidden = S3.source === 'plan';
  $('#catalogHint').textContent = S3.source === 'plan'
    ? 'Click a piece to place it in your 3D home.'
    : 'Click a piece to place it in the 3D room.';
  updateControls();
}

// Construiește piesele 3D din forme simple (cutii, cilindri, sfere) – rapid și gratuit
function build3D(type, c) {
  const g = new T.Group();
  const mat = (color) => new T.MeshStandardMaterial({ color, roughness: 0.8 });
  const B = (w, h, d, x, y, z, color = c) => {
    const m = new T.Mesh(new T.BoxGeometry(w, h, d), mat(color));
    m.position.set(x, y + h / 2, z); g.add(m);
  };
  const C = (rt, rb, h, x, y, z, color = c) => {
    const m = new T.Mesh(new T.CylinderGeometry(rt, rb, h, 24), mat(color));
    m.position.set(x, y + h / 2, z); g.add(m);
  };
  const S = (r, x, y, z, color) => {
    const m = new T.Mesh(new T.SphereGeometry(r, 20, 16), mat(color));
    m.position.set(x, y, z); g.add(m);
  };
  const legs = (sx, sz, h, s = 0.05, color = DARK) => {
    for (const a of [-1, 1]) for (const b of [-1, 1]) B(s, h, s, (a * sx) / 2, 0, (b * sz) / 2, color);
  };
  switch (type) {
    case 'canapea':
      legs(2.0, 0.8, 0.1); B(2.1, 0.25, 0.9, 0, 0.1, 0); B(1.74, 0.15, 0.7, 0, 0.35, 0.08, shade(c, 18));
      B(2.1, 0.45, 0.2, 0, 0.35, -0.35); B(0.18, 0.3, 0.9, -0.96, 0.35, 0); B(0.18, 0.3, 0.9, 0.96, 0.35, 0); break;
    case 'fotoliu':
      legs(0.75, 0.75, 0.1); B(0.85, 0.25, 0.85, 0, 0.1, 0); B(0.5, 0.15, 0.6, 0, 0.35, 0.08, shade(c, 18));
      B(0.85, 0.45, 0.18, 0, 0.35, -0.335); B(0.17, 0.3, 0.85, -0.34, 0.35, 0); B(0.17, 0.3, 0.85, 0.34, 0.35, 0); break;
    case 'masa':
      legs(1.5, 0.8, 0.7, 0.06, shade(c, -30)); B(1.6, 0.05, 0.9, 0, 0.7, 0); break;
    case 'scaun':
      legs(0.4, 0.4, 0.42, 0.04, shade(c, -30)); B(0.45, 0.05, 0.45, 0, 0.42, 0, shade(c, 15)); B(0.45, 0.45, 0.04, 0, 0.47, -0.205); break;
    case 'pat':
      legs(1.5, 1.9, 0.05, 0.06); B(1.6, 0.3, 2.0, 0, 0.05, 0, shade(c, -30)); B(1.52, 0.2, 1.92, 0, 0.35, 0, '#f3efe8');
      B(1.56, 0.06, 1.3, 0, 0.52, 0.33); B(0.5, 0.1, 0.3, -0.4, 0.55, -0.75, '#ffffff'); B(0.5, 0.1, 0.3, 0.4, 0.55, -0.75, '#ffffff');
      B(1.6, 0.9, 0.08, 0, 0.05, -0.98, shade(c, -30)); break;
    case 'dulap':
      legs(1.1, 0.5, 0.05); B(1.2, 2.0, 0.6, 0, 0.05, 0); B(0.01, 1.9, 0.01, 0, 0.1, 0.3, DARK);
      B(0.02, 0.25, 0.03, -0.06, 1.0, 0.31, '#999'); B(0.02, 0.25, 0.03, 0.06, 1.0, 0.31, '#999'); break;
    case 'planta':
      C(0.18, 0.13, 0.35, 0, 0, 0); S(0.3, 0, 0.72, 0, '#4f7d3a'); S(0.2, 0.12, 0.98, 0.05, '#5f9145'); break;
    case 'lampa':
      C(0.18, 0.18, 0.03, 0, 0, 0, '#333'); C(0.015, 0.015, 1.4, 0, 0.03, 0, '#444'); C(0.15, 0.25, 0.3, 0, 1.35, 0); break;
    case 'covor':
      B(2.0, 0.01, 1.4, 0, 0, 0); break;
    case 'tv':
      legs(1.5, 0.3, 0.05); B(1.6, 0.5, 0.4, 0, 0.05, 0); B(0.3, 0.05, 0.2, 0, 0.55, -0.05, '#1d1f24');
      B(1.1, 0.65, 0.05, 0, 0.6, -0.05, '#1d1f24'); break;
  }
  return g;
}

function spawn3D(it) {
  const g = build3D(it.type, it.color);
  const { x, z } = getXZ(it);
  g.position.set(x, 0, z);
  g.rotation.y = it.rot;
  g.traverse((o) => { if (o.isMesh) o.userData.root = g; });
  g.userData.item = it;
  // „obj” e ascuns, ca să nu fie salvat odată cu proiectul
  Object.defineProperty(it, 'obj', { value: g, writable: true, configurable: true, enumerable: false });
  spawned.add(g);
  scene.add(g);
}

function select3D(it) {
  S3.sel = it;
  for (const i of list3D()) {
    i.obj?.traverse((o) => { if (o.isMesh) o.material.emissive.set(i === it ? 0x5a2e10 : 0x000000); });
  }
  updateControls();
}

function save3D() { store('casamea-3d', { room: S3.room, items: S3.items }); }

function setPointer(e) {
  const r = renderer.domElement.getBoundingClientRect();
  pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
}

function onDown3D(e) {
  if (!S3.ready) return;
  setPointer(e);
  const hits = raycaster.intersectObjects(list3D().map((i) => i.obj).filter(Boolean), true);
  if (!hits.length) { select3D(null); return; } // lăsăm OrbitControls să rotească scena
  const g = hits[0].object.userData.root;
  const it = g.userData.item;
  select3D(it);
  controls.enabled = false;
  const p = new T.Vector3();
  if (!raycaster.ray.intersectPlane(floorPlane, p)) p.set(g.position.x, 0, g.position.z);
  const off = { x: g.position.x - p.x, z: g.position.z - p.z };
  const el = renderer.domElement;
  el.setPointerCapture(e.pointerId);
  const move = (ev) => {
    setPointer(ev);
    if (raycaster.ray.intersectPlane(floorPlane, p)) {
      setXZ(it, p.x + off.x, p.z + off.z);
      const q = getXZ(it);
      g.position.set(q.x, 0, q.z);
    }
  };
  const up = () => {
    controls.enabled = true;
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerup', up);
    el.removeEventListener('pointercancel', up);
    saveActive();
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
}

async function add3D(type) {
  if (!(await init3D())) return;
  const it = { type, color: CATALOG[type].color, rot: 0 };
  const b = bounds3D();
  setXZ(it, rand(-b.w / 6, b.w / 6), rand(-b.l / 6, b.l / 6));
  list3D().push(it);
  spawn3D(it);
  select3D(it);
  saveActive();
}

function delete3D() {
  if (!S3.sel) return;
  scene.remove(S3.sel.obj);
  spawned.delete(S3.sel.obj);
  if (S3.source === 'plan') P.items = P.items.filter((i) => i !== S3.sel);
  else S3.items = S3.items.filter((i) => i !== S3.sel);
  select3D(null);
  saveActive();
}

function onRoomSize() {
  const w = clamp(parseFloat($('#roomW').value) || 4, 2, 12);
  const l = clamp(parseFloat($('#roomL').value) || 5, 2, 12);
  S3.room = { w, l };
  for (const it of S3.items) setXZ(it, it.x, it.z); // mobila rămâne în interiorul camerei
  S3.built = null;
  rebuild3D();
  save3D();
}
$('#roomW').addEventListener('change', onRoomSize);
$('#roomL').addEventListener('change', onRoomSize);
$('#lowWalls').addEventListener('change', () => { if (S3.ready) { const s = S3.built; rebuild3D(); S3.built = s; } });
document.querySelectorAll('.seg button').forEach((b) => {
  b.onclick = () => { S3.source = b.dataset.src; rebuild3D(); };
});

$('#btnRotate3d').onclick = () => {
  if (!S3.sel) return;
  S3.sel.rot = (S3.sel.rot + Math.PI / 4) % (Math.PI * 2);
  S3.sel.obj.rotation.y = S3.sel.rot;
  saveActive();
};
$('#btnDelete3d').onclick = delete3D;
$('#btnExport3d').onclick = () => {
  if (!S3.ready) return;
  select3D(null);
  renderer.render(scene, camera);
  showModal(renderer.domElement.toDataURL('image/jpeg', 0.92));
};
let clearArmed = false;
$('#btnClear3d').onclick = () => {
  if (!S3.ready) return;
  if (!clearArmed) {
    clearArmed = true;
    toast('Press again within 3 seconds to remove all furniture.');
    setTimeout(() => (clearArmed = false), 3000);
    return;
  }
  clearArmed = false;
  list3D().forEach((i) => scene.remove(i.obj));
  if (S3.source === 'plan') P.items = []; else S3.items = [];
  select3D(null);
  saveActive();
};

// =====================================================================
// 5. ELEMENTE COMUNE: catalog, culoare, file, taste, fereastra de salvare
// =====================================================================
function selected() { return mode === 'plan' ? P.sel : mode === 'foto' ? S2.sel : S3.sel; }

function updateControls() {
  ['#btnDelete2d', '#btnFlip2d', '#btnFront2d'].forEach((s) => ($(s).disabled = !S2.sel));
  ['#btnDelete3d', '#btnRotate3d'].forEach((s) => ($(s).disabled = !S3.sel));
  ['#btnDeletePlan', '#btnRotatePlan'].forEach((s) => ($(s).disabled = !P.sel));
  const sel = selected();
  $('#colorPick').disabled = !sel;
  if (sel) $('#colorPick').value = sel.color;
}

$('#colorPick').addEventListener('input', (e) => {
  const sel = selected();
  if (!sel) return;
  sel.color = e.target.value;
  if (mode === 'foto') {
    const el = [...stage.querySelectorAll('.item')].find((x) => x._item === sel);
    if (el) el.querySelector('img').src = svgURL(sel.type, sel.color);
    save2D();
  } else if (mode === 'plan') {
    const el = [...planStage.querySelectorAll('.pitem')].find((x) => x._item === sel);
    if (el) el.querySelector('img').src = topURL(sel.type, sel.color);
    savePlan();
  } else {
    scene.remove(sel.obj);
    spawned.delete(sel.obj);
    spawn3D(sel);
    select3D(sel);
    saveActive();
  }
});

// Catalogul din stânga
const itemsBox = $('#items');
for (const [type, d] of Object.entries(CATALOG)) {
  const b = document.createElement('button');
  b.className = 'cat-item';
  b.title = `${TOP[type].size[0]} × ${TOP[type].size[1]} m`;
  b.innerHTML = `<img src="${svgURL(type, d.color)}" alt=""><span>${d.name}</span>`;
  b.onclick = () => (mode === 'plan' ? addPlan(type) : mode === 'foto' ? add2D(type) : add3D(type));
  itemsBox.appendChild(b);
}

// Comutarea între moduri
const HINTS = {
  plan: 'Click a piece to place it on the plan at real size.',
  foto: 'Click a piece to add it to the photo.',
};
document.querySelectorAll('.tab').forEach((tab) => {
  tab.onclick = async () => {
    mode = tab.dataset.mode;
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t === tab));
    $('#planView').classList.toggle('active', mode === 'plan');
    $('#fotoView').classList.toggle('active', mode === 'foto');
    $('#view3d').classList.toggle('active', mode === '3d');
    if (HINTS[mode]) $('#catalogHint').textContent = HINTS[mode];
    if (mode === 'plan') renderPlan();
    if (mode === '3d' && (await init3D())) { resize3D(); rebuild3D(); }
    updateControls();
  };
});

// Taste rapide: Delete/Backspace = șterge, R = rotește, Esc = termină peretele / renunță
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mode === 'plan') {
    if (P.tool === 'wall' && P.chain) { P.chain = null; P.hover = null; renderWalls(); } else setTool('select');
    return;
  }
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (mode === 'plan') deletePlan(); else if (mode === 'foto') delete2D(); else delete3D();
  }
  if (e.key === 'r' || e.key === 'R') {
    if (mode === 'plan') $('#btnRotatePlan').click();
    if (mode === '3d') $('#btnRotate3d').click();
  }
});

function showModal(url) {
  $('#modalImg').src = url;
  $('#modalDownload').href = url;
  $('#modal').hidden = false;
}
$('#modalClose').onclick = () => ($('#modal').hidden = true);
$('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') $('#modal').hidden = true; });

// Pornire: reîncarcă proiectele salvate sau exemplele demonstrative
(async () => {
  const sp = recall('casamea-plan');
  if (sp && !sp.isDemo && sp.img) {
    await setPlanImage(sp.img, sp.natW, sp.natH);
    Object.assign(P, { mpp: sp.mpp, isDemo: false, walls: sp.walls || [], items: sp.items || [] });
  } else {
    await setPlanImage(demoPlan(), 1200, 800);
    Object.assign(P, { mpp: 0.01, isDemo: true, walls: sp?.walls?.length ? sp.walls : DEMO_WALLS, items: sp?.items?.length ? sp.items : DEMO_ITEMS.map((i) => ({ ...i })) });
  }
  renderPlan();

  const saved = recall('casamea-2d');
  if (saved?.photo) await setPhoto(saved.photo, false);
  else await setPhoto(demoRoom(), true);
  S2.items = saved?.items || [];
  render2D();
})();
