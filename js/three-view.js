'use strict';
/* =====================================================================
   3D views (three.js).  A view is a box on the stage showing one model.
   Its numbers ("params") are given per beat by at(beat); when you click,
   they glide to the new values.  Nothing moves unless a click changed a
   param.  Drag inside a view to turn the model (it resets on the next
   section).  Works offline: three.js is in lib/, every model is built in code.
   ===================================================================== */
const EASE = {
  inOut: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  out: t => 1 - Math.pow(1 - t, 3),
  linear: t => t
};
const views3d = [];
let tickRaf = 0;
function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
/* every colour token of css/deck.css as a THREE.Color (so the T key recolours the 3D too).
   keys keep the CSS names: p.chili, p.screen, p['wood-dark'], p['skin-1'], p['cloth-a'] … ; p.dark = night theme */
const TOKENS3D = ['bg', 'paper', 'ink', 'muted', 'line', 'chili', 'mango', 'screen', 'rose', 'leaf',
  'wood', 'wood-dark', 'broth', 'broth-white', 'skin-1', 'skin-2', 'skin-3', 'hair', 'lamp', 'poster', 'sticky', 'tea', 'pearl', 'pot', 'dough',
  'cloth-a', 'cloth-b', 'cloth-c', 'cloth-d', 'cloth-e', 'cloth-f', 'chat-bg', 'chat-me'];
function palette3d() {
  const p = {dark: document.documentElement.dataset.theme !== 'light'};
  for (const k of TOKENS3D) p[k] = new THREE.Color(cssVar('--' + k));
  return p;
}

/* view3d({x, y, w, h, from, to, model(view) → {camera, update(p, view), render(renderer, p, view), recolor(pal)},
           at(beat) → {param: number, …, $dur: {param: seconds}},
           dur: {param: seconds}, ease: {param: 'inOut'|'out'|'linear'}, snap: [params never animated],
           backSnap: [params that jump back instead of rewinding], overlay(view, p) called after every frame}) */
function view3d(cfg) {
  const d = document.createElement('div');
  d.className = 'view3d';
  Object.assign(d.style, {left: cfg.x + 'px', top: cfg.y + 'px', width: cfg.w + 'px', height: cfg.h + 'px'});
  addLayer(d);
  const v = {cfg, d, cur: {}, tw: {}, orbit: {yaw: 0, pitch: 0}, visible: false, dirty: true, renderer: null, model: null, pal: null};
  try {
    if (!window.THREE) throw new Error('three.js missing');
    const r = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true});
    r.setClearColor(0x000000, 0);
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    d.appendChild(r.domElement);
    v.renderer = r;
  } catch (e) {
    d.innerHTML = '<div class="nogl">這台電腦的瀏覽器無法顯示 3D（WebGL）。<br>請用 Chrome 或 Edge 開啟這個檔案。</div>';
  }
  v.pal = palette3d();
  if (v.renderer) v.model = cfg.model(v);
  Object.assign(v.cur, stripMeta(cfg.at(cfg.from)));
  /* stage coordinates of a 3D point (for SVG labels that follow the model) */
  const tmp = new THREE.Vector3();
  v.toStage = (x, y, z) => {
    if (!v.model) return {x: cfg.x + cfg.w / 2, y: cfg.y + cfg.h / 2};
    tmp.set(x, y, z).project(v.model.camera);
    return {x: cfg.x + (tmp.x + 1) / 2 * cfg.w, y: cfg.y + (1 - tmp.y) / 2 * cfg.h};
  };
  /* drag to turn */
  let drag = null;
  d.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    drag = {x: e.clientX, y: e.clientY, yaw: v.orbit.yaw, pitch: v.orbit.pitch};
    try { d.setPointerCapture(e.pointerId); } catch (err) {}
  });
  d.addEventListener('pointermove', e => {
    if (!drag) return;
    v.orbit.yaw = drag.yaw + (e.clientX - drag.x) * 0.008 / stageScale;
    v.orbit.pitch = Math.max(-0.5, Math.min(0.8, drag.pitch + (e.clientY - drag.y) * 0.006 / stageScale));
    v.dirty = true; kick();
  });
  const end = () => { drag = null; };
  d.addEventListener('pointerup', end); d.addEventListener('pointercancel', end);
  views3d.push(v);
  resizeView(v);
  /* pre-warm: draw once right after load (the view is still hidden), so the GPU compiles this view's
     shaders now and not on the first click that shows it. A first-use compile can swallow the entrance animation. */
  if (v.model) setTimeout(() => { try { drawView(v); } catch (err) { console.warn('[deck] 3D pre-warm skipped', err); } }, 60);
  return v;
}
function stripMeta(o) { const r = {}; for (const k in o) if (k[0] !== '$') r[k] = o[k]; return r; }
function resizeView(v) {
  if (!v.renderer) return;
  const pr = Math.min(2.5, (window.devicePixelRatio || 1) * stageScale);
  v.renderer.setPixelRatio(pr);
  v.renderer.setSize(v.cfg.w, v.cfg.h, false);
  v.dirty = true;
}
function kick() { if (!tickRaf) tickRaf = requestAnimationFrame(tick3d); }
function tick3d(now) {
  tickRaf = 0;
  let again = false;
  for (const v of views3d) {
    if (!v.visible || !v.model) continue;
    for (const k in v.tw) {
      const t = v.tw[k];
      const u = Math.min(1, Math.max(0, (now - t.t0) / t.dur));
      v.cur[k] = t.from + (t.to - t.from) * t.ease(u);
      if (u >= 1) { v.cur[k] = t.to; delete v.tw[k]; } else again = true;
      v.dirty = true;
    }
    if (v.dirty) { v.dirty = false; drawView(v); }
  }
  if (again) kick();
}
function drawView(v) {
  v.model.update(v.cur, v);
  v.model.render(v.renderer, v.cur, v);
  if (v.cfg.overlay) v.cfg.overlay(v, v.cur);
}

beatHooks.push((b, pb, dir, still) => {
  for (const v of views3d) {
    const vis = b >= v.cfg.from && b < v.cfg.to;
    v.d.classList.toggle('on', vis);
    v.d.style.setProperty('--op', keyed(v.cfg.op, b, 1));
    const wasVis = v.visible;
    v.visible = vis;
    if (!vis) { v.tw = {}; continue; }
    const tgtFull = v.cfg.at(b), tgt = stripMeta(tgtFull), durs = tgtFull.$dur || {};
    const live = !still && !STILL;
    let animate = live && wasVis;
    if (!wasVis) {
      v.orbit.yaw = 0; v.orbit.pitch = 0; v.tw = {};
      /* entering on a forward click: start from the previous beat's numbers, so the entrance animates */
      if (live && dir > 0 && pb === b - 1) { Object.assign(v.cur, stripMeta(v.cfg.at(pb))); animate = true; }
      else Object.assign(v.cur, tgt);
    }
    for (const k in tgt) {
      const to = tgt[k];
      if (typeof to !== 'number' || !animate || (v.cfg.snap || []).includes(k) ||
          (dir < 0 && (v.cfg.backSnap || []).includes(k))) { v.cur[k] = to; delete v.tw[k]; continue; }
      const tw = v.tw[k];
      if (tw && tw.to === to) continue;               /* already gliding there (e.g. a crash still playing) */
      if (v.cur[k] === to) { delete v.tw[k]; continue; }
      let dur = durs[k] != null ? durs[k] : (v.cfg.dur && v.cfg.dur[k] != null ? v.cfg.dur[k] : 0.9);
      if (dir < 0) dur = Math.min(dur, 0.45);
      v.tw[k] = {from: v.cur[k], to, t0: performance.now(), dur: Math.max(1, dur * 1000), ease: EASE[(v.cfg.ease && v.cfg.ease[k]) || 'inOut']};
    }
    v.dirty = true;
    /* in jump / screenshot mode draw right away, so the frame is ready */
    if (!live && v.model) { v.dirty = false; drawView(v); }
  }
  kick();
});
fitHooks.push(() => { views3d.forEach(resizeView); kick(); });
themeHooks.push(() => {
  for (const v of views3d) { v.pal = palette3d(); if (v.model && v.model.recolor) v.model.recolor(v.pal); v.dirty = true; }
  kick();
});

/* an SVG label with a leader line that follows a point of a 3D model; returns update(ax, ay, lx, ly) */
function label3d(parent, str, color, size = 30) {
  const line = paint(el('path', {}, parent), {stroke: color, w: 2.5});
  const dot = paint(el('circle', {r: 6}, parent), {fill: color});
  const g = el('g', {}, parent);
  tag(g, str, color, {x: 0, y: 0, size});
  return (ax, ay, lx, ly) => {
    line.setAttribute('d', `M${ax} ${ay} L${lx} ${ly}`);
    dot.setAttribute('cx', ax); dot.setAttribute('cy', ay);
    g.setAttribute('transform', `translate(${lx} ${ly})`);
  };
}
