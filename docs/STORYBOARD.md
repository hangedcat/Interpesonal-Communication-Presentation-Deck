# Storyboard — 93 beats

Format: `id·k (global n)` — what the beat's note is about → **what the screen shows**. The notes themselves are in `js/notes.js`; never put them on screen.
Within a section the composition evolves: elements pop in, move (`pos`), dim (`op`) or leave; it is not a new slide every click unless a cut is written.
Each section lists the only numbers it may show.

## title (global 0) — 1 beat
- title·0 (0) — no note → **Left:** eyebrow 「人際溝通 · 報告」 (muted, small); headline over two lines 「滑著手機的我們，」/「還在真正溝通嗎？」 (Huninn, ~96 px), with 「真正溝通」 underlined by a hand-drawn chili stroke; bottom-left date from the computer clock plus `PRESENTER` from `js/content.js` (an empty string by default, so nothing shows). **Right:** a 3D vignette of one seated clay figure, head down, face lit cold blue by the phone, with a warm pendant lamp above that is dim. The mood is set.

## open (1–7) — numbers allowed: 4, 15
- open·0 (1) 一家人去吃火鍋，四個人，四支手機 → **Full-stage 3D hot-pot table** (3/4 high angle): a family of four (dad, mom, teen, kid; different hair, shirt and height), each holding a glowing phone, heads down. 鴛鴦鍋 in the centre, lamp dim. SVG tags with leader lines (`label3d`): 「4 個人」 and 「4 支手機」.
- open·1 (2) 湯在滾，沒有人說話 → Steam wisps rise over the pot (static shapes that appear on the click). An empty speech bubble 「……」 with a slash floats above the table. The camera pushes in a little.
- open·2 (3) 菜來了，抬頭拍照 → A meat-and-vegetable platter slides onto the table. All heads come up and the phones rise to photo position pointed at the food. A white camera flash (quick fade on the click, then settled) and 「喀嚓」 marks near the phones.
- open·3 (4) 又低頭了 → Heads go back down, the phones return to the faces and the blue glow comes back. Tag 「又低頭了」 with a down arrow. The camera eases back.
- open·4 (5) 傳訊息、按讚、回貼圖 → Cut. **Chat phone** (centre-left) showing the family group 「我們這一家」 filling fast, with staggered messages: a 早安圖 tile (flower plus 早安), 「吃飽沒」, a dumpling sticker, 「哈哈哈」, a thumbs-up drawn as a sticker, and a forwarded-article tile. **Right:** three big words stack up 「傳訊息」 「按讚」 「回貼圖」, each with its icon.
- open·5 (6) 我的題目：滑著手機的我們，還在真正溝通嗎？ → A new outgoing bubble types 「滑著手機的我們，還在真正溝通嗎？」 and sends. The bubble then lifts out of the phone and grows into the headline across the stage (the phone dims away).
- open·6 (7) 接下來 15 分鐘…… → **MRT route map** across the stage, with four stations popping in left to right (staggered about 0.35 s): ① 多黏手機 ② 真正的溝通 ③ 三個小偷 ④ 三個小方法. A little rider marker waits at the start.

## p1 我們到底多黏手機？ (8–16) — numbers: 2,300 萬, 2,200 萬, 2024, 4, 1,460 (spoken as 「一千四百多」, show 「1,400+ 小時」 or 「1,460」), 60, 24, 200, 7
- p1·0 (8) heading → Section header: the route map (station ① lit, rider moves there) and the title 「我們到底多黏手機？」.
- p1·1 (9) 台灣大約 2,300 萬人 → A 10 × 10 grid of person pictograms pops in row by row in `--line`. Label 「台灣 ≈ 2,300 萬人」. A note under the grid: 「1 人 = 23 萬人」.
- p1·2 (10) LINE 2,200 萬人，幾乎每一個人 → 95 of the 100 turn chat-green with a tiny bubble each (staggered sweep). Big 「2,200 萬」 in `--leaf`, caption 「每 20 人有 19 人在用 LINE」, source tag 「LINE 台灣 2026」.
- p1·3 (11) 國高中生每天超過 4 小時 → Cut to a 24-hour day dial. A 4-hour arc fills in `--screen`; inside it 「4+ 小時 / 天」; a teen pictogram holding a phone; source tag 「兒福聯盟 2024」.
- p1·4 (12) 一年一千四百多個小時 → The dial shrinks to the left and a year strip appears: 365 small cells (a 53 × 7 calendar grid), each cell blue for 1/6 of its height. A counter rolls 4 → 1,460 with 「小時 / 年」.
- p1·5 (13) 等於整整 60 天，24 小時不睡覺 → The blue drains out of the year strip and pours into 60 solid blue day cells (two calendar months, 一月 and 二月, fully filled). Big 「= 60 天」; a sleepless face pictogram (wide eyes, glow).
- p1·6 (14) 從不熟到很好的朋友，200 小時以上 → Cut. A long horizontal track with two pictogram people at the ends who walk toward each other (`pos`). At the far end 「200+ 小時」 and 「好朋友」, with a small high-five burst when they meet. Source tag 「Hall 2018」.
- p1·7 (15) 一年滑掉的時間 ≈ 七個好朋友 → Above the track, a 1,460-hour bar splits into 7 segments of 200. Each segment drops a friend pictogram (staggered) into a row of 7. Big 「≈ 7 個好朋友」 in `--mango`.
- p1·8 (16) 時間就這麼多 → Composition: you (centre) between a phone (left, cold glow) and a person across the table (right). A ring of 24 time tokens drifts toward the phone side; the person on the right fades to `--line`. Text 「時間就這麼多」.

## p2 什麼才叫「真正的溝通」？ (17–31) — numbers: none
- p2·0 (17) heading → Route map, station ② lit; title 「什麼才叫真正的溝通？」.
- p2·1 (18) 到底什麼叫溝通？ → Two 2D faces in profile facing each other, with a big 「溝通 = ？」 between them.
- p2·2 (19) 訊息傳出去，就算溝通了？ → A paper-plane bubble flies from left to right; 「已送出 ✓」 under it; then a stamp 「這樣就算溝通？」.
- p2·3 (20) 一個來回：說、聽、懂、回應 → The loop draws itself (`draw`) as a circle of four arrows between the two faces, labelled 說 → 聽 → 懂 → 回應 and back.
- p2·4 (21) 干擾：一直跳出來的通知 → Notification banners stack into the middle of the loop (generic texts such as 「限時動態更新」 「群組有新訊息」 「優惠快搶」, dot badges only). The message bubble 「我今天其實很難過」 glitches into fragments, and one arrow of the loop breaks into dashes. Tag 「干擾」.
- p2·5 (22) 不只靠字：「好啊」 → Cut. A huge 「好啊」 at centre (~220 px), with three blank face outlines waiting behind it.
- p2·6 (23) 開心：真的很想去 → Face 1 (2D or 3D head) lights up with a big smile and bright eyes. A bouncy, high, short voice waveform. Tag 「真的很想去」 in `--leaf`.
- p2·7 (24) 拖長嘆氣：不好意思拒絕 → Face 2: droopy eyes and a sweat drop. A long, flat waveform that trails off. Tag 「不太想去」 in `--mango`.
- p2·8 (25) 冷冷地：你最好小心一點 → Face 3: narrowed eyes, brows down, flat mouth. A short, sharp spike waveform. Tag 「你最好小心一點」 in `--chili`.
- p2·9 (26) 語氣、表情、眼神一換 → The three faces line up, with chips under them for 「語氣」 (wave icon), 「表情」 (face icon) and 「眼神」 (eye icon), so each face's differences read clearly.
- p2·10 (27) 在 LINE 上只是兩個字，只能用猜的 → The faces flip over into three identical green chat bubbles 「好啊」. A grey 「？」 replaces each face. Icons: crossed-out eye 「看不到臉」 and muted speaker 「聽不到聲音」. Then 「只能用猜的」.
- p2·11 (28) email 研究：傳的人很有把握 → Cut. The sender pictogram on the left holds envelopes tagged 「認真」 and 「反話 / 開玩笑」, with a big confident thought bubble 「對方一定看得懂！」. The receiver waits on the right. **No numbers.**
- p2·12 (29) 結果看錯的比想的還多 → The receiver opens the envelopes: confused marks 「？」 「！？」 and a mix-up (a joke read as serious). The sender's confident bubble cracks. Text 「看錯的，比想的還要多」. **No bars, counts or ratios.**
- p2·13 (30) 不是把字傳過去就好，是讓對方真的懂你 → A crossed-out paper plane 「≠ 把字傳過去」 above 「= 對方真的懂你」 (two heads sharing a lit spark).
- p2·14 (31) 「你有在聽我說。」先記著 → A yellow sticky note 「你有在聽我說。」 is pinned with a tack (slight tilt), with a small pin label 「先記著」. Keep the same note design for the p5 callback.

## p3 偷走溝通的三個小偷 (32–57) — numbers: 2015, 89 (將近九成), 82 (八成多), 41 (四成一), 10, 300+ (三百多), 2021
- p3·0 (32) heading → Route map, station ③ lit; title 「偷走溝通的三個小偷」.
- p3·1 (33) 三個小偷 → A wall with three 通緝 posters, each a dark silhouette with 「？」 and a red 「通緝」 stamp.
- p3·2 (34) 第一個小偷：低頭 → Poster 1 comes forward. The silhouette resolves into a person, head bent over a glowing phone, named 「低頭」.
- p3·3 (35) phubbing = phone + snubbing → A word equation: 「phone」 (`--screen`) + 「snubbing」 (`--chili`). The letters slide and merge into 「phubbing」, with the 「ph」 keeping the phone colour and 「ubbing」 the snub colour. Gloss 「因為滑手機，冷落眼前的人」.
- p3·4 (36) 低頭族 → 「= 低頭族」 with a row of three heads-down pictograms.
- p3·5 (37) 2015 調查：將近九成聚會時用手機 → A 100-pictogram grid of "people at a gathering"; 89 get a phone glow (staggered). Big 「89%」, caption 「上次聚會時有用手機」, source tag 「Pew 2015」.
- p3·6 (38) 八成多覺得聊天變差 → Beside it, a grid of 100 speech bubbles; 82 crack. Big 「82%」, caption 「覺得聊天變差」.
- p3·7 (39) 都知道不好，還是在做 → The two numbers face off as 「知道不好 82%」 vs 「還是在做 89%」, with a shrugging pictogram between them.
- p3·8 (40) 兒福聯盟 2015：四成一的孩子 → Cut. A child pictogram tugs a parent's sleeve while the parent looks at a glowing phone. A 100-kid grid with 41 highlighted, big 「41%」, caption 「國小五、六年級」, source tag 「兒福聯盟 2015」.
- p3·9 (41) 講心事，他一直「嗯嗯嗯」 → **3D duo café table.** The left friend talks (speech bubble 「其實我最近……」); the right friend is head-down on a glowing phone. Three 「嗯」 bubbles pop from the right friend one after another; the left friend's bubble shrinks.
- p3·10 (42) 你沒有手機重要 → A phone-style **notification banner** slides down from the top of the stage, with a generic app icon and the text 「你沒有手機重要。」. The left friend's smile turns down (3D `smile` → −1).
- p3·11 (43) 第二個小偷：放在桌上的手機 → Poster 2 comes forward: a phone lying on a table, named 「桌上的手機」.
- p3·12 (44) 我只是放在桌上 → 3D duo again. Both heads are up and talking; a phone lies face-up on the table between them, faintly glowing. Bubble 「我又沒在滑！」.
- p3·13 (45) 英國實驗：陌生人聊 10 分鐘，手機或筆記本 → Split stage. Left, a duo table with a notebook; right, the same with a phone. A 「10 分鐘」 timer chip; tags 「筆記本」 / 「手機」. **No numbers beyond 10.**
- p3·14 (46) 有手機的比較不親近，重要話題更明顯 → On the phone side the chairs drift apart and a link icon between them snaps; on the notebook side they stay close. Tag 「聊重要話題時更明顯」. **No bars or counts.**
- p3·15 (47) 加拿大：三百多人去餐廳，一半手機放桌上 → Cut. A top-down restaurant floor of small round tables (dots for people), split by a dashed line: left tables have phone icons on them, right tables have phones in bags. Label 「300+ 人」, source tag 「Dwyer 等 2018」.
- p3·16 (48) 比較分心、沒那麼開心 → Left-side faces go "meh" with distraction squiggles; right-side faces smile. Labels 「比較分心」 and 「沒那麼開心」.
- p3·17 (49) 2021 重做英國實驗，沒看到一樣的效果 → The split from p3·13 returns smaller, with a big stamp 「2021 重做」 and a tag 「結果不一樣」. The snapped link becomes a 「？」.
- p3·18 (50) 比較準確：「可能」會讓聊天變淺 → The sentence 「手機放桌上 → 讓聊天變淺」. An editor's caret mark inserts 「可能」 in `--mango` before 「讓」, like a proof-reading correction.
- p3·19 (51) 光是「可能」就值得收進包包 → The phone slides off the table into a bag and the zip closes. Text 「收進包包」.
- p3·20 (52) 第三個小偷：文字 → Poster 3 comes forward: a chat bubble 「……」, named 「文字」.
- p3·21 (53) LINE 的「已讀」 → **Chat phone**, contact 「阿哲」. I send 「週末要不要一起吃火鍋？」 (a callback to the hot pot). 「已讀 22:47」 appears under it and gets a hand-drawn circle.
- p3·22 (54) 被已讀不回過的舉手？ → The status-bar time jumps 22:47 → 23:58 → 01:12 (shown as a small time-lapse stack beside the phone). A raised-hand icon with 「舉手？」.
- p3·23 (55) 在忙？沒看到？生氣了？越想越多 → Thought bubbles burst around the phone, escalating in size and heat: 「在忙？」 「沒看到？」 「生氣了？」 「我說錯話了？」 「他是不是討厭我？」. My avatar sweats.
- p3·24 (56) 記得「好啊」嗎？只能猜 → A reply arrives: 「好啊。」. Beside it the three p2 faces (happy, tired, cold) hover as ghost options with 「？」.
- p3·25 (57) 猜錯了，誤會就來了 → The wrong face is picked, a lightning crack runs across the bubble, and a stamp reads 「誤會」 in `--chili`.

## p4 手機不是壞人 (58–66) — numbers: 2022, 80 (八成), 67 (將近七成)
- p4·0 (58) heading → Route map: an extra stop pops in between ③ and ④, 「加開一站：手機不是壞人」, and it lights up.
- p4·1 (59) 好像手機很壞 → A police line-up height chart; a big phone character stands in it looking guilty while the three posters point at it.
- p4·2 (60) 手機不是壞人 → A 「無罪」 stamp lands on the line-up; the posters fall away.
- p4·3 (61) 離家讀書，跟爸媽視訊、看家裡的狗 → **Video-call phone**: the parents wave on the screen and a dog pokes into frame, with my small self-view. A dotted arc from 「宿舍」 to 「家」 (abstract, no country) behind it.
- p4·4 (62) 2022：八成更知道朋友的生活 → A 100-pictogram grid, 80 lit. Big 「80%」, caption 「更知道朋友的生活」, source tag 「Pew 2022」.
- p4·5 (63) 將近七成覺得有人支持 → A second grid, 67 lit with a small linked-hands mark. Big 「67%」, caption 「遇到困難時，覺得有人支持」.
- p4·6 (64) 問題不是手機，是怎麼用 → A phone in a hand at centre, with 「問題 ≠ 手機」 crossed through and 「問題 = 怎麼用」.
- p4·7 (65) 遠的人變近，近的人變遠 → Two lanes. Top: a far pictogram slides closer through a phone 「遠的人變近」. Bottom: a near pictogram slides away while I look at my phone 「近的人變遠」. Distance arrows, no numbers.
- p4·8 (66) 近的人呢？ → The near person, drifting away, is spotlit. Big 「近的人呢？」 in `--mango`.

## p5 把溝通找回來的三個小方法 (67–86) — numbers: 30, 3 (三個禮拜), 1, 2, 3 (card numbers), 7
- p5·0 (67) heading → Route map, station ④ lit; title 「三個小方法」.
- p5·1 (68) 不會叫大家把手機丟掉 → A phone flies toward a trash can and is stopped by a big chili 「✗」 stamp 「不可能」. A shrugging pictogram 「我也做不到」.
- p5·2 (69) 賓州大學實驗：每天只滑 30 分鐘 → A timer dial with a 30-minute arc and a small row of generic social-app tiles. Big 「每天 30 分鐘」, source tag 「Hunt 等 2018」.
- p5·3 (70) 三個禮拜後：比較不孤單、不憂鬱 → A 3-week calendar (21 cells) ticks off, then two chips with down arrows: 「孤單 ↓」 and 「憂鬱 ↓」 (qualitative, no numbers).
- p5·4 (71) 用對地方；三個小方法 → 「不用 ✗」 → 「用對地方 ✓」, then three numbered cards (1, 2, 3) land face-down.
- p5·5 (72) 第一個：手機疊疊樂 → Card 1 flips: 「手機疊疊樂」 with a stacked-phones icon.
- p5·6 (73) 手機疊在中間，螢幕朝下 → **3D hot-pot table** returns (four friends this time). Phones fly from the hands to the centre and stack face-down. The blue glow goes out, heads come up and the lamp warms.
- p5·7 (74) 誰先拿起來誰請喝飲料 → A rule card with four bubble-tea cups: 「誰先拿起來，誰請喝飲料」. In 3D, one person's hand twitches toward the stack (an `arm` nudge).
- p5·8 (75) 誰都不想付錢，大家認真聊天（停頓） → Everyone talks and laughs. 「哈哈」 bubbles appear and the lamp is at full warmth. Leave visual space for the laugh.
- p5·9 (76) 跟家人：餐桌是「無手機區」 → A hanging round sign 「無手機區」 (a crossed-out phone) swings in over the table.
- p5·10 (77) 第二個：想念一個人，就打給他 → Card 2 flips: 「想念，就打給他」 with a phone-call icon.
- p5·11 (78) 以為打電話會尷尬，比較想打字 → A thought bubble 「打電話……好尷尬」 with a sweat drop. A keyboard choice is highlighted: 「那就打字吧」.
- p5·12 (79) 結果：更親近，也沒有比較尷尬 → **Voice-call screen** (call UI: big avatar, 「通話中」, warm glow). Chips 「更親近 ↑」 and 「尷尬：沒有比較多」, source tag 「Kumar & Epley」. **No numbers.**
- p5·13 (80) 語氣、笑聲、停頓，貼圖給不了 → A voice waveform annotated 「語氣」 「笑聲」 「停頓」 (a real gap in the wave) next to the dumpling sticker with 「✗ 給不了」.
- p5·14 (81) 第三個：給聊天七分鐘 → Card 3 flips: a clock face with 7 marked, 「給聊天 7 分鐘」.
- p5·15 (82) 大學生說：要七分鐘才知道會不會變有趣 → A 7-minute dial. A conversation line grows around it; at 7 a spark 「變有趣」 waits, still greyed out.
- p5·16 (83) 一冷場就拿起手機 → The line hits a gap (「冷場」), a hand grabs a phone and the line stops. The spark at 7 stays grey.
- p5·17 (84) 冷場時忍一下，問一個問題 → The gap is bridged by a 「？」 question bubble. The line continues to 7 and the spark lights up in `--mango`.
- p5·18 (85) 手機蓋起來、看著他、點點頭、「然後呢？」 → **3D duo table:** the phone is face-down, the listener looks at the speaker and nods, and a bubble reads 「然後呢？」. A four-item checklist ticks on in a stagger: 手機蓋起來 / 眼睛看著他 / 點點頭 / 問「然後呢？」.
- p5·19 (86) 這就是傾聽 → Big 「傾聽」. The p2 sticky note 「你有在聽我說。」 flies back in and pins beside it (the callback payoff).

## end (87–91) — numbers: none
- end·0 (87) 回到今天的問題 → The headline question returns in the same styling as open·5.
- end·1 (88) 還在，但只是「傳訊息」，忘了「交流」 → A leaf stamp 「還在」 lands on the question. Then a split: left 「傳訊息」 (one-way arrows, bubbles flying off a phone, cold); right 「交流」 (two faces, loop arrows, warm).
- end·2 (89) 有連線，不等於有連結 → Wordplay: 「連線」 with signal bars (`--screen`) 「≠」 「連結」 with two linked hands (`--chili`/`--mango`).
- end·3 (90) 先抬頭看一下，身邊的人可能正在等你 → **Final 3D:** the hot-pot family from the opening, phones stacked face-down in the centre, everyone looking at each other, lamp fully warm, steam rising. The camera rises gently on the click. Text 「先抬頭看一下」.
- end·4 (91) 謝謝大家 → 「謝謝大家」 big, with the dumpling mascot waving and a thin line of route-map stations, all lit.

## refs (92) — 1 beat
- refs·0 (92) → 「參考資料」: two columns of small text (about 18–20 px) listing every source from the doc's table, grouped by section (organisation or authors, year, and one line on what it supports). URLs in small mono text.
