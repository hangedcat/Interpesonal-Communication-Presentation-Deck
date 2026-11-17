'use strict';
/* 第二段：什麼才叫真正的溝通？
   17 路線圖 · 18 兩張側臉 · 19 訊息傳出去 · 20 一個來回 · 21 干擾
   22–27 「好啊」示範 · 28–29 email 研究 · 30 定義 · 31 便利貼 */
section('p2', NOTES_BY_SECTION.p2, (b) => {
  const B = k => b + k;

  /* ---- a tiny helper: a short transform animation on one inner group, only on a forward click.
     jump / back / ?still → the settled state at once; any other beat → the resting state ---- */
  const anims = [];
  const anim = (node, beat, startT, endT, {ms = 600, delay = 0, rest = 'none', ease = 'cubic-bezier(.3,1.35,.5,1)'} = {}) => {
    node.style.transformBox = 'fill-box'; node.style.transformOrigin = 'center';
    node.style.transform = rest;
    anims.push({node, beat, startT, endT, ms, delay, rest, ease, t: 0});
    return node;
  };
  beatHooks.push((bt, pb, dir, still) => {
    for (const a of anims) {
      clearTimeout(a.t); a.node.style.transition = 'none';
      if (bt !== a.beat) { a.node.style.transform = a.rest; continue; }
      if (still || STILL || dir <= 0) { a.node.style.transform = a.endT; continue; }
      a.node.style.transform = a.startT; void a.node.getBoundingClientRect();
      a.t = setTimeout(() => { a.node.style.transition = `transform ${a.ms}ms ${a.ease}`; a.node.style.transform = a.endT; }, a.delay);
    }
  });
  const sub = (parent, x = 0, y = 0) => el('g', {}, parent);              // an inner group the helper can move

  /* =============================================================
     17 · heading
     ============================================================= */
  Kit2D.sectionHeader(item({from: B(0), to: B(1), cls: 'fade'}), {active: 1, from: 0, title: '什麼才叫真正的溝通？'});

  /* =============================================================
     18–21 · two faces in profile (stay through the loop beats)
     ============================================================= */
  const FY = 470, FR = 140;
  const bust = (parent, {x, y, r, dir, shirt, skin, neck, hair}) => {
    const o = G(parent, x, y, 1), k = r / 60, f = el('g', {transform: `scale(${dir} 1)`}, o);
    paint(el('rect', {x: -34 * k, y: 30 * k, width: 46 * k, height: 96 * k, rx: 14 * k}, f), {fill: neck});
    paint(el('path', {d: `M${-118 * k} ${250 * k} Q${-118 * k} ${112 * k} ${-50 * k} ${96 * k} L${34 * k} ${96 * k} Q${108 * k} ${112 * k} ${108 * k} ${250 * k} Z`}, f), {fill: shirt});
    Kit2D.faceProfile(o, {x: 0, y: 0, r, dir, fill: skin, hair});
    return o;
  };
  const LX = 245, RX = 1355;
  bust(item({from: B(1), to: B(5), cls: 'slide-left'}), {x: LX, y: FY, r: FR, dir: 1, shirt: C.rose, skin: C.skin1, neck: C.skin2});
  bust(item({from: B(1), to: B(5), cls: 'slide-right', delay: 120}), {x: RX, y: FY, r: FR, dir: -1, shirt: C.mango, skin: C.skin3, neck: '#9B6444'});

  /* 18 · 溝通 = ？ */
  {
    const q = item({from: B(1), to: B(2), delay: 450});
    text(q, '溝通', {x: 635, y: FY - 6, size: 150, weight: 700});
    text(q, '=', {x: 850, y: FY - 6, size: 120, fill: C.muted});
    const qq = item({from: B(1), to: B(2), delay: 900, cls: 'stamp'});
    text(qq, '？', {x: 985, y: FY - 6, size: 170, weight: 700, fill: C.mango});
  }

  /* 19 · a message flies across; 已送出; stamp */
  {
    const g = item({from: B(2), to: B(3), cls: 'fade'});
    const fly = anim(sub(g), B(2), 'translate(-430px, 0px)', 'translate(0px, 0px)', {ms: 1000, delay: 250, rest: 'translate(0px, 0px)', ease: 'cubic-bezier(.4,.05,.2,1)'});
    for (let i = 0; i < 3; i++) paint(el('path', {d: `M${560 - i * 4} ${392 + i * 24 - 24} L${650 - i * 24} ${392 + i * 24 - 24}`}, fly), {stroke: C.muted, w: 7});
    Kit2D.bubble(fly, {x: 800, y: 380, w: 320, h: 180, text: '', fill: C.chatMe, stroke: C.chatMe, tail: 'right'});
    Kit2D.icon(fly, 'plane', {x: 800, y: 380, s: 3.6, color: C.chatInk, w: 3.6});
    const sent = item({from: B(2), to: B(3), delay: 1350, cls: 'fade'});
    text(sent, '已送出', {x: 780, y: 535, size: 54, fill: C.muted});
    check(sent, 902, 536, C.leaf, 1.4);
    const st = item({from: B(2), to: B(3), delay: 1850, cls: 'stamp'});
    Kit2D.stamp(st, '這樣就算溝通？', {x: 800, y: 745, size: 62, rot: -4});
  }

  /* 20–21 · the loop: 說 → 聽 → 懂 → 回應 */
  const CX = 800, CY = 470, R = 250, NR = 72, DELTA = 20 * Math.PI / 180;
  const NODES = [['說', C.mango, -135], ['聽', C.leaf, -45], ['懂', C.leaf, 45], ['回應', C.mango, 135]];
  const polar = (deg, rr = R) => [CX + rr * Math.cos(deg * Math.PI / 180), CY + rr * Math.sin(deg * Math.PI / 180)];
  const arcOf = k => {
    const a0 = NODES[k][2] * Math.PI / 180 + DELTA, a1 = (NODES[k][2] + 90) * Math.PI / 180 - DELTA;
    const p0 = [CX + R * Math.cos(a0), CY + R * Math.sin(a0)], p1 = [CX + R * Math.cos(a1), CY + R * Math.sin(a1)];
    const t = [-Math.sin(a1), Math.cos(a1)], n = [Math.cos(a1), Math.sin(a1)], L = 30;   // tangent (clockwise) and outward normal at the tip
    const head = `M${p1[0] - L * t[0] + L * .62 * n[0]} ${p1[1] - L * t[1] + L * .62 * n[1]} L${p1[0]} ${p1[1]} L${p1[0] - L * t[0] - L * .62 * n[0]} ${p1[1] - L * t[1] - L * .62 * n[1]}`;
    return {d: `M${p0[0]} ${p0[1]} A${R} ${R} 0 0 1 ${p1[0]} ${p1[1]}`, head, p0, p1};
  };
  const loopArc = (parent, k, color, delay, dur = '.6s') => {
    const A = arcOf(k), pth = draw(parent, A.d, color, 9, delay);
    pth.style.transitionDuration = dur;
    const h = paint(el('path', {d: A.head, class: 'cell'}, parent), {stroke: color, w: 9});
    h.style.transitionDelay = (delay + 500) + 'ms';
    return A;
  };
  NODES.forEach(([lab, col, deg], k) => {
    const [x, y] = polar(deg);
    const g = item({from: B(3), to: B(5), delay: k * 430});
    paint(el('circle', {cx: x + 5, cy: y + 6, r: NR}, g), {fill: C.pearl}).style.opacity = .35;
    paint(el('circle', {cx: x, cy: y, r: NR}, g), {fill: C.paper, stroke: col, w: 7});
    text(g, lab, {x, y: y + 2, size: lab.length > 1 ? 54 : 66, weight: 700, fill: col});
  });
  /* arc k goes from node k to node k+1 */
  for (let k = 0; k < 4; k++) {
    if (k === 0) loopArc(item({from: B(3), to: B(4), delay: 150, cls: 'fade'}), 0, C.ink, 0);
    else loopArc(item({from: B(3), to: B(5), delay: k * 430 + 150, cls: 'fade'}), k, C.ink, 0);
  }

  /* the message above the left face (calm on 20, glitched on 21) */
  const MSG = {x: 315, y: 190, w: 470, h: 112, size: 48, str: '我今天其實很難過'};
  const msg = (parent, dx = 0, dy = 0, op = 1) => {
    const g = el('g', {transform: `translate(${dx} ${dy})`}, parent); g.style.opacity = op;
    Kit2D.bubble(g, {x: MSG.x, y: MSG.y, w: MSG.w, h: MSG.h, text: MSG.str, size: MSG.size, fill: C.chatMe, stroke: C.chatMe, color: C.chatInk, tail: 'down'});
    return g;
  };
  msg(item({from: B(3), to: B(4), delay: 1500}));
  /* glitch: three bands slide apart, colour ghosts, dropped pixels */
  {
    const g = item({from: B(4), to: B(5), cls: 'fade'});
    defClip('p2-gl-a', `<rect x="0" y="0" width="1600" height="${MSG.y - 12}"/>`);
    defClip('p2-gl-b', `<rect x="0" y="${MSG.y - 12}" width="1600" height="30"/>`);
    defClip('p2-gl-c', `<rect x="0" y="${MSG.y + 18}" width="1600" height="300"/>`);
    const ghost = el('g', {}, g);
    [[-9, 5, C.chili], [9, -4, C.mango]].forEach(([dx, dy, col]) => {
      text(ghost, MSG.str, {x: MSG.x + dx, y: MSG.y + dy, size: MSG.size, fill: col}).style.opacity = .6;
    });
    [['p2-gl-a', -16, '0s'], ['p2-gl-b', 22, '0s'], ['p2-gl-c', -8, '0s']].forEach(([id, dx], i) => {
      const clip = el('g', {'clip-path': `url(#${id})`}, g);
      const inner = sub(clip);
      msg(inner, 0, 0);
      anim(inner, B(4), `translate(${i === 1 ? -70 : 70}px, 0px)`, `translate(${dx}px, 0px)`, {ms: 420, delay: 250 + i * 70, rest: `translate(${dx}px, 0px)`, ease: 'steps(4, end)'});
    });
    [[100, 160, 38], [450, 236, 26], [196, 244, 20], [520, 146, 20]].forEach(([x, y, w]) => paint(el('rect', {x, y, width: w, height: 10}, g), {fill: C.chili}));
  }
  /* the broken arrow: 說 → 聽 turns into dashes and a snap */
  {
    const g = item({from: B(4), to: B(5), cls: 'fade', delay: 500});
    const A = arcOf(0);
    paint(el('path', {d: A.d}, g), {stroke: C.chili, w: 9, dash: '22 26'});
    Kit2D.burst(g, {x: (A.p0[0] + A.p1[0]) / 2, y: CY - R + 4, r: 44, n: 6, len: 26, color: C.chili, w: 6});
  }
  /* notification banners fall into the loop, dot badges only */
  [['限時動態更新', 425, 794, -3], ['群組有新訊息', 473, 808, 2.2], ['優惠快搶', 521, 797, -1.6]].forEach(([str, y, x, rot], i) => {
    const g = item({from: B(4), to: B(5), cls: 'fade', delay: 650 + i * 280});
    const fall = anim(sub(g), B(4), 'translate(0px, -330px)', 'translate(0px, 0px)', {ms: 520, delay: 650 + i * 280, rest: 'translate(0px, 0px)', ease: 'cubic-bezier(.3,1.25,.5,1)'});
    const n = G(fall, x, y, 1); n.setAttribute('transform', `translate(${x} ${y}) rotate(${rot})`);
    paint(el('rect', {x: -185, y: -36, width: 380, height: 88, rx: 22}, n), {fill: C.pearl}).style.opacity = .4;
    paint(el('rect', {x: -190, y: -42, width: 380, height: 88, rx: 22}, n), {fill: C.screen});
    paint(el('rect', {x: -170, y: -30, width: 40, height: 40, rx: 11}, n), {fill: C.pearl});
    paint(el('circle', {cx: -150, cy: -10, r: 9}, n), {fill: C.screen});
    text(n, str, {x: -112, y: -9, size: 31, fill: C.pearl, anchor: 'start'});
    paint(el('rect', {x: -112, y: 20, width: 150 + i * 30, height: 9, rx: 4}, n), {fill: C.pearl}).style.opacity = .28;
    Kit2D.badge(n, {x: 164, y: -9, r: 11});
  });
  tag(item({from: B(4), to: B(5), delay: 1450, cls: 'stamp'}), '干擾', C.chili, {x: 800, y: 118, size: 62});

  /* =============================================================
     22–27 · 「好啊」
     ============================================================= */
  const COLS = [300, 800, 1300], FY2 = 310, FR2 = 125;
  const MOODS = [
    {mood: 'happy', col: C.leaf, glow: 'leaf', kind: 'bounce', tag: '真的很想去'},
    {mood: 'tired', col: C.mango, glow: 'mango', kind: 'long', tag: '不太想去'},
    {mood: 'cold', col: C.chili, glow: 'chili', kind: 'sharp', tag: '你最好小心一點'}
  ];
  /* the huge word, then it shrinks to the top */
  const big = item({x: 800, y: 540, from: B(5), to: B(10), pos: {[B(6)]: [800, 98, .42]}, cls: 'stamp'});
  text(big, '好啊', {x: 0, y: 0, size: 270, weight: 700, fill: C.mango});
  /* three blank outlines waiting behind it; each is replaced by its lit face on its own beat */
  MOODS.forEach((m, i) => {
    const bl = item({from: B(5), to: B(6 + i), cls: 'fade', delay: 250 + i * 160});
    Kit2D.face(bl, {x: COLS[i], y: FY2, r: FR2, mood: 'blank'});
    const g = item({from: B(6 + i), to: B(10)});
    const flipOut = sub(g);
    Kit2D.face(flipOut, {x: COLS[i], y: FY2, r: FR2, mood: m.mood, glowColor: m.glow});
    anim(flipOut, B(10), 'scaleX(1)', 'scaleX(0)', {ms: 320, delay: 0, rest: 'none', ease: 'ease-in'});
    /* a small extra that says it without words */
    const x = COLS[i];
    if (i === 0) { Kit2D.burst(g, {x: x - 150, y: FY2 - 70, r: 18, n: 5, len: 18, color: C.mango, w: 6}); Kit2D.burst(g, {x: x + 150, y: FY2 - 70, r: 18, n: 5, len: 18, color: C.mango, w: 6}); }
    if (i === 1) [[x + 150, FY2 + 60, 15], [x + 182, FY2 + 30, 10], [x + 206, FY2 + 6, 7]].forEach(([cx, cy, rr]) => paint(el('circle', {cx, cy, r: rr}, g), {stroke: C.muted, w: 4}));
    if (i === 2) [[-34, 0], [0, 6], [34, 0]].forEach(([dx, dy]) => paint(el('path', {d: `M${x + dx} ${FY2 - 118 + dy} l0 26`}, g), {stroke: C.muted, w: 6}));
    /* voice waveform */
    const wv = item({from: B(6 + i), to: B(10), delay: 450});
    Kit2D.wave(wv, {x: x - 195, y: 590, w: 390, h: 150, kind: m.kind, color: m.col, step: 24});
    /* the coloured tag */
    const tg = item({from: B(6 + i), to: B(9), delay: 1000, cls: 'stamp'});
    tag(tg, m.tag, m.col, {x, y: 748, size: i === 2 ? 44 : 50});
  });
  /* 26 · 語氣 / 表情 / 眼神 */
  {
    const ch = [['語氣', 'wave', C.mango], ['表情', 'smile', C.rose], ['眼神', 'eye', C.ink]];
    ch.forEach(([str, ic, col], i) => {
      const g = item({from: B(9), to: B(10), delay: 300 + i * 330, cls: 'stamp'});
      const x = 490 + i * 310, y = 760;
      paint(el('rect', {x: x - 140 + 5, y: y - 46 + 6, width: 280, height: 92, rx: 46}, g), {fill: C.pearl}).style.opacity = .35;
      paint(el('rect', {x: x - 140, y: y - 46, width: 280, height: 92, rx: 46}, g), {fill: C.paper, stroke: col, w: 5});
      Kit2D.icon(g, ic, {x: x - 80, y, s: 1.4, color: col, w: 4});
      text(g, str, {x: x + 30, y: y + 2, size: 58, weight: 700});
    });
    COLS.forEach((x, i) => {
      const g = item({from: B(9), to: B(10), cls: 'fade', delay: 1100 + i * 150});
      Kit2D.scribble(g, {x, y: FY2 - 14, rx: 82, ry: 22, color: C.ink, w: 6, delay: 1100 + i * 150});
    });
  }
  /* 27 · on a chat screen it is only two characters */
  COLS.forEach((x, i) => {
    const g = item({from: B(10), to: B(11), cls: 'fade'});
    const flipIn = anim(sub(g), B(10), 'scaleX(0)', 'scaleX(1)', {ms: 420, delay: 300 + i * 120, rest: 'scaleX(1)'});
    Kit2D.bubble(flipIn, {x, y: 215, w: 270, h: 150, text: '好啊', size: 84, fill: C.chatMe, stroke: C.chatMe, color: C.chatInk, tail: 'right'});
    const q = item({from: B(10), to: B(11), delay: 650 + i * 120, cls: 'stamp'});
    Kit2D.face(q, {x, y: 430, r: 88, mood: 'blank', outline: C.muted});
  });
  [['eye-off', '看不到臉', 560], ['speaker-off', '聽不到聲音', 1040]].forEach(([ic, str, x], i) => {
    const g = item({from: B(10), to: B(11), delay: 800 + i * 330, cls: 'stamp'});
    Kit2D.icon(g, ic, {x: x - 150, y: 640, s: 2.4, color: C.muted, w: 3.4});
    text(g, str, {x: x - 80, y: 642, size: 54, anchor: 'start', weight: 700});
  });
  text(item({from: B(10), to: B(11), delay: 1650, cls: 'stamp'}), '只能用猜的', {x: 800, y: 810, size: 96, weight: 700, fill: C.mango});

  /* =============================================================
     28–29 · the email study (qualitative only)
     ============================================================= */
  const SX = 200, RXp = 1440, PY = 762, PH = 370;
  const E1 = 450, E2 = 780, EY = 468, SHIFT = 340, ES = 1.4;
  Kit2D.person(item({from: B(11), to: B(13), cls: 'slide-left'}), {x: SX, y: PY, h: PH, pose: 'arms', color: C.mango});
  Kit2D.person(item({from: B(11), to: B(12), cls: 'slide-right', delay: 100}), {x: RXp, y: PY, h: PH, pose: 'stand', flip: true});
  Kit2D.person(item({from: B(12), to: B(13), cls: 'fade'}), {x: RXp, y: PY, h: PH, pose: 'shrug', flip: true});
  Kit2D.icon(item({from: B(11), to: B(12), delay: 600}), 'clock', {x: RXp, y: 340, s: 1.7, color: C.muted, w: 3.4});
  /* the sender's confident thought bubble: whole on 28, cracked on 29 */
  const BUB = {x: 820, y: 190, w: 840, h: 200, text: '對方一定看得懂！', size: 80, fill: C.paper, stroke: C.mango, color: C.ink, kind: 'thought', tail: 'left', sw: 6};
  Kit2D.bubble(item({from: B(11), to: B(12), delay: 500}), BUB);
  {
    const g = item({from: B(12), to: B(13), cls: 'fade'});
    const zig = [[760, 60], [800, 125], [748, 190], [806, 255], [762, 315], [800, 380]];
    const left = 'M0 0 L' + zig.map(p => p.join(' ')).join(' L') + ' L0 380 Z';
    const right = 'M1600 0 L' + zig.map(p => p.join(' ')).join(' L') + ' L1600 380 Z';
    defClip('p2-ck-l', `<path d="${left}"/>`); defClip('p2-ck-r', `<path d="${right}"/>`);
    [['p2-ck-l', -14, 8, -1.2], ['p2-ck-r', 14, -6, 1.4]].forEach(([id, dx, dy, rot], i) => {
      const clip = el('g', {'clip-path': `url(#${id})`}, g);
      const inner = sub(clip);
      Kit2D.bubble(inner, BUB);
      anim(inner, B(12), 'translate(0px, 0px)', `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, {ms: 380, delay: 500, rest: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, ease: 'cubic-bezier(.3,1.6,.5,1)'});
    });
    paint(el('path', {d: 'M' + zig.map(p => p.join(' ')).join(' L')}, g), {stroke: C.chili, w: 7}).style.strokeLinejoin = 'miter';
  }
  /* the two envelopes: they ride from the sender over to the receiver on 29 */
  [[E1, '認真', C.leaf, 0], [E2, '反話 / 開玩笑', C.mango, 1]].forEach(([ex, lab, col, i]) => {
    const g = item({x: ex, y: EY, s: ES, from: B(11), to: B(13), delay: 700 + i * 250, pos: {[B(12)]: [ex + SHIFT, EY, ES]}});
    paint(el('rect', {x: -90, y: -58, width: 190, height: 130, rx: 14}, g), {fill: C.pearl}).style.opacity = .35;
    paint(el('rect', {x: -95, y: -65, width: 190, height: 130, rx: 14}, g), {fill: C.poster, stroke: C.hair, w: 6});
    paint(el('path', {d: 'M-93 -58 L0 10 L93 -58'}, g), {stroke: C.hair, w: 6});
    paint(el('circle', {cx: 0, cy: 12, r: 15}, g), {fill: col, stroke: C.hair, w: 4});
    tag(g, lab, col, {x: 0, y: 122, size: 28});
  });
  /* 29 · the receiver opens them */
  text(item({from: B(12), to: B(13), delay: 700, cls: 'stamp'}), '？', {x: E1 + SHIFT, y: 333, size: 130, weight: 700, fill: C.ink});
  text(item({from: B(12), to: B(13), delay: 1000, cls: 'stamp'}), '！？', {x: E2 + SHIFT, y: 333, size: 130, weight: 700, fill: C.chili});
  {
    const g = item({from: B(12), to: B(13), delay: 1300, cls: 'fade'});
    text(g, '當真了', {x: E2 + SHIFT, y: 730, size: 46, fill: C.chili});
    arrow(g, E2 + SHIFT, 700, E2 + SHIFT, 680, C.chili, 6);
  }
  text(item({from: B(12), to: B(13), delay: 1600, cls: 'stamp'}), '看錯的，比想的還要多', {x: 800, y: 822, size: 64, weight: 700, fill: C.mango});

  /* =============================================================
     30 · definition
     ============================================================= */
  {
    const o = 150;                                    /* shift the whole composition toward the centre */
    const top = item({from: B(13), to: B(14), cls: 'fade'});
    Kit2D.icon(top, 'plane', {x: 270 + o, y: 270, s: 4.2, color: C.muted, w: 3.2});
    cross(top, 270 + o, 270, 190, C.chili, 14);
    text(top, '≠', {x: 490 + o, y: 270, size: 130, weight: 700, fill: C.chili});
    text(top, '把字傳過去', {x: 610 + o, y: 272, size: 100, weight: 700, fill: C.muted, anchor: 'start'});
    const bot = item({from: B(13), to: B(14), delay: 900});
    Kit2D.glow(bot, {x: 305 + o, y: 625, r: 250, color: 'lamp', op: .55});
    Kit2D.faceProfile(bot, {x: 165 + o, y: 635, r: 88, dir: 1, fill: C.skin1});
    Kit2D.faceProfile(bot, {x: 445 + o, y: 635, r: 88, dir: -1, fill: C.skin3});
    Kit2D.icon(bot, 'spark', {x: 305 + o, y: 580, s: 2.2, color: C.mango});
    text(bot, '=', {x: 540 + o + 30, y: 622, size: 130, weight: 700, fill: C.leaf});
    text(bot, '對方真的懂你', {x: 640 + o + 30, y: 624, size: 100, weight: 700, anchor: 'start'});
  }

  /* =============================================================
     31 · the sticky note, pinned (same call as p5·19)
     ============================================================= */
  Kit2D.sticky(item({x: 560, y: 450, s: 1.7, from: B(14), to: B(15), cls: 'stamp'}), ['你有在聽', '我說。'], {x: 0, y: 0});
  {
    const g = item({from: B(14), to: B(15), delay: 900});
    Kit2D.icon(g, 'pin', {x: 1000, y: 430, s: 2, color: C.chili, w: 4});
    text(g, '先記著', {x: 1070, y: 434, size: 88, weight: 700, fill: C.mango, anchor: 'start'});
  }
});
