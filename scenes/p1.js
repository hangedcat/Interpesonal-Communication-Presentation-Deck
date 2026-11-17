'use strict';
/* 第一段：我們到底多黏手機？（資訊圖表：100 人格 → 一天 24 小時 → 一年 → 60 天 → 200 小時交朋友 → 7 個好朋友 → 時間往手機流） */
section('p1', NOTES_BY_SECTION.p1, (b) => {
  /* a node that glides between per-beat states ({t: css transform, o: opacity}) on a forward click; jumps / back / ?still set the end state at once */
  const mover = (node, st, {delay = 500, dur = 1.1, ease = 'cubic-bezier(.45,.05,.2,1)'} = {}) => {
    const keys = Object.keys(st).map(Number).sort((p, q) => p - q);
    const of = bt => { let s = st[keys[0]]; for (const k of keys) if (bt >= k) s = st[k]; return s; };
    const set = s => { node.style.transform = s.t || 'none'; node.style.opacity = s.o == null ? 1 : s.o; };
    let tm = 0;
    beatHooks.push((bt, pb, dir, still) => {
      clearTimeout(tm); node.style.transition = 'none';
      const cur = of(bt), prev = of(pb);
      if (still || STILL || dir <= 0 || cur === prev) { set(cur); return; }
      set(prev); void node.getBoundingClientRect();
      tm = setTimeout(() => { node.style.transition = `transform ${dur}s ${ease}, opacity ${dur}s ease`; set(cur); }, delay);
    });
  };
  const place = (cx, cy, s, nx, ny) => [nx - cx * s, ny - cy * s, s];
  const T = (dx, dy) => `translate(${dx}px, ${dy}px)`;

  /* ---------- p1·0 (b): section header ---------- */
  Kit2D.sectionHeader(item({from: b, to: b + 1}), {active: 0, title: '我們到底多黏手機？'});

  /* ---------- p1·1 / p1·2 (b+1, b+2): the 100-person grid, 95 turn chat-green ---------- */
  const GX = 110, GY = 130, GS = 640;
  Kit2D.grid(item({from: b + 1, to: b + 3}), {x: GX, y: GY, w: GS, h: GS, color: C.line, step: 55});
  Kit2D.grid(item({from: b + 2, to: b + 3, cls: 'fade'}), {x: GX, y: GY, w: GS, h: GS, to: 95, color: C.leaf, icon: 'person-bubble', order: 'cell', step: 16, delay: 200});
  {
    const lg = item({from: b + 1, to: b + 3});
    Kit2D.icon(lg, 'users', {x: GX + 40, y: 826, s: .9, color: C.muted, w: 3.4});
    text(lg, '1 人 = 23 萬人', {x: GX + 90, y: 826, size: 34, fill: C.muted, anchor: 'start'});
  }
  {
    const t1 = item({from: b + 1, to: b + 2});
    text(t1, '台灣大約', {x: 1190, y: 330, size: 50, fill: C.muted});
    text(t1, '2,300 萬人', {x: 1190, y: 460, size: 138, weight: 700});
    const t2 = item({from: b + 2, to: b + 3, delay: 150});
    text(t2, '台灣 ≈ 2,300 萬人', {x: 1190, y: 190, size: 38, fill: C.muted});
    text(t2, 'LINE 每月活躍用戶', {x: 1190, y: 290, size: 52, fill: C.leaf});
    text(t2, '2,200 萬', {x: 1170, y: 440, size: 164, weight: 700, fill: C.leaf});
    text(t2, '每 20 人有 19 人在用 LINE', {x: 1190, y: 590, size: 40});
    Kit2D.source(t2, 'LINE 台灣 2026', {x: 1190, y: 690, anchor: 'middle'});
  }

  /* ---------- p1·3 (b+3): the 24-hour dial ---------- */
  const DX = 520, DY = 470;
  {
    const d = item({x: DX, y: DY, from: b + 3, to: b + 5, pos: {[b + 4]: [250, 260, .5]}});
    const dl = Kit2D.dial(d, {x: 0, y: 0, r: 215, of: 24, from: 0, to: 4, w: 48, ticks: 1, delay: 250});
    const m = dl.pt(2, 215);
    Kit2D.glow(d, {x: m.x, y: m.y, r: 170, color: 'screen', op: .8});
    text(d, '4+', {x: 0, y: -26, size: 190, weight: 700, fill: C.mango});
    text(d, '小時 / 天', {x: 0, y: 92, size: 48, fill: C.muted});
    text(d, '一天 24 小時', {x: 0, y: 292, size: 42, fill: C.muted});
    const tn = item({from: b + 3, to: b + 4, delay: 400});
    text(tn, '國高中生', {x: 1160, y: 250, size: 52});
    Kit2D.person(tn, {x: 1160, y: 760, h: 380, pose: 'phone', color: C.ink, head: C.skin1});
    Kit2D.source(tn, '兒福聯盟 2024', {x: 1160, y: 830, anchor: 'middle'});
  }

  /* ---------- p1·4 (b+4): the year strip, counter 4 -> 1,460 ---------- */
  const SX = 61, SY = 480;
  Kit2D.calendar(item({from: b + 4, to: b + 6, pos: {[b + 5]: [0, -350, 1]}}), {x: SX, y: SY, cols: 53, rows: 7, flow: 'col', count: 365, cell: 22, gap: 6, frac: 0, step: 14});
  Kit2D.calendar(item({from: b + 4, to: b + 5}), {x: SX, y: SY, cols: 53, rows: 7, flow: 'col', count: 365, cell: 22, gap: 6, frac: 1 / 6, base: null, color: C.screen, step: 14, delay: 150});
  {
    const lg = item({from: b + 4, to: b + 5, delay: 300});
    paint(el('rect', {x: SX, y: 722, width: 22, height: 22, rx: 4}, lg), {fill: C.line});
    paint(el('rect', {x: SX, y: 722 + 22 * 5 / 6, width: 22, height: 22 / 6, rx: 2}, lg), {fill: C.screen});
    text(lg, '一格 = 一天，藍色 = 滑掉的 4 小時', {x: SX + 40, y: 733, size: 34, fill: C.muted, anchor: 'start'});
    const cn = item({x: 1010, y: 250, from: b + 4, to: b + 6, pos: {[b + 5]: [1180, 360, .56]}, delay: 250});
    counter(cn, {x: 0, y: 0, size: 180, fill: C.mango, values: {[b + 3]: 4, [b + 4]: 1460}});
    text(cn, '小時 / 年', {x: 0, y: 140, size: 56, fill: C.ink});
    const ar = item({from: b + 4, to: b + 5, delay: 120});
    arrow(ar, 400, 255, 600, 255, C.muted, 6);
  }

  /* ---------- p1·5 (b+5): the blue pours into 60 solid day cells ---------- */
  {
    const MXA = 110, MXB = 520, MY = 440, CELL = 40, GAP = 6;
    const mo = item({from: b + 5, to: b + 6, cls: 'fade'});
    const st = item({from: b + 5, to: b + 6, cls: 'fade'});
    [MXA + 158, MXB + 158].forEach((x, j) => [-100, 0, 100].forEach((dx, i) => {
      draw(st, `M${x + dx} 332 L${x + dx * .7} 430`, C.screen, 9, 100 + i * 120 + j * 80);
    }));
    Kit2D.calendar(mo, {x: MXA, y: MY, cols: 7, rows: 5, cell: CELL, gap: GAP, count: 31, frac: 1, base: null, step: 70, delay: 500});
    Kit2D.calendar(mo, {x: MXB, y: MY, cols: 7, rows: 5, cell: CELL, gap: GAP, count: 29, frac: 1, base: null, step: 70, delay: 800});
    text(mo, '一月', {x: MXA + 158, y: 706, size: 46});
    text(mo, '二月', {x: MXB + 158, y: 706, size: 46});
    const rt = item({from: b + 5, to: b + 6, delay: 700});
    Kit2D.face(rt, {x: 1170, y: 575, r: 82, mood: 'sleepless', glowColor: 'screen'});
    text(rt, '= 60 天', {x: 1170, y: 725, size: 130, weight: 700, fill: C.mango});
    text(rt, '24 小時不睡覺', {x: 1170, y: 820, size: 40, fill: C.muted});
  }

  /* ---------- p1·6 / p1·7 (b+6, b+7): friendship track, then the 1,460-hour bar -> 7 friends ---------- */
  const TP = place(800, 640, .36, 800, 840);
  const TI = o => item(Object.assign({from: b + 6, to: b + 8, pos: {[b + 7]: TP}}, o));
  {
    const tr = TI({});
    paint(el('path', {d: 'M170 652 L1430 652'}, tr), {stroke: C.line, w: 14});
    [170, 1430].forEach(x => paint(el('circle', {cx: x, cy: 652, r: 14}, tr), {fill: C.bg, stroke: C.line, w: 8}));
    text(tr, '不熟', {x: 170, y: 712, size: 38, fill: C.muted});
    text(tr, '不熟', {x: 1430, y: 712, size: 38, fill: C.muted});
    paint(el('path', {d: 'M200 372 L200 334 L1400 334 L1400 372'}, tr), {stroke: C.mango, w: 7});
    text(tr, '200+ 小時', {x: 800, y: 215, size: 150, weight: 700, fill: C.mango});
    /* two people walk toward each other along the track */
    const L = el('g', {}, tr), R = el('g', {}, tr);
    Kit2D.person(L, {x: 728, y: 640, h: 250, pose: 'hand', color: C.mango});
    Kit2D.person(R, {x: 872, y: 640, h: 250, pose: 'hand', color: C.rose, flip: true});
    mover(L, {[b + 5]: {t: T(-535, 0), o: 1}, [b + 6]: {t: T(0, 0), o: 1}}, {delay: 450, dur: 1.2});
    mover(R, {[b + 5]: {t: T(535, 0), o: 1}, [b + 6]: {t: T(0, 0), o: 1}}, {delay: 450, dur: 1.2});
    const hf = TI({delay: 1700});
    Kit2D.burst(hf, {x: 800, y: 384, r: 26, n: 9, len: 22, w: 5});
    text(hf, '好朋友', {x: 800, y: 712, size: 56, weight: 700, fill: C.mango});
    const sr = item({from: b + 6, to: b + 7, delay: 300});
    Kit2D.source(sr, 'Hall 2018', {x: 1440, y: 830, anchor: 'end'});
  }
  {
    /* the 1,460-hour bar splits into 7 x 200 (+ the rest), each piece drops a friend */
    const BX = 150, BW = 1300, BY = 196, BH = 66, U = BW / 1460, SW = 200 * U;
    const bt = item({from: b + 7, to: b + 8});
    text(bt, '一年滑掉', {x: BX, y: 112, size: 44, fill: C.muted, anchor: 'start'});
    text(bt, '1,460 小時', {x: BX + 190, y: 112, size: 60, weight: 700, fill: C.mango, anchor: 'start'});
    const cols = [C.mango, C.rose, C.leaf, C.chili, C.mango, C.rose, C.leaf];
    for (let i = 0; i < 8; i++) {
      const last = i === 7, w = last ? 60 * U : SW;
      const sg = el('g', {}, bt);
      const r = el('rect', {x: BX + i * SW, y: BY - BH / 2, width: w, height: BH, rx: 6}, sg);
      paint(r, {fill: last ? C.line : C.screen});
      if (!last) text(sg, '200', {x: BX + i * SW + w / 2, y: BY + 2, size: 36, fill: C.pearl, weight: 700});
      mover(sg, {[b + 6]: {t: T(0, 0)}, [b + 7]: {t: T((i - 3.5) * 12, 0)}}, {delay: 450, dur: .7});
      if (!last) {
        const fr = el('g', {}, bt), fx = BX + i * SW + w / 2 + (i - 3.5) * 12;
        Kit2D.person(fr, {x: fx, y: 480, h: 170, pose: i % 2 ? 'wave' : 'arms', color: cols[i]});
        mover(fr, {[b + 6]: {t: T(0, -230), o: 0}, [b + 7]: {t: T(0, 0), o: 1}}, {delay: 1000 + i * 130, dur: .55, ease: 'cubic-bezier(.3,1.35,.5,1)'});
      }
    }
    const big = item({from: b + 7, to: b + 8, delay: 1500});
    text(big, '≈ 7 個好朋友', {x: 800, y: 565, size: 116, weight: 700, fill: C.mango});
  }

  /* ---------- p1·8 (b+8): time tokens drift toward the phone ---------- */
  {
    const hd = item({from: b + 8, to: b + 9});
    text(hd, '時間就這麼多', {x: 800, y: 110, size: 100, weight: 700});
    const YX = 760, YF = 760, YH = 320;
    /* the table between me and the person across from me */
    const tb = item({from: b + 8, to: b + 9, cls: 'fade'});
    paint(el('rect', {x: 960, y: 620, width: 220, height: 18, rx: 6}, tb), {fill: C.wood});
    paint(el('rect', {x: 985, y: 638, width: 14, height: 130, rx: 5}, tb), {fill: C.woodDark});
    paint(el('rect', {x: 1141, y: 638, width: 14, height: 130, rx: 5}, tb), {fill: C.woodDark});
    /* person across the table: line-coloured underneath, a warm copy fades out on top */
    const ps = item({from: b + 8, to: b + 9, cls: 'fade'});
    Kit2D.person(ps, {x: 1330, y: YF, h: YH, pose: 'wave', color: C.line, flip: true});
    const warm = el('g', {}, ps);
    Kit2D.person(warm, {x: 1330, y: YF, h: YH, pose: 'wave', color: C.rose, flip: true});
    mover(warm, {[b + 7]: {o: 1}, [b + 8]: {o: 0}}, {delay: 900, dur: 1.2});
    text(ps, '眼前的人', {x: 1330, y: 820, size: 40, fill: C.muted});
    const me = item({from: b + 8, to: b + 9, cls: 'fade'});
    Kit2D.person(me, {x: YX, y: YF, h: YH, pose: 'stand', color: C.ink});
    text(me, '我', {x: YX, y: 820, size: 40, fill: C.muted});
    const ph = item({from: b + 8, to: b + 9, cls: 'fade'});
    const gl = el('g', {}, ph);
    Kit2D.glow(gl, {x: 300, y: 530, r: 260, color: 'screen'});
    mover(gl, {[b + 7]: {o: .35}, [b + 8]: {o: 1}}, {delay: 900, dur: 1.2});
    Kit2D.phone(ph, {x: 300, y: 530, w: 120, glow: false});
    text(ph, '螢幕', {x: 300, y: 820, size: 40, fill: C.screen});
    /* 24 time tokens: a ring around me, then they drift to the phone */
    const tk = item({from: b + 8, to: b + 9, cls: 'fade'});
    for (let i = 0; i < 24; i++) {
      const a = i / 24 * Math.PI * 2 - Math.PI / 2;
      const sx = YX + Math.cos(a) * 230, sy = 560 + Math.sin(a) * 215;
      const ga = i * 2.399, gr = 118 + 21 * Math.sqrt(i);
      const ex = 300 + Math.cos(ga) * gr * 1.15, ey = 530 + Math.sin(ga) * gr;
      const g = el('g', {}, tk);
      const c = el('g', {transform: `translate(${sx} ${sy})`}, g);
      paint(el('circle', {r: 25}, c), {fill: C.paper, stroke: C.mango, w: 4});
      paint(el('path', {d: 'M0 -13 L0 0 L9 6'}, c), {stroke: C.mango, w: 4});
      mover(g, {[b + 7]: {t: T(0, 0), o: 1}, [b + 8]: {t: T(ex - sx, ey - sy), o: 1}}, {delay: 500 + i * 32, dur: 1.0});
    }
  }
});
