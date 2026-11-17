# Deck brief — 「滑著手機的我們，還在真正溝通嗎？」

An HTML presentation (16:9 stage, 1600 × 900) for a university 人際溝通 class, presented live from a laptop.
One click = one beat. 93 beats. Speaker notes are the presenter's script, already split per beat in `js/notes.js`.
The engine is adapted from the presenter's earlier deck (SVG stage + three.js views + presenter window).
Read this file, then `docs/STORYBOARD.md` (what every beat shows).

## 1. Hard rules

- **Opens by double-click** (`file://`), offline. Classic `<script>` tags only: no ES modules, no `fetch`, no CDN, no network at runtime. Fonts and libraries live in this folder.
- **Nothing moves without a click.** No CSS `infinite` animations, no rAF loops that keep running, no idle drift. A click may start a short sequence (staggered pop-ins, a camera glide, a counter roll), and it must settle within about 2.5 s.
- **`?still` mode** (used by the screenshot tool) shows every beat's end state with no transitions. Custom animation code must respect `STILL` / the `still` argument of beat hooks.
- **Back works.** Pressing ← must restore the previous beat exactly, including 3D params and chat state.
- **Notes are never retyped.** Every scene calls `section('<id>', NOTES_BY_SECTION['<id>'], build)`.
- **No invented numbers.** A number may appear on screen only if it is in that section's list in the storyboard. Every listed number comes from the script or the doc's sources table. Derived legends are fine, such as 「1 人 = 23 萬人」 or 「每 20 人有 19 人」. Fake counters, "99+" badges and made-up percentages are not allowed. Clock times inside the fake chat UI, such as 22:47, are UI decoration and are allowed.
- **Proportions are exact.** Icon grids are out of 100 and use the real count: 95 (LINE, 2,200 of 2,325 萬, rounded), 89, 82, 41, 80, 67.
- **Unverified studies get no quantities.** The email study (p2) and the UK phone-on-table experiment (p3) have no verified numbers, so they get no bars, no counts and no ratios. Show them qualitatively.
- **Not LINE-branded.** The chat mock-up is LINE-like (green sent bubbles, white received bubbles, blue-grey chat background, small 「已讀」 receipts) but has no LINE logo, no LINE Friends characters and no app name in the UI. Contact names are generic (小美, 阿哲, 我們這一家).
- **No emoji characters anywhere.** Draw icons as SVG or 3D.
- **Script ownership.** Classic scripts share one global scope. Each scene file may declare nothing at top level except its `section(...)` call; put helpers inside the build function or an IIFE. Kits each expose exactly one global object (`Kit2D`, `Chat`, `Kit3D`).
- **No git commands.** The surrounding repo holds unrelated uncommitted work.

## 2. Art direction: 「冷光與熱湯」 (screen glow vs. hot-pot warmth)

The story is about cold screens and warm people, so colour carries meaning:
- **`--screen`** (pale cold blue) is used only for phones, screens, notifications and the light they cast.
- **`--chili` and `--mango`** are human warmth: the hot pot, the lamp, laughter and real conversation. Chili also marks the "thieves".
- **`--leaf`** is chat-green (sent bubbles) and positive "connection".
- The deck gets warmer as it goes. Early 3D scenes are lit by phone glow with a dim lamp; the reconnect scenes in p5 and the end are lit by a warm lamp with phones face-down.

### Palette (all colours live in `css/deck.css` `:root` tokens, 3D included)

Night is the default (`data-theme="dark"`). It is a deep petrol-teal room, deliberately not the warm cream or charcoal of the earlier deck.

| token | night (default) | day (T key) | use |
|---|---|---|---|
| `--bg` | `#0E3238` | `#E3EEEA` | stage background |
| `--paper` | `#154149` | `#F5F9F7` | cards, poster paper (see below), panels |
| `--ink` | `#F7F1E8` | `#0F343A` | main text |
| `--muted` | `#8FB0B1` | `#5A7C7E` | secondary text, source tags |
| `--line` | `#2B5B62` | `#BCD2CD` | rules, grid lines, inactive icons |
| `--chili` | `#FF6B47` | `#E04F2B` | warmth, thieves, alerts |
| `--mango` | `#FFC24D` | `#D48A0C` | big numbers, highlights |
| `--screen` | `#A8DBFF` | `#2C86C9` | phones and screen light only |
| `--rose` | `#FF9DB0` | `#D4547A` | emotion, stickers |
| `--leaf` | `#8FDB7A` | `#3E9B4C` | chat-green, connection |

Object colours (same in both themes): `--wood #C98A5B`, `--wood-dark #9C6440`, `--broth #E0452B`, `--broth-white #F1E6D2`, `--skin-1 #F2C9A5`, `--skin-2 #D9A27A`, `--skin-3 #B57A55`, `--hair #2A1E1A`, `--lamp #FFB86B`, `--poster #EFE3C8` (wanted-poster paper).
Chat UI: `--chat-bg #9BB3D3`, `--chat-me #A5E688`, `--chat-them #FFFFFF`, `--chat-ink #1E1E1E`, `--chat-meta #4E5D6C`.

### Type

- **Display and labels:** jf-openhuninn 粉圓 (SIL OFL, Taiwanese rounded type). Download the latest release TTF from `github.com/justfont/open-huninn-font` (find the asset via `api.github.com/repos/justfont/open-huninn-font/releases/latest`) into `assets/fonts/`, add `@font-face { font-family: Huninn }`, and set `FONT.zh` to `"Huninn","Microsoft JhengHei","PingFang TC",sans-serif`. Keep the font's licence file next to it. If the download is impossible, fall back to Microsoft JhengHei and say so in your report.
- **Inside the fake phone UI:** use the system UI stack (`"Microsoft JhengHei UI","PingFang TC",sans-serif`) so it reads as a real app.
- **Sizes:** big numbers 120–220 px; key words 64–110 px; labels 28–40 px; source tags 20–22 px in `--muted`.
- **Amount of text:** at most about 14 Chinese characters per on-screen text element, except quoted lines. Never put the spoken sentence on screen; the screen shows the picture and the keyword.

### Texture and depth

- Add a static film-grain overlay over the whole stage (an SVG `feTurbulence` noise as a data-URI background, about 5–7 % opacity, `pointer-events:none`).
- Gradients only where they depict light: a radial phone glow or a lamp glow. No decorative gradients, glass blur, soft drop shadows or neon.
- When something needs to lift off the background, give it a hard offset shadow (3–4 px, solid darker tone). Use it sparingly.
- Icons: flat filled shapes, with 4 px round-cap strokes where a stroke is needed. Keep weights consistent.

### Recurring motifs (local and specific, not stock)

- **Taipei-MRT-style route map** for the agenda and section headers. Four stations: ① 多黏手機 ② 真正的溝通 ③ 三個小偷 ④ 三個小方法. The current station is lit. In p4 an extra stop pops in between ③ and ④: 「加開一站：手機不是壞人」.
- **通緝 wanted posters** (`--poster` paper, red 通緝 stamp) for the three thieves.
- **鴛鴦鍋 hot-pot table** in 3D (red/white split pot). It is the recurring set: the opening (phones out), tip 1 (phones stacked) and the ending (heads up, warm light).
- **小籠包 dumpling mascot**, an original sticker character (round, pleated top, two dot eyes, blush). It is the chat "sticker" and appears in the 貼圖給不了 beat. It must not resemble any existing brand character.
- **珍奶 bubble-tea cup** for the phone-stack penalty, the **早安圖** joke tile in the family group chat, a **police line-up height chart** in p4, an **editor's caret mark** inserting 「可能」 in p3, and a **sticky note** 「你有在聽我說。」 pinned in p2 that comes back in p5 (the callback payoff).

### 3D look

- Soft clay/toy figures in the spirit of a modern illustrated diorama, not realistic.
- Rounded capsule bodies, sphere heads, simple hair shapes, dot eyes and a small mouth that can smile, go flat or frown.
- Matte `MeshStandardMaterial` (roughness 0.75–0.9, metalness 0), soft shadows, a consistent 3/4 high-angle camera.
- Lighting tells the story: phone screens are emissive with small cool point lights on faces when `glow` > 0, and a warm pendant lamp sits over the table (`lamp` 0..1).
- Every material colour is read from the CSS tokens, so the T theme switch recolours the 3D (see `palette3d` / `recolor` in `three-view.js`).

## 3. Engine (adapted from the earlier deck)

`js/engine.js` provides `section`, `at`, `item({from,to,pos,op,delay,cls,top})`, `el`, `paint`, `text`, `tag`, `arrow`, `cross`, `draw`, `bar`, `check`, `stampBox`, `curveArrow`, `G`, `media`, `panel(div, vis, update)`, `counter`, `placeholder`, `beatHooks`, `STILL`, `rnd()` (seeded) and the colour map `C` (CSS variables).
`js/three-view.js` provides `view3d({x,y,w,h,from,to,model(v),at(beat),dur,ease,snap,backSnap,overlay})` and `label3d`.
Keys: → / Space / click = next, ← / right-click = back, N notes, P presenter window, F fullscreen, T theme, `#n` in the URL jumps to beat n.

Global beat numbers (START of each section): title 0, open 1–7, p1 8–16, p2 17–31, p3 32–57, p4 58–66, p5 67–86, end 87–91, refs 92.

## 4. Kits (owned by the foundation job; scene jobs only use them)

- **`js/kit2d.js` → `Kit2D`:** person pictogram and pictogram grid (`n of 100` highlight, staggered), phone icon, chat-bubble icon, 2D face with moods (happy, tired, cold, neutral, sad), voice waveform (bouncy, long/flat, sharp), clock dial / arc, calendar grid, MRT route map (active station, optional extra stop), wanted poster frame, stamp, source tag, sticky note, dumpling mascot, bubble-tea cup, bag, notification badge (dot only), section header (route map plus title).
- **`js/chat.js` → `Chat`:** an HTML phone mock-up shown through `panel()`: status bar, chat header (back arrow, contact name, call and menu icons), chat background, messages that appear on given beats (`me`/`them`, text, sticker, image tile), 「已讀」 receipts that appear on a given beat, an optional static typing bubble, status-bar time per beat, and a voice-call screen variant. It also offers a stand-alone **notification banner** that slides down from the top of the stage on a given beat.
- **`js/kit3d.js` → `Kit3D`:** palette from tokens, standard lighting rig and renderer settings, `person({skin,hair,shirt,kid})` with params (`tilt` head down 0..1, `turn`, `arm` 0 lap / 1 phone at chest / 2 phone raised for a photo, `glow`, `smile` −1..1, `nod`), `phone()` (`glow`, `faceDown`), the hot-pot table set for 4 (`steam`, `food`, `stack` phones fly to the centre face-down, `lamp`, per-person params) and the duo café table for 2 (`phone` on table, `notebook`, `distance` between chairs, `faceDown`, speaker/listener params).

The foundation job documents the exact signatures in `docs/KIT.md` with a short example each.

## 5. Checks every job runs before reporting

1. `node tools/shot.cjs sheet docs/shots/<section>.jpg <its beats…>`, then open the image and look at it. Judge it as a demanding art director would: it should be clean, legible from the back of a classroom, show one focal point per beat and look distinctive rather than stock.
2. `node tools/shot.cjs idle <a few beats>`: frames 5 s apart are identical.
3. `node tools/shot.cjs walk <first> <last>`: every beat settles, and forward vs. back frames match.
4. No `pageerror`, console error or failed request in the tool output.
5. `node tools/check.cjs`: notes rebuild `docs/script.txt`, the Huninn font is loaded and the beat count is 93.
