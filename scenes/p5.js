'use strict';
/* p5 把溝通找回來的三個小方法（beats b .. b+19）
   67 標題 · 68 不可能 · 69 賓大 30 分鐘 · 70 三週日曆 · 71 三張牌 · 72 牌1
   73–76 火鍋桌疊手機（3D）· 77 牌2 · 78 好尷尬 · 79 通話中 · 80 聲音 · 81 牌3
   82–84 七分鐘 · 85 咖啡桌傾聽（3D）· 86 傾聽＋便利貼 */
section('p5', NOTES_BY_SECTION.p5, (b) => {
  /* ---------- small local helpers ---------- */
  const rect = (p, x, y, w, h, rx, o) => paint(el('rect', {x, y, width: w, height: h, rx}, p), o);
  const path = (p, d, o) => paint(el('path', {d}, p), o);
  const disc = (p, cx, cy, r, o) => paint(el('circle', {cx, cy, r}, p), o);
  /* a short transform sequence on a forward click only. steps[0] is the start, the rest are timed ({tf, at ms, dur s, ease});
     rest(bt) = the resting transform on any other arrival (jump, back, still); default = the last step */
  const anim = (g, beat, steps, rest) => {
    let timers = [];
    const last = steps[steps.length - 1].tf;
    beatHooks.push((bt, pb, dir, still) => {
      timers.forEach(clearTimeout); timers = [];
      g.style.transition = 'none';
      if (bt === beat && dir > 0 && !still && !STILL) {
        g.style.transform = steps[0].tf;
        void g.getBoundingClientRect();
        steps.slice(1).forEach(s => timers.push(setTimeout(() => {
          g.style.transition = `transform ${s.dur}s ${s.ease || 'ease'}`; g.style.transform = s.tf;
        }, s.at)));
      } else g.style.transform = rest ? rest(bt) : last;
    });
  };
  const COLD = 'cubic-bezier(.5,0,.9,.6)', SPRING = 'cubic-bezier(.3,1.5,.5,1)', OUT = 'cubic-bezier(.2,.8,.3,1)';

  /* ================= p5·0 (b) heading ================= */
  Kit2D.sectionHeader(item({from: b, to: b + 1}), {active: 3, from: 2, title: '三個小方法'});

  /* ================= p5·1 (b+1) 不可能 ================= */
  {
    const bg = item({from: b + 1, to: b + 2});
    Kit2D.icon(bg, 'trash', {x: 1260, y: 450, s: 6.6, color: C.muted, w: 3.2});
    Kit2D.person(bg, {x: 250, y: 840, h: 290, pose: 'shrug', color: C.ink});
    text(bg, '我也做不到', {x: 400, y: 720, size: 84, weight: 700, anchor: 'start'});
    const fly = item({from: b + 1, to: b + 2, cls: 'fade'});
    const ph = el('g', {}, fly);
    Kit2D.phone(ph, {x: 0, y: 0, w: 104, glow: true});
    anim(ph, b + 1, [
      {tf: 'translate(300px, 380px) rotate(-10deg)'},
      {tf: 'translate(700px, 420px) rotate(16deg)', at: 250, dur: .55, ease: COLD},
      {tf: 'translate(655px, 436px) rotate(5deg)', at: 880, dur: .35, ease: OUT}]);
    const wall = item({from: b + 1, to: b + 2, cls: 'stamp', delay: 780});
    cross(wall, 930, 450, 250, C.chili, 30);
    const st = item({from: b + 1, to: b + 2, cls: 'stamp', delay: 1000});
    Kit2D.stamp(st, '不可能', {x: 930, y: 190, size: 100, rot: -7});
  }

  /* ================= p5·2 (b+2) 賓大：每天 30 分鐘 ================= */
  {
    const d = item({from: b + 2, to: b + 3});
    Kit2D.dial(d, {x: 440, y: 470, r: 205, of: 60, to: 30, w: 38, ticks: 5, color: C.mango, hand: 30, delay: 350,
      labels: [{v: 30, str: '30', size: 56, color: C.mango, off: 52}]});
    const tiles = item({from: b + 2, to: b + 3, delay: 250});
    [['chat', 0], ['heart', 1], ['camera', 2], ['thumb', 3]].forEach(([ic, i]) => {
      const x = 870 + i * 150, y = 270;
      rect(tiles, x - 62, y - 62, 124, 124, 30, {fill: C.screen});
      Kit2D.icon(tiles, ic, {x, y, s: 1.9, color: C.pearl, w: 3.4});
    });
    const head = item({from: b + 2, to: b + 3, delay: 800, cls: 'slide-right'});
    text(head, '每天 30 分鐘', {x: 830, y: 470, size: 104, weight: 700, fill: C.mango, anchor: 'start'});
    Kit2D.source(item({from: b + 2, to: b + 3, delay: 1300, cls: 'fade'}), 'Hunt 等 2018', {x: 834, y: 580, size: 26});
  }

  /* ================= p5·3 (b+3) 三個禮拜：日曆打勾 → 孤單 ↓ 憂鬱 ↓ ================= */
  {
    const bd = item({from: b + 3, to: b + 4, cls: 'fade'});
    rect(bd, 70, 56, 520, 100, 50, {fill: C.mango});
    Kit2D.icon(bd, 'clock', {x: 130, y: 106, s: 1.6, color: C.pearl, w: 4});
    text(bd, '每天 30 分鐘', {x: 186, y: 109, size: 52, weight: 700, fill: C.pearl, anchor: 'start'});
    const cal = item({from: b + 3, to: b + 4, cls: 'fade'});
    const CX = 80, CY = 440, CS = 92, GP = 14;
    text(cal, '3 個禮拜', {x: CX + 3.5 * (CS + GP) - GP / 2, y: 345, size: 96, weight: 700});
    for (let i = 0; i < 21; i++) rect(cal, CX + (i % 7) * (CS + GP), CY + Math.floor(i / 7) * (CS + GP), CS, CS, 14, {fill: C.line});
    const ticks = item({from: b + 3, to: b + 4, cls: 'fade'});
    for (let i = 0; i < 21; i++) {
      const c = el('g', {class: 'cell'}, ticks), x = CX + (i % 7) * (CS + GP), y = CY + Math.floor(i / 7) * (CS + GP);
      c.style.transitionDelay = (300 + i * 45) + 'ms';
      rect(c, x, y, CS, CS, 14, {fill: C.leaf});
      path(c, `M${x + 24} ${y + 48} L${x + 41} ${y + 65} L${x + 70} ${y + 29}`, {stroke: C.pearl, w: 8});
    }
    [['孤單', 440, 1250], ['憂鬱', 670, 1650]].forEach(([w, y, dl]) => {
      const ch = item({from: b + 3, to: b + 4, delay: dl, cls: 'slide-right'});
      rect(ch, 890, y - 85, 600, 170, 85, {fill: C.paper, stroke: C.leaf, w: 7});
      text(ch, w, {x: 965, y: y + 3, size: 108, weight: 700, anchor: 'start'});
      arrow(ch, 1260, y - 46, 1260, y + 50, C.leaf, 16);
      Kit2D.icon(ch, 'smile', {x: 1385, y, s: 1.5, color: C.leaf, w: 3.6});
    });
  }

  /* ================= p5·4–5 (b+4, b+5) 不用 → 用對地方；三張牌 ================= */
  const CW = 400, CH = 500, XS = [300, 800, 1300];
  /* three phones lying face-down in a pile, an arrow pressing them down (about 230 x 210, centred) */
  const stackPhones = g => {
    /* a messy, slightly fanned pile of phones lying face-down: backs with a camera lens, the top one slightly askew */
    [[-36, 78, -22, C.pearl], [2, 70, -2, C.woodDark], [34, 75, 17, C.line]].forEach(([dx, dy, r, col]) => {
      const p = el('g', {transform: `translate(${dx} ${dy}) rotate(${r})`}, g);
      rect(p, -44, -170, 88, 170, 20, {fill: col, stroke: C.muted, w: 4});
      rect(p, -33, -159, 40, 40, 11, {fill: C.bg, stroke: C.muted, w: 3});
      disc(p, -20, -146, 8, {fill: C.line, stroke: C.muted, w: 2}); disc(p, -4, -131, 8, {fill: C.line, stroke: C.muted, w: 2});
      disc(p, 24, -150, 4, {fill: C.mango});
    });
    path(g, 'M0 -168 L0 -130 M-20 -148 L0 -128 L20 -148', {stroke: C.mango, w: 9});
  };
  const cardBack = (g, n) => {
    rect(g, -CW / 2 + 7, -CH / 2 + 9, CW, CH, 26, {fill: C.pearl}).style.opacity = .4;
    rect(g, -CW / 2, -CH / 2, CW, CH, 26, {fill: C.line, stroke: C.paper, w: 6});
    rect(g, -CW / 2 + 26, -CH / 2 + 26, CW - 52, CH - 52, 16, {stroke: C.muted, w: 3, dash: '4 14'});
    text(g, String(n), {x: 0, y: 10, size: 250, weight: 700, fill: C.mango, font: 'en'});
  };
  const cardFront = (g, n) => {
    rect(g, -CW / 2 + 7, -CH / 2 + 9, CW, CH, 26, {fill: C.pearl}).style.opacity = .4;
    rect(g, -CW / 2, -CH / 2, CW, CH, 26, {fill: C.paper, stroke: C.mango, w: 7});
    disc(g, -CW / 2 + 70, -CH / 2 + 70, 46, {fill: C.mango});
    text(g, String(n), {x: -CW / 2 + 70, y: -CH / 2 + 73, size: 62, weight: 700, fill: C.pearl, font: 'en'});
    const ic = el('g', {transform: 'translate(0 -52)'}, g);
    if (n === 1) stackPhones(ic);
    else if (n === 2) {
      Kit2D.icon(ic, 'call', {x: -14, y: 8, s: 5.2, color: C.leaf, w: 3.2});
      path(ic, 'M50 -76 Q86 -52 62 -8 M80 -102 Q134 -62 98 -2', {stroke: C.leaf, w: 8});
    } else {
      Kit2D.dial(ic, {x: 0, y: 2, r: 88, of: 60, to: 7, w: 20, color: C.mango, hand: 7, labels: [{v: 7, str: '7', size: 44, color: C.mango, off: 40}]});
    }
    [['手機', '疊疊樂'], ['想念，', '就打給他'], ['給聊天', '7 分鐘']][n - 1].forEach((l, i) =>
      text(g, l, {x: 0, y: 122 + i * 74, size: 64, weight: 700}));
  };
  /* one card = a back and a front; flipAt = beat on which it turns over (-1: always face-up, 999: always face-down) */
  const flipper = (g, n, flipAt) => {
    const back = el('g', {}, g), front = el('g', {}, g);
    cardBack(back, n); cardFront(front, n);
    const rest = bt => bt >= flipAt;
    let t1 = 0, t2 = 0;
    beatHooks.push((bt, pb, dir, still) => {
      clearTimeout(t1); clearTimeout(t2);
      back.style.transition = front.style.transition = 'none';
      if (bt === flipAt && dir > 0 && !still && !STILL) {
        back.style.transform = 'scaleX(1)'; front.style.transform = 'scaleX(0)';
        void back.getBoundingClientRect();
        t1 = setTimeout(() => { back.style.transition = 'transform .22s ease-in'; back.style.transform = 'scaleX(0)'; }, 750);
        t2 = setTimeout(() => { front.style.transition = 'transform .32s cubic-bezier(.3,1.4,.5,1)'; front.style.transform = 'scaleX(1)'; }, 970);
      } else { const f = rest(bt); back.style.transform = `scaleX(${f ? 0 : 1})`; front.style.transform = `scaleX(${f ? 1 : 0})`; }
    });
  };
  {
    const head = item({from: b + 4, to: b + 5});
    Kit2D.icon(head, 'cross', {x: 290, y: 160, s: 2.6, color: C.chili, w: 3.4});
    text(head, '不用', {x: 360, y: 165, size: 100, weight: 700, anchor: 'start', fill: C.muted});
    arrow(head, 600, 162, 740, 162, C.muted, 9);
    Kit2D.icon(head, 'check', {x: 830, y: 160, s: 2.6, color: C.leaf, w: 3.4});
    text(head, '用對地方', {x: 900, y: 165, size: 108, weight: 700, anchor: 'start', fill: C.mango});
    XS.forEach((x, i) => {
      const it = item({from: b + 4, to: b + 6, x, y: 610, s: .92, delay: 750 + i * 300, cls: 'slide-up',
        pos: {[b + 5]: i === 0 ? [800, 450, 1.42] : [x, 610, .92]}, op: {[b + 5]: i === 0 ? 1 : 0}});
      flipper(it, i + 1, i === 0 ? b + 5 : 999);
    });
  }
  /* later visits: card 2 (b+10), card 3 (b+14) — earlier cards stay face-up, dimmed */
  [[b + 10, 1], [b + 14, 2]].forEach(([bt, cur]) => {
    const others = [0, 1, 2].filter(i => i !== cur), slot = {[others[0]]: XS[0], [others[1]]: XS[2]};
    [0, 1, 2].forEach(i => {
      const isCur = i === cur;
      const it = item({from: bt, to: bt + 1, x: isCur ? 800 : slot[i], y: 450, s: isCur ? 1.42 : .82, op: isCur ? null : {[bt]: .55}, delay: isCur ? 0 : 150});
      flipper(it, i + 1, isCur ? bt : i < cur ? -1 : 999);
    });
  });

  /* ================= p5·6–9 (b+6 .. b+9) the hot pot: tip 1 ================= */
  const FRIENDS = [
    {skin: 'skin-3', style: 'bun', shirt: 'cloth-e', pants: 'pearl', scale: 1.0},
    {skin: 'skin-1', style: 'spiky', shirt: 'cloth-f', pants: 'pearl', glasses: true, scale: 1.03, hand: 'l'},
    {skin: 'skin-2', style: 'short', hairColor: 'wood-dark', shirt: 'cloth-a', pants: 'pearl', scale: .99, hand: 'l'},
    {skin: 'skin-1', style: 'bob', shirt: 'cloth-c', pants: 'pearl', scale: .96}
  ];
  const DOWN = {arm: 1, tilt: .9, glow: 1, lamp: .16, steam: 1, food: 1};
  const UP = {arm: 0, tilt: 0, glow: 0, stack: 1, steam: 1, food: 1, smile: .4, turn0: .4, turn1: -.4};
  const HP = k => {
    if (k <= 5) return Kit3D.params('hotpot', DOWN);
    if (k === 6) return Kit3D.params('hotpot', Object.assign({}, UP, {lamp: .6}));
    if (k === 7) return Kit3D.params('hotpot', Object.assign({}, UP, {lamp: .75, arm3: .5, lean3: .12, dist: 10.6, tx: -1.35, ty: 1.95, smile: .25}));
    if (k === 8) return Kit3D.params('hotpot', Object.assign({}, UP, {lamp: 1, smile: 1, nod: .45, ty: 1.8}));
    return Kit3D.params('hotpot', Object.assign({}, UP, {lamp: 1, smile: .9, nod: .2, dist: 10.4, tx: .9, ty: 1.8}));
  };
  const pot = view3d({x: 0, y: 0, w: 1600, h: 900, from: b + 6, to: b + 10, model: v => Kit3D.hotpot(v, {people: FRIENDS}), at: bt => HP(bt - b),
    dur: {stack: 1.5, glow: 1.2, tilt: 1.3, arm: 1.2, lamp: 2.2, dist: 1.3, tx: 1.3, ty: 1.3, smile: 1.2, nod: 1.2, turn0: 1.2, turn1: 1.2}});

  /* the rule card (b+7) */
  {
    const rc = item({from: b + 7, to: b + 8, top: true, cls: 'slide-left'});
    rect(rc, 36, 150, 500, 600, 30, {fill: C.paper, stroke: C.mango, w: 7});
    stackPhones(el('g', {transform: 'translate(286 270) scale(.6)'}, rc));
    text(rc, '誰先拿起來，', {x: 286, y: 360, size: 62, weight: 700});
    text(rc, '誰請喝飲料', {x: 286, y: 436, size: 62, weight: 700, fill: C.mango});
    [0, 1, 2, 3].forEach(i => {
      const c = item({from: b + 7, to: b + 8, top: true, delay: 600 + i * 220, cls: 'slide-up'});
      Kit2D.teaCup(c, {x: 118 + i * 112, y: 620, s: .78, rot: i === 3 ? 8 : 0});
    });
  }
  const nudge = item({from: b + 7, to: b + 8, top: true, delay: 900, cls: 'stamp'});
  const ng = el('g', {}, nudge);
  Kit2D.burst(ng, {r: 34, n: 6, len: 20, w: 7, color: C.chili});
  /* laughter (b+8) and the sign (b+9) follow / hang over the 3D scene */
  const ha = [0, 1, 2, 3].map(i => {
    const g = item({from: b + 8, to: b + 9, top: true, delay: 350 + i * 260});
    const m = el('g', {}, g);
    Kit2D.bubble(m, {x: 0, y: 0, w: 150 + (i % 2) * 14, h: 94, text: '哈哈', size: 56, fill: C.mango, stroke: C.pearl, color: C.pearl, tail: 'down', sw: 5});
    return m;
  });
  const sign = item({from: b + 9, to: b + 10, top: true, cls: 'fade'});
  const swing = el('g', {}, el('g', {transform: 'translate(1385 0) scale(.88)'}, sign));
  anim(swing, b + 9, [{tf: 'rotate(16deg)'}, {tf: 'rotate(-9deg)', at: 120, dur: .55, ease: 'ease-in-out'}, {tf: 'rotate(5deg)', at: 700, dur: .5, ease: 'ease-in-out'}, {tf: 'rotate(0deg)', at: 1200, dur: .45, ease: 'ease-in-out'}]);
  {
    const SX = 0;      /* hang point = origin of the swinging group */
    path(swing, `M${SX - 70} 150 L${SX} 0 M${SX + 70} 150 L${SX} 0`, {stroke: C.muted, w: 5});
    disc(swing, SX, 170, 130, {fill: C.poster, stroke: C.chili, w: 18});
    disc(swing, SX, 170, 108, {stroke: C.hair, w: 3});
    Kit2D.phone(swing, {x: SX, y: 170, w: 70, color: C.hair, body: C.hair});
    path(swing, `M${SX - 86} ${170 + 86} L${SX + 86} ${170 - 86}`, {stroke: C.chili, w: 20});
    rect(swing, SX - 190, 336, 380, 104, 22, {fill: C.wood, stroke: C.woodDark, w: 6});
    text(swing, '無手機區', {x: SX, y: 390, size: 70, weight: 700, fill: C.pearl});
  }
  pot.cfg.overlay = (v) => {
    const sp = Kit3D.stagePoint(v, 'stack'); ng.setAttribute('transform', `translate(${sp.x + 20} ${sp.y + 10})`);
    ha.forEach((m, i) => { const p = Kit3D.stagePoint(v, 'top', i); m.setAttribute('transform', `translate(${p.x} ${Math.max(78, p.y - 62)})`); });
  };

  /* ================= p5·11 (b+11) 打電話…好尷尬 → 那就打字吧 ================= */
  {
    const f = item({from: b + 11, to: b + 12});
    Kit2D.face(f, {x: 300, y: 590, r: 160, mood: 'tired'});
    const t = item({from: b + 11, to: b + 12, delay: 400, cls: 'slide-up'});
    Kit2D.bubble(t, {x: 540, y: 250, w: 800, h: 190, text: '打電話……好尷尬', size: 76, kind: 'thought', tail: 'left', stroke: C.muted});
    const call = item({from: b + 11, to: b + 12, delay: 900});
    Kit2D.icon(call, 'call', {x: 1130, y: 330, s: 3.6, color: C.muted, w: 3.4}).style.opacity = .55;
    path(call, 'M1020 440 L1240 220', {stroke: C.chili, w: 12});
    const k = item({from: b + 11, to: b + 12, delay: 1500, cls: 'stamp'});
    rect(k, 840, 480, 560, 330, 36, {fill: C.paper, stroke: C.mango, w: 9});
    Kit2D.icon(k, 'keyboard', {x: 1120, y: 590, s: 5.2, color: C.mango, w: 3});
    text(k, '那就打字吧', {x: 1120, y: 740, size: 66, weight: 700, fill: C.mango});
  }

  /* ================= p5·12 (b+12) 通話中，更親近 ================= */
  {
    const glow = item({from: b + 12, to: b + 13, cls: 'fade'});
    Kit2D.glow(glow, {x: 480, y: 450, r: 560, color: 'lamp', op: .75});
    Chat.call({x: 280, y: 40, w: 400, from: b + 12, to: b + 13, name: '阿哲', status: '通話中', warm: true});
    const c1 = item({from: b + 12, to: b + 13, delay: 650, cls: 'slide-right'});
    rect(c1, 860, 230, 640, 160, 80, {fill: C.paper, stroke: C.mango, w: 7});
    text(c1, '更親近', {x: 1090, y: 312, size: 92, weight: 700, fill: C.mango});
    arrow(c1, 1390, 358, 1390, 266, C.mango, 14);
    const c2 = item({from: b + 12, to: b + 13, delay: 1150, cls: 'slide-right'});
    rect(c2, 860, 430, 640, 160, 80, {fill: C.paper, stroke: C.leaf, w: 7});
    text(c2, '尷尬：沒有比較多', {x: 1180, y: 512, size: 62, weight: 700, fill: C.ink});
    Kit2D.source(item({from: b + 12, to: b + 13, delay: 1650, cls: 'fade'}), 'Kumar & Epley', {x: 1180, y: 650, anchor: 'middle', size: 28});
  }

  /* ================= p5·13 (b+13) 語氣、笑聲、停頓 ✗ 貼圖給不了 ================= */
  {
    const w = item({from: b + 13, to: b + 14});
    const Y = 470;
    Kit2D.wave(w, {x: 70, y: Y, w: 330, h: 230, kind: 'long', n: 14, color: C.mango, step: 40});
    Kit2D.wave(w, {x: 410, y: Y, w: 340, h: 230, kind: 'bounce', n: 15, color: C.mango, step: 40, delay: 300});
    Kit2D.wave(w, {x: 760, y: Y, w: 190, h: 230, kind: 'steady', n: 8, gapAt: .5, gapW: 1.1, color: C.muted, step: 40, delay: 700});
    Kit2D.wave(w, {x: 960, y: Y, w: 150, h: 230, kind: 'long', n: 7, color: C.mango, step: 40, delay: 900});
    [['語氣', 235, C.mango], ['笑聲', 580, C.mango], ['停頓', 855, C.chili]].forEach(([s, x, col], i) => {
      const a = item({from: b + 13, to: b + 14, delay: 500 + i * 350});
      const x1 = x - (i === 2 ? 95 : 160), x2 = x + (i === 2 ? 95 : 160);
      path(a, `M${x1} 290 L${x1} 270 L${x2} 270 L${x2} 290`, {stroke: col, w: 6});
      text(a, s, {x, y: 215, size: 72, weight: 700, fill: col});
    });
    const s = item({from: b + 13, to: b + 14, delay: 1500, cls: 'stamp'});
    rect(s, 1160, 250, 340, 340, 44, {fill: C.chatThem, stroke: C.paper, w: 6});
    Kit2D.dumpling(s, {x: 1330, y: 424, s: 2.4});
    Kit2D.icon(s, 'cross', {x: 1470, y: 270, s: 2.8, color: C.chili, w: 4.6});
    text(s, '給不了', {x: 1330, y: 680, size: 84, weight: 700, fill: C.chili});
  }

  /* ================= p5·15–17 (b+15 .. b+17) the 7-minute dial ================= */
  {
    const CXD = 800, CYD = 500, RD = 250, WD = 40;
    const base = item({from: b + 15, to: b + 18, cls: 'fade'});
    const dl = Kit2D.dial(base, {x: CXD, y: CYD, r: RD, of: 7, to: 0, w: WD, ticks: 1});
    text(base, '7', {x: CXD, y: CYD - 36, size: 290, weight: 700, font: 'en'});
    text(base, '分鐘', {x: CXD, y: CYD + 165, size: 56, fill: C.muted});
    const A = Kit2D.dial(item({from: b + 15, to: b + 18}), {x: CXD, y: CYD, r: RD, of: 7, from: 0, to: 3, w: WD, color: C.leaf, track: 'none', delay: 450});
    const B = Kit2D.dial(item({from: b + 16, to: b + 18}), {x: CXD, y: CYD, r: RD, of: 7, from: 3, to: 3.55, w: WD, color: C.leaf, track: 'none', delay: 150});
    Kit2D.dial(item({from: b + 17, to: b + 18}), {x: CXD, y: CYD, r: RD, of: 7, from: 3.55, to: 7, w: WD, color: C.leaf, track: 'none', delay: 650});
    /* the spark at 7 (top of the dial): grey, then lit */
    const top = dl.pt(0);
    const sg = item({from: b + 15, to: b + 17});
    Kit2D.icon(sg, 'spark', {x: top.x, y: top.y - 4, s: 3.4, color: C.muted});
    text(sg, '變有趣', {x: top.x + 86, y: top.y - 62, size: 62, fill: C.muted, anchor: 'start'});
    const sl = item({from: b + 17, to: b + 18, delay: 1900, cls: 'stamp'});
    Kit2D.glow(sl, {x: top.x, y: top.y - 4, r: 150, color: 'mango'});
    Kit2D.burst(sl, {x: top.x, y: top.y - 4, r: 64, n: 10, len: 26, w: 7});
    Kit2D.icon(sl, 'spark', {x: top.x, y: top.y - 4, s: 3.6, color: C.mango});
    text(sl, '變有趣', {x: top.x + 104, y: top.y - 66, size: 70, weight: 700, fill: C.mango, anchor: 'start'});
    /* 冷場: the line stops, a hand grabs the phone (b+16) */
    const e = dl.pt(3.55), gp = dl.pt(3.95);
    const stop = item({from: b + 16, to: b + 17, delay: 650, cls: 'stamp'});
    cross(stop, e.x, e.y, 56, C.chili, 12);
    const gap = item({from: b + 16, to: b + 17, delay: 900});
    tag(gap, '冷場', C.chili, {x: gp.x - 230, y: gp.y + 60, size: 66});
    arrow(gap, gp.x - 170, gp.y + 44, gp.x - 22, gp.y + 6, C.chili, 7);
    const hp = item({from: b + 16, to: b + 17, cls: 'fade'});
    const hg = el('g', {}, hp);
    Kit2D.phone(hg, {x: 0, y: -20, w: 92, glow: true});
    Kit2D.icon(hg, 'hand', {x: 0, y: 64, s: 4, color: C.skin1, w: 3.2});
    anim(hg, b + 16, [{tf: 'translate(1520px, 660px)'}, {tf: 'translate(1180px, 700px)', at: 300, dur: .9, ease: OUT}]);
    /* the question bridges the gap (b+17) */
    const q = item({from: b + 17, to: b + 18, delay: 150, cls: 'stamp'});
    Kit2D.bubble(q, {x: gp.x - 250, y: gp.y - 30, w: 210, h: 170, text: '？', size: 140, fill: C.paper, stroke: C.mango, color: C.mango, tail: 'right'});
  }

  /* ================= p5·18 (b+18) the café: listening ================= */
  const CAFE_BEFORE = {phone: 1, faceDown: 0, arm1: 1, tilt1: .9, glow1: 1, smile0: .5, lamp: 1, yaw: .14, tx: 1.35, dist: 10.6};
  const CAFE_NOW = {phone: 1, faceDown: 1, arm: 0, tilt: 0, glow: 0, nod1: 1, smile0: .8, smile1: .5, lamp: 1, tx: 1.35, dist: 10.6};
  const cafe = view3d({x: 0, y: 0, w: 1600, h: 900, from: b + 18, to: b + 19, model: v => Kit3D.cafe(v),
    at: bt => Kit3D.params('cafe', bt >= b + 18 ? CAFE_NOW : CAFE_BEFORE),
    dur: {faceDown: 1.2, tilt: 1.3, arm: 1.2, glow: 1.0, nod: 1.0, smile: 1.2}});
  const thenq = item({from: b + 18, to: b + 19, top: true, delay: 1100, cls: 'stamp'});
  const tq = el('g', {}, thenq);
  Kit2D.bubble(tq, {x: 0, y: 0, w: 330, h: 112, text: '然後呢？', size: 62, fill: C.paper, stroke: C.mango, color: C.ink, tail: 'down', sw: 6});
  cafe.cfg.overlay = v => { const p = Kit3D.stagePoint(v, 'top', 1); tq.setAttribute('transform', `translate(${p.x} ${p.y - 84})`); };
  {
    const items = [['phone', '手機蓋起來'], ['eye', '眼睛看著他'], ['smile', '點點頭'], ['question', '問「然後呢？」']];
    items.forEach(([ic, s], i) => {
      const r = item({from: b + 18, to: b + 19, top: true, delay: 500 + i * 380, cls: 'slide-right'});
      const y = 200 + i * 150;
      rect(r, 1050, y - 56, 530, 112, 56, {fill: C.paper, stroke: C.line, w: 4});
      disc(r, 1106, y, 36, {fill: C.leaf});
      path(r, `M${1106 - 15} ${y + 1} L${1106 - 4} ${y + 12} L${1106 + 17} ${y - 12}`, {stroke: C.pearl, w: 8});
      text(r, s, {x: 1162, y: y + 3, size: 56, weight: 700, anchor: 'start'});
    });
  }

  /* ================= p5·19 (b+19) 傾聽 + the sticky note ================= */
  {
    const lamp = item({from: b + 19, to: b + 20, cls: 'fade'});
    Kit2D.glow(lamp, {x: 800, y: 450, r: 700, color: 'lamp', op: .55});
    const w = item({from: b + 19, to: b + 20, cls: 'stamp', delay: 150});
    text(w, '傾聽', {x: 470, y: 440, size: 320, weight: 700});
    Kit2D.underline(item({from: b + 19, to: b + 20, delay: 800, cls: 'fade'}), {x1: 200, x2: 740, y: 640, color: C.mango, w: 14});
    const s = item({from: b + 19, to: b + 20, cls: 'fade'});
    const fly = el('g', {}, el('g', {transform: 'translate(1225 440) scale(1.6)'}, s));
    Kit2D.sticky(fly, ['你有在聽', '我說。'], {x: 0, y: 0});
    anim(fly, b + 19, [{tf: 'translate(520px, -520px) rotate(26deg) scale(1.5)'}, {tf: 'translate(0px, 0px) rotate(0deg) scale(1)', at: 1100, dur: .85, ease: SPRING}]);
  }
});
