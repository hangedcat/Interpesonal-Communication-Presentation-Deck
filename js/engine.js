'use strict';
/* =====================================================================
   「滑著手機的我們，還在真正溝通嗎？」簡報引擎（由前一份簡報的 engine 移植）
   ・每按一次「下一步」＝一個 beat。畫面只在按下的時候動，不會自己跑。
   ・下一步：→、空白鍵、Enter、PageDown、滑鼠左鍵
   ・上一步：←、PageUp、Backspace、滑鼠右鍵
   ・N 講稿　P 講者視窗　F 全螢幕　T 夜晚／白天　Home／End 第一／最後
   ・網址後面加 #數字 可以直接跳到那個 beat（例：index.html#24）
   ・網址加 ?still：每個 beat 都直接顯示結束畫面、沒有動畫（截圖用）
   ・可改的文字：js/content.js；每一段的畫面：scenes/*.js
   ===================================================================== */

const W = 1600, H = 900;
const NS = 'http://www.w3.org/2000/svg';
const QS = new URLSearchParams(location.search);
const STILL = QS.has('still');          /* screenshot mode: no transitions, every beat shows its end state */
const PRESENTER_WIN = QS.has('presenter');  /* the notes window opened with P (the presenter's NAME is PRESENTER in js/content.js) */
const stage = document.getElementById('stage');
const svg = document.getElementById('svg');
const svgTop = document.getElementById('svgTop');
const defs = svg.querySelector('defs');
/* colours = CSS variables (css/deck.css), so the T key recolours every SVG at once */
const C = {ink: 'var(--ink)', muted: 'var(--muted)', line: 'var(--line)', paper: 'var(--paper)', bg: 'var(--bg)',
  chili: 'var(--chili)', mango: 'var(--mango)', screen: 'var(--screen)', rose: 'var(--rose)', leaf: 'var(--leaf)',
  wood: 'var(--wood)', woodDark: 'var(--wood-dark)', broth: 'var(--broth)', brothWhite: 'var(--broth-white)',
  skin1: 'var(--skin-1)', skin2: 'var(--skin-2)', skin3: 'var(--skin-3)', hair: 'var(--hair)', lamp: 'var(--lamp)',
  poster: 'var(--poster)', sticky: 'var(--sticky)', tea: 'var(--tea)', pearl: 'var(--pearl)', pot: 'var(--pot)', dough: 'var(--dough)',
  chatBg: 'var(--chat-bg)', chatMe: 'var(--chat-me)', chatThem: 'var(--chat-them)', chatInk: 'var(--chat-ink)', chatMeta: 'var(--chat-meta)'};
const FONT = {
  zh: '"Huninn","Microsoft JhengHei","PingFang TC","Noto Sans TC",sans-serif',
  ui: '"Microsoft JhengHei UI","Microsoft JhengHei","PingFang TC",sans-serif',   /* inside the fake phone */
  en: '"Huninn","Segoe UI","Helvetica Neue",Arial,sans-serif',
  mono: 'Consolas,"Cascadia Mono","Courier New",monospace'
};

/* ================= sections =================
   section(id, notes, build): notes = one string per beat (what the speaker says on that click);
   build(b, at) draws the section; b = its first beat, at('p1', 2) = beat 2 of section 'p1'.   */
const ORDER = ['title', 'open', 'p1', 'p2', 'p3', 'p4', 'p5', 'end', 'refs'];
const SECTION_NAME = {title: '封面', open: '開場', p1: '多黏手機', p2: '真正的溝通', p3: '三個小偷', p4: '手機不是壞人', p5: '三個小方法', end: '結論', refs: '參考資料'};
const SECTIONS = {}, START = {}, COUNT = {};
function section(id, notes, build) { SECTIONS[id] = {notes, build}; }
function at(id, k = 0) {
  if (!(id in START)) throw new Error('[deck] unknown section ' + id);
  return START[id] + (k < 0 ? COUNT[id] + k : k);
}
function sectionOf(b) { let s = ORDER[0]; for (const id of ORDER) if (id in START && START[id] <= b) s = id; return s; }

/* ================= SVG helpers (same as the original deck) ================= */
function el(name, attrs = {}, parent) {
  const e = document.createElementNS(NS, name);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function paint(e, {fill = 'none', stroke = null, w = 3, dash = null, cap = 'round'} = {}) {
  e.style.fill = fill;
  if (stroke) { e.style.stroke = stroke; e.style.strokeWidth = w; e.style.strokeLinecap = cap; e.style.strokeLinejoin = 'round'; }
  if (dash) e.style.strokeDasharray = dash;
  return e;
}
/* font: 'zh' (default) | 'en' | 'mono' */
function text(parent, str, {x = 0, y = 0, size = 26, fill = C.ink, weight = 400, anchor = 'middle', font = null} = {}) {
  const t = el('text', {x, y, 'font-size': size, 'font-weight': weight, 'text-anchor': anchor, 'dominant-baseline': 'central'}, parent);
  t.style.fill = fill;
  /* Huninn has one weight: "bold" is a thin same-colour outline, so it never turns into a smeared synthetic bold */
  if (weight >= 600) { t.style.stroke = fill; t.style.strokeWidth = size * 0.03; t.style.strokeLinejoin = 'round'; t.setAttribute('font-weight', 400); }
  if (font) t.style.fontFamily = FONT[font];
  t.textContent = str;
  return t;
}
function tag(parent, str, color, {x = 0, y = 0, size = 26, font = null} = {}) {
  const g = el('g', {}, parent);
  const r = paint(el('rect', {rx: 8, ry: 8}, g), {fill: C.paper, stroke: color, w: 2});
  const t = text(g, str, {x, y, size, fill: color, font});
  const w = t.getComputedTextLength();
  const px = size * 0.6, h = size * 1.7;
  r.setAttribute('x', x - w / 2 - px); r.setAttribute('y', y - h / 2);
  r.setAttribute('width', w + 2 * px); r.setAttribute('height', h);
  return g;
}
function arrow(parent, x1, y1, x2, y2, color, w = 3) {
  const g = el('g', {}, parent);
  paint(el('path', {d: `M${x1} ${y1} L${x2} ${y2}`}, g), {stroke: color, w});
  const ang = Math.atan2(y2 - y1, x2 - x1), L = 14 + w, sp = 0.45;
  const p1 = [x2 - L * Math.cos(ang - sp), y2 - L * Math.sin(ang - sp)];
  const p2 = [x2 - L * Math.cos(ang + sp), y2 - L * Math.sin(ang + sp)];
  paint(el('path', {d: `M${p1[0]} ${p1[1]} L${x2} ${y2} L${p2[0]} ${p2[1]}`}, g), {stroke: color, w});
  return g;
}
function cross(parent, cx, cy, size, color, w = 8) {
  const g = el('g', {transform: `rotate(-6 ${cx} ${cy})`}, parent);
  const h = size / 2;
  paint(el('path', {d: `M${cx - h} ${cy - h} L${cx + h} ${cy + h} M${cx + h} ${cy - h} L${cx - h} ${cy + h}`}, g), {stroke: color, w});
  return g;
}
/* seeded random, so every screenshot / every run looks the same */
let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function defClip(id, inner) { const c = el('clipPath', {id}, defs); c.innerHTML = inner; }
function G(parent, tx, ty, sc = 1) { return el('g', {transform: `translate(${tx} ${ty}) scale(${sc})`}, parent); }
/* a line that draws itself (like a plotter) when its item appears */
function draw(parent, d, color, w = 4, delay = 0) {
  const pth = paint(el('path', {d, class: 'draw'}, parent), {stroke: color, w});
  const len = pth.getTotalLength();
  pth.style.strokeDasharray = len; pth.style.strokeDashoffset = len; pth.style.transitionDelay = delay + 'ms';
  return pth;
}
function bar(parent, x, y, len, h, color, delay = 0) {
  const r = el('rect', {x, y: y - h / 2, width: Math.max(1, len), height: h, rx: 4, class: 'grow'}, parent);
  r.style.fill = color; r.style.transitionDelay = delay + 'ms';
  return r;
}
function check(parent, cx, cy, color = C.leaf, sz = 1) {
  return paint(el('path', {d: `M${cx - 14 * sz} ${cy} L${cx - 4 * sz} ${cy + 10 * sz} L${cx + 15 * sz} ${cy - 11 * sz}`}, parent), {stroke: color, w: 5});
}
function stampBox(parent, str, color, cx, cy, size = 40, rot = -8) {
  const g = el('g', {transform: `rotate(${rot} ${cx} ${cy})`}, parent);
  const r = paint(el('rect', {rx: 8}, g), {fill: 'none', stroke: color, w: 4});
  const t = text(g, str, {x: cx, y: cy, size, weight: 700, fill: color});
  const w = t.getComputedTextLength();
  r.setAttribute('x', cx - w / 2 - 22); r.setAttribute('y', cy - size * .85);
  r.setAttribute('width', w + 44); r.setAttribute('height', size * 1.7);
  return g;
}
function curveArrow(parent, x1, y1, cx, cy, x2, y2, color, w = 3) {
  const g = el('g', {}, parent);
  paint(el('path', {d: `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`}, g), {stroke: color, w});
  const ang = Math.atan2(y2 - cy, x2 - cx), L = 14 + w, sp = .45;
  paint(el('path', {d: `M${x2 - L * Math.cos(ang - sp)} ${y2 - L * Math.sin(ang - sp)} L${x2} ${y2} L${x2 - L * Math.cos(ang + sp)} ${y2 - L * Math.sin(ang + sp)}`}, g), {stroke: color, w});
  return g;
}
/* ================= things that appear on beats ================= */
const items = [], medias = [], panels = [], counters = [];
const beatHooks = [], fitHooks = [], themeHooks = [];
/* item(): a group that is visible for beats from … to-1.
   pos: {beat: [x, y, scale]} moves it on later beats; op: {beat: opacity}; delay: ms after the click (keep it short);
   cls: 'stamp' | 'fade'; top: true draws above images / 3D views. Returns the group to draw into. */
function item({x = 0, y = 0, s = 1, from = 0, to = 999, pos = null, delay = 0, op = null, cls = null, top = false} = {}) {
  const o = el('g', {class: 'o'}, top ? svgTop : svg);
  /* groups that get dimmed need their own layer, or Chrome can paint a ghost copy of them elsewhere */
  if (op) o.style.willChange = 'opacity';
  const a = el('g', {class: 'a'}, o);
  if (cls) a.classList.add(cls);
  items.push({o, a, x, y, s, from, to, pos, delay, op});
  return a;
}
/* HTML layers go below #svgTop */
function addLayer(node) { stage.insertBefore(node, svgTop); return node; }
function media({src, x, y, w, h, from, to = 999, label = '', optional = false, pos = null}) {
  const d = document.createElement('div');
  d.className = 'media';
  Object.assign(d.style, {left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px'});
  d.innerHTML = `<img alt=""><div class="ph"><b>${label}</b><span>找不到圖片：${src}</span></div>`;
  const img = d.querySelector('img');
  img.addEventListener('error', () => { if (optional) d.style.display = 'none'; else d.classList.add('missing'); });
  img.src = src;
  addLayer(d);
  medias.push({d, from, to, pos});
  return d;
}
/* panel(): an HTML block (reading table etc.). vis(beat) → shown?, update(beat) → refresh classes */
function panel(d, vis, update = () => {}) { addLayer(d); panels.push({d, vis, update}); return d; }
/* counter(): a number that rolls to a new value when its beat is clicked. values: {beat: number} */
function counter(parent, {x = 0, y = 0, size = 60, weight = 700, fill = C.ink, anchor = 'middle', font = 'en', values,
  format = n => Math.round(n).toLocaleString('en-US'), dur = 1.1} = {}) {
  const t = text(parent, '', {x, y, size, weight, fill, anchor, font});
  const keys = Object.keys(values).map(Number).sort((a, b) => a - b);
  counters.push({t, keys, values, format, dur, shown: null, raf: 0});
  return t;
}
/* ================= render & navigation ================= */
let beat = 0, prevBeat = 0, LAST = 0;
const NOTES = [];
const notesEl = document.getElementById('notes'), hintEl = document.getElementById('hint');
function keyed(map, b, dflt) {
  if (!map) return dflt;
  let v = dflt;
  for (const k of Object.keys(map).map(Number).sort((p, q) => p - q)) if (b >= k) v = map[k];
  return v;
}
function render(dir = 0, still = false) {
  for (const it of items) {
    const vis = beat >= it.from && beat < it.to;
    /* appearing: wait `delay` for every property (opacity, transform, visibility); hiding: use the stylesheet
       (fade out, then visibility:hidden, so hidden items are never painted) */
    it.a.style.transitionDelay = vis && !it.a.classList.contains('on') ? `${it.delay}ms, ${it.delay}ms, ${it.delay}ms` : '';
    it.a.classList.toggle('on', vis);
    const p = keyed(it.pos, beat, [it.x, it.y, it.s]);
    it.o.style.transform = `translate(${p[0]}px, ${p[1]}px) scale(${p[2]})`;
    it.o.style.opacity = keyed(it.op, beat, 1);
  }
  for (const m of medias) {
    m.d.classList.toggle('on', beat >= m.from && beat < m.to);
    const p = keyed(m.pos, beat, [0, 0, 1]);
    m.d.style.transform = `translate(${p[0]}px, ${p[1]}px) scale(${p[2]})`;
  }
  for (const p of panels) { p.d.classList.toggle('on', !!p.vis(beat)); p.update(beat); }
  for (const c of counters) {
    let v = c.values[c.keys[0]];
    for (const k of c.keys) if (beat >= k) v = c.values[k];
    cancelAnimationFrame(c.raf);
    if (c.shown === null || still || dir <= 0 || v === c.shown) { c.shown = v; c.t.textContent = c.format(v); continue; }
    const from = c.shown, t0 = performance.now();
    const step = now => {
      const k = Math.min(1, (now - t0) / (c.dur * 1000)), e = 1 - Math.pow(1 - k, 3);
      c.t.textContent = c.format(from + (v - from) * e);
      if (k < 1) c.raf = requestAnimationFrame(step); else c.shown = v;
    };
    c.shown = v;
    c.raf = requestAnimationFrame(step);
  }
  for (const h of beatHooks) h(beat, prevBeat, dir, still);
  notesEl.innerHTML = `<small>${beat} / ${LAST}　${SECTION_NAME[sectionOf(beat)] || ''}</small>${NOTES[beat] || ''}`;
  if (!STILL) { try { history.replaceState(null, '', '#' + beat); } catch (e) {} }
  postPresenter();
  prevBeat = beat;
}
function go(d) {
  const n = Math.max(0, Math.min(LAST, beat + d));
  if (n === beat) return;
  beat = n; hintEl.style.opacity = 0;
  render(d, STILL);
}
function jump(n) {
  n = Math.max(0, Math.min(LAST, n | 0));
  beat = n;
  document.body.classList.add('still');
  render(0, true);
  if (!STILL) requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove('still')));
}

/* ================= input ================= */
let downX = 0, downY = 0, dragged = false;
addEventListener('keydown', e => {
  if (PRESENTER_WIN || e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key;
  if (['ArrowRight', ' ', 'PageDown', 'Enter', 'ArrowDown'].includes(k)) { e.preventDefault(); go(1); }
  else if (['ArrowLeft', 'PageUp', 'Backspace', 'ArrowUp'].includes(k)) { e.preventDefault(); go(-1); }
  else if (k === 'Home') jump(0);
  else if (k === 'End') jump(LAST);
  else if (k === 'n' || k === 'N') notesEl.style.display = notesEl.style.display === 'block' ? 'none' : 'block';
  else if (k === 'f' || k === 'F') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {}); }
  else if (k === 'p' || k === 'P') openPresenter();
  else if (k === 't' || k === 'T') setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});
addEventListener('pointerdown', e => { downX = e.clientX; downY = e.clientY; dragged = false; });
addEventListener('pointermove', e => { if (e.buttons && Math.hypot(e.clientX - downX, e.clientY - downY) > 6) dragged = true; });
addEventListener('click', e => {
  if (PRESENTER_WIN || e.button !== 0 || dragged || (e.target.closest && e.target.closest('[data-noclick]'))) return;
  go(1);
});
addEventListener('contextmenu', e => { if (PRESENTER_WIN) return; e.preventDefault(); go(-1); });
addEventListener('hashchange', () => { const h = parseInt(location.hash.slice(1), 10); if (Number.isFinite(h) && h !== beat) jump(h); });

let stageScale = 1;
function fit() {
  stageScale = Math.min(innerWidth / W, innerHeight / H);
  stage.style.transform = `translate(-50%, -50%) scale(${stageScale})`;
  for (const f of fitHooks) f(stageScale);
}
addEventListener('resize', () => { if (!PRESENTER_WIN) fit(); });

function setTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('deck-comm-theme', t); } catch (e) {}
  for (const h of themeHooks) h(t);
}

/* ================= presenter window (P) ================= */
let presenterWin = null;
function openPresenter() {
  const url = location.href.split('#')[0].split('?')[0] + '?presenter';
  presenterWin = window.open(url, 'deck-presenter', 'width=1100,height=760');
  setTimeout(postPresenter, 700); setTimeout(postPresenter, 1600);
}
function postPresenter() {
  try { if (presenterWin && !presenterWin.closed) presenterWin.postMessage({type: 'deck-state', beat, last: LAST}, '*'); } catch (e) {}
}
addEventListener('message', e => {
  const d = e.data || {};
  if (PRESENTER_WIN) return;
  if (d.type === 'deck-hello') { presenterWin = e.source; postPresenter(); }
  else if (d.type === 'deck-nav') { if (d.d) go(d.d); else if (typeof d.to === 'number') jump(d.to); }
});
function buildPresenter() {
  document.body.classList.remove('still');
  document.body.classList.add('presenter');
  stage.remove(); hintEl.remove(); notesEl.remove();
  document.title = '講者視窗｜' + document.title;
  const pv = document.createElement('div');
  pv.id = 'pv';
  pv.innerHTML = `<header><b id="pvSec"></b><span id="pvCount"></span><span class="grow"></span><span id="pvTimer">00:00</span><span id="pvClock"></span></header>
    <main><div class="lab">現在</div><p id="pvNow">（等待簡報視窗…請從簡報視窗按 P 開啟）</p><div class="lab">下一步</div><p id="pvNext"></p></main>
    <footer><button data-d="-1">← 上一步</button><button data-d="1">下一步 →</button><button id="pvReset">計時歸零</button></footer>`;
  document.body.appendChild(pv);
  const $ = id => document.getElementById(id);
  let t0 = Date.now();
  const send = msg => { try { (window.opener || presenterWin).postMessage(msg, '*'); } catch (e) {} };
  pv.querySelectorAll('[data-d]').forEach(b => b.addEventListener('click', () => send({type: 'deck-nav', d: +b.dataset.d})));
  $('pvReset').addEventListener('click', () => { t0 = Date.now(); });
  addEventListener('keydown', e => {
    if (['ArrowRight', ' ', 'PageDown', 'Enter', 'ArrowDown'].includes(e.key)) { e.preventDefault(); send({type: 'deck-nav', d: 1}); }
    else if (['ArrowLeft', 'PageUp', 'Backspace', 'ArrowUp'].includes(e.key)) { e.preventDefault(); send({type: 'deck-nav', d: -1}); }
  });
  addEventListener('message', e => {
    const d = e.data || {};
    if (d.type !== 'deck-state') return;
    $('pvSec').textContent = SECTION_NAME[sectionOf(d.beat)] || '';
    $('pvCount').textContent = `${d.beat} / ${d.last}`;
    $('pvNow').textContent = NOTES[d.beat] || '';
    $('pvNext').textContent = d.beat < d.last ? NOTES[d.beat + 1] : '（最後一步）';
  });
  const tick = () => {
    const s = Math.floor((Date.now() - t0) / 1000);
    $('pvTimer').textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    const n = new Date();
    $('pvClock').textContent = `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`;
  };
  tick(); setInterval(tick, 1000);
  send({type: 'deck-hello'});
}

/* stand-in drawing for a section that is not drawn yet: shows its name on each beat */
function placeholder(b, id, n) {
  for (let k = 0; k < n; k++) {
    const t = item({from: b + k, to: b + k + 1});
    text(t, SECTION_NAME[id] || id, {x: 800, y: 400, size: 56, weight: 700, fill: C.muted});
    text(t, `（畫面製作中：${k + 1} / ${n}）`, {x: 800, y: 480, size: 28, fill: C.muted});
  }
}

/* ================= start ================= */
const Deck = {
  /* waits for the Huninn font first: tag() / stampBox() measure text while the scenes are being built */
  start() {
    const run = () => this.run();
    if (document.fonts && document.fonts.load) {
      Promise.race([document.fonts.load('40px Huninn', '人際溝通報告滑著手機'), new Promise(r => setTimeout(r, 5000))]).then(run, run);
    } else run();
  },
  run() {
    let b = 0;
    for (const id of ORDER) {
      const s = SECTIONS[id];
      if (!s) { console.warn('[deck] missing section', id); continue; }
      START[id] = b; COUNT[id] = s.notes.length; NOTES.push(...s.notes); b += s.notes.length;
    }
    LAST = NOTES.length - 1;
    try { const t = localStorage.getItem('deck-comm-theme'); if (t === 'dark' || t === 'light') document.documentElement.dataset.theme = t; } catch (e) {}
    if (PRESENTER_WIN) { buildPresenter(); return; }
    for (const id of ORDER) if (SECTIONS[id]) { seed = 7; SECTIONS[id].build(START[id], at); }
    fit();
    const h = parseInt(location.hash.slice(1), 10);
    beat = Number.isFinite(h) ? Math.max(0, Math.min(LAST, h)) : 0;
    prevBeat = beat;
    if (beat > 0 || STILL) hintEl.style.opacity = 0;
    render(0, true);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!STILL) document.body.classList.remove('still');
      window.__deckReady = true;
    }));
  }
};
