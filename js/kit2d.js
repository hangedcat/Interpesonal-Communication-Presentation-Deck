'use strict';
/* =====================================================================
   Kit2D — 2D drawing kit (SVG).  One global: Kit2D.  Documented in docs/KIT.md.
   Every function draws into an SVG parent (usually the group returned by item())
   and returns the group it made.  Colours are CSS tokens through C (engine.js).
   Pictogram cells, calendar cells and waveform bars use the .cell class, so they
   pop in one after another (staggered) when their item appears.
   ===================================================================== */
const Kit2D = (() => {
  const g = (parent, tf) => el('g', tf ? {transform: tf} : {}, parent);
  const P = (parent, d, o = {}) => paint(el('path', {d}, parent), o);
  const R = (parent, x, y, w, h, rx, o = {}) => paint(el('rect', {x, y, width: w, height: h, rx}, parent), o);
  const Ci = (parent, cx, cy, r, o = {}) => paint(el('circle', {cx, cy, r}, parent), o);
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const ring = (n, a, b) => a + (b - a) * hash(n);

  /* ---------- light glow: a radial gradient that depicts light (never decoration) ---------- */
  function glowDef(color) {
    const id = 'glow-' + color;
    if (!document.getElementById(id)) {
      const rg = el('radialGradient', {id}, defs);
      const v = 'var(--' + color + ')';
      for (const [o, a] of [[0, .6], [.45, .22], [1, 0]]) { const s = el('stop', {offset: o}, rg); s.style.stopColor = v; s.style.stopOpacity = a; }
    }
    return 'url(#' + id + ')';
  }
  /* glow(parent, {x, y, r, color: 'screen'|'lamp'|'mango'|'leaf'|'chili', op}) */
  function glow(parent, {x = 0, y = 0, r = 200, color = 'screen', op = 1} = {}) {
    const c = el('circle', {cx: x, cy: y, r}, parent);
    c.style.fill = glowDef(color); c.style.opacity = op;
    return c;
  }

  /* ---------- people ---------- */
  /* person(parent, {x, y, h, color, pose, flip, phoneColor, skin})  (x, y) = feet.  pose: 'stand' | 'phone' | 'wave' | 'hand' | 'shrug' | 'arms' | 'sleepless' */
  function person(parent, {x = 0, y = 0, h = 140, color = C.ink, pose = 'stand', flip = false, phoneColor = C.screen, head = null} = {}) {
    const u = h / 100;
    if (pose === 'phone') return personPhone(parent, {x, y, u, color, flip, phoneColor, head});
    const o = g(parent, `translate(${x} ${y}) scale(${flip ? -u : u} ${u})`);
    const sw = 9, hy = -87;
    /* legs */
    R(o, -14, -34, 12, 34, 6, {fill: color}); R(o, 2, -34, 12, 34, 6, {fill: color});
    /* arms (behind the torso) */
    const arm = (d) => P(o, d, {stroke: color, w: sw});
    if (pose === 'wave') { arm('M-15 -62 L-20 -36'); arm('M15 -64 Q30 -76 30 -94'); }
    else if (pose === 'hand') { arm('M-15 -62 L-20 -36'); arm('M15 -66 L22 -104'); }
    else if (pose === 'shrug') { arm('M-15 -62 Q-34 -52 -32 -70'); arm('M15 -62 Q34 -52 32 -70'); }
    else if (pose === 'arms') { arm('M-15 -62 L-32 -36'); arm('M15 -62 L32 -36'); }
    else { arm('M-15 -62 L-20 -34'); arm('M15 -62 L20 -34'); }
    /* torso + head */
    R(o, -19, -72, 38, 46, 16, {fill: color});
    Ci(o, 0, hy, 15, {fill: head || color});
    if (pose === 'sleepless') { Ci(o, -6, hy - 1, 3.2, {fill: C.bg}); Ci(o, 6, hy - 1, 3.2, {fill: C.bg}); }
    return o;
  }
  /* the head-down phone person, side view facing right (flip mirrors): the torso leans, the head hangs forward and down over a glowing
     phone held at chest height in bent arms; the phone's light falls on the face and the hands. (x, y) = feet. */
  function personPhone(parent, {x, y, u, color, flip, phoneColor, head}) {
    const o = g(parent, `translate(${x} ${y}) scale(${flip ? -u : u} ${u})`), s = g(o, 'translate(-9 0)');
    const sw = 9, shade = 'rgba(0,0,0,.38)';
    /* legs: slightly apart, the front one a little forward */
    R(s, -12, -36, 12, 36, 6, {fill: color}); R(s, 1, -36, 12, 36, 6, {fill: color});
    /* back arm sits behind the torso; torso leans forward from the hip */
    const lean = g(s, 'rotate(15 0 -34)');
    R(lean, -14, -74, 28, 46, 14, {fill: color});
    /* neck craned forward, then the head hanging down over the phone */
    P(s, 'M8 -72 L22 -70', {stroke: color, w: 10});
    const hx = 24, hy = -68;
    Ci(s, hx, hy, 15, {fill: head || color});
    /* the lit face (lower front of the head) and a closed, downcast eye */
    Ci(s, hx + 5, hy + 4, 8, {fill: phoneColor}).style.opacity = .55;
    P(s, `M${hx + 4} ${hy + 1} Q${hx + 8} ${hy + 4} ${hx + 12} ${hy + 1}`, {stroke: C.pearl, w: 2});
    /* phone light: a cone up to the face, and a soft pool on the hands */
    const ph = {x: 34, y: -48};
    P(s, `M${ph.x - 3} ${ph.y - 10} L${hx + 2} ${hy + 12} L${hx + 20} ${hy + 10} L${ph.x + 8} ${ph.y - 10} Z`, {fill: phoneColor}).style.opacity = .22;
    if (phoneColor === C.screen) glow(s, {x: ph.x - 2, y: ph.y - 8, r: 34, color: 'screen', op: .8}); else Ci(s, ph.x, ph.y, 22, {fill: phoneColor}).style.opacity = .15;
    /* bent arms: shoulder -> elbow tucked in -> forearm forward to the phone; a dark rim keeps them readable over the torso */
    const arm = (d) => { P(s, d, {stroke: shade, w: sw + 4}); P(s, d, {stroke: color, w: sw}); };
    arm('M8 -66 Q4 -48 14 -44 L' + (ph.x - 4) + ' ' + (ph.y + 2));
    /* phone, tilted so the screen faces up toward the face */
    const pg = g(s, `translate(${ph.x} ${ph.y}) rotate(-28)`);
    R(pg, -6, -10, 12, 20, 3, {fill: C.pearl}); R(pg, -4.2, -8.2, 8.4, 16.4, 2, {fill: phoneColor});
    /* hands in the phone light */
    Ci(s, ph.x - 5, ph.y + 6, 5.5, {fill: color, stroke: shade, w: 1.5}); Ci(s, ph.x - 5, ph.y + 6, 5.5, {fill: phoneColor}).style.opacity = .5;
    Ci(s, ph.x + 5, ph.y - 3, 4.5, {fill: color}); Ci(s, ph.x + 5, ph.y - 3, 4.5, {fill: phoneColor}).style.opacity = .5;
    return o;
  }
  /* a dark silhouette: head and shoulders (for posters), optional big question mark */
  function silhouette(parent, {x = 0, y = 0, s = 1, color = C.pearl, q = true, qColor = C.poster} = {}) {
    const o = g(parent, `translate(${x} ${y}) scale(${s})`);
    P(o, 'M-70 90 Q-70 30 -34 22 Q-20 14 -20 4 L20 4 Q20 14 34 22 Q70 30 70 90 Z', {fill: color});
    Ci(o, 0, -34, 40, {fill: color});
    if (q) text(o, '？', {x: 0, y: -30, size: 66, weight: 700, fill: qColor});
    return o;
  }

  /* 2D face.  mood: 'happy' | 'tired' | 'cold' | 'neutral' | 'sad' | 'sleepless' | 'blank' (just an outline waiting to be filled) | 'meh' */
  function face(parent, {x = 0, y = 0, r = 60, mood = 'neutral', fill = C.skin1, ink = C.hair, outline = null, glowColor = null} = {}) {
    const o = g(parent, `translate(${x} ${y}) scale(${r / 60})`);
    const st = (w = 5) => ({stroke: ink, w});
    if (glowColor) glow(o, {r: 130, color: glowColor, op: .8});
    if (mood === 'blank') { Ci(o, 0, 0, 58, {stroke: outline || C.line, w: 5, dash: '10 10'}); text(o, '？', {x: 0, y: 2, size: 56, fill: outline || C.line}); return o; }
    Ci(o, 0, 0, 58, {fill, stroke: outline});
    if (outline) o.firstChild.style.strokeWidth = 4;
    const eyes = (dy = -8, dx = 20, rr = 5.5) => { Ci(o, -dx, dy, rr, {fill: ink}); Ci(o, dx, dy, rr, {fill: ink}); };
    if (mood === 'happy') {
      Ci(o, -34, 12, 9, {fill: C.rose}).style.opacity = .55; Ci(o, 34, 12, 9, {fill: C.rose}).style.opacity = .55;
      eyes(-10, 20, 7.5); Ci(o, -17.5, -13, 2.6, {fill: '#fff'}); Ci(o, 22.5, -13, 2.6, {fill: '#fff'});
      P(o, 'M-24 14 Q0 44 24 14 Z', {fill: ink, stroke: ink, w: 4});
      P(o, 'M-12 26 Q0 33 12 26', {stroke: C.chili, w: 4});
      P(o, 'M-30 -30 Q-20 -37 -10 -31 M10 -31 Q20 -37 30 -30', st(4));
    } else if (mood === 'tired') {
      P(o, 'M-32 -8 Q-20 2 -8 -8 M8 -8 Q20 2 32 -8', st(5));
      P(o, 'M-30 -22 Q-20 -28 -10 -20 M10 -20 Q20 -28 30 -22', st(4));
      P(o, 'M-18 28 Q-9 20 0 28 Q9 36 18 28', st(5));
      P(o, 'M-30 5 Q-20 11 -10 5', {stroke: C.muted, w: 3}); P(o, 'M10 5 Q20 11 30 5', {stroke: C.muted, w: 3});
      P(o, 'M44 -34 Q54 -16 44 -8 Q34 -16 44 -34 Z', {fill: C.screen});
    } else if (mood === 'cold') {
      P(o, 'M-32 -4 L-10 -8 M32 -4 L10 -8', st(6));
      P(o, 'M-36 -22 L-8 -14 M36 -22 L8 -14', st(6));
      P(o, 'M-16 28 L16 28', st(6));
    } else if (mood === 'sad') {
      eyes(-6, 20, 5.5);
      P(o, 'M-32 -22 L-10 -30 M32 -22 L10 -30', st(4));
      P(o, 'M-18 32 Q0 16 18 32', st(5));
      P(o, 'M-28 4 Q-32 16 -26 24 Q-20 16 -28 4 Z', {fill: C.screen});
    } else if (mood === 'sleepless') {
      Ci(o, -20, -8, 14, {fill: '#fff', stroke: ink, w: 4}); Ci(o, 20, -8, 14, {fill: '#fff', stroke: ink, w: 4});
      Ci(o, -20, -8, 5.5, {fill: ink}); Ci(o, 20, -8, 5.5, {fill: ink});
      P(o, 'M-34 8 Q-20 18 -6 8 M6 8 Q20 18 34 8', {stroke: C.muted, w: 3});
      P(o, 'M-14 34 L14 34', st(5));
    } else if (mood === 'meh') {
      P(o, 'M-30 -8 L-10 -8 M10 -8 L30 -8', st(6));
      P(o, 'M-14 30 Q0 26 14 32', st(5));
    } else { eyes(); P(o, 'M-12 30 L12 30', st(5)); }
    return o;
  }
  /* a head seen from the side: dir = 1 faces right, -1 faces left */
  function faceProfile(parent, {x = 0, y = 0, r = 60, dir = 1, fill = C.skin1, ink = C.hair, hair = C.hair, mood = 'neutral'} = {}) {
    const o = g(parent, `translate(${x} ${y}) scale(${dir * r / 60} ${r / 60})`);
    Ci(o, 0, 0, 58, {fill});
    P(o, 'M56 -4 Q80 4 56 16 Z', {fill, stroke: fill, w: 2});                 /* nose */
    P(o, 'M-58 0 Q-58 -58 0 -58 Q40 -58 52 -28 Q10 -34 -14 -12 Q-30 0 -58 0 Z', {fill: hair});
    Ci(o, 18, -2, 6, {fill: ink});
    Ci(o, -22, 12, 10, {fill: C.skin2});                                       /* ear */
    P(o, mood === 'happy' ? 'M26 26 Q40 38 54 24' : 'M28 28 L50 28', {stroke: ink, w: 4.5});
    return o;
  }

  /* ---------- the small icon set (48 x 48 box centred on 0, 0) ---------- */
  const ICONS = {
    phone: (o, c, w) => { R(o, -12, -20, 24, 40, 6, {stroke: c, w}); P(o, 'M-4 14 L4 14', {stroke: c, w}); },
    chat: (o, c, w) => P(o, 'M-20 -14 Q-20 -22 -12 -22 L12 -22 Q20 -22 20 -14 L20 6 Q20 14 12 14 L0 14 L-10 22 L-10 14 L-12 14 Q-20 14 -20 6 Z', {stroke: c, w}),
    heart: (o, c, w) => P(o, 'M0 18 Q-24 2 -20 -10 Q-16 -22 -4 -16 Q0 -13 0 -10 Q0 -13 4 -16 Q16 -22 20 -10 Q24 2 0 18 Z', {fill: c, stroke: c, w: 2}),
    thumb: (o, c, w) => { P(o, 'M-18 -2 L-8 -2 L-8 18 L-18 18 Z', {stroke: c, w}); P(o, 'M-8 0 L2 -20 Q8 -20 8 -12 L6 -4 L18 -4 Q22 -4 21 2 L18 14 Q17 18 12 18 L-8 18', {stroke: c, w}); },
    eye: (o, c, w) => { P(o, 'M-22 0 Q0 -20 22 0 Q0 20 -22 0 Z', {stroke: c, w}); Ci(o, 0, 0, 6, {fill: c}); },
    'eye-off': (o, c, w) => { ICONS.eye(o, c, w); P(o, 'M-20 20 L20 -20', {stroke: C.chili, w: w + 1}); },
    speaker: (o, c, w) => { P(o, 'M-20 -8 L-10 -8 L2 -18 L2 18 L-10 8 L-20 8 Z', {stroke: c, w}); P(o, 'M10 -10 Q16 0 10 10 M16 -16 Q26 0 16 16', {stroke: c, w}); },
    'speaker-off': (o, c, w) => { P(o, 'M-20 -8 L-10 -8 L2 -18 L2 18 L-10 8 L-20 8 Z', {stroke: c, w}); P(o, 'M10 -8 L24 8 M24 -8 L10 8', {stroke: C.chili, w}); },
    wave: (o, c, w) => P(o, 'M-20 0 L-20 0 M-12 -8 L-12 8 M-4 -16 L-4 16 M4 -6 L4 6 M12 -12 L12 12 M20 -2 L20 2', {stroke: c, w}),
    smile: (o, c, w) => { Ci(o, 0, 0, 20, {stroke: c, w}); Ci(o, -7, -5, 2.5, {fill: c}); Ci(o, 7, -5, 2.5, {fill: c}); P(o, 'M-9 6 Q0 15 9 6', {stroke: c, w: w - 1}); },
    hand: (o, c, w) => P(o, 'M-14 20 L-14 -2 Q-14 -6 -10 -6 Q-6 -6 -6 -2 L-6 -14 Q-6 -18 -2 -18 Q2 -18 2 -14 L2 -16 Q2 -20 6 -20 Q10 -20 10 -16 L10 -12 Q10 -16 14 -14 Q18 -12 18 -8 L18 8 Q18 20 6 20 Z', {stroke: c, w: w - 1}),
    link: (o, c, w) => { P(o, 'M-6 6 L6 -6', {stroke: c, w}); P(o, 'M-2 -12 L4 -18 Q12 -24 18 -16 Q24 -8 16 -2 L12 2', {stroke: c, w}); P(o, 'M2 12 L-4 18 Q-12 24 -18 16 Q-24 8 -16 2 L-12 -2', {stroke: c, w}); },
    'link-off': (o, c, w) => { P(o, 'M-4 -12 L-10 -6 Q-18 0 -12 8 Q-6 14 0 10', {stroke: c, w}); P(o, 'M4 12 L10 6 Q18 0 12 -8 Q6 -14 0 -10', {stroke: c, w}); P(o, 'M-2 -2 L2 2', {stroke: C.chili, w}); P(o, 'M-10 10 L-14 14 M10 -10 L14 -14', {stroke: C.chili, w}); },
    signal: (o, c, w) => { for (let i = 0; i < 4; i++) R(o, -18 + i * 10, 14 - (i + 1) * 8, 7, (i + 1) * 8, 2, {fill: c}); },
    check: (o, c, w) => P(o, 'M-16 2 L-5 13 L16 -12', {stroke: c, w: w + 1}),
    cross: (o, c, w) => P(o, 'M-14 -14 L14 14 M14 -14 L-14 14', {stroke: c, w: w + 1}),
    plane: (o, c, w) => { P(o, 'M-22 -4 L22 -20 L10 20 L-2 6 Z', {stroke: c, w}); P(o, 'M-2 6 L22 -20', {stroke: c, w: w - 1}); },
    mail: (o, c, w) => { R(o, -22, -15, 44, 30, 5, {stroke: c, w}); P(o, 'M-20 -12 L0 4 L20 -12', {stroke: c, w}); },
    camera: (o, c, w) => { R(o, -22, -12, 44, 32, 7, {stroke: c, w}); Ci(o, 0, 4, 9, {stroke: c, w}); P(o, 'M-10 -12 L-6 -20 L6 -20 L10 -12', {stroke: c, w}); },
    question: (o, c, w) => { P(o, 'M-10 -12 Q-10 -22 0 -22 Q10 -22 10 -13 Q10 -6 2 -2 Q0 0 0 5', {stroke: c, w}); Ci(o, 0, 16, 2.6, {fill: c}); },
    trash: (o, c, w) => { P(o, 'M-16 -12 L16 -12 M-6 -12 L-6 -18 L6 -18 L6 -12', {stroke: c, w}); P(o, 'M-12 -12 L-10 20 L10 20 L12 -12', {stroke: c, w}); P(o, 'M-4 -4 L-4 12 M4 -4 L4 12', {stroke: c, w: w - 1}); },
    call: (o, c, w) => P(o, 'M-16 -16 Q-22 -8 -12 8 Q0 24 14 20 Q20 18 20 12 L16 6 Q12 4 8 8 Q2 6 -4 0 Q-8 -6 -8 -8 Q-4 -12 -6 -14 L-10 -20 Q-14 -20 -16 -16 Z', {stroke: c, w}),
    keyboard: (o, c, w) => { R(o, -22, -12, 44, 26, 5, {stroke: c, w}); P(o, 'M-14 -4 L-12 -4 M-4 -4 L-2 -4 M6 -4 L8 -4 M14 -4 L16 -4 M-12 6 L12 6', {stroke: c, w: w - 1}); },
    clock: (o, c, w) => { Ci(o, 0, 0, 20, {stroke: c, w}); P(o, 'M0 -10 L0 0 L8 6', {stroke: c, w}); },
    users: (o, c, w) => { Ci(o, -8, -10, 7, {stroke: c, w}); P(o, 'M-20 18 Q-20 2 -8 2 Q4 2 4 18', {stroke: c, w}); Ci(o, 12, -8, 6, {stroke: c, w}); P(o, 'M8 4 Q20 2 22 18', {stroke: c, w}); },
    bell: (o, c, w) => { P(o, 'M-14 8 Q-14 -18 0 -18 Q14 -18 14 8 L18 12 L-18 12 Z', {stroke: c, w}); P(o, 'M-4 18 Q0 22 4 18', {stroke: c, w}); },
    spark: (o, c, w) => P(o, 'M0 -22 Q3 -3 22 0 Q3 3 0 22 Q-3 3 -22 0 Q-3 -3 0 -22 Z', {fill: c}),
    sweat: (o, c, w) => P(o, 'M0 -20 Q16 2 10 12 Q0 22 -10 12 Q-16 2 0 -20 Z', {fill: c}),
    shrug: (o, c, w) => { Ci(o, 0, -14, 7, {stroke: c, w}); P(o, 'M-5 -4 L-5 16 M5 -4 L5 16 M-5 -2 Q-20 0 -20 -10 M5 -2 Q20 0 20 -10', {stroke: c, w}); },
    search: (o, c, w) => { Ci(o, -4, -4, 14, {stroke: c, w}); P(o, 'M6 6 L20 20', {stroke: c, w: w + 1}); },
    lock: (o, c, w) => { R(o, -14, -4, 28, 22, 5, {stroke: c, w}); P(o, 'M-8 -4 L-8 -10 Q-8 -20 0 -20 Q8 -20 8 -10 L8 -4', {stroke: c, w}); },
    stack: (o, c, w) => { R(o, -14, 8, 28, 8, 3, {fill: c}); R(o, -14, -2, 28, 8, 3, {fill: c}); R(o, -14, -12, 28, 8, 3, {fill: c}); },
    flower: (o, c, w) => { for (let i = 0; i < 5; i++) { const a = i * 72 * Math.PI / 180; Ci(o, Math.sin(a) * 11, -Math.cos(a) * 11, 8, {fill: c}); } Ci(o, 0, 0, 6, {fill: C.mango}); },
    pin: (o, c, w) => { P(o, 'M0 20 L0 4', {stroke: c, w}); Ci(o, 0, -6, 11, {fill: c}); },
    book: (o, c, w) => { P(o, 'M0 -14 Q-12 -20 -22 -14 L-22 14 Q-12 8 0 14 Q12 8 22 14 L22 -14 Q12 -20 0 -14 Z M0 -14 L0 14', {stroke: c, w}); }
  };
  /* icon(parent, name, {x, y, s, color, w}) — names: see ICONS (listed in docs/KIT.md) */
  function icon(parent, name, {x = 0, y = 0, s = 1, color = C.ink, w = 4} = {}) {
    const o = g(parent, `translate(${x} ${y}) scale(${s})`);
    if (!ICONS[name]) throw new Error('[Kit2D] unknown icon ' + name);
    ICONS[name](o, color, w);
    return o;
  }

  /* ---------- objects ---------- */
  /* phone(parent, {x, y, w, color, glow: bool, screen}) — front view, centred.  glow adds the cold light behind it */
  function phone(parent, {x = 0, y = 0, w = 80, color = C.screen, glow: gl = false, body = C.pearl, tilt = 0} = {}) {
    const h = w * 1.95, o = g(parent, `translate(${x} ${y}) rotate(${tilt})`);
    if (gl) glow(o, {r: w * 2.4, color: 'screen'});
    R(o, -w / 2, -h / 2, w, h, w * .2, {fill: body});
    R(o, -w / 2 + w * .07, -h / 2 + w * .07, w * .86, h - w * .14, w * .15, {fill: color});
    R(o, -w * .14, -h / 2 + w * .11, w * .28, w * .05, w * .025, {fill: body});
    return o;
  }
  /* bubble(parent, {x, y, w, h, text, size, fill, stroke, color, tail, kind}) — (x, y) = centre of the bubble body.
     tail: 'left' | 'right' | 'down' | 'none'; kind: 'speech' | 'thought'.  w / h default to the text size. Returns the group (.w/.h on the node). */
  function bubble(parent, {x = 0, y = 0, w = 0, h = 0, text: str = '', size = 40, fill = C.paper, stroke = C.line, color = C.ink, tail = 'left', kind = 'speech', sw = 4} = {}) {
    const o = g(parent, `translate(${x} ${y})`);
    const body = el('g', {}, o);
    const t = str ? text(o, str, {x: 0, y: 1, size, fill: color}) : null;
    if (t && !w) w = t.getComputedTextLength() + size * 1.1;
    w = w || size * 2.2; h = h || size * 1.7;
    const r = Math.min(h / 2, 30), a = -w / 2, b = w / 2, c = -h / 2, d = h / 2;
    let path = `M${a + r} ${c} L${b - r} ${c} Q${b} ${c} ${b} ${c + r} L${b} ${d - r} Q${b} ${d} ${b - r} ${d} `;
    if (kind === 'speech' && tail === 'right') path += `L${b - r - 6} ${d} L${b - r + 10} ${d + 26} L${b - r - 34} ${d} `;
    if (kind === 'speech' && tail === 'down') path += `L${12} ${d} L${0} ${d + 26} L${-14} ${d} `;
    path += `L${a + r} ${d} Q${a} ${d} ${a} ${d - r} `;
    if (kind === 'speech' && tail === 'left') path += `L${a} ${d - 2} L${a - 18} ${d + 24} L${a + 34} ${d - 2} `;
    path += `L${a} ${c + r} Q${a} ${c} ${a + r} ${c} Z`;
    P(body, path, {fill, stroke, w: sw});
    if (kind === 'thought') {
      const sgn = tail === 'right' ? 1 : -1;
      Ci(body, sgn * (w / 2 - 30), d + 22, 11, {fill, stroke, w: sw - 1}); Ci(body, sgn * (w / 2 - 52), d + 44, 6.5, {fill, stroke, w: sw - 1});
    }
    if (t) o.appendChild(t);
    o.w = w; o.h = h;
    return o;
  }
  /* notification dot (just a dot, no number) */
  function badge(parent, {x = 0, y = 0, r = 11, color = C.chili} = {}) { const o = g(parent, `translate(${x} ${y})`); Ci(o, 0, 0, r + 4, {fill: C.bg}); Ci(o, 0, 0, r, {fill: color}); return o; }
  /* shopping / tote bag.  open: shows the dark mouth */
  function bag(parent, {x = 0, y = 0, s = 1, color = C.rose, open = false} = {}) {
    const o = g(parent, `translate(${x} ${y}) scale(${s})`);
    P(o, 'M-30 -30 Q-30 -66 0 -66 Q30 -66 30 -30', {stroke: C.ink, w: 7});
    P(o, 'M-52 -34 L52 -34 L62 56 Q62 66 52 66 L-52 66 Q-62 66 -62 56 Z', {fill: color});
    if (open) P(o, 'M-52 -34 Q0 -14 52 -34 Q0 -50 -52 -34 Z', {fill: C.pearl}); else P(o, 'M-52 -34 L52 -34', {stroke: C.ink, w: 5, dash: '4 7'});
    R(o, -9, -32, 18, 20, 5, {fill: C.mango});
    return o;
  }
  /* 珍珠奶茶 cup with a straw */
  function teaCup(parent, {x = 0, y = 0, s = 1, rot = 0} = {}) {
    const o = g(parent, `translate(${x} ${y}) scale(${s}) rotate(${rot})`);
    P(o, 'M14 -86 L34 -118', {stroke: C.chili, w: 9});
    P(o, 'M-40 -70 L40 -70 L30 70 Q29 78 20 78 L-20 78 Q-29 78 -30 70 Z', {fill: C.brothWhite, stroke: C.ink, w: 4});
    P(o, 'M-37 -34 L37 -34 L30 70 Q29 78 20 78 L-20 78 Q-29 78 -30 70 Z', {fill: C.tea});
    P(o, 'M-46 -70 Q-46 -90 0 -90 Q46 -90 46 -70 Z', {fill: C.paper, stroke: C.ink, w: 4});
    for (const [px, py] of [[-18, 62], [-4, 64], [10, 62], [22, 60], [-12, 49], [3, 50], [16, 47], [-3, 36]]) Ci(o, px, py, 6.5, {fill: C.pearl});
    return o;
  }
  /* 小籠包 mascot as markup (shared with the chat sticker): viewBox -60 -60 120 120 */
  function dumplingMarkup({wave = false, mood = 'happy'} = {}) {
    const out = 'stroke="var(--wood-dark)" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"';
    let m = '';
    if (wave) m += `<path d="M44 6 Q64 -2 60 -26" fill="none" stroke="var(--wood-dark)" stroke-width="9" stroke-linecap="round"/><path d="M44 6 Q64 -2 60 -26" fill="none" stroke="var(--dough)" stroke-width="4.5" stroke-linecap="round"/>`;
    m += `<path d="M-52 18 Q-58 -16 -28 -34 Q0 -46 28 -34 Q58 -16 52 18 Q48 44 0 46 Q-48 44 -52 18 Z" fill="var(--dough)" ${out}/>`;
    m += `<circle cx="0" cy="-42" r="8" fill="var(--dough)" ${out}/>`;
    m += `<path d="M-4 -35 Q-18 -28 -26 -14 M-1 -34 Q-8 -24 -12 -10 M4 -35 Q14 -26 20 -12 M8 -36 Q24 -30 32 -18" fill="none" stroke="var(--wood-dark)" stroke-width="3" stroke-linecap="round" opacity=".75"/>`;
    m += `<circle cx="-22" cy="16" r="8" fill="var(--rose)" opacity=".6"/><circle cx="22" cy="16" r="8" fill="var(--rose)" opacity=".6"/>`;
    if (mood === 'sad') m += `<circle cx="-16" cy="8" r="4.2" fill="var(--hair)"/><circle cx="16" cy="8" r="4.2" fill="var(--hair)"/><path d="M-6 24 Q0 18 6 24" fill="none" stroke="var(--hair)" stroke-width="3" stroke-linecap="round"/>`;
    else m += `<circle cx="-16" cy="8" r="4.2" fill="var(--hair)"/><circle cx="16" cy="8" r="4.2" fill="var(--hair)"/><path d="M-6 16 Q0 24 6 16" fill="none" stroke="var(--hair)" stroke-width="3" stroke-linecap="round"/>`;
    return m;
  }
  /* dumpling(parent, {x, y, s, wave, mood: 'happy'|'sad'}) — s = 1 → about 120 px wide */
  function dumpling(parent, {x = 0, y = 0, s = 1, wave = false, mood = 'happy'} = {}) {
    const o = g(parent, `translate(${x} ${y}) scale(${s})`);
    o.innerHTML = dumplingMarkup({wave, mood});
    return o;
  }

  /* ---------- text-like marks ---------- */
  /* stamp(parent, str, {x, y, size, color, rot}) — a rubber stamp (double border).  Put it in an item with cls: 'stamp' for the thud */
  function stamp(parent, str, {x = 0, y = 0, size = 64, color = C.chili, rot = -8} = {}) {
    const o = g(parent, `translate(${x} ${y}) rotate(${rot})`);
    const t = text(o, str, {x: 0, y: 2, size, weight: 700, fill: color});
    const w = t.getComputedTextLength() + size * .8, h = size * 1.5;
    R(o, -w / 2, -h / 2, w, h, size * .14, {stroke: color, w: Math.max(4, size / 11)});
    R(o, -w / 2 + size * .15, -h / 2 + size * .15, w - size * .3, h - size * .3, size * .08, {stroke: color, w: Math.max(2, size / 24)});
    o.w = w; o.h = h;
    return o;
  }
  /* source(parent, str, {x, y, anchor, size}) — a small source tag in --muted */
  function source(parent, str, {x = 0, y = 0, anchor = 'start', size = 22} = {}) {
    const o = g(parent, `translate(${x} ${y})`);
    const t = text(o, str, {x: 0, y: 0, size, fill: C.muted, anchor: 'start'});
    const w = t.getComputedTextLength(), pad = size * .55, h = size * 1.7;
    const x0 = anchor === 'end' ? -w - 2 * pad : anchor === 'middle' ? -w / 2 - pad : 0;
    t.setAttribute('x', x0 + pad);
    R(o, x0, -h / 2, w + 2 * pad, h, h / 2, {stroke: C.muted, w: 1.8}).style.opacity = .7;
    o.insertBefore(o.lastChild, t);
    return o;
  }
  /* sticky(parent, lines, {x, y, w, h, rot, size, pin, color}) — a yellow sticky note with a tack; lines = string or array of lines */
  function sticky(parent, lines, {x = 0, y = 0, w = 360, h = 280, rot = -3, size = 56, pin = true, color = C.sticky} = {}) {
    const o = g(parent, `translate(${x} ${y}) rotate(${rot})`);
    R(o, -w / 2 + 7, -h / 2 + 8, w, h, 4, {fill: C.pearl}).style.opacity = .35;                 /* hard offset shadow */
    R(o, -w / 2, -h / 2, w, h, 4, {fill: color});
    P(o, `M${w / 2 - 44} ${h / 2} L${w / 2} ${h / 2 - 44} L${w / 2} ${h / 2} Z`, {fill: C.mango}).style.opacity = .55;
    const ls = Array.isArray(lines) ? lines : String(lines).split('\n');
    ls.forEach((l, i) => text(o, l, {x: 0, y: (i - (ls.length - 1) / 2) * size * 1.28 + (pin ? 14 : 0), size, fill: C.hair, weight: 700}));
    if (pin) { Ci(o, 0, -h / 2 + 26, 13, {fill: C.chili}); Ci(o, -4, -h / 2 + 22, 4, {fill: '#fff'}).style.opacity = .7; }
    o.w = w; o.h = h;
    return o;
  }
  /* hand-drawn marks: these draw themselves when their item appears */
  function underline(parent, {x1 = 0, x2 = 300, y = 0, color = C.chili, w = 10, delay = 0} = {}) {
    const n = 6, dx = (x2 - x1) / n;
    let d = `M${x1} ${y + 2}`;
    for (let i = 1; i <= n; i++) d += ` Q${x1 + dx * (i - .5)} ${y + (i % 2 ? -7 : 8)} ${x1 + dx * i} ${y + (i % 2 ? 4 : -2)}`;
    return draw(parent, d, color, w, delay);
  }
  function scribble(parent, {x = 0, y = 0, rx = 80, ry = 40, color = C.chili, w = 6, delay = 0} = {}) {
    const d = `M${x - rx} ${y - ry * .1} C${x - rx} ${y - ry * 1.25} ${x + rx} ${y - ry * 1.3} ${x + rx * 1.02} ${y} C${x + rx} ${y + ry * 1.2} ${x - rx * 1.05} ${y + ry * 1.2} ${x - rx * .94} ${y - ry * .5} C${x - rx * .88} ${y - ry * .95} ${x - rx * .3} ${y - ry * 1.05} ${x} ${y - ry * 1.02}`;
    return draw(parent, d, color, w, delay);
  }
  /* editor's insertion caret: a ^ under the line with a stem, pointing at the gap */
  function caret(parent, {x = 0, y = 0, h = 60, color = C.mango, w = 6} = {}) {
    const o = g(parent, `translate(${x} ${y})`);
    P(o, `M-14 ${h} L0 ${h - 18} L14 ${h}`, {stroke: color, w}); P(o, `M0 ${h - 18} L0 ${-h * .1}`, {stroke: color, w});
    return o;
  }
  /* burst(parent, {x, y, r, n, color}) — short radial strokes (a high-five, a click) */
  function burst(parent, {x = 0, y = 0, r = 50, n = 8, color = C.mango, w = 5, len = 22} = {}) {
    const o = g(parent, `translate(${x} ${y})`);
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; P(o, `M${Math.cos(a) * r} ${Math.sin(a) * r} L${Math.cos(a) * (r + len)} ${Math.sin(a) * (r + len)}`, {stroke: color, w}); }
    return o;
  }

  /* ---------- pictogram grids ---------- */
  function glyph(o, kind, color, k) {
    /* a cell glyph inside a (-50..50) box, drawn with the same fill */
    const fill = {fill: color};
    if (kind === 'bubble' || kind === 'bubble-crack') {
      P(o, 'M-38 -26 Q-38 -38 -26 -38 L26 -38 Q38 -38 38 -26 L38 8 Q38 20 26 20 L2 20 L-18 40 L-14 20 L-26 20 Q-38 20 -38 8 Z', fill);
      if (kind === 'bubble-crack') P(o, 'M4 -38 L-8 -14 L8 -4 L-6 20', {stroke: C.bg, w: 8});
      return;
    }
    if (kind === 'phone') { R(o, -22, -40, 44, 80, 10, fill); R(o, -15, -31, 30, 56, 5, {fill: C.bg}); return; }
    /* person-like */
    Ci(o, 0, -26, 17, fill);
    P(o, 'M-27 40 L-27 0 Q-27 -8 -19 -8 L19 -8 Q27 -8 27 0 L27 40 Z', fill);
    if (kind === 'kid') return;
    if (kind === 'person-phone') { R(o, 14, 4, 20, 34, 5, {fill: C.screen}); Ci(o, 24, 20, 30, {fill: C.screen}).style.opacity = .22; }
    if (kind === 'person-bubble') { P(o, 'M14 -48 Q14 -58 24 -58 L38 -58 Q48 -58 48 -48 L48 -40 Q48 -30 38 -30 L32 -30 L24 -20 L24 -30 Q14 -30 14 -40 Z', {fill: C.chatThem}); }
  }
  /* gridPos({x, y, w, h, n, cols}) → {cell, pos(i)→{x,y}} — the centre of cell i (row by row, from the top-left) */
  function gridLayout({x = 0, y = 0, w = 600, h = 600, n = 100, cols = 10} = {}) {
    const rows = Math.ceil(n / cols), cell = Math.min(w / cols, h / rows);
    const ox = x + (w - cell * cols) / 2, oy = y + (h - cell * rows) / 2;
    return {cell, rows, cols, pos: i => ({x: ox + (i % cols + .5) * cell, y: oy + (Math.floor(i / cols) + .5) * cell})};
  }
  /* grid(parent, {x, y, w, h, n, cols, icon, color, from, to, step, order, scale})
     draws cells from..to-1 (default all n).  icon: 'person' | 'person-phone' | 'person-bubble' | 'kid' | 'bubble' | 'bubble-crack' | 'phone'.
     The cells pop in one after another: order 'row' (default; every cell of a row together, `step` ms between rows) | 'cell' | 'none'.
     To light some of them, draw a SECOND grid with the same box and {from: 0, to: 95, color: ...} in a later item. */
  function grid(parent, {x = 0, y = 0, w = 600, h = 600, n = 100, cols = 10, icon: kind = 'person', color = C.line, from = 0, to = null, step = 55, order = 'row', scale = .78, delay = 0} = {}) {
    const L = gridLayout({x, y, w, h, n, cols}), o = g(parent), cells = [];
    const end = to == null ? n : to;
    for (let i = from; i < end; i++) {
      const p = L.pos(i), c = g(o, `translate(${p.x} ${p.y}) scale(${L.cell * scale / 100})`);
      c.setAttribute('class', 'cell');
      c.style.transitionDelay = (delay + (order === 'row' ? Math.floor(i / cols) * step : order === 'cell' ? (i - from) * step : 0)) + 'ms';
      glyph(c, kind, color, i);
      cells.push(c);
    }
    o.layout = L; o.cells = cells;
    return o;
  }

  /* ---------- waveform ---------- */
  /* wave(parent, {x, y, w, h, kind, color, n, gapAt, gapW, step}) — (x, y) = left end, centre line.
     kind: 'bounce' (high, bouncy, short) | 'long' (low, long, trailing off) | 'sharp' (a few sharp spikes) | 'steady'.
     gapAt / gapW (0..1 of the width): a real silence (bars flatten to dots) */
  function wave(parent, {x = 0, y = 0, w = 400, h = 140, kind = 'bounce', color = C.ink, n = 0, gapAt = -1, gapW = .12, step = 28, delay = 0} = {}) {
    const o = g(parent), N = n || (kind === 'long' ? 34 : kind === 'sharp' ? 24 : 26), gw = w / N, bw = gw * .56;
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      let a;
      if (kind === 'bounce') a = .45 + .55 * Math.abs(Math.sin(i * 1.15)) * (.75 + .25 * hash(i));
      else if (kind === 'long') a = Math.max(.07, (.62 - t * .55)) * (.7 + .3 * hash(i + 9)) * (1 - .35 * Math.sin(t * 7) * Math.sin(t * 7));
      else if (kind === 'sharp') a = [.04, .05, .04, .5, 1, .45, .05, .04, .88, .35, .04, .05, .04, .04][i % 14] * (.9 + .1 * hash(i));
      else a = .35 + .15 * hash(i);
      if (gapAt >= 0 && t > gapAt - gapW / 2 && t < gapAt + gapW / 2) a = .035;
      const bh = Math.max(bw, a * h);
      const r = R(o, x + i * gw + (gw - bw) / 2, y - bh / 2, bw, bh, bw / 2, {fill: color});
      r.setAttribute('class', 'cell'); r.style.transitionDelay = (delay + i * (step * (kind === 'bounce' ? .5 : 1))) + 'ms';
    }
    return o;
  }

  /* ---------- dials, clocks, calendars ---------- */
  const polar = (cx, cy, r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  /* dial(parent, {x, y, r, of, from, to, color, track, w, ticks, labels, hand}) — a ring with `of` units, 0 at the top, clockwise.
     The arc from..to draws itself when its item appears.  labels: [{v, str, size}] placed outside; ticks: tick marks every `ticks` units.
     Returns the group with .pt(v, radius) → {x, y} (stage coords of unit v on the dial) */
  function dial(parent, {x = 0, y = 0, r = 140, of = 24, from = 0, to = 4, color = C.screen, track = C.line, w = 26, ticks = 0, labels = [], hand = null, delay = 0} = {}) {
    const o = g(parent, `translate(${x} ${y})`);
    const ang = v => -Math.PI / 2 + v / of * Math.PI * 2;
    Ci(o, 0, 0, r, {stroke: track, w});
    if (ticks) for (let v = 0; v < of; v += ticks) { const [a, b] = polar(0, 0, r - w / 2 - 6, ang(v)), [c, d] = polar(0, 0, r - w / 2 - 18, ang(v)); P(o, `M${a} ${b} L${c} ${d}`, {stroke: C.muted, w: 3}); }
    if (to > from) {
      const [x1, y1] = polar(0, 0, r, ang(from)), [x2, y2] = polar(0, 0, r, ang(Math.min(to, from + of - .001)));
      draw(o, `M${x1} ${y1} A${r} ${r} 0 ${(to - from) / of > .5 ? 1 : 0} 1 ${x2} ${y2}`, color, w, delay);
    }
    for (const l of labels) { const [lx, ly] = polar(0, 0, r + w / 2 + (l.off || 34), ang(l.v)); text(o, l.str, {x: lx, y: ly, size: l.size || 28, fill: l.color || C.muted}); }
    if (hand != null) { const [hx, hy] = polar(0, 0, r - w / 2 - 14, ang(hand)); P(o, `M0 0 L${hx} ${hy}`, {stroke: C.ink, w: 6}); Ci(o, 0, 0, 9, {fill: C.ink}); }
    o.pt = (v, rr = r) => { const [px, py] = polar(x, y, rr, ang(v)); return {x: px, y: py}; };
    return o;
  }
  /* calendar(parent, {x, y, cols, rows, cell, gap, count, flow, frac, color, base, from, to, step}) — a grid of small day cells.
     flow 'row' (default; 7 columns = week rows) | 'col' (53 x 7: each column is a week).  frac 0..1 fills only the bottom part of each cell in `color`;
     base: colour of the empty cell (null = draw only the fill, to lay over another calendar).  Returns the group with .cells[], .pos(i) */
  function calendar(parent, {x = 0, y = 0, cols = 7, rows = 5, cell = 36, gap = 4, count = 0, flow = 'row', frac = 1, color = C.screen, base = C.line, from = 0, to = null, step = 14, delay = 0} = {}) {
    const o = g(parent, `translate(${x} ${y})`), total = count || cols * rows, end = to == null ? total : to, cells = [];
    const pos = i => flow === 'col' ? {c: Math.floor(i / rows), r: i % rows} : {c: i % cols, r: Math.floor(i / cols)};
    for (let i = from; i < end; i++) {
      const {c, r} = pos(i), cx = c * (cell + gap), cy = r * (cell + gap), cg = g(o);
      cg.setAttribute('class', 'cell'); cg.style.transitionDelay = (delay + (flow === 'col' ? c : r) * step) + 'ms';
      if (base) R(cg, cx, cy, cell, cell, Math.min(4, cell / 4), {fill: base});
      if (frac > 0) R(cg, cx, cy + cell * (1 - frac), cell, cell * frac, Math.min(4, cell / 4) * (frac > .5 ? 1 : .4), {fill: color});
      cells.push(cg);
    }
    o.cells = cells;
    o.pos = i => { const {c, r} = pos(i); return {x: x + c * (cell + gap) + cell / 2, y: y + r * (cell + gap) + cell / 2}; };
    return o;
  }

  /* ---------- the MRT route map ---------- */
  const STATIONS = ['多黏手機', '真正的溝通', '三個小偷', '三個小方法'];
  /* mrtLayout({x, y, w, n, extra}) — x, y = left end of the line; extra: true leaves a slot between station 3 and 4 for the extra stop */
  function mrtLayout({x = 200, y = 330, w = 1200, n = 4, extra = false} = {}) {
    const slots = n + (extra ? 1 : 0), dx = w / (slots - 1), pts = [];
    let k = 0, extraPt = null;
    for (let s = 0; s < slots; s++) {
      const p = {x: x + s * dx, y};
      if (extra && s === 3) extraPt = p; else pts[k++] = p;
    }
    return {x, y, w, n, extra, pts, extraPt, line: {x1: x - 40, x2: x + w + 40, y}};
  }
  /* mrtLine(parent, L, {upTo, color}) — the track; the part up to station `upTo` (index, or 'extra') is drawn in `color` */
  function mrtLine(parent, L, {upTo = -1, color = C.mango, base = C.line, w = 26} = {}) {
    const o = g(parent);
    P(o, `M${L.line.x1} ${L.y} L${L.line.x2} ${L.y}`, {stroke: base, w});
    const tx = upTo === 'extra' ? L.extraPt.x : upTo >= 0 ? L.pts[upTo].x : null;
    if (tx != null) P(o, `M${L.line.x1} ${L.y} L${tx} ${L.y}`, {stroke: color, w});
    return o;
  }
  /* mrtStation(parent, L, i, {state, label, labelAbove, size}) — i = station index 0..n-1 or 'extra'.  state: 'idle' | 'lit' | 'done' */
  function mrtStation(parent, L, i, {state = 'idle', label = null, labelAbove = false, size = 36, num = null, k = 1, labelDy = null} = {}) {
    const p = i === 'extra' ? L.extraPt : L.pts[i], o = g(parent, `translate(${p.x} ${p.y})`);
    const lit = state === 'lit', done = state === 'done';
    if (lit) { glow(o, {r: 100 * k, color: 'mango'}); Ci(o, 0, 0, 50 * k, {stroke: C.mango, w: 5}).style.opacity = .6; }
    Ci(o, 0, 0, 35 * k, {fill: lit ? C.mango : done ? C.line : C.paper, stroke: lit ? C.ink : done ? C.mango : C.line, w: 10 * k});
    const n = num != null ? num : (i === 'extra' ? '加' : i + 1);
    text(o, String(n), {x: 0, y: 2 * k, size: 34 * k, weight: 700, fill: lit ? C.pearl : done ? C.ink : C.muted});
    const lbl = label != null ? label : (i === 'extra' ? '' : STATIONS[i]);
    if (lbl) text(o, lbl, {x: 0, y: labelAbove ? (labelDy != null ? labelDy : -80 * k) : 90 * k, size, weight: lit ? 700 : 400, fill: lit ? C.mango : done ? C.ink : C.muted});
    return o;
  }
  /* rider(parent, {x, y, fromX, s}) — the little MRT car sitting above the line at (x, y).  With fromX it rolls from fromX to x when its item appears. */
  function rider(parent, {x = 0, y = 0, fromX = null, s = 1} = {}) {
    const o = g(parent, `translate(${x} ${y - 70}) scale(${s})`), m = el('g', {class: 'rider'}, o);
    if (fromX != null) m.style.setProperty('--dx0', (fromX - x) / s + 'px');
    R(m, -42, -22, 84, 40, 12, {fill: C.chili});
    for (const wx of [-30, -9, 12]) R(m, wx, -14, 18, 16, 4, {fill: C.paper});
    R(m, -42, 4, 84, 5, 0, {fill: C.pearl}).style.opacity = .35;
    Ci(m, -22, 22, 7, {fill: C.ink}); Ci(m, 22, 22, 7, {fill: C.ink});
    P(m, 'M0 34 L0 56', {stroke: C.chili, w: 0.1});
    return o;
  }
  /* mrt(parent, {x, y, w, active, extra, labels, size, rider, lit}) — the whole map at once.  active: index 0..3 or 'extra' (lit); stations before it are 'done'; lit: true = all lit */
  function mrt(parent, {x = 200, y = 330, w = 1200, active = -1, extra = false, extraLabel = '加開一站：手機不是壞人', size = 36, rider: withRider = false, lit = false, k = 1} = {}) {
    const L = mrtLayout({x, y, w, extra}), o = g(parent);
    const order = extra ? [0, 1, 2, 'extra', 3] : [0, 1, 2, 3];
    const ai = active === 'extra' ? order.indexOf('extra') : order.indexOf(active);
    mrtLine(o, L, {upTo: lit ? order[order.length - 1] : (active === -1 ? -1 : active)});
    order.forEach((s, j) => mrtStation(o, L, s, {state: lit ? 'lit' : j === ai ? 'lit' : (ai >= 0 && j < ai) ? 'done' : 'idle', size, k, labelDy: s === 'extra' ? -156 * k : null, label: s === 'extra' ? extraLabel : undefined, labelAbove: s === 'extra', num: s === 'extra' ? '加' : (s + 1)}));
    if (withRider && ai >= 0) rider(o, {x: (order[ai] === 'extra' ? L.extraPt : L.pts[order[ai]]).x, y: y - 30 * (k - 1), s: k});
    o.layout = L;
    return o;
  }
  /* sectionHeader(parent, {active, title, extra, from}) — the route map across the middle with the section title under it; the rider rolls from station `from` */
  function sectionHeader(parent, {active = 0, title = '', extra = false, from = null, titleSize = 100} = {}) {
    const o = g(parent), m = mrt(o, {x: 220, y: 330, w: 1160, active, extra, size: 36, k: 1.4});
    const L = m.layout, order = extra ? [0, 1, 2, 'extra', 3] : [0, 1, 2, 3];
    const pt = s => (s === 'extra' ? L.extraPt : L.pts[s]);
    const ax = pt(order[order.indexOf(active)]).x, fx = from == null ? ax : pt(order[Math.max(0, order.indexOf(from))]).x;
    rider(o, {x: ax, y: 330 - 40, fromX: fx, s: 1.4});
    text(o, title, {x: 800, y: 640, size: titleSize, weight: 700});
    o.layout = L;
    return o;
  }

  let posterN = 0;
  /* questionBubble(parent, {x, y, s = 1}) — the big green outgoing bubble carrying the headline 「滑著手機的我們，／還在真正溝通嗎？」 (open·5 and end·0).
     1120 x 380 at s = 1, (x, y) = centre, tail at the lower right; 「真正溝通」 is highlighted in --mango (the same key-phrase treatment as the cover). */
  function questionBubble(parent, {x = 800, y = 450, s = 1} = {}) {
    const o = g(parent, `translate(${x} ${y}) scale(${s})`), BW = 1120, BH = 380, r = 60;
    P(o, `M${-BW / 2 + r} ${-BH / 2} L${BW / 2 - r} ${-BH / 2} Q${BW / 2} ${-BH / 2} ${BW / 2} ${-BH / 2 + r} L${BW / 2} ${BH / 2 - r} Q${BW / 2} ${BH / 2} ${BW / 2 - r} ${BH / 2} L${BW / 2 - 70} ${BH / 2} L${BW / 2 - 10} ${BH / 2 + 70} L${BW / 2 - 190} ${BH / 2} L${-BW / 2 + r} ${BH / 2} Q${-BW / 2} ${BH / 2} ${-BW / 2} ${BH / 2 - r} L${-BW / 2} ${-BH / 2 + r} Q${-BW / 2} ${-BH / 2} ${-BW / 2 + r} ${-BH / 2} Z`, {fill: C.chatMe, stroke: C.paper, w: 6});
    R(o, -214, -2, 428, 128, 24, {fill: C.mango});
    text(o, '滑著手機的我們，', {x: 0, y: -62, size: 104, weight: 700, fill: C.chatInk});
    text(o, '還在', {x: -312, y: 62, size: 104, weight: 700, fill: C.chatInk});
    text(o, '真正溝通', {x: 0, y: 62, size: 104, weight: 700, fill: C.chatInk});
    text(o, '嗎？', {x: 312, y: 62, size: 104, weight: 700, fill: C.chatInk});
    o.w = BW; o.h = BH;
    return o;
  }

  /* ---------- wanted poster ---------- */
  /* poster(parent, {x, y, w, h, name, art, stamp, rot, label}) — a 通緝 poster (centre x, y).  art(group, {w, h}) draws inside the picture window
     (default: a dark silhouette with ？); stamp: a string such as '通緝' puts the red stamp across the corner */
  function poster(parent, {x = 0, y = 0, w = 300, h = 420, name = '？？？', art = null, stamp: st = '通緝', rot = 0, label = '通 緝'} = {}) {
    const o = g(parent, `translate(${x} ${y}) rotate(${rot})`);
    R(o, -w / 2 + 6, -h / 2 + 8, w, h, 6, {fill: C.pearl}).style.opacity = .4;
    R(o, -w / 2, -h / 2, w, h, 6, {fill: C.poster});
    R(o, -w / 2 + 12, -h / 2 + 12, w - 24, h - 24, 3, {stroke: C.hair, w: 3});
    text(o, label, {x: 0, y: -h / 2 + 58, size: Math.round(w * .2), weight: 700, fill: C.hair});
    const pw = w - 70, ph = h - 190, py = -h / 2 + 100;
    R(o, -pw / 2, py, pw, ph, 3, {fill: C.wood}).style.opacity = .28;
    const clip = 'pc' + (++posterN);
    const cp = el('clipPath', {id: clip}, defs); el('rect', {x: -pw / 2, y: py, width: pw, height: ph}, cp);
    const win = el('g', {'clip-path': `url(#${clip})`}, o);
    const wg = g(win, `translate(0 ${py + ph / 2})`);
    if (art) art(wg, {w: pw, h: ph}); else silhouette(wg, {y: ph * .08, s: ph / 250});
    text(o, name, {x: 0, y: h / 2 - 50, size: Math.round(w * .115), weight: 700, fill: C.hair});
    if (st) stamp(o, st, {x: w * .16, y: h * .24, size: Math.round(w * .17), color: C.broth, rot: -14});
    o.w = w; o.h = h;
    return o;
  }

  return {glow, person, silhouette, face, faceProfile, icon, ICONS: Object.keys(ICONS), phone, bubble, badge, bag, teaCup, dumpling, dumplingMarkup,
    stamp, source, sticky, questionBubble, underline, scribble, caret, burst, grid, gridLayout, wave, dial, calendar,
    mrtLayout, mrtLine, mrtStation, rider, mrt, sectionHeader, STATIONS, poster};
})();
