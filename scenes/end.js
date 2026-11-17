'use strict';
/* 結論：題目回來 → 還在，但只是傳訊息 → 連線 ≠ 連結 → 抬頭（火鍋桌，暖燈）→ 謝謝大家 */
section('end', NOTES_BY_SECTION.end, (b) => {
  const R = (parent, x, y, w, h, rx, o = {}) => paint(el('rect', {x, y, width: w, height: h, rx}, parent), o);
  const Ci = (parent, cx, cy, r, o = {}) => paint(el('circle', {cx, cy, r}, parent), o);
  const P = (parent, d, o = {}) => paint(el('path', {d}, parent), o);
  const clasp = (parent, x, y, s = 1) => {
    const o = el('g', {transform: `translate(${x} ${y}) scale(${s})`}, parent);
    const L = (d, col, w) => P(o, d, {stroke: col, w});
    L('M-330 150 L-120 28', 'var(--cloth-a)', 124);
    L('M330 150 L120 28', 'var(--cloth-b)', 124);
    L('M-150 40 L26 -6', C.skin1, 92);
    L('M150 40 L-26 -6', C.skin3, 88);
    [-52, -22, 8, 38].forEach(x2 => P(o, `M${x2} -34 Q${x2 + 8} -6 ${x2 - 2} 22`, {stroke: C.hair, w: 6}));
    L('M-96 -26 Q-36 -62 30 -40', C.skin1, 30);
    return o;
  };

  /* ---------- end·0 / end·1 (b, b+1): the question comes back, 「還在」 lands, then the split ---------- */
  Kit2D.questionBubble(item({x: 800, y: 450, from: b, to: b + 2, cls: 'fade', pos: {[b + 1]: [690, 185, .5]}}), {x: 0, y: 0});
  {
    const st = item({from: b + 1, to: b + 2, cls: 'stamp', delay: 600});
    const sg = el('g', {transform: 'translate(1105 232) rotate(-9)'}, st);
    const s2 = Kit2D.stamp(sg, '還在', {x: 0, y: 0, size: 110, color: C.leaf, rot: 0});
    R(sg, -s2.w / 2, -s2.h / 2, s2.w, s2.h, 16, {fill: C.bg});
    sg.insertBefore(sg.lastChild, sg.firstChild);
    const cold = item({from: b + 1, to: b + 2, delay: 1100}), warm = item({from: b + 1, to: b + 2, delay: 1600});
    /* left: messages sent one way, nobody answers */
    R(cold, 90, 350, 680, 520, 28, {fill: C.paper, stroke: C.screen, w: 4});
    text(cold, '傳訊息', {x: 430, y: 425, size: 80, weight: 700, fill: C.screen});
    Kit2D.phone(cold, {x: 240, y: 660, w: 130, glow: true});
    [[430, 640, 2.3, 1], [535, 590, 1.7, .7], [625, 548, 1.2, .45]].forEach(([x, y, s, o]) => {
      const g = el('g', {}, cold); g.style.opacity = o;
      Kit2D.icon(g, 'chat', {x, y, s, color: C.screen, w: 3.4});
    });
    [[330, 660, 372, 660], [492, 612, 512, 600], [580, 568, 596, 560]].forEach(([x1, y1, x2, y2]) => arrow(cold, x1, y1, x2, y2, C.muted, 5));
    text(cold, '一直傳出去', {x: 430, y: 810, size: 40, fill: C.muted});
    /* right: a back-and-forth between two faces */
    R(warm, 830, 350, 680, 520, 28, {fill: C.paper, stroke: C.mango, w: 4});
    Kit2D.glow(warm, {x: 1170, y: 640, r: 320, color: 'lamp', op: .55});
    text(warm, '交流', {x: 1170, y: 425, size: 80, weight: 700, fill: C.mango});
    Kit2D.face(warm, {x: 985, y: 650, r: 78, mood: 'happy'});
    Kit2D.face(warm, {x: 1355, y: 650, r: 78, mood: 'happy', fill: C.skin2});
    curveArrow(warm, 1055, 596, 1170, 500, 1285, 596, C.leaf, 8);
    curveArrow(warm, 1285, 706, 1170, 800, 1055, 706, C.leaf, 8);
    text(warm, '一來一回', {x: 1170, y: 650, size: 40, fill: C.muted});
  }

  /* ---------- end·2 (b+2): 連線 ≠ 連結 ---------- */
  {
    const l = item({from: b + 2, to: b + 3});
    Kit2D.glow(l, {x: 380, y: 440, r: 300, color: 'screen', op: .7});
    Kit2D.icon(l, 'signal', {x: 380, y: 440, s: 9, color: C.screen});
    text(l, '連線', {x: 380, y: 720, size: 120, weight: 700, fill: C.screen});
    const m = item({from: b + 2, to: b + 3, cls: 'stamp', delay: 500});
    text(m, '≠', {x: 800, y: 470, size: 240, weight: 700});
    const r = item({from: b + 2, to: b + 3, delay: 1000});
    Kit2D.glow(r, {x: 1220, y: 440, r: 330, color: 'lamp', op: .8});
    clasp(r, 1230, 480, .74);
    text(r, '連結', {x: 1220, y: 720, size: 120, weight: 700, fill: C.mango});
  }

  /* ---------- end·3 (b+3): the table from the opening, phones stacked, heads up, lamp warm; the camera rises ---------- */
  {
    const calm = {arm: 0, tilt: 0, glow: 0, stack: 1, lamp: 1, steam: 1, food: 1, smile: 1, turn0: .5, turn1: -.5, turn2: .4, turn3: -.4};
    const view = view3d({x: 0, y: 0, w: 1600, h: 900, from: b + 3, to: b + 4, model: v => Kit3D.hotpot(v),
      at: k => Kit3D.params('hotpot', Object.assign({}, calm, k <= b + 2 ? {pitch: .56, ty: 1.55, dist: 9.4} : {pitch: .68, ty: 1.85, dist: 9.7})),
      dur: {pitch: 2, ty: 2, dist: 2}});
    const t = item({from: b + 3, to: b + 4, top: true, delay: 900, cls: 'fade'});
    paint(el('rect', {x: 24, y: 740, width: 576, height: 126, rx: 63}, t), {fill: C.pearl}).style.opacity = .82;   /* a plate behind the words keeps them readable on the pale day-theme floor */
    text(t, '先抬頭看一下', {x: 300, y: 810, size: 84, weight: 700, fill: C.mango});
  }

  /* ---------- end·4 (b+4): 謝謝大家, the whole route lit ---------- */
  {
    const t = item({from: b + 4, to: b + 5, cls: 'fade'});
    Kit2D.glow(t, {x: 560, y: 330, r: 460, color: 'lamp', op: .55});
    text(t, '謝謝大家', {x: 560, y: 330, size: 190, weight: 700});
    Kit2D.underline(t, {x1: 190, x2: 930, y: 440, color: C.mango, w: 12, delay: 600});
    Kit2D.dumpling(item({from: b + 4, to: b + 5, delay: 500}), {x: 1230, y: 340, s: 3.2, wave: true});
    const MY = 740, L = Kit2D.mrtLayout({x: 240, y: MY, w: 1120});
    Kit2D.mrtLine(item({from: b + 4, to: b + 5, cls: 'fade', delay: 800}), L, {upTo: 3, w: 16});
    L.pts.forEach((p, i) => Kit2D.mrtStation(item({from: b + 4, to: b + 5, delay: 900 + i * 220}), L, i, {state: 'lit', size: 34, k: .82}));
    Kit2D.rider(item({from: b + 4, to: b + 5, delay: 1500, cls: 'fade'}), {x: L.pts[3].x, y: MY - 34, s: .9});
  }
});
