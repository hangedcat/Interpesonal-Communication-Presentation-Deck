'use strict';
/* =====================================================================
   Chat — the LINE-like phone mock-up (HTML, shown through panel()).  One global: Chat.
   Not LINE-branded: no logo, no app name, generic contact names.  Documented in docs/KIT.md.
   Chat.phone({...})  a chat screen whose messages appear on given beats
   Chat.call({...})   the voice-call screen
   Chat.shell({...})  an empty phone you fill yourself (e.g. a video call)
   Chat.banner({...}) a notification that slides down from the top of the stage
   ===================================================================== */
const Chat = (() => {
  const div = (cls, html = '') => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; return d; };
  const svgi = (inner, size = 30, vb = '-24 -24 48 48', sw = 4) =>
    `<svg width="${size}" height="${size}" viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  const I = {
    back: svgi('<path d="M10 -16 L-8 0 L10 16"/>', 30),
    call: svgi('<path d="M-16 -16 Q-22 -8 -12 8 Q0 24 14 20 Q20 18 20 12 L16 6 Q12 4 8 8 Q2 6 -4 0 Q-8 -6 -8 -8 Q-4 -12 -6 -14 L-10 -20 Q-14 -20 -16 -16 Z"/>', 30),
    menu: svgi('<path d="M-16 -10 L16 -10 M-16 0 L16 0 M-16 10 L16 10"/>', 30),
    plus: svgi('<circle r="18"/><path d="M0 -9 L0 9 M-9 0 L9 0"/>', 34),
    mic: svgi('<rect x="-8" y="-20" width="16" height="26" rx="8"/><path d="M-16 -2 Q-16 14 0 14 Q16 14 16 -2 M0 14 L0 22"/>', 32),
    smile: svgi('<circle r="18"/><path d="M-8 4 Q0 12 8 4"/><circle cx="-6" cy="-5" r="1" fill="currentColor"/><circle cx="6" cy="-5" r="1" fill="currentColor"/>', 34),
    status: '<svg width="86" height="22" viewBox="0 0 86 22"><g fill="currentColor"><rect x="0" y="14" width="5" height="6" rx="1"/><rect x="8" y="10" width="5" height="10" rx="1"/><rect x="16" y="6" width="5" height="14" rx="1"/><rect x="24" y="2" width="5" height="18" rx="1"/></g><path d="M40 8 Q49 0 58 8 M44 12 Q49 8 54 12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="49" cy="17" r="2" fill="currentColor"/><rect x="66" y="3" width="18" height="15" rx="3.5" fill="none" stroke="currentColor" stroke-width="2"/><rect x="68.5" y="5.5" width="13" height="10" rx="2" fill="currentColor"/></svg>',
    mute: svgi('<rect x="-8" y="-20" width="16" height="26" rx="8"/><path d="M-16 -2 Q-16 14 0 14 Q16 14 16 -2 M0 14 L0 22 M-20 -20 L20 22"/>', 40),
    speaker: svgi('<path d="M-20 -8 L-10 -8 L2 -18 L2 18 L-10 8 L-20 8 Z"/><path d="M10 -10 Q16 0 10 10 M16 -16 Q26 0 16 16"/>', 40),
    pad: svgi('<circle cx="-12" cy="-12" r="3" fill="currentColor"/><circle cx="0" cy="-12" r="3" fill="currentColor"/><circle cx="12" cy="-12" r="3" fill="currentColor"/><circle cx="-12" cy="0" r="3" fill="currentColor"/><circle cx="0" cy="0" r="3" fill="currentColor"/><circle cx="12" cy="0" r="3" fill="currentColor"/><circle cx="-12" cy="12" r="3" fill="currentColor"/><circle cx="0" cy="12" r="3" fill="currentColor"/><circle cx="12" cy="12" r="3" fill="currentColor"/>', 40),
    hang: svgi('<path d="M-22 4 Q0 -12 22 4 L18 12 L8 8 L8 2 Q0 -2 -8 2 L-8 8 L-18 12 Z" fill="currentColor"/>', 44),
    person: '<svg viewBox="-24 -24 48 48" width="100%" height="100%"><circle cx="0" cy="-6" r="9" fill="#fff"/><path d="M-16 20 Q-16 6 0 6 Q16 6 16 20 Z" fill="#fff"/></svg>'
  };
  /* generic app icon for banners: a rounded square with a speech bubble (not any real app) */
  const APP_ICON = '<svg width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="var(--screen)"/><path d="M14 22 Q14 14 22 14 L42 14 Q50 14 50 22 L50 36 Q50 44 42 44 L32 44 L22 52 L22 44 Q14 44 14 36 Z" fill="var(--bg)"/><circle cx="24" cy="29" r="3" fill="var(--screen)"/><circle cx="32" cy="29" r="3" fill="var(--screen)"/><circle cx="40" cy="29" r="3" fill="var(--screen)"/></svg>';
  const sticker = {
    dumpling: () => `<svg viewBox="-60 -60 120 120" width="150" height="150">${Kit2D.dumplingMarkup({})}</svg>`,
    thumb: () => `<svg viewBox="-60 -60 120 120" width="140" height="140"><circle r="52" fill="var(--sticky)" stroke="var(--wood-dark)" stroke-width="3.5"/><g transform="translate(-4 2) scale(1.45)" fill="none" stroke="var(--wood-dark)" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"><path d="M-18 -2 L-8 -2 L-8 18 L-18 18 Z" fill="var(--paper)"/><path d="M-8 0 L2 -20 Q8 -20 8 -12 L6 -4 L18 -4 Q22 -4 21 2 L18 14 Q17 18 12 18 L-8 18" fill="var(--paper)"/></g><circle cx="-20" cy="-30" r="3" fill="#fff"/></svg>`
  };
  const tile = {
    /* 早安圖: the classic family-group tile — a flower, sparkles, loud text */
    morning: () => `<svg viewBox="0 0 240 240" width="240" height="240"><rect width="240" height="240" rx="14" fill="#7EC8E3"/><circle cx="196" cy="48" r="26" fill="#FFE27A"/><path d="M0 190 Q60 160 120 186 Q180 208 240 176 L240 240 L0 240 Z" fill="#6DBF7A"/>
      <g transform="translate(78 150)"><path d="M0 14 L0 80" stroke="#3E8E50" stroke-width="7" stroke-linecap="round"/><path d="M0 50 Q-24 34 -30 46 Q-12 60 0 50" fill="#3E8E50"/>${[0, 1, 2, 3, 4].map(i => { const a = i * 72 * Math.PI / 180; return `<circle cx="${Math.sin(a) * 22}" cy="${-Math.cos(a) * 22}" r="17" fill="#FF8FA8"/>`; }).join('')}<circle r="12" fill="#FFD04A"/></g>
      <text x="150" y="118" text-anchor="middle" font-size="62" font-weight="700" fill="#E5322D" stroke="#fff" stroke-width="7" paint-order="stroke" font-family="Huninn,sans-serif">早安</text>
      <path d="M30 40 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z M200 130 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 z" fill="#fff"/></svg>`,
    photo: () => `<svg viewBox="0 0 240 180" width="240" height="180"><rect width="240" height="180" rx="14" fill="var(--wood)"/><ellipse cx="120" cy="104" rx="84" ry="46" fill="var(--broth-white)"/><ellipse cx="120" cy="104" rx="60" ry="30" fill="var(--broth)"/><path d="M120 74 Q150 100 120 134 Q96 104 120 74 Z" fill="var(--broth-white)"/></svg>`
  };
  const article = (title) => `<div class="fwd">轉傳</div><div class="atitle">${title || '震驚！這件事你一定要知道'}</div><div class="aimg"><svg viewBox="0 0 240 90" width="100%" height="100%" preserveAspectRatio="none"><rect width="240" height="90" fill="#D6DFEA"/><path d="M0 70 L50 34 L90 58 L140 22 L200 60 L240 40 L240 90 L0 90 Z" fill="#9FB3CC"/><circle cx="196" cy="24" r="12" fill="#fff"/></svg></div><div class="alink">news.example.com</div>`;
  const AV = ['--cloth-a', '--cloth-c', '--cloth-b', '--cloth-d', '--cloth-f'];
  const avHash = s => { let h = 0; for (const c of s || '?') h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
  const avatar = (name, size = 56) => `<div class="av" style="width:${size}px;height:${size}px;background:var(${AV[avHash(name) % AV.length]})">${I.person}</div>`;
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const instant = () => document.body.classList.contains('still');

  /* shell({x, y, w, from, to, dark, op, opDelay, time, update(beat), cls}) → {el, screen, phone, body}
     An empty phone (status bar + screen div) on stage.  w = width in stage px (default 420; the height is 2.05 x).  op: {beat: opacity} dims the phone; time: {beat: '22:47'} */
  function shell(cfg) {
    const {x = 0, y = 0, w = 420, from = 0, to = 999, dark = false, op = null, opDelay = 0, time = {0: '22:41'}} = cfg;
    const s = w / 420;
    const d = div('panel chatpanel' + (cfg.cls ? ' ' + cfg.cls : ''));
    Object.assign(d.style, {left: x + 'px', top: y + 'px', width: w + 'px', height: 860 * s + 'px'});
    const ph = div('phone'); ph.style.transform = `scale(${s})`; d.appendChild(ph);
    const scr = div('scr' + (dark ? ' dark' : '')); ph.appendChild(scr);
    const sb = div('sb', `<span class="clk"></span><span class="sbi">${I.status}</span>`); scr.appendChild(sb);
    const clk = sb.firstChild;
    const body = div('body'); scr.appendChild(body);
    ph.style.transition = 'opacity .5s ease';
    panel(d, b => b >= from && b < to, b => {
      const o = keyed(op, b, 1);
      if (String(o) !== ph.dataset.o) {
        ph.style.transitionDelay = (o < +(ph.dataset.o || 1) ? opDelay : 0) + 'ms';
        ph.style.opacity = o; ph.dataset.o = o;
      }
      clk.textContent = keyed(time, b, '22:41');
      if (cfg.update) cfg.update(b);
    });
    return {el: d, phone: ph, screen: scr, body};
  }

  /* phone({x, y, w, from, to, contact, sub, msgs, typing, time, stagger, op, opDelay})
     msgs: [{beat, who: 'me'|'them', name, text | sticker: 'dumpling'|'thumb' | tile: 'morning'|'photo'|'article', title, time, typed, until, receipt}]
       beat      the global beat on which the message appears (it stays until `until`); several messages on one beat pop in one after another (`stagger` ms)
       typed     true: the text types itself in (a short sequence), then stays
       receipt   {beat, text: '已讀', time: '22:47', ring: beat}: a 「已讀」 receipt beside my bubble from `beat`; `ring` draws a hand-drawn circle round it
     typing: {from, to, who: 'them'|'me'}  a static "..." bubble */
  function phone(cfg) {
    const {contact = '小美', sub = '', msgs = [], typing = null, stagger = 300} = cfg;
    const sh = shell(Object.assign({}, cfg, {update: b => refresh(b)}));
    const scr = sh.screen;
    const hd = div('hd', `<span class="hb">${I.back}</span><span class="hn">${esc(contact)}${sub ? `<i>${esc(sub)}</i>` : ''}</span><span class="hi">${I.call}${I.menu}</span>`);
    scr.insertBefore(hd, sh.body);
    sh.body.className = 'body chatbg';
    const list = div('msgs'); sh.body.appendChild(list);
    const inp = div('inp', `<span>${I.plus}</span><span class="fld"></span><span>${I.smile}</span><span>${I.mic}</span>`); scr.appendChild(inp);

    const perBeat = {};
    const items = msgs.map((m, i) => {
      const k = perBeat[m.beat] = (perBeat[m.beat] || 0);
      perBeat[m.beat]++;
      const row = div('m ' + (m.who === 'me' ? 'me' : 'them'));
      let inner = '';
      const t = m.time ? `<span class="tm">${m.receipt ? '<b class="rd"></b>' : ''}<span class="tt">${m.time}</span></span>` : (m.receipt ? '<span class="tm"><b class="rd"></b><span class="tt"></span></span>' : '');
      let bub;
      if (m.sticker) bub = `<div class="stk">${sticker[m.sticker]()}</div>`;
      else if (m.tile === 'article') bub = `<div class="bub art">${article(m.title)}</div>`;
      else if (m.tile) bub = `<div class="tile">${tile[m.tile]()}</div>`;
      else if (m.typed) bub = `<div class="bub"><span class="t1"></span><span class="t2">${esc(m.text)}</span></div>`;
      else bub = `<div class="bub">${esc(m.text || '')}</div>`;
      if (m.who === 'me') inner = `<div class="row">${t}${bub}</div>`;
      else inner = `${avatar(m.name || contact)}<div class="col">${m.name !== '' ? `<div class="nm">${esc(m.name || contact)}</div>` : ''}<div class="row">${bub}${t}</div></div>`;
      row.innerHTML = inner;
      if (m.receipt) {
        row.querySelector('.rd').textContent = m.receipt.text || '已讀';
        row.querySelector('.tm').insertAdjacentHTML('beforeend', '<svg class="ring" viewBox="0 0 120 70" width="120" height="70"><path d="M10 34 C10 6 106 2 112 32 C116 62 14 68 18 22 C20 10 50 6 70 8" fill="none" stroke="var(--chili)" stroke-width="4.5" stroke-linecap="round"/></svg>');
      }
      list.appendChild(row);
      return {m, row, bubEl: row.querySelector('.bub'), shown: false, timer: 0, delayT: 0, delay: k * stagger, ringEl: row.querySelector('.ring'), tm: row.querySelector('.tm'), tt: row.querySelector('.tt')};
    });
    let tp = null;
    if (typing) { tp = div('m ' + (typing.who === 'me' ? 'me' : 'them') + ' typing', typing.who === 'me' ? '<div class="row"><div class="bub dots"><i></i><i></i><i></i></div></div>' : `${avatar(contact)}<div class="col"><div class="row"><div class="bub dots"><i></i><i></i><i></i></div></div></div>`); list.appendChild(tp); }

    function typeIn(it, anim) {
      const bub = it.bubEl, t1 = bub.querySelector('.t1'), t2 = bub.querySelector('.t2'), full = it.m.text;
      clearInterval(it.timer);
      if (!anim) { t1.textContent = full; t2.textContent = ''; return; }
      let n = 0; t1.textContent = ''; t2.textContent = full;
      const per = Math.max(30, 1000 / full.length);
      it.timer = setInterval(() => { n++; t1.textContent = full.slice(0, n); t2.textContent = full.slice(n); if (n >= full.length) clearInterval(it.timer); }, per);
    }
    function showRow(it, anim) { it.row.classList.add('on'); if (it.m.typed) typeIn(it, anim); }
    function refresh(b) {
      const inst = instant();
      for (const it of items) {
        const m = it.m, on = b >= m.beat && b < (m.until != null ? m.until : 9999);
        /* a row takes space only when it appears (after its stagger delay), so older rows do not jump early */
        if (on) {
          if (!it.shown) { clearTimeout(it.delayT); if (inst) showRow(it, false); else it.delayT = setTimeout(() => showRow(it, true), it.delay); }
          else if (inst && !it.row.classList.contains('on')) { clearTimeout(it.delayT); showRow(it, false); }
        } else { clearTimeout(it.delayT); it.row.classList.remove('on'); if (m.typed) typeIn(it, false); }
        it.shown = on;
        if (m.receipt) {
          const rOn = on && b >= m.receipt.beat;
          it.tm.classList.toggle('rcpt', rOn);
          if (it.tt) it.tt.textContent = rOn && m.receipt.time ? m.receipt.time : (m.time || '');
          if (it.ringEl) it.ringEl.classList.toggle('on', rOn && m.receipt.ring != null && b >= m.receipt.ring);
        }
      }
      if (tp) tp.classList.toggle('on', b >= typing.from && b < typing.to);
    }
    sh.refresh = refresh;
    return sh;
  }

  /* call({x, y, w, from, to, name, status, warm, op, time}) — the voice-call screen.  warm: true lights it with the lamp colour */
  function call(cfg) {
    const {name = '阿哲', status = '通話中', warm = true} = cfg;
    const sh = shell(Object.assign({dark: true, cls: 'callpanel'}, cfg));
    sh.screen.classList.add('call'); if (warm) sh.screen.classList.add('warm');
    sh.body.className = 'body';
    sh.body.innerHTML = `<div class="ctop">${I.speaker.replace(/ width="\d+" height="\d+"/, ' width="26" height="26"')}<span>${esc(status)}</span></div>
      <div class="cav">${avatar(name, 240)}</div><div class="cname">${esc(name)}</div>
      <div class="cbtns"><span>${I.mute}</span><span>${I.speaker}</span><span>${I.pad}</span></div><div class="cend"><span>${I.hang}</span></div>`;
    return sh;
  }

  /* banner({from, to, text, title, time, x, y, w}) — a notification that slides down from the top of the stage at `from` and goes away at `to` */
  function banner(cfg) {
    const {from = 0, to = 999, text = '', title = '新訊息', time = '現在', x = 380, y = 26, w = 840, k = 1} = cfg;
    const d = div('panel banner', `<span class="bi">${APP_ICON}</span><span class="bt"><b>${esc(title)}</b><span>${esc(text)}</span></span><span class="bm">${esc(time)}</span>`);
    Object.assign(d.style, {left: x + 'px', top: y + 'px', width: w + 'px'});
    d.style.setProperty('--bk', k);   /* k scales the whole banner (type, icon, padding) */
    panel(d, b => b >= from && b < to);
    return {el: d};
  }

  return {phone, call, shell, banner, sticker: Object.keys(sticker), tiles: Object.keys(tile).concat('article')};
})();
