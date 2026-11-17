'use strict';
/* 第三段：偷走溝通的三個小偷（通緝海報牆 → 低頭 → 桌上的手機 → 文字） */
section('p3', NOTES_BY_SECTION.p3, (b) => {
  const BX = 1496, BY = 112, BS = .28;                 /* the small poster that stays in the corner while a thief is on */
  const PW = 330, PH = 470;

  /* ================= 0: the route map, station ③ ================= */
  Kit2D.sectionHeader(item({from: b, to: b + 1, cls: 'fade'}), {active: 2, title: '偷走溝通的三個小偷', from: 1});

  /* ================= 1: the wall of three posters ================= */
  const wall = item({from: b + 1, to: b + 3, cls: 'fade', op: {[b + 2]: .3}});
  for (let r = 0; r < 14; r++) {
    const y = 20 + r * 66, off = r % 2 ? 0 : 60;
    paint(el('path', {d: `M0 ${y} L1600 ${y}`}, wall), {stroke: C.line, w: 3}).style.opacity = .4;
    for (let x = off + 60; x < 1700; x += 120) paint(el('path', {d: `M${x} ${y} L${x} ${y + 66}`}, wall), {stroke: C.line, w: 3}).style.opacity = .4;
  }

  const FWD = [b + 2, b + 11, b + 20], END = [b + 11, b + 20, b + 26];
  const WALL = [[300, 460, -2.5], [800, 460, 1.5], [1300, 460, -1.5]];
  const NAMES = ['低頭', '桌上的手機', '文字'];
  /* picture windows: the unresolved one is the default dark silhouette with a ？ */
  const night = (a, w, h) => paint(el('rect', {x: -w / 2, y: -h / 2, width: w, height: h}, a), {fill: C.bg});
  const ART = [
    (a, {w, h}) => {   /* 低頭：a person bent over a glowing phone */
      night(a, w, h);
      Kit2D.glow(a, {x: 0, y: h * .08, r: 150, color: 'screen', op: .7});
      Kit2D.person(a, {x: 0, y: h * .5, h: h * 1.02, pose: 'phone', color: C.ink});
    },
    (a, {w, h}) => {   /* 桌上的手機：a phone lying face-up on a table, lighting it */
      night(a, w, h);
      paint(el('ellipse', {cx: 0, cy: h * .3, rx: w * .5, ry: h * .2}, a), {fill: C.wood});
      paint(el('ellipse', {cx: 0, cy: h * .27, rx: w * .5, ry: h * .2}, a), {fill: C.woodDark}).style.opacity = .35;
      Kit2D.glow(a, {x: 0, y: h * .12, r: 140, color: 'screen', op: .85});
      const g = el('g', {transform: `translate(0 ${h * .2}) matrix(1 0 -.55 .36 0 0)`}, a);
      Kit2D.phone(g, {x: -46, y: 0, w: 74});
    },
    (a, {w, h}) => {   /* 文字：two chat bubbles of 「……」 */
      night(a, w, h);
      Kit2D.bubble(a, {x: -34, y: -50, w: 140, h: 84, text: '……', size: 46, fill: C.chatThem, stroke: 'none', color: C.chatInk, tail: 'left', sw: 0});
      Kit2D.bubble(a, {x: 34, y: 56, w: 140, h: 84, text: '……', size: 46, fill: C.chatMe, stroke: 'none', color: C.chatInk, tail: 'right', sw: 0});
    }
  ];
  const tape = (P, x, y, rot) => { const t = paint(el('rect', {x: x - 40, y: y - 13, width: 80, height: 26, rx: 2, transform: `rotate(${rot} ${x} ${y})`}, P), {fill: C.mango}); t.style.opacity = .55; };
  const drawPoster = (g, i, resolved) => {
    const P = Kit2D.poster(g, {x: 0, y: 0, w: PW, h: PH, name: '', stamp: null, rot: WALL[i][2], art: resolved ? ART[i] : null});
    text(P, resolved ? NAMES[i] : '？？？', {x: 0, y: PH / 2 - 52, size: 48, weight: 700, fill: C.hair});
    Kit2D.stamp(P, '通緝', {x: PW * .2, y: PH * .13, size: 56, color: C.broth, rot: -14});
    tape(P, -PW / 2 + 18, -PH / 2 + 8, -38); tape(P, PW / 2 - 18, -PH / 2 + 8, 38);
    return P;
  };
  /* three posters, 3 first so that the one on stage lies on top; every poster is two items sharing one position:
     the unresolved silhouette (always there) and the resolved one that fades in over it a moment after the poster arrives */
  [2, 1, 0].forEach(i => {
    const [wx, wy] = WALL[i], pos = {[FWD[i]]: [800, 450, 1.45], [FWD[i] + 1]: [BX, BY, BS]}, ws = 1.12;
    const silOp = i === 0 ? null : i === 1 ? {[b + 1]: 1, [b + 2]: 0, [FWD[1]]: 1} : {[b + 1]: 1, [b + 2]: 0, [b + 3]: 0, [FWD[2]]: 1};
    drawPoster(item({x: wx, y: wy, s: ws, from: b + 1, to: END[i], pos, op: silOp, delay: i * 260, top: true, cls: 'fade'}), i, false);
    const res = item({x: wx, y: wy, s: ws, from: b + 1, to: END[i], pos, op: {[b]: 0, [FWD[i]]: 1}, top: true, cls: 'fade'});
    drawPoster(res, i, true);
    res.parentNode.style.transitionDelay = '0s, .9s';
  });

  /* ================= thief 1: 低頭 (b+2 .. b+10) ================= */
  /* ---- 3: phone + snubbing = phubbing ---- */
  const MS = 150, MY = 400;
  const mer = item({from: b + 3, to: b + 5, cls: 'fade', pos: {[b + 4]: [160, -100, .8]}});
  const mk = (str, fill) => text(mer, str, {x: 0, y: MY, size: MS, fill, anchor: 'start', font: 'en'});
  const mA = mk('ph', C.screen), mB = mk('one', C.screen), mP = mk('+', C.muted), mC = mk('sn', C.chili), mD = mk('ubbing', C.chili);
  const mw = t => t.getComputedTextLength(), gap = 46;
  const wA = mw(mA), wB = mw(mB), wP = mw(mP), wC = mw(mC), wD = mw(mD);
  const x0 = 800 - (wA + wB + wP + wC + wD + gap * 2) / 2;
  const xs = {A: x0, B: x0 + wA, P: x0 + wA + wB + gap, C: x0 + wA + wB + gap + wP + gap, D: x0 + wA + wB + gap + wP + gap + wC};
  const xf = 800 - (wA + wD) / 2;
  [[mA, xs.A], [mB, xs.B], [mP, xs.P], [mC, xs.C], [mD, xs.D]].forEach(([t, x]) => { t.setAttribute('x', x); t.style.transformBox = 'view-box'; });
  const mergeTo = final => {
    const tr = (t, dx, dy, o) => { t.style.transform = `translate(${dx}px, ${dy}px)`; t.style.opacity = o; };
    if (!final) { [mA, mB, mP, mC, mD].forEach(t => tr(t, 0, 0, 1)); return; }
    tr(mA, xf - xs.A, 0, 1); tr(mD, xf + wA - xs.D, 0, 1);
    tr(mB, 30, -50, 0); tr(mP, 0, -50, 0); tr(mC, -30, 50, 0);
  };
  let mt = 0;
  beatHooks.push((bt, pb, dir, still) => {
    clearTimeout(mt);
    [mA, mB, mP, mC, mD].forEach(t => { t.style.transition = 'none'; });
    if (bt === b + 3 && dir > 0 && !still && !STILL) {
      mergeTo(false);
      mt = setTimeout(() => {
        [mA, mB, mP, mC, mD].forEach(t => { t.style.transition = 'transform .9s cubic-bezier(.45,.05,.2,1), opacity .6s ease'; });
        mergeTo(true);
      }, 850);
    } else mergeTo(true);
  });
  const gloss = item({from: b + 3, to: b + 4, delay: 1750});
  text(gloss, '因為滑手機，冷落眼前的人', {x: 800, y: 600, size: 58, weight: 700});

  /* ---- 4: 低頭族 ---- */
  const tz = item({from: b + 4, to: b + 5, cls: 'fade', delay: 250});
  text(tz, '=', {x: 520, y: 470, size: 130, weight: 700, fill: C.muted, font: 'en'});
  text(tz, '低頭族', {x: 880, y: 470, size: 150, weight: 700, fill: C.mango});
  [560, 800, 1040].forEach((x, i) => {
    const g = item({from: b + 4, to: b + 5, cls: 'fade', delay: 800 + i * 330});
    const w = el('g', {class: 'pop'}, g); w.style.transitionDelay = (800 + i * 330) + 'ms';
    Kit2D.person(w, {x, y: 850, h: 230, pose: 'phone', color: C.ink});
  });

  /* ---- 5-7: Pew 2015 — 89 of 100 on their phones, 82 of 100 say talk got worse, face-off ---- */
  const CARD = {A: 430, B: 1170};
  const GY = 70, GS = 500;
  const card = (cx, key, o) => {
    const pos = o.pos, from = o.from;
    const mkI = (extra = {}) => item(Object.assign({x: o.x0, from, to: b + 8, pos, op: {[b + 7]: .07}, cls: 'fade'}, extra));
    Kit2D.grid(mkI(), {x: cx - GS / 2, y: GY, w: GS, h: GS, icon: o.icon0, color: C.line, step: 45});
    Kit2D.grid(mkI(), {x: cx - GS / 2, y: GY, w: GS, h: GS, icon: o.icon1, color: o.color, to: o.n, step: 55, delay: 700});
    const t = item({x: o.x0, from, to: b + 7, pos, cls: 'fade', delay: 500});
    text(t, o.num, {x: cx, y: 674, size: 170, weight: 700, fill: C.mango, font: 'en'});
    text(t, o.cap, {x: cx, y: 778, size: 44});
    if (o.src) Kit2D.source(t, o.src, {x: cx, y: 846, anchor: 'middle'});
  };
  card(CARD.A, 'A', {from: b + 5, x0: 370, pos: {[b + 6]: [0, 0, 1]}, icon0: 'person', icon1: 'person-phone', color: C.screen, n: 89, num: '89%', cap: '上次聚會時有用手機', src: 'Pew 2015'});
  card(CARD.B, 'B', {from: b + 6, x0: 0, pos: null, icon0: 'bubble', icon1: 'bubble-crack', color: C.mango, n: 82, num: '82%', cap: '覺得聊天變差'});
  /* the face-off */
  const fo = item({from: b + 7, to: b + 8, cls: 'fade', delay: 200});
  text(fo, '知道不好', {x: 400, y: 300, size: 84, weight: 700});
  text(fo, '82%', {x: 400, y: 500, size: 240, weight: 700, fill: C.mango, font: 'en'});
  text(fo, '還是在做', {x: 1200, y: 300, size: 84, weight: 700});
  text(fo, '89%', {x: 1200, y: 500, size: 240, weight: 700, fill: C.chili, font: 'en'});
  const sh = item({from: b + 7, to: b + 8, delay: 800});
  Kit2D.person(sh, {x: 800, y: 700, h: 330, pose: 'shrug', color: C.ink});

  /* ---- 8: 兒福聯盟 2015 — a kid tugging a parent on a phone, 41 of 100 kids ---- */
  const kd = item({from: b + 8, to: b + 9, cls: 'fade'});
  text(kd, '41%', {x: 400, y: 190, size: 230, weight: 700, fill: C.mango, font: 'en'});
  text(kd, '國小五、六年級', {x: 400, y: 340, size: 50});
  Kit2D.source(kd, '兒福聯盟 2015', {x: 400, y: 410, anchor: 'middle'});
  const sc = item({from: b + 8, to: b + 9, delay: 350});
  Kit2D.person(sc, {x: 250, y: 850, h: 340, pose: 'phone', color: C.ink});
  Kit2D.person(sc, {x: 440, y: 850, h: 210, pose: 'hand', color: C.mango, flip: true});
  const tug = item({from: b + 8, to: b + 9, delay: 900});
  [[-12, 0], [0, 12], [-8, 24]].forEach(([dx, dy], i) => paint(el('path', {d: `M${398 + dx} ${650 + dy} q-10 -8 -20 0 q-10 8 -20 0`}, tug), {stroke: C.chili, w: 5}));
  Kit2D.grid(item({from: b + 8, to: b + 9, cls: 'fade'}), {x: 820, y: 170, w: 560, h: 560, icon: 'kid', color: C.line, step: 45});
  Kit2D.grid(item({from: b + 8, to: b + 9, cls: 'fade'}), {x: 820, y: 170, w: 560, h: 560, icon: 'kid', color: C.mango, to: 41, step: 55, delay: 700});

  /* ---- 9-10: the duo café (3D), 12 (phone on the table), 19 (phone into a bag): one view for all of them ---- */
  const CF = o => Kit3D.params('cafe', Object.assign({lamp: .2, dist: 8.2, ty: 2.0, yaw: .5}, o));
  const TALK = {arm1: 1, tilt1: .9, glow1: 1, tilt0: .05, smile0: 0};
  const UP = {tilt: 0, arm: 0, glow: 0, smile: .35, phone: 1, lamp: .3};
  const cafeAt = k => k <= 9 ? CF(TALK) : k === 10 ? CF(Object.assign({}, TALK, {smile0: -1, tilt0: .16})) :
    k <= 18 ? CF(UP) : CF(Object.assign({}, UP, {bag: 1, yaw: .2, pitch: .55, dist: 9.6, ty: 1.1}));
  const V1 = view3d({x: 0, y: 0, w: 1600, h: 900, from: b + 9, to: b + 20, model: v => Kit3D.cafe(v), at: bt => cafeAt(bt - b),
    op: {[b + 9]: 1, [b + 11]: 0, [b + 12]: 1, [b + 13]: 0, [b + 19]: 1}});
  const OV = [];            /* overlay callbacks, run after every frame of any café view */
  V1.cfg.overlay = v => OV.forEach(f => f(v));
  /* an SVG group that follows a 3D anchor: item > follower (moved every frame) > body */
  const follow = (it, name, i, dx, dy) => { const f = el('g', {}, it); OV.push(v => { const p = Kit3D.stagePoint(v, name, i); f.setAttribute('transform', `translate(${p.x + dx} ${p.y + dy})`); }); return f; };

  /* 9: 「其實我最近……」 and three 「嗯」 */
  const sayL = item({from: b + 9, to: b + 11, top: true, delay: 350});
  const fL = follow(sayL, 'top', 0, 0, -62);
  const scL = el('g', {}, fL); scL.style.transformBox = 'fill-box'; scL.style.transformOrigin = '50% 100%';
  Kit2D.bubble(scL, {x: 0, y: 0, w: 520, h: 112, text: '其實我最近……', size: 58, fill: C.paper, stroke: C.mango, tail: 'down', sw: 5});
  [[-120, -30], [-250, -100], [-380, -36]].forEach(([dx, dy], i) => {
    const g = item({from: b + 9, to: b + 11, top: true, delay: 900 + i * 380, op: {[b + 10]: .4}});
    Kit2D.bubble(follow(g, 'top', 1, dx, dy), {x: 0, y: 0, w: 128, h: 106, text: '嗯', size: 68, fill: C.paper, stroke: C.line, tail: i === 0 ? 'right' : 'none', sw: 5});
  });
  let st = 0;
  beatHooks.push((bt, pb, dir, still) => {
    clearTimeout(st); scL.style.transition = 'none';
    if (bt === b + 9 && dir > 0 && !still && !STILL) {
      scL.style.transform = 'scale(1)';
      st = setTimeout(() => { scL.style.transition = 'transform .45s cubic-bezier(.4,0,.3,1)'; scL.style.transform = 'scale(.6)'; }, 1750);
    } else scL.style.transform = 'scale(.6)';
  });
  /* 10: the notification (created after the view, so it lies on top of it) */
  Chat.banner({from: b + 10, to: b + 11, text: '你沒有手機重要。', k: 1.7, w: 1180, x: 210, y: 12});
  /* 12: 「我又沒在滑！」 */
  const defend = item({from: b + 12, to: b + 13, top: true, delay: 500});
  Kit2D.bubble(follow(defend, 'top', 1, 40, -86), {x: 0, y: 0, w: 480, h: 104, text: '我又沒在滑！', size: 56, fill: C.paper, stroke: C.chili, tail: 'down', sw: 5});

  /* ================= thief 2: 桌上的手機 (b+11 .. b+19) ================= */
  /* ---- 13-14, 17: the UK experiment as a split (3D), 15-16: the Canadian restaurant (2D) ---- */
  const SPL = {tilt: 0, arm: 0, glow: 0, smile: .3, lamp: .28, yaw: .25, pitch: .5, dist: 7.4, ty: 1.35};
  const splAt = side => bt => CF(Object.assign({}, SPL, side === 'L' ? {notebook: 1} : {phone: 1}, {distance: side === 'R' && bt - b === 14 ? 1.1 : 0}, side === 'R' && bt - b === 14 ? {dist: 8.6} : {}));
  const splOp = {[b + 13]: 1, [b + 15]: 0, [b + 17]: 1, [b + 18]: 0};
  const VL = view3d({x: 20, y: 200, w: 780, h: 620, from: b + 13, to: b + 19, model: v => Kit3D.cafe(v), at: splAt('L'), op: splOp});
  const VR = view3d({x: 800, y: 200, w: 780, h: 620, from: b + 13, to: b + 19, model: v => Kit3D.cafe(v), at: splAt('R'), op: splOp});
  const OVL = [], OVR = [];
  VL.cfg.overlay = v => OVL.forEach(f => f(v)); VR.cfg.overlay = v => OVR.forEach(f => f(v));
  const linkIcon = (it, ov, name, color) => {
    const f = el('g', {}, it);
    ov.push(v => { const a = Kit3D.stagePoint(v, 'head', 0), c = Kit3D.stagePoint(v, 'head', 1); f.setAttribute('transform', `translate(${(a.x + c.x) / 2} ${(a.y + c.y) / 2 - 36})`); });
    Kit2D.icon(f, name, {x: 0, y: 0, s: 2.8, color, w: 4});
  };
  /* split furniture */
  const dv = item({from: b + 13, to: b + 15, cls: 'fade'}); const dv2 = item({from: b + 17, to: b + 18, cls: 'fade'});
  [dv, dv2].forEach(g => paint(el('path', {d: 'M800 200 L800 800'}, g), {stroke: C.line, w: 4, dash: '4 16'}));
  const chip = item({from: b + 13, to: b + 15, delay: 200});
  paint(el('rect', {x: 560, y: 42, width: 480, height: 116, rx: 58}, chip), {fill: C.mango});
  Kit2D.icon(chip, 'clock', {x: 650, y: 100, s: 1.7, color: C.pearl, w: 4});
  text(chip, '10 分鐘', {x: 720, y: 103, size: 62, weight: 700, fill: C.pearl, anchor: 'start'});
  const tg = item({from: b + 13, to: b + 15, delay: 600, top: true});
  tag(tg, '筆記本', C.mango, {x: 410, y: 232, size: 42}); tag(tg, '手機', C.screen, {x: 1190, y: 232, size: 42});
  linkIcon(item({from: b + 13, to: b + 15, top: true, delay: 900}), OVL, 'link', C.leaf);
  linkIcon(item({from: b + 13, to: b + 14, top: true, delay: 900}), OVR, 'link', C.leaf);
  linkIcon(item({from: b + 14, to: b + 15, top: true, delay: 1100}), OVR, 'link-off', C.chili);
  tag(item({from: b + 14, to: b + 15, delay: 1300, top: true}), '聊重要話題時更明顯', C.chili, {x: 1190, y: 836, size: 44});
  /* 17: redone in 2021 */
  Kit2D.stamp(item({from: b + 17, to: b + 18, cls: 'stamp', top: true, delay: 400}), '2021 重做', {x: 800, y: 112, size: 96, rot: -5});
  tag(item({from: b + 17, to: b + 18, delay: 1100, top: true}), '結果不一樣', C.mango, {x: 800, y: 834, size: 50});
  const qm = item({from: b + 17, to: b + 18, top: true, delay: 800, cls: 'stamp'});
  const fq = follow(qm, 'table', 0, 0, -110, OVR); text(fq, '？', {x: 0, y: 0, size: 190, weight: 700, fill: C.mango});

  /* ---- 15-16: a restaurant seen from above ---- */
  const RT = [[260, 330], [590, 330], [260, 640], [590, 640]].map(p => [p[0], p[1]]).concat([[1010, 330], [1340, 330], [1010, 640], [1340, 640]]);
  const SK = [C.skin1, C.skin2, C.skin3, C.skin1];
  const ANG = [45, 135, 225, 315].map(a => a * Math.PI / 180), PD = 106, PR = 30;
  const rst = item({from: b + 15, to: b + 17, cls: 'fade'});
  paint(el('path', {d: 'M800 190 L800 800'}, rst), {stroke: C.line, w: 4, dash: '4 16'});
  RT.forEach(([tx, ty], n) => {
    const w = el('g', {class: 'pop'}, rst); w.style.transitionDelay = (n * 90) + 'ms';
    const g = el('g', {transform: `translate(${tx} ${ty})`}, w), left = n < 4;
    paint(el('circle', {r: 62}, g), {fill: C.wood, stroke: C.woodDark, w: 8});
    ANG.forEach((a, k) => paint(el('circle', {cx: Math.cos(a) * PD, cy: Math.sin(a) * PD, r: PR}, g), {fill: SK[k]}));
    if (left) { Kit2D.glow(g, {x: 0, y: 0, r: 70, color: 'screen', op: .8}); Kit2D.phone(g, {x: 0, y: 0, w: 30, tilt: n % 2 ? 20 : -15}); }
    else Kit2D.bag(g, {x: 116, y: -2, s: .34, color: C.rose});
  });
  const rh = item({from: b + 15, to: b + 17, delay: 500});
  Kit2D.icon(rh, 'users', {x: 560, y: 98, s: 2.6, color: C.mango, w: 3.4});
  text(rh, '300+ 人', {x: 640, y: 100, size: 112, weight: 700, fill: C.mango, anchor: 'start'});
  Kit2D.source(item({from: b + 15, to: b + 17, delay: 900}), 'Dwyer 等', {x: 1560, y: 868, anchor: 'end'});
  tag(item({from: b + 15, to: b + 16, delay: 700}), '手機放桌上', C.screen, {x: 425, y: 842, size: 42});
  tag(item({from: b + 15, to: b + 17, delay: 900}), '手機收進包包', C.rose, {x: 1175, y: 842, size: 42});
  const meh = item({from: b + 16, to: b + 17, cls: 'fade', delay: 200});
  RT.forEach(([tx, ty], n) => {
    const left = n < 4, g = el('g', {transform: `translate(${tx} ${ty})`}, meh);
    ANG.forEach((a, k) => Kit2D.face(g, {x: Math.cos(a) * PD, y: Math.sin(a) * PD, r: PR + 1, mood: left ? 'meh' : 'happy', fill: SK[k]}));
    if (left) paint(el('path', {d: 'M-26 -98 q6.5 -16 13 0 t13 0 t13 0 t13 0'}, g), {stroke: C.chili, w: 5});
  });
  tag(item({from: b + 16, to: b + 17, delay: 700}), '比較分心', C.chili, {x: 300, y: 842, size: 40});
  tag(item({from: b + 16, to: b + 17, delay: 1000}), '沒那麼開心', C.chili, {x: 582, y: 842, size: 40});

  /* ---- 18: 「手機放桌上 → 讓聊天變淺」 and the editor's caret ---- */
  const sn = item({from: b + 18, to: b + 19, cls: 'fade'});
  const SZ = 100, YY = 430, AR = 100, GP = 30;
  const s1 = text(sn, '手機放桌上', {x: 0, y: YY, size: SZ, weight: 700, anchor: 'start'});
  const s2 = text(sn, '讓聊天變淺', {x: 0, y: YY, size: SZ, weight: 700, anchor: 'start'});
  const sk = text(sn, '可能', {x: 0, y: YY, size: SZ, weight: 700, fill: C.mango, anchor: 'start'});
  const sa = el('g', {}, sn); arrow(sa, 0, YY, AR, YY, C.ink, 8);
  const sw1 = s1.getComputedTextLength(), sw2 = s2.getComputedTextLength(), swk = sk.getComputedTextLength();
  const pre = (() => { const x1 = 800 - (sw1 + GP + AR + 2 * GP + sw2) / 2, xa = x1 + sw1 + GP; return {x1, xa, x2: xa + AR + 2 * GP, gap: xa + AR + GP}; })();
  const post = (() => { const x1 = 800 - (sw1 + GP + AR + 20 + swk + 20 + sw2) / 2, xa = x1 + sw1 + GP, xk = xa + AR + 20; return {x1, xa, xk, x2: xk + swk + 20}; })();
  const caret = el('g', {}, sn); Kit2D.caret(caret, {x: pre.gap, y: 476, h: 60});
  const place = (e, x, dy, o) => { e.style.transform = `translate(${x}px, ${dy}px)`; e.style.opacity = o; };
  const proof = step => {   /* 0: the claim, 1: caret, 2: 「可能」 above it, 3: inserted */
    place(s1, step < 3 ? pre.x1 : post.x1, 0, 1); place(sa, step < 3 ? pre.xa : post.xa, 0, 1); place(s2, step < 3 ? pre.x2 : post.x2, 0, 1);
    place(sk, step < 3 ? pre.gap - swk / 2 : post.xk, step === 2 ? -104 : step < 2 ? -80 : 0, step >= 2 ? 1 : 0);
    caret.style.opacity = step === 1 || step === 2 ? 1 : 0;
  };
  let pts = [];
  const TR = 'transform .6s cubic-bezier(.45,.05,.2,1), opacity .35s ease';
  beatHooks.push((bt, pb, dir, still) => {
    pts.forEach(clearTimeout); pts = [];
    const all = [s1, s2, sk, sa, caret]; all.forEach(e => { e.style.transition = 'none'; });
    if (bt === b + 18 && dir > 0 && !still && !STILL) {
      proof(0);
      [[550, 1], [1100, 2], [1550, 3]].forEach(([ms, st]) => pts.push(setTimeout(() => { all.forEach(e => { e.style.transition = TR; }); proof(st); }, ms)));
    } else proof(3);
  });

  /* ---- 19: 收進包包 (the bag is in the 3D view) ---- */
  /* a 2D close-up over the dimmed 3D shot: the phone drops into the open bag */
  {
    const veil = item({from: b + 19, to: b + 20, cls: 'fade', top: true});
    paint(el('rect', {x: 0, y: 0, width: 1600, height: 900}, veil), {fill: C.bg}).style.opacity = .72;
    Kit2D.glow(veil, {x: 800, y: 560, r: 420, color: 'lamp', op: .35});
    const drop = item({from: b + 19, to: b + 20, cls: 'fade', top: true, delay: 300});
    const ghost = el('g', {}, drop);
    [[-250, .12], [-140, .24]].forEach(([dy, o]) => { const gp = Kit2D.phone(ghost, {x: 800, y: 470 + dy, w: 104, tilt: 8}); gp.style.opacity = o; });
    const ph = el('g', {}, drop);
    Kit2D.phone(ph, {x: 800, y: 470, w: 104, glow: true, tilt: 8});
    Kit2D.bag(drop, {x: 800, y: 610, s: 3.4, color: C.rose, open: true});
    let dt = 0;
    beatHooks.push((bt, pb, dir, still) => {
      clearTimeout(dt); ph.style.transition = 'none';
      if (bt === b + 19 && dir > 0 && !still && !STILL) {
        ph.style.transform = 'translateY(-210px)';
        dt = setTimeout(() => { ph.style.transition = 'transform .9s cubic-bezier(.5,0,.8,.6)'; ph.style.transform = 'translateY(0)'; }, 900);
      } else ph.style.transform = 'translateY(0)';
    });
  }
  text(item({from: b + 19, to: b + 20, delay: 500, top: true}), '收進包包', {x: 800, y: 118, size: 104, weight: 700, fill: C.mango});

  /* ================= thief 3: 文字 (b+20 .. b+25) ================= */
  const CH = {x: 130, y: 40, w: 400};
  const chat = Chat.phone({x: CH.x, y: CH.y, w: CH.w, from: b + 21, to: b + 26, contact: '阿哲', time: {[b + 21]: '22:47', [b + 22]: '01:12'}, stagger: 200,
    msgs: [
      {beat: b + 21, who: 'me', text: '週末要不要一起吃火鍋？', time: '22:46', receipt: {beat: b + 21, time: '22:47', ring: b + 21}},
      {beat: b + 24, who: 'them', name: '', text: '好啊。'}
    ]});
  /* 21: a big 「已讀」 beside the phone, circled */
  const rd = item({from: b + 21, to: b + 22, delay: 700});
  text(rd, '已讀', {x: 1010, y: 400, size: 200, weight: 700, fill: C.mango});
  text(rd, '22:47', {x: 1010, y: 560, size: 84, fill: C.muted, font: 'en'});
  Kit2D.scribble(item({from: b + 21, to: b + 22, delay: 1000, cls: 'fade'}), {x: 1010, y: 410, rx: 220, ry: 130, color: C.chili, w: 9, delay: 0});
  /* 22: the clock runs, 舉手？ */
  [['22:47', 230, C.screen], ['23:58', 440, C.screen], ['01:12', 650, C.chili]].forEach(([t, y, col], i) => {
    const g = item({from: b + 22, to: b + 23, delay: i * 650, cls: 'fade'});
    paint(el('rect', {x: 700, y: y - 80, width: 360, height: 160, rx: 36}, g), {fill: C.paper, stroke: col, w: 6});
    text(g, t, {x: 880, y: y + 4, size: 112, weight: 700, fill: col, font: 'en'});
    if (i < 2) arrow(g, 880, y + 92, 880, y + 126, C.muted, 6);
  });
  const hd = item({from: b + 22, to: b + 23, delay: 1750, cls: 'stamp'});
  Kit2D.icon(hd, 'hand', {x: 1330, y: 360, s: 6, color: C.mango, w: 3.4});
  text(hd, '舉手？', {x: 1330, y: 590, size: 100, weight: 700});
  /* 23: thoughts that grow */
  const me = item({from: b + 23, to: b + 24, delay: 100});
  Kit2D.person(me, {x: 690, y: 862, h: 170, pose: 'stand', color: C.ink});
  Kit2D.icon(me, 'sweat', {x: 740, y: 706, s: 1.2, color: C.screen}); Kit2D.icon(me, 'sweat', {x: 640, y: 722, s: .9, color: C.screen});
  [['在忙？', 800, 590, 170, 90, 46, C.muted], ['沒看到？', 1040, 520, 250, 104, 54, C.mango], ['生氣了？', 820, 390, 290, 120, 62, C.mango],
   ['我說錯話了？', 1210, 280, 470, 132, 72, C.chili], ['他是不是討厭我？', 1010, 130, 700, 150, 82, C.chili]].forEach(([t, x, y, w, h, sz, col], i) => {
    const g = item({from: b + 23, to: b + 24, delay: 250 + i * 380, cls: 'stamp'});
    const last = i === 4;
    Kit2D.bubble(g, {x, y, w, h, text: t, size: sz, fill: last ? C.chili : C.paper, stroke: col, color: last ? C.pearl : C.ink, kind: 'thought', tail: 'left', sw: 6});
  });
  /* 24: 「好啊。」 and three ghost faces */
  const FX = [900, 1140, 1380], FY = [470, 520, 470], MOODS = ['happy', 'tired', 'cold'];
  MOODS.forEach((m, i) => {
    const g = item({x: FX[i], y: FY[i], from: b + 24, to: b + 26, delay: 300 + i * 330, cls: 'fade',
      op: i === 2 ? {[b + 24]: .55, [b + 25]: 1} : {[b + 24]: .55, [b + 25]: .14}, pos: i === 2 ? {[b + 25]: [FX[i], FY[i], 1.3]} : null});
    Kit2D.face(g, {x: 0, y: 0, r: 100, mood: m});
  });
  Kit2D.bubble(item({from: b + 24, to: b + 25, delay: 150}), {x: 1010, y: 236, w: 380, h: 170, text: '好啊。', size: 112, fill: C.chatThem, stroke: C.chatThem, color: C.chatInk, tail: 'left', sw: 5});
  text(item({from: b + 24, to: b + 25, delay: 1300}), '？', {x: 1450, y: 270, size: 210, weight: 700, fill: C.mango});
  /* 25: the cold face is picked; a crack runs through the bubble; 誤會 */
  const ring = item({from: b + 25, to: b + 26, delay: 250, cls: 'fade'});
  paint(el('circle', {cx: FX[2], cy: FY[2], r: 150}, ring), {stroke: C.chili, w: 9, dash: '18 14'});
  const bolt = item({from: b + 25, to: b + 26, delay: 450, top: true});
  const bz = el('g', {transform: 'translate(690 560) rotate(14) scale(1.6)'}, bolt);
  paint(el('path', {d: 'M26 -120 L-44 8 L-4 8 L-30 124 L48 -22 L6 -22 Z'}, bz), {fill: C.mango, stroke: C.chili, w: 7});
  const crackP = paint(el('path', {d: 'M0 0'}, bolt), {stroke: C.chili, w: 7});
  Kit2D.stamp(item({from: b + 25, to: b + 26, delay: 1100, cls: 'stamp', top: true}), '誤會', {x: 1060, y: 770, size: 130, color: C.chili, rot: -8});
  beatHooks.push((bt) => {
    if (bt !== b + 25) return;
    const bub = chat.el.querySelector('.m.them:last-child .bub'), sr = stage.getBoundingClientRect();
    if (!bub) return;
    const r = bub.getBoundingClientRect(), s = stageScale;
    const cx = (r.left + r.width / 2 - sr.left) / s, cy = (r.top + r.height / 2 - sr.top) / s, w = r.width / s, h = r.height / s;
    crackP.setAttribute('d', `M${cx - w * .12} ${cy - h * .62} L${cx + w * .04} ${cy - h * .2} L${cx - w * .1} ${cy + h * .08} L${cx + w * .12} ${cy + h * .62}`);
  });
});
