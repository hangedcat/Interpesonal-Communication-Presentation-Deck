'use strict';
/* 第四段：手機不是壞人（加開一站 → 嫌犯排排站 → 無罪 → 視訊 → 80 / 67 → 問題在怎麼用 → 遠近兩條路 → 近的人呢？） */
section('p4', NOTES_BY_SECTION.p4, (b) => {
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
  const T = (dx, dy) => `translate(${dx}px, ${dy}px)`;
  const R = (parent, x, y, w, h, rx, o = {}) => paint(el('rect', {x, y, width: w, height: h, rx}, parent), o);
  const Ci = (parent, cx, cy, r, o = {}) => paint(el('circle', {cx, cy, r}, parent), o);
  const P = (parent, d, o = {}) => paint(el('path', {d}, parent), o);
  /* two hands linked, drawn small (the "connection" mark) */
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

  /* ---------- p4·0 (b): header with the extra stop ---------- */
  {
    const MY = 330, K = 1.4;
    const L = Kit2D.mrtLayout({x: 220, y: MY, w: 1160, extra: true});
    Kit2D.mrtLine(item({from: b, to: b + 1, cls: 'fade'}), L, {upTo: 'extra'});
    [0, 1, 2, 3].forEach(i => Kit2D.mrtStation(item({from: b, to: b + 1, delay: i * 160}), L, i, {state: i < 3 ? 'done' : 'idle', size: 36, k: K}));
    Kit2D.mrtStation(item({from: b, to: b + 1, delay: 900, cls: 'stamp'}), L, 'extra', {state: 'lit', size: 36, k: K, label: '加開一站：手機不是壞人', labelAbove: true, labelDy: -156 * K, num: '加'});
    Kit2D.rider(item({from: b, to: b + 1, cls: 'fade'}), {x: L.extraPt.x, y: MY - 40, fromX: L.pts[2].x, s: K});
    text(item({from: b, to: b + 1, delay: 300, cls: 'fade'}), '手機不是壞人', {x: 800, y: 640, size: 100, weight: 700});
  }

  /* ---------- p4·1 / p4·2 (b+1, b+2): the line-up ---------- */
  {
    const wall = item({from: b + 1, to: b + 3});
    R(wall, 230, 290, 1140, 580, 10, {fill: C.paper, stroke: C.line, w: 4});
    for (let i = 0; i <= 10; i++) {
      const y = 330 + i * 52;
      P(wall, `M258 ${y} L${i % 5 === 0 ? 400 : 340} ${y} M1342 ${y} L${i % 5 === 0 ? 1200 : 1260} ${y}`, {stroke: C.muted, w: i % 5 === 0 ? 5 : 3});
      if (i % 5) continue;
      P(wall, `M400 ${y} L1200 ${y}`, {stroke: C.line, w: 2, dash: '3 12'});
    }
    const side = el('g', {}, wall); side.style.opacity = .5;
    Kit2D.person(side, {x: 480, y: 850, h: 330, color: C.muted});
    Kit2D.person(side, {x: 1120, y: 850, h: 260, color: C.muted});
    /* the guilty phone */
    const ch = item({from: b + 1, to: b + 3, cls: 'fade'});
    [[-26, 1], [26, -1]].forEach(([dx]) => R(ch, 800 + dx - 11, 780, 22, 66, 11, {fill: C.pearl}));
    [-44, 44].forEach(dx => el('ellipse', {cx: 800 + dx, cy: 848, rx: 24, ry: 11}, ch).style.fill = C.pearl);
    P(ch, 'M724 590 Q684 640 702 724', {stroke: C.pearl, w: 16});
    P(ch, 'M876 590 Q916 640 898 724', {stroke: C.pearl, w: 16});
    Kit2D.phone(ch, {x: 800, y: 640, w: 150, color: C.screen});
    const gf = item({from: b + 1, to: b + 2, cls: 'fade'});
    [[-30, 598], [30, 598]].forEach(([dx, y]) => { el('ellipse', {cx: 800 + dx, cy: y, rx: 15, ry: 17}, gf).style.fill = '#fff'; Ci(gf, 800 + dx - 6, y + 2, 7, {fill: C.pearl}); });
    P(gf, 'M772 566 L790 574 M828 574 L846 566', {stroke: C.pearl, w: 5});
    P(gf, 'M778 672 Q789 662 800 672 Q811 682 822 672', {stroke: C.pearl, w: 5});
    P(gf, 'M884 520 Q896 540 890 550 Q878 556 874 544 Q874 534 884 520 Z', {fill: C.screen});
    const rf = item({from: b + 2, to: b + 3, cls: 'fade', delay: 250});
    P(rf, 'M770 598 Q782 586 794 598 M806 598 Q818 586 830 598', {stroke: C.pearl, w: 6});
    P(rf, 'M772 650 Q800 684 828 650 Z', {fill: C.pearl});
    Ci(rf, 768, 632, 9, {fill: C.rose}).style.opacity = .7; Ci(rf, 832, 632, 9, {fill: C.rose}).style.opacity = .7;
    /* three posters point at it, then fall away */
    const ps = item({from: b + 1, to: b + 3, pos: {[b + 2]: [0, 560, 1]}, op: {[b + 2]: 0}, delay: 200});
    const arts = [
      (a, {h}) => Kit2D.person(a, {x: 0, y: h * .4, h: h * .9, pose: 'phone'}),
      (a) => { Kit2D.phone(a, {x: 0, y: -6, w: 70, tilt: 90, glow: false}); P(a, 'M-100 38 L100 38', {stroke: C.woodDark, w: 8}); },
      (a) => Kit2D.bubble(a, {x: 0, y: -4, w: 130, h: 80, text: '……', size: 44, fill: C.paper, stroke: C.hair, color: C.hair, tail: 'left'})
    ];
    [['低頭', 520], ['桌上的手機', 800], ['文字', 1080]].forEach(([nm, x], i) =>
      Kit2D.poster(G(ps, x, 160, .56), {x: 0, y: 0, name: nm, art: arts[i], rot: (i - 1) * 3}));
    const ar = item({from: b + 1, to: b + 2, delay: 900});
    arrow(ar, 540, 290, 742, 468, C.chili, 7); arrow(ar, 800, 292, 800, 462, C.chili, 7); arrow(ar, 1060, 290, 858, 468, C.chili, 7);
    Kit2D.stamp(item({from: b + 2, to: b + 3, cls: 'stamp'}), '無罪', {x: 800, y: 395, size: 140, color: C.leaf, rot: -9});
  }

  /* ---------- p4·3 (b+3): the video call ---------- */
  {
    const arc = item({from: b + 3, to: b + 4, cls: 'fade'});
    P(arc, 'M240 650 Q800 -330 1360 650', {stroke: C.mango, w: 9, dash: '1 24'});
    const lf = item({from: b + 3, to: b + 4, delay: 250});
    Kit2D.person(lf, {x: 190, y: 700, h: 190, pose: 'phone', color: C.ink});
    text(lf, '宿舍', {x: 190, y: 770, size: 52});
    const hs = item({from: b + 3, to: b + 4, delay: 400});
    P(hs, 'M1290 600 L1400 520 L1510 600 Z', {fill: C.wood});
    R(hs, 1312, 600, 176, 110, 6, {fill: C.brothWhite});
    R(hs, 1394, 636, 44, 74, 6, {fill: C.woodDark});
    R(hs, 1326, 622, 46, 40, 5, {fill: C.lamp});
    Kit2D.glow(hs, {x: 1349, y: 642, r: 70, color: 'lamp', op: .9});
    text(hs, '家', {x: 1400, y: 770, size: 64, weight: 700, fill: C.mango});
    const sh = Chat.shell({x: 590, y: 30, w: 420, from: b + 3, to: b + 4, dark: true, time: {[b + 3]: '21:30'}});
    const sv = el('svg', {viewBox: '0 0 396 760', width: '100%', height: '100%', preserveAspectRatio: 'xMidYMid slice'}, sh.body);
    sv.style.display = 'block';
    R(sv, 0, 0, 396, 760, 0, {fill: C.pearl});
    Kit2D.glow(sv, {x: 200, y: 330, r: 330, color: 'lamp', op: 1});
    R(sv, 20, 120, 130, 150, 6, {fill: C.sticky}).style.opacity = .12;
    /* mom and dad */
    const body = (cx, col) => P(sv, `M${cx - 92} 780 Q${cx - 92} 470 ${cx} 462 Q${cx + 92} 470 ${cx + 92} 780 Z`, {fill: col});
    body(118, 'var(--cloth-f)'); body(282, 'var(--cloth-a)');
    const hairBack = (cx) => P(sv, `M${cx - 74} 380 Q${cx - 80} 250 ${cx} 250 Q${cx + 80} 250 ${cx + 74} 380 Q${cx + 70} 420 ${cx + 56} 410 L${cx - 56} 410 Q${cx - 70} 420 ${cx - 74} 380 Z`, {fill: C.hair});
    hairBack(282);
    Kit2D.face(sv, {x: 118, y: 360, r: 76, mood: 'happy'});
    Kit2D.face(sv, {x: 282, y: 360, r: 76, mood: 'happy'});
    P(sv, 'M44 346 Q40 282 118 280 Q196 282 192 346 Q160 312 118 316 Q76 312 44 346 Z', {fill: C.hair});                /* dad's hair */
    P(sv, 'M214 332 Q226 278 282 280 Q338 278 350 332 Q316 312 282 322 Q248 312 214 332 Z', {fill: C.hair});            /* mom's fringe */
    [[84, 360], [152, 360]].forEach(([x, y]) => Ci(sv, x, y, 21, {stroke: C.hair, w: 4}));
    P(sv, 'M105 360 L131 360', {stroke: C.hair, w: 4});
    /* waving hands */
    const wave = (x, y, s) => {
      const w = el('g', {transform: `translate(${x} ${y}) scale(${s})`}, sv);
      P(w, 'M0 90 Q-6 50 0 24', {stroke: C.skin2, w: 22});
      Ci(w, 0, 0, 30, {fill: C.skin1});
      [-24, -8, 8, 24].forEach(dx => P(w, `M${dx} -22 L${dx * 1.35} -48`, {stroke: C.skin1, w: 13}));
      P(w, 'M-46 -30 Q-58 -6 -46 18 M46 -30 Q58 -6 46 18', {stroke: C.mango, w: 5});
      return w;
    };
    wave(36, 300, .8); wave(362, 250, .8);
    /* self view */
    R(sv, 276, 34, 108, 148, 16, {fill: C.paper, stroke: C.ink, w: 4});
    Kit2D.face(sv, {x: 330, y: 108, r: 38, mood: 'happy', fill: C.skin2});
    P(sv, 'M292 100 Q292 70 330 68 Q368 70 368 100 Q350 84 330 86 Q310 84 292 100 Z', {fill: C.hair});
    /* the dog pokes into the frame from below */
    const dog = el('g', {}, sv);
    P(dog, 'M120 560 Q104 560 104 604 Q106 650 134 646 Q138 600 132 566 Z', {fill: C.woodDark});
    P(dog, 'M280 560 Q296 560 296 604 Q294 650 266 646 Q262 600 268 566 Z', {fill: C.woodDark});
    Ci(dog, 200, 620, 84, {fill: C.tea});
    el('ellipse', {cx: 200, cy: 650, rx: 46, ry: 36}, dog).style.fill = C.dough;
    Ci(dog, 168, 608, 9, {fill: C.hair}); Ci(dog, 232, 608, 9, {fill: C.hair});
    el('ellipse', {cx: 200, cy: 634, rx: 17, ry: 12}, dog).style.fill = C.hair;
    P(dog, 'M200 646 L200 658 M182 666 Q200 680 218 666', {stroke: C.hair, w: 5});
    P(dog, 'M190 674 Q200 704 210 674 Z', {fill: C.rose});
    mover(dog, {[b + 2]: {t: T(0, 250)}, [b + 3]: {t: T(0, 0)}}, {delay: 900, dur: .9, ease: 'cubic-bezier(.3,1.3,.5,1)'});
  }

  /* ---------- p4·4 / p4·5 (b+4, b+5): 80 of 100, then 67 of 100 ---------- */
  {
    const GX = 110, GY = 130, GS = 640, S = .6, LX = 210, LY = 170;
    const pos = {[b + 5]: [LX - GX * S, LY - GY * S, S]};
    Kit2D.grid(item({from: b + 4, to: b + 6, pos}), {x: GX, y: GY, w: GS, h: GS, color: C.line, step: 55});
    Kit2D.grid(item({from: b + 4, to: b + 6, pos, cls: 'fade'}), {x: GX, y: GY, w: GS, h: GS, to: 80, color: C.leaf, order: 'cell', step: 16, delay: 200});
    const t1 = item({from: b + 4, to: b + 5, delay: 200});
    text(t1, '80%', {x: 1180, y: 380, size: 230, weight: 700, fill: C.mango});
    text(t1, '更知道朋友的生活', {x: 1180, y: 540, size: 54});
    Kit2D.source(t1, 'Pew 2022', {x: 1180, y: 640, anchor: 'middle'});
    const t1b = item({from: b + 5, to: b + 6, delay: 200});
    text(t1b, '80%', {x: LX + 192, y: 625, size: 140, weight: 700, fill: C.mango});
    text(t1b, '更知道朋友的生活', {x: LX + 192, y: 735, size: 36});
    const RX = 1006;
    Kit2D.grid(item({from: b + 5, to: b + 6}), {x: RX, y: LY, w: 384, h: 384, color: C.line, step: 40, delay: 500});
    Kit2D.grid(item({from: b + 5, to: b + 6, cls: 'fade'}), {x: RX, y: LY, w: 384, h: 384, to: 67, color: C.leaf, order: 'cell', step: 16, delay: 1000});
    const t2 = item({from: b + 5, to: b + 6, delay: 1100});
    text(t2, '67%', {x: RX + 192, y: 625, size: 140, weight: 700, fill: C.mango});
    text(t2, '遇到困難，覺得有人支持', {x: RX + 192, y: 735, size: 36});
    clasp(t2, RX + 192, 112, .3);
    Kit2D.source(item({from: b + 5, to: b + 6, delay: 400}), 'Pew 2022', {x: 800, y: 830, anchor: 'middle'});
  }

  /* ---------- p4·6 (b+6): the problem is not the phone, it is how we use it ---------- */
  {
    const px = 800, py = 450;
    const ph = item({from: b + 6, to: b + 7, cls: 'fade'});
    Kit2D.glow(ph, {x: px, y: py, r: 330, color: 'screen', op: .8});
    P(ph, `M${px - 50} 640 L${px - 56} 920 L${px + 56} 920 L${px + 50} 640 Z`, {fill: C.skin2});
    el('ellipse', {cx: px, cy: 596, rx: 76, ry: 52}, ph).style.fill = C.skin2;
    Kit2D.phone(ph, {x: px, y: py - 6, w: 170, color: C.screen});
    R(ph, px - 96, 500, 36, 108, 18, {fill: C.skin2}).setAttribute('transform', `rotate(-16 ${px - 78} 554)`);
    [450, 492, 534, 576].forEach(y => { R(ph, px + 62, y, 52, 34, 17, {fill: C.skin2}); });
    [496, 538, 580].forEach(y => P(ph, `M${px + 66} ${y - 3} L${px + 100} ${y - 3}`, {stroke: C.skin3, w: 3}));
    const l = item({from: b + 6, to: b + 7, delay: 150});
    const lt = text(l, '問題 ≠ ', {x: 90, y: 270, size: 100, anchor: 'start'});
    const w1 = lt.getComputedTextLength();
    text(l, '手機', {x: 90 + w1, y: 270, size: 100, anchor: 'start', fill: C.muted});
    draw(l, `M${80 + w1} 304 L${90 + w1 + 214} 238`, C.chili, 13, 600);
    const r = item({from: b + 6, to: b + 7, delay: 1200});
    const rt = text(r, '問題 = ', {x: 940, y: 650, size: 92, anchor: 'start'});
    text(r, '怎麼用', {x: 940 + rt.getComputedTextLength() + 8, y: 650, size: 92, anchor: 'start', fill: C.mango, weight: 700});
  }

  /* ---------- p4·7 / p4·8 (b+7, b+8): two lanes, then the near person ---------- */
  {
    const MEX = 1330, F1 = 410, F2 = 750, H = 190;
    const ln = item({from: b + 7, to: b + 9});
    [[120, '遠的人變近', C.leaf], [460, '近的人變遠', C.chili]].forEach(([y, lbl, col]) => {
      R(ln, 90, y, 1420, 290, 24, {fill: C.paper, stroke: C.line, w: 4});
      text(ln, lbl, {x: 800, y: y + 40, size: 54, weight: 700, fill: col});
    });
    P(ln, 'M300 316 L1240 316', {stroke: C.leaf, w: 6, dash: '2 16'});
    Kit2D.icon(ln, 'signal', {x: 780, y: 270, s: 1.2, color: C.screen});
    Kit2D.person(ln, {x: MEX, y: F1, h: H, pose: 'phone', color: C.ink, flip: true});
    Kit2D.person(ln, {x: MEX, y: F2, h: H, pose: 'phone', color: C.ink, flip: true});
    const far = el('g', {}, ln), near = el('g', {}, ln);
    Kit2D.person(far, {x: 380, y: F1, h: H, pose: 'wave', color: C.mango});
    Kit2D.person(near, {x: 920, y: F2, h: H, pose: 'wave', color: C.mango});
    mover(far, {[b + 6]: {t: T(0, 0), o: .4}, [b + 7]: {t: T(520, 0), o: 1}}, {delay: 450, dur: 1.3});
    mover(near, {[b + 6]: {t: T(0, 0), o: 1}, [b + 7]: {t: T(-540, 0), o: .4}, [b + 8]: {t: T(-540, 0), o: 1}}, {delay: 450, dur: 1.3});
    const d1 = item({from: b + 7, to: b + 9, delay: 1700});
    arrow(d1, 1100, 214, 960, 214, C.leaf, 7); arrow(d1, 1100, 214, 1240, 214, C.leaf, 7);
    const d2 = item({from: b + 7, to: b + 9, delay: 1700});
    arrow(d2, 850, 560, 480, 560, C.chili, 7); arrow(d2, 850, 560, 1220, 560, C.chili, 7);
    /* the spotlight on the near person */
    const cx = 380, cy = 650, Rr = 150;
    const sp = item({from: b + 8, to: b + 9, cls: 'fade'});
    const ov = el('path', {d: `M0 0 H1600 V900 H0 Z M${cx - Rr} ${cy} a${Rr} ${Rr} 0 1 0 ${2 * Rr} 0 a${Rr} ${Rr} 0 1 0 ${-2 * Rr} 0 Z`, 'fill-rule': 'evenodd'}, sp);
    ov.style.fill = C.bg; ov.style.opacity = .84;
    Ci(sp, cx, cy, Rr, {stroke: C.mango, w: 6});
    Kit2D.glow(sp, {x: cx, y: cy, r: 250, color: 'lamp', op: .5});
    const tx = item({from: b + 8, to: b + 9, delay: 300});
    text(tx, '近的人呢？', {x: 960, y: 610, size: 150, weight: 700, fill: C.mango});
    arrow(tx, 640, 640, 548, 650, C.mango, 8);
  }
});
