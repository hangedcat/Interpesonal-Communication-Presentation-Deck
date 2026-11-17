'use strict';
/* 開場：火鍋桌（4 個人 4 支手機）→ 切到家人群組 → 題目變成大標題 → 捷運路線圖 */
section('open', NOTES_BY_SECTION.open, (b) => {
  /* ---- 3D hot-pot table: beats b .. b+3 ---- */
  const H = k => {
    k = Math.max(0, Math.min(3, k));
    const down = {arm: 1, tilt: .9, glow: 1, lamp: .18};
    if (k === 0) return Kit3D.params('hotpot', down);
    if (k === 1) return Kit3D.params('hotpot', Object.assign({}, down, {steam: 1, dist: 8.5, ty: 1.6}));
    if (k === 2) return Kit3D.params('hotpot', {arm: 2, tilt: 0, glow: .45, lamp: .3, steam: 1, food: 1, dist: 8.5, ty: 1.6, smile: .5});
    return Kit3D.params('hotpot', Object.assign({}, down, {steam: 1, food: 1}));
  };
  const view = view3d({x: 0, y: 0, w: 1600, h: 900, from: b, to: b + 4, model: v => Kit3D.hotpot(v), at: k => H(k - b),
    dur: {dist: 1.1, ty: 1.1}});

  /* tags with leader lines that follow the model */
  const tagG = item({from: b, to: b + 1, top: true, delay: 500});
  const upMen = label3d(tagG, '4 個人', C.mango, 34), upPhone = label3d(tagG, '4 支手機', C.screen, 34);
  /* the silent speech bubble above the table (beat b+1) */
  const quiet = item({from: b + 1, to: b + 2, top: true, delay: 350});
  Kit2D.bubble(quiet, {x: 330, y: 150, w: 190, h: 106, text: '……', size: 58, fill: C.paper, stroke: C.muted, color: C.muted, tail: 'right'});
  paint(el('path', {d: 'M236 232 L424 68'}, quiet), {stroke: C.chili, w: 10});
  /* 喀嚓 marks near the phones (beat b+2) */
  const snap = item({from: b + 2, to: b + 3, top: true, delay: 700});
  const marks = [0, 2, 3].map(i => { const m = el('g', {}, snap); Kit2D.burst(m, {r: 26, n: 7, len: 18, w: 5}); text(m, '喀嚓', {x: 0, y: -64, size: 36, weight: 700, fill: C.mango}); return {m, i}; });
  /* 又低頭了 (beat b+3) */
  const again = item({from: b + 3, to: b + 4, top: true, delay: 500});
  tag(again, '又低頭了', C.chili, {x: 330, y: 150, size: 44});
  arrow(again, 330, 200, 330, 280, C.chili, 7);

  view.cfg.overlay = (v) => {
    const a = Kit3D.stagePoint(v, 'top', 2), c = Kit3D.stagePoint(v, 'phone', 3);
    upMen(a.x, a.y, 300, 190);
    upPhone(c.x, c.y, 1060, 810);
    marks.forEach(({m, i}) => { const p = Kit3D.stagePoint(v, 'phone', i); m.setAttribute('transform', `translate(${p.x} ${p.y - 8})`); });
  };

  /* camera flash on beat b+2: a white veil that fades out quickly (still mode: never shown) */
  const flash = document.createElement('div');
  Object.assign(flash.style, {position: 'absolute', inset: 0, background: '#fff', opacity: 0, pointerEvents: 'none', zIndex: 40});
  stage.appendChild(flash);
  let ft = 0;
  beatHooks.push((bt, pb, dir, still) => {
    clearTimeout(ft); flash.style.transition = 'none'; flash.style.opacity = 0;
    if (bt === b + 2 && dir > 0 && !still && !STILL) {
      ft = setTimeout(() => { flash.style.opacity = .8; void flash.offsetWidth; flash.style.transition = 'opacity .5s ease-out'; flash.style.opacity = 0; }, 750);
    }
  });

  /* ---- the family group chat: beat b+4, then my question (b+5) ---- */
  const CH = {x: 230, y: 10, w: 480};   /* big enough to read from the back; the phone bleeds off the bottom edge (input bar out of frame) */
  const chat = Chat.phone({x: CH.x, y: CH.y, w: CH.w, from: b + 4, to: b + 6, contact: '我們這一家', sub: '(4)', stagger: 240,
    op: {[b + 5]: .1}, opDelay: 1300, time: {0: '22:41'},
    msgs: [
      {beat: b + 4, who: 'them', name: '爸', text: '吃飽沒', time: '18:02'},
      {beat: b + 4, who: 'them', name: '', tile: 'article', title: '震驚！這件事你一定要知道'},
      {beat: b + 4, who: 'them', name: '', sticker: 'thumb'},
      {beat: b + 4, who: 'me', sticker: 'dumpling'},
      {beat: b + 4, who: 'them', name: '', tile: 'morning'},
      {beat: b + 5, who: 'me', text: '滑著手機的我們，還在真正溝通嗎？', typed: true}
    ]});
  [['傳訊息', 'chat', 0], ['按讚', 'heart', 1], ['回貼圖', null, 2]].forEach(([w, ic, i]) => {
    const g = item({from: b + 4, to: b + 5, delay: 450 + i * 520, cls: 'slide-right'});
    const y = 255 + i * 195;
    if (ic) Kit2D.icon(g, ic, {x: 900, y, s: 2.5, color: C.leaf, w: 3.2}); else Kit2D.dumpling(g, {x: 900, y, s: 1.05});
    text(g, w, {x: 1010, y, size: 108, weight: 700, anchor: 'start'});
  });

  /* the question lifts out of the phone and grows into the headline */
  const lift = el('g', {}, svgTop);
  lift.style.opacity = 0; lift.style.willChange = 'transform, opacity';
  Kit2D.questionBubble(lift, {x: 0, y: 0});
  /* the headline starts exactly where my bubble sits in the phone (measured from the DOM), small, and grows */
  const T1 = 'translate(800px, 450px) scale(1)';
  const T0 = () => {
    const bub = chat.el.querySelector('.m.me:last-child .bub'), sr = stage.getBoundingClientRect();
    if (!bub) return T1;
    const r = bub.getBoundingClientRect();
    return `translate(${(r.left + r.width / 2 - sr.left) / stageScale}px, ${(r.top + r.height / 2 - sr.top) / stageScale}px) scale(${r.width / stageScale / 1120})`;
  };
  lift.style.transform = 'translate(433px, 690px) scale(.235)';
  let lt = 0;
  beatHooks.push((bt, pb, dir, still) => {
    clearTimeout(lt);
    lift.style.transition = 'none';
    if (bt === b + 5) {
      if (still || STILL || dir <= 0) { lift.style.transform = T1; lift.style.opacity = 1; }
      else {
        lift.style.opacity = 0;
        lt = setTimeout(() => {
          lift.style.transform = T0(); lift.style.opacity = 1; void lift.getBoundingClientRect();
          lift.style.transition = 'transform .9s cubic-bezier(.45,.05,.2,1)'; lift.style.transform = T1;
        }, 1250);
      }
    } else { lift.style.transition = 'opacity .3s ease'; lift.style.opacity = 0; }
  });

  /* ---- the route map: beat b+6 ---- */
  const MY = 440, K = 1.55;
  const L = Kit2D.mrtLayout({x: 230, y: MY, w: 1140});
  const line = item({from: b + 6, to: b + 7, cls: 'fade'});
  Kit2D.mrtLine(line, L, {w: 28});
  L.pts.forEach((p, i) => {
    const g = item({from: b + 6, to: b + 7, delay: 300 + i * 350});
    Kit2D.mrtStation(g, L, i, {state: 'idle', size: 44, k: K});
  });
  const rd = item({from: b + 6, to: b + 7, delay: 1500, cls: 'fade'});
  Kit2D.rider(rd, {x: L.pts[0].x, y: MY - 30, s: 1.7});
});
