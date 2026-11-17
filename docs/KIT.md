# KIT.md — what the foundation gives the scene builders

Read `BRIEF.md` (rules, palette) and `STORYBOARD.md` (what each beat shows) first. This file says **how to draw it** with what exists.
Classic scripts share one global scope: a scene file declares nothing at top level except its `section(...)` call (keep helpers inside the build function). Kits expose exactly one global each: `Kit2D`, `Chat`, `Kit3D`.
A scene is `section('p1', NOTES_BY_SECTION.p1, (b, at) => { ... })`; `b` = global number of the section's first beat, so "p1·3" is beat `b + 3`.

Open `tools/gallery.html` (`DECK=tools/gallery.html node tools/shot.cjs one out.png 6`) to see every kit function drawn once (`tools/gallery.js`).

---------------------------------------------------------------------------------------------------------

## 0. Engine recap (js/engine.js)

* Colours `C`: `C.ink C.muted C.line C.paper C.bg C.chili C.mango C.screen C.rose C.leaf` (theme tokens) and object colours `C.wood C.woodDark C.broth C.brothWhite C.skin1 C.skin2 C.skin3 C.hair C.lamp C.poster C.sticky C.tea C.pearl C.pot C.dough` and chat colours `C.chatBg C.chatMe C.chatThem C.chatInk C.chatMeta`. These are `var(--x)` strings, so they follow the T key. `C.pearl` = very dark brown, good for text on `C.mango`/`C.sticky`. `C.hair` is the dark ink used on posters/stickies (always dark, in both themes).
* Fonts: `text(parent, str, {x, y, size, fill, weight, anchor, font})`. Default font is Huninn (one weight only). `weight: 700` is simulated with a thin outline, so use it for headings. `font: 'en'` is still Huninn; `'mono'` for URLs.
* `item({from, to, x, y, s, pos, op, delay, cls, top})` returns the group to draw in. Visible for beats `from .. to-1`. `delay` ms before it appears (keep stagger + 0.6 s under about 2.2 s: the settle budget is 2.5 s). `cls`: `'stamp'` (thud in), `'fade'` (no pop movement), `'slide-up'`, `'slide-left'`, `'slide-right'`. `pos: {beat: [x, y, scale]}` moves it on later beats; `op: {beat: opacity}` dims it; `top: true` draws above 3D views / chat panels.
* Per-element stagger inside an item: give a shape `class="cell"` and `style.transitionDelay = 'Nms'` (opacity fade-in, used by grids/waves/calendars), or class `pop` (scales in), or `draw(parent, d, color, w, delayMs)` (a line that draws itself). All of these play when the item turns on, and are instant in `?still`.
* Other helpers: `el paint tag arrow cross check stampBox curveArrow G draw bar counter panel media rnd placeholder defClip`. `counter(parent, {x, y, size, fill, values: {beat: n}, format})` rolls to a new number on a beat.
* `beatHooks.push((beat, prevBeat, dir, still) => {...})` runs after every beat change. Use it for short custom sequences (timers). Always `clearTimeout` at the top of the hook, and set the final state immediately when `still || STILL || dir <= 0` `dir > 0` is a forward click. Pattern (a short sequence that must also be right when jumping or going back):
  ```js
  let t = 0;
  beatHooks.push((bt, pb, dir, still) => {
    clearTimeout(t); el.style.transition = 'none';
    if (bt !== b + 5) { el.style.opacity = 0; return; }                 // not our beat: hidden state
    if (still || STILL || dir <= 0) { el.style.opacity = 1; return; }   // jump / back / screenshot: final state at once
    el.style.opacity = 0;
    t = setTimeout(() => { el.style.transition = 'opacity .5s'; el.style.opacity = 1; }, 800);   // forward click: short sequence
  });
  ```
* `STILL` is true in `?still` mode. `keyed(map, beat, default)` returns the value of the latest key `<= beat`.
* `PRESENTER` and `COURSE` are in `js/content.js`.

---------------------------------------------------------------------------------------------------------

## 1. Kit2D (js/kit2d.js)

All functions: `Kit2D.fn(parent, {options})` draw into an SVG group and return the new `<g>`. (x, y) is the centre unless stated. All sizes are stage px.

### People and faces
* `person(parent, {x, y, h = 140, color = C.ink, pose = 'stand', flip = false, phoneColor = C.screen, head = null})` — flat pictogram, (x, y) = **feet**. `pose`: `'stand' | 'phone'` (head down, glowing phone held at the chest) `| 'wave' | 'hand'` (raised hand) `| 'shrug' | 'arms' | 'sleepless'`. `flip: true` mirrors. `head` overrides the head colour.
  `Kit2D.person(g, {x: 400, y: 700, h: 220, pose: 'phone', color: C.ink})`
* `silhouette(parent, {x, y, s = 1, color = C.pearl, q = true, qColor})` — dark head-and-shoulders with a big 「？」 (for posters).
* `face(parent, {x, y, r = 60, mood = 'neutral', fill = C.skin1, ink = C.hair, outline = null, glowColor = null})` — 2D face. `mood`: `'happy' | 'tired'` (droopy, sweat drop) `| 'cold'` (narrow eyes, brows down) `| 'neutral' | 'sad' | 'sleepless' | 'meh'` (flat, bored) `| 'blank'` (dashed empty outline with ？, waiting to be filled). `glowColor: 'screen'` puts a cold glow behind it.
  `Kit2D.face(g, {x: 400, y: 450, r: 110, mood: 'happy'})`
* `faceProfile(parent, {x, y, r, dir = 1, fill, ink, hair, mood})` — side view head, `dir: 1` faces right, `-1` left (`mood: 'happy'` smiles). For p2·1.

### Icons
* `icon(parent, name, {x, y, s = 1, color = C.ink, w = 4})` — 48 × 48 line icon (flat, 4 px round caps), `s` scales (s = 3 → 144 px). `Kit2D.ICONS` lists names:
  `phone chat heart thumb eye eye-off speaker speaker-off wave smile hand link link-off signal check cross plane mail camera question trash call keyboard clock users bell spark sweat shrug search lock stack flower pin book`.
  (`eye-off`, `speaker-off`, `link-off` carry their own chili slash.) `Kit2D.icon(g, 'eye-off', {x: 900, y: 500, s: 3, color: C.muted})`

### Objects
* `phone(parent, {x, y, w = 80, color = C.screen, glow = false, body = C.pearl, tilt = 0})` — front-view phone (height = 1.95 w). `glow: true` adds the cold radial glow (the only place `--screen` light appears in 2D).
* `bubble(parent, {x, y, w, h, text, size = 40, fill = C.paper, stroke = C.line, color = C.ink, tail = 'left', kind = 'speech', sw = 4})` — (x, y) = centre of the bubble body. `tail`: `'left' | 'right' | 'down' | 'none'`; `kind: 'speech' | 'thought'` (thought = bubbles instead of a tail). w/h default from the text. The returned group has `.w` `.h`.
  `Kit2D.bubble(g, {x: 800, y: 300, text: '嗯', size: 60, tail: 'down'})`
* `badge(parent, {x, y, r = 11, color = C.chili})` — notification dot (a dot only, never a number).
* `bag(parent, {x, y, s = 1, color = C.rose, open = false})` — tote bag; `open` shows the dark mouth, otherwise a zip line.
* `teaCup(parent, {x, y, s = 1, rot = 0})` — 珍珠奶茶, ~120 × 200 at s = 1.
* `dumpling(parent, {x, y, s = 1, wave = false, mood = 'happy'|'sad'})` — 小籠包 mascot, ~120 px wide at s = 1. `dumplingMarkup({wave, mood})` returns the same drawing as an SVG string (viewBox `-60 -60 120 120`).
* `sticky(parent, lines, {x, y, w = 360, h = 280, rot = -3, size = 56, pin = true, color = C.sticky})` — yellow sticky note with a tack and a hard shadow; `lines` is a string (use `\n`) or an array. Use the **same call** in p2·14 and p5·19: `Kit2D.sticky(g, ['你有在聽', '我說。'], {x: 800, y: 450})`.
* `poster(parent, {x, y, w = 300, h = 420, name = '？？？', art = null, stamp = '通緝', rot = 0, label = '通 緝'})` — wanted poster (paper, double border, header, picture window, name plate, red stamp; set `stamp: null` for none). `art(group, {w, h})` draws inside the window, origin at the window centre (default: `silhouette`).
  `Kit2D.poster(g, {x: 800, y: 450, name: '低頭', art: (a, {h}) => Kit2D.person(a, {x: 0, y: h * .35, h: h * .8, pose: 'phone'})})`

### Marks
* `stamp(parent, str, {x, y, size = 64, color = C.chili, rot = -8})` — double-border rubber stamp. Put it in an `item({cls: 'stamp'})` for the thud. Returns `.w .h`.
* `source(parent, str, {x, y, anchor = 'start'|'middle'|'end', size = 22})` — source tag pill in `--muted`.
* `underline(parent, {x1, x2, y, color = C.chili, w = 10, delay})`, `scribble(parent, {x, y, rx, ry, color, w, delay})` (hand-drawn loop around something), `caret(parent, {x, y, h = 60, color = C.mango})` (editor's insertion mark: a stem and a ^), `burst(parent, {x, y, r = 50, n = 8, color, len})` (radial strokes). `underline` and `scribble` draw themselves when their item appears.
* `glow(parent, {x, y, r = 200, color = 'screen'|'lamp'|'mango'|'leaf'|'chili', op = 1})` — a radial light gradient.

### Pictogram grid (the exact counts)
* `grid(parent, {x, y, w, h, n = 100, cols = 10, icon = 'person', color = C.line, from = 0, to = n, step = 55, order = 'row', scale = .78, delay = 0})` — cells fill the box (x, y = top-left), left to right, row by row. `icon`: `'person' | 'person-phone' | 'person-bubble' | 'kid' | 'bubble' | 'bubble-crack' | 'phone'`. Draws cells `from .. to-1`. They fade in with a stagger: `order: 'row'` (rows `step` ms apart), `'cell'` (each cell `step` ms), `'none'`. Returns the group with `.cells[]` and `.layout` (`.pos(i)` = centre of cell i, `.cell` = pitch).
  **To light 89 of 100:** draw a base grid in `C.line`, then in a *later item* draw the same box with `{to: 89, color: C.screen, icon: 'person-phone'}`. With the 100 / 95 / 89 / 82 / 41 / 80 / 67 counts, `to` is the count.
  `Kit2D.grid(a, {x: 200, y: 150, w: 600, h: 600}); Kit2D.grid(b2, {x: 200, y: 150, w: 600, h: 600, to: 95, color: C.leaf, icon: 'person-bubble'})`
* `gridLayout({x, y, w, h, n, cols})` → `{cell, rows, cols, pos(i)}` without drawing.

### Waveform, dial, calendar
* `wave(parent, {x, y, w = 400, h = 140, kind = 'bounce', color = C.ink, n, gapAt = -1, gapW = .12, step = 28, delay})` — voice bars, (x, y) = left end of the centre line. `kind`: `'bounce'` (high, bouncy, short) `| 'long'` (low, long, trails off) `| 'sharp'` (a few sharp spikes) `| 'steady'`. `gapAt` (0..1 along the width) + `gapW` make a real silence (bars flatten to dots) for 「停頓」. Bars fade in left to right.
* `dial(parent, {x, y, r = 140, of = 24, from = 0, to = 4, color = C.screen, track = C.line, w = 26, ticks = 0, labels = [], hand = null, delay})` — ring with `of` units, 0 at the top, clockwise. The `from..to` arc draws itself when its item appears. `labels: [{v, str, size, color, off}]`, `ticks: 1` = a tick per unit, `hand: v` draws a hand. Returns the group with `.pt(v, radius)` = stage position of unit v.
  Day dial: `Kit2D.dial(g, {x: 500, y: 450, r: 190, of: 24, to: 4, ticks: 1, labels: [{v: 0, str: '0'}, {v: 6, str: '6'}]})`. Clock face: `of: 60, to: 7, hand: 7, w: 14`.
* `calendar(parent, {x, y, cols = 7, rows = 5, cell = 36, gap = 4, count, flow = 'row', frac = 1, color = C.screen, base = C.line, from = 0, to, step = 14, delay})` — day cells, (x, y) = top-left. `flow: 'col'` fills down each column (a 53-column × 7-row year: `{cols: 53, rows: 7, flow: 'col', count: 365, cell: 22, gap: 6, frac: 1/6}`); `frac` fills only the bottom fraction of each cell in `color`; `base: null` draws only the fills (lay it over another calendar). Returns `.cells[]` and `.pos(i)`.

### MRT route map
* `mrt(parent, {x = 200, y = 330, w = 1200, active = -1, extra = false, extraLabel, size = 34, k = 1, rider = false, lit = false})` (`k` scales the station markers) — the whole map. Stations ① 多黏手機 ② 真正的溝通 ③ 三個小偷 ④ 三個小方法 (`Kit2D.STATIONS`). `active` = 0..3 or `'extra'` is lit; earlier stations are "done"; `lit: true` lights all (end·4). `extra: true` makes room for 「加開一站：手機不是壞人」 between ③ and ④.
* `sectionHeader(parent, {active, title, extra = false, from = null, titleSize = 100})` — the heading beat of a section: map across the middle, a rider that rolls from station `from` to `active` (when its item appears), the title at y = 640. For p4 use `{active: 'extra', extra: true, title: ...}`.
* Parts, for staggered pop-ins: `L = mrtLayout({x, y, w, n = 4, extra})` (`L.pts[i]`, `L.extraPt`), `mrtLine(parent, L, {upTo, color, base, w})`, `mrtStation(parent, L, i | 'extra', {state: 'idle'|'lit'|'done', label, labelAbove, labelDy, size, num, k = 1})` (`k` scales the marker), `rider(parent, {x, y, fromX = null, s = 1})` (little train car sitting above the line at y).
  Staggered build (each station its own item, so they pop in left to right; ≈ 0.35 s apart):
  ```js
  const L = Kit2D.mrtLayout({x: 230, y: 520, w: 1140});
  Kit2D.mrtLine(item({from: b, to: b + 1, cls: 'fade'}), L, {w: 28});
  L.pts.forEach((p, i) => Kit2D.mrtStation(item({from: b, to: b + 1, delay: 300 + i * 350}), L, i, {state: 'idle', size: 50, k: 1.55}));
  Kit2D.rider(item({from: b, to: b + 1, delay: 1500, cls: 'fade'}), {x: L.pts[0].x, y: 490, s: 1.7});
  ```
* `questionBubble(parent, {x = 800, y = 450, s = 1})` — the big green outgoing bubble with the headline 「滑著手機的我們，／還在真正溝通嗎？」, 1120 × 380 at s = 1, tail at the lower right, 「真正溝通」 highlighted in `--mango` (the same key-phrase colour as the cover). Use it for end·0 exactly as open·5 does (put it in an `item({cls: 'fade'})` at the centre, or a smaller `s` beside other things).

---------------------------------------------------------------------------------------------------------

## 2. Chat (js/chat.js)

HTML phone through `panel()`. Not LINE-branded. Inside the phone the font is the system UI stack. It sits below `svgTop`, so `item({top: true})` things draw over it.
Phone `w` is the width in stage px (default 420, height = 2.05 × w, so w 400 → 820 tall: use y ≈ 40).

* `Chat.phone({x, y, w = 420, from, to = 999, contact = '小美', sub = '', msgs = [], typing = null, time = {0: '22:41'}, stagger = 300, op = null, opDelay = 0})`
  * `contact` header name, `sub` small text after it (e.g. `'(4)'`).
  * `time: {beat: 'hh:mm'}` — status-bar time from that global beat on (keyed). `op: {beat: opacity}` dims the phone (`opDelay` ms wait before it dims only).
  * `msgs` — each `{beat, who: 'me'|'them', name, text | sticker | tile, title, time, typed, until, receipt}`:
    * `beat` global beat on which it appears (stays until `until`, default forever). Several messages on one beat appear one after another, `stagger` ms apart (keep n × stagger ≤ ~1.8 s). Messages appear at the bottom and push older ones up; the top is clipped like a real chat.
    * `name` sender name above a "them" bubble (default `contact`; `''` hides it). Generic names only: 媽 爸 姊 阿姨 阿哲 小美.
    * `text` bubble text. `typed: true` makes the text type itself in (~1 s, forward clicks only).
    * `sticker: 'dumpling' | 'thumb'`. `tile: 'morning'` (早安圖: flower + 早安), `'photo'` (hot-pot photo), `'article'` (forwarded link card, `title` sets its headline).
    * `time` small time beside the bubble.
    * `receipt: {beat, text = '已讀', time, ring}` — a 「已讀」 receipt (with time) left of **my** bubble from `beat`; `ring: beat` draws a hand-drawn chili circle round it from that beat.
  * `typing: {from, to, who = 'them'|'me'}` — a static "…" bubble for those beats.
  * Returns `{el, screen, phone, body, refresh}`.
  ```js
  Chat.phone({x: 300, y: 40, w: 400, from: b + 21, to: b + 26, contact: '阿哲',
    time: {[b + 21]: '22:47', [b + 22]: '23:58', [b + 23]: '01:12'},
    msgs: [{beat: b + 21, who: 'me', text: '週末要不要一起吃火鍋？', time: '22:46', receipt: {beat: b + 21, time: '22:47', ring: b + 21}},
           {beat: b + 24, who: 'them', text: '好啊。'}]});
  ```
* `Chat.call({x, y, w = 420, from, to, name = '阿哲', status = '通話中', warm = true, op, opDelay, time})` — the voice-call screen: big avatar, name, status, three round buttons and the red end button; `warm: true` lights it with the lamp colour (p5·12).
* `Chat.shell({x, y, w, from, to, dark = false, op, opDelay, time, cls, update(beat)})` → `{el, phone, screen, body}` — an empty phone (status bar + `body` div) for custom content such as the p4 video call. Append HTML or an inline `<svg>` into `body` (it is `position: relative; flex: 1`, about 396 × 760 design px; the whole phone is scaled by `w / 420`).
* `Chat.banner({from, to, text, title = '新訊息', time = '現在', x = 380, y = 26, w = 840})` — notification that slides down from the top of the stage on `from` and leaves on `to`; generic app icon (not LINE). `Chat.banner({from: b + 10, to: b + 11, text: '你沒有手機重要。'})`
* `Chat.sticker` / `Chat.tiles` list the names.

---------------------------------------------------------------------------------------------------------

## 3. Kit3D (js/kit3d.js)

Three sets, all clay/toy figures (matte, soft shadows, 3/4 high-angle camera), every colour read from CSS tokens (T recolours them). The model is a pure function of the numbers: no clocks, so back / still / idle all behave.
Use `view3d` (js/three-view.js) with a Kit3D model and `Kit3D.params(kind, {...})` for `at`:

```js
const view = view3d({x: 0, y: 0, w: 1600, h: 900, from: b, to: b + 4,
  model: v => Kit3D.hotpot(v),                                   // or Kit3D.cafe(v) / Kit3D.solo(v)
  at: beat => Kit3D.params('hotpot', beat === b ? {arm: 1, tilt: .9, glow: 1, lamp: .18} : {steam: 1, dist: 8.5})});
```

Rules:
* `at(beat)` is called for any beat (also ones before `from` when the view enters), and must return the **full** params every time: always go through `Kit3D.params(kind, overrides)`, which fills defaults.
* Changed numbers glide (default 0.9 s, 0.45 s on back). Per-key: `dur: {dist: 1.2}` in `view3d`, or `$dur: {tilt: .4}` inside the object `at` returns.
* **One view per run of beats**; every `view3d` owns a WebGL context and Chrome allows only about 16 live ones. Build one view with `from`..`to` covering all the beats that share the set, and let `at` vary.
* Views need not be full-stage: a narrower view automatically gets a wider lens so the set still fits (p3·13 split stage: two `Kit3D.cafe` views, e.g. 780 × 640 each).
* Dragging inside a view orbits it (`v.orbit`), already handled.

### Params shared by all sets
`yaw` (camera azimuth, rad), `pitch` (elevation, rad), `dist` (distance), `tx ty tz` (look-at point), `lamp` 0..1 (pendant lamp + warm light; 0.1–0.3 = dim cold room, 1 = warm).

**Per-person params** — `tilt` 0..1 head down; `turn` rad head yaw; `arm` 0 phone in lap / 1 phone at chest / 2 phone raised for a photo (in between = glide; phone hidden when `arm` = 0 and not stacked); `glow` 0..1 cold phone light on face/hands/phone screen; `smile` −1 frown … 0 flat … 1 smile; `nod` 0..1 a nodding pose (chin dip, eyes squint, cheeks); `lean` rad, 0..0.35, extra lean forward. Pass `tilt: .9` to set **everyone**, `tilt2: .9` to set **person 2 only** (a number suffix overrides the unsuffixed value). Which index is whom is below.

### `Kit3D.hotpot(v, {people})` — 鴛鴦鍋 table for four
Persons: `0` dad (far left, glasses), `1` mom (far right, bob), `2` teen (left side, cap), `3` kid (right side, pigtails). Everybody's own phone is drawn automatically.
Extra params: `steam` 0..1 (wisps over the pot), `food` 0..1 (the meat-and-vegetable platter slides onto the table from the camera side, front-left), `stack` 0..1 (every phone flies from the hand to a pile at the front right of the pot and lies face-down; the hands reach for it while it goes. For tip 1 use `stack: 1, arm: 0, glow: 0`, heads up with `tilt: 0`), `lamp`.
Defaults: `yaw .34, pitch .56, dist 9.4, ty 1.55`. A push-in is a smaller `dist` (8.4); a gentle rise at the end is a bigger `pitch`/`ty`.
Examples: heads down = `{arm: 1, tilt: .9, glow: 1, lamp: .18}`; photo = `{arm: 2, tilt: 0, glow: .45, food: 1, smile: .5}`; reconnect = `{arm: 0, tilt: 0, glow: 0, stack: 1, lamp: 1, steam: 1, food: 1, smile: 1, turn0: .5, turn1: -.5}`; a hand twitching toward the pile (p5·7) = the heads-up reconnect params plus `arm2: .45` (that person's hand lifts from the lap; the phone itself stays in the pile).
`Kit3D.hotpot(v, {people: [...]})` replaces the four figures; each `{skin: 'skin-1'|'skin-2'|'skin-3', style: 'short'|'bob'|'bun'|'pigtails'|'cap'|'spiky'|'bald', hairColor: 'hair', shirt: 'cloth-a'…'cloth-f', pants, hat, kid: false, glasses: false, scale: 1, hand: 'r'|'l'}`.

### `Kit3D.cafe(v, {people})` — duo café table
Persons: `0` left friend (faces right), `1` right friend (faces left, left-handed phone).
Extra params: `distance` 0..1.6 (chairs drift apart; widen `dist` a little when > 1), `phone` 0..1 (a phone lies on the table between them, face-up, `phoneGlow` 0..1 faint cold glow, default .5), `faceDown` 0..1 (that phone flips face-down and stops glowing), `notebook` 0..1 (a notebook replaces the phone on the table), `bag` 0..1 (a bag appears on the floor in front of the table and the table phone slides into it; the phone is then hidden inside).
Own phone in hand: `arm1: 1, tilt1: .9, glow1: 1` (right friend head-down on a glowing phone). Examples: p3·9 `{arm1: 1, tilt1: .9, glow1: 1, tilt0: .05, smile0: 0}`; p3·10 same with `smile0: -1`; p3·12 `{phone: 1}` both heads up talking; p3·13 left table `{notebook: 1}`, right table `{phone: 1}`; p3·14 right `{phone: 1, distance: 1}`; p3·19 `{phone: 1, bag: 1}`; p5·18 `{phone: 1, faceDown: 1, arm: 0, tilt: 0, nod0: 1, smile: .4}` (listener = whichever you pick; tilt only the speaker if you like).
Defaults: `yaw .14, pitch .46, dist 8.2, ty 1.5`.

### `Kit3D.solo(v, {person})` — one figure alone (the cover)
Person `0`. Params: per-person + camera + `lamp` (defaults `yaw 2.6, dist 7.4, tz .5`: camera looks at the figure from across the table). The cover scene fades the view's edges with a CSS mask: `v.d.style.maskImage = 'radial-gradient(...)'`.

### Anchors: put SVG on a 3D point
`Kit3D.stagePoint(v, name, i = 0)` → `{x, y}` in stage px (use in `view.cfg.overlay = (v, p) => {...}`, which runs after every frame so labels follow camera moves). Names: `'head'` (head centre, i = person), `'top'` (just above the head), `'phone'` (the phone, i = person), `'pot'`, `'lamp'`, `'stack'` (hot-pot pile), `'food'`, `'table'`; café also `'phoneTable'`. `v.model.anchor(name, i)` gives the raw THREE.Vector3.
Pair with `label3d(parent, str, color, size)` (engine): it returns `update(anchorX, anchorY, tagX, tagY)` and draws a tag with a leader line. Create the labels inside an `item({top: true})`, update them in the overlay:
```js
const tags = item({from: b, to: b + 1, top: true, delay: 500});
const upMen = label3d(tags, '4 個人', C.mango, 34), upPhone = label3d(tags, '4 支手機', C.screen, 34);
view.cfg.overlay = v => {
  const a = Kit3D.stagePoint(v, 'top', 2), c = Kit3D.stagePoint(v, 'phone', 3);
  upMen(a.x, a.y, 300, 190);        // anchor point, then where the tag sits
  upPhone(c.x, c.y, 1060, 810);
};
```
The same overlay can move any SVG group (`g.setAttribute('transform', `translate(${p.x} ${p.y})`)`), e.g. speech bubbles that follow a head.

### Lower level
`Kit3D.person(mats, opts)`, `Kit3D.phone(mats, scale)`, `Kit3D.makeMats(pal)` build the pieces (see the source); scenes normally do not need them.

---------------------------------------------------------------------------------------------------------

## 4. Rules of thumb
* One focal point per beat. Warm colour = people (`--mango`, `--chili`), cold `--screen` only for phones/screens/notification light, `--leaf` = connection.
* No emoji, no invented numbers (see BRIEF). Icons come from `Kit2D.icon`.
* Anything animated by code must respect `STILL` / `still` and be settled within ~2.5 s. Anything with timers: clear on the next beat, set the final state when `still` or going back.
* Check each beat with `node tools/shot.cjs one out.png <beat>` (full size, look at it), then `sheet`, `idle`, `walk`, `node tools/check.cjs`. `THEME=light` checks the day theme.
