'use strict';
/* 封面：左邊標題，右邊一個低頭滑手機的黏土小人（冷光），頭上的吊燈很暗 */
section('title', NOTES_BY_SECTION.title, (b) => {
  const t = item({from: b, to: b + 1, cls: 'fade'});
  text(t, `${COURSE} · 報告`, {x: 112, y: 262, size: 32, fill: C.muted, anchor: 'start'});
  const S = 88;
  text(t, '滑著手機的我們，', {x: 106, y: 388, size: S, weight: 700, anchor: 'start'});
  text(t, '還在', {x: 106, y: 508, size: S, weight: 700, anchor: 'start'});
  text(t, '真正溝通', {x: 106 + 2 * S, y: 508, size: S, weight: 700, fill: C.mango, anchor: 'start'});
  text(t, '嗎？', {x: 106 + 6 * S, y: 508, size: S, weight: 700, anchor: 'start'});
  const u = item({from: b, to: b + 1, cls: 'fade', delay: 500});
  Kit2D.underline(u, {x1: 106 + 2 * S + 4, x2: 106 + 6 * S - 4, y: 508 + 62, color: C.chili, w: 11, delay: 500});
  /* today's date from the computer's clock + the presenter's name (empty by default) */
  const n = new Date();
  const when = `${n.getFullYear()} 年 ${n.getMonth() + 1} 月 ${n.getDate()} 日`;
  text(t, PRESENTER ? `${when}　·　${PRESENTER}` : when, {x: 112, y: 810, size: 28, fill: C.muted, anchor: 'start'});
  const v3 = view3d({x: 790, y: 50, w: 810, h: 800, from: b, to: b + 1,
    model: v => Kit3D.solo(v),
    at: () => Kit3D.params('solo', {arm: 1, tilt: .65, glow: 1, lamp: .12, dist: 4.9, tz: .8, ty: 1.35})
  });
  /* fade the edges of the 3D box into the room (no hard rectangle) */
  v3.d.style.webkitMaskImage = v3.d.style.maskImage = 'radial-gradient(ellipse 62% 60% at 50% 52%, #000 62%, transparent 100%)';
});
