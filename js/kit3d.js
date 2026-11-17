'use strict';
/* =====================================================================
   Kit3D — clay / toy figures and the three table sets (three.js).  One global: Kit3D.  Documented in docs/KIT.md.
   Everything is a pure function of the numeric params (no clocks), so back / still / idle all work.
   World units ≈ metres * 1.4; the table top is at y = 1.  Figures face +z in their own frame.
   ===================================================================== */
const Kit3D = (() => {
  const T = THREE;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const sm = t => t * t * (3 - 2 * t);
  const PERSON_KEYS = ['tilt', 'turn', 'arm', 'glow', 'smile', 'nod', 'lean'];
  const G = {sphere: new T.SphereGeometry(1, 28, 18), cyl: new T.CylinderGeometry(1, 1, 1, 72), box: new T.BoxGeometry(1, 1, 1), cone: new T.ConeGeometry(1, 1, 16)};
  const Y = new T.Vector3(0, 1, 0);

  /* ---------- materials: every colour comes from a CSS token; recolor() re-reads them (theme switch) ---------- */
  function makeMats(pal) {
    const list = [];
    const col = (role, p) => role[0] === '#' ? new T.Color(role) : p[role];
    return {
      pal,
      m(role, o = {}) {
        const {emissive, emissiveIntensity = 1, ...rest} = o;
        const mat = new T.MeshStandardMaterial(Object.assign({roughness: .85, metalness: 0}, rest));
        mat.color.copy(col(role, pal));
        if (emissive) { mat.emissive.copy(col(emissive, pal)); mat.emissiveIntensity = emissiveIntensity; }
        list.push({mat, role, emissive});
        return mat;
      },
      basic(role, o = {}) {
        const mat = new T.MeshBasicMaterial(o); mat.color.copy(col(role, pal)); list.push({mat, role}); return mat;
      },
      light(l, role) { l.color.copy(col(role, pal)); list.push({l, role}); return l; },
      recolor(p) { this.pal = p; for (const e of list) { if (e.l) { e.l.color.copy(col(e.role, p)); continue; } e.mat.color.copy(col(e.role, p)); if (e.emissive) e.mat.emissive.copy(col(e.emissive, p)); } }
    };
  }
  function mesh(geo, mat, parent, {p = [0, 0, 0], s = [1, 1, 1], r = [0, 0, 0], cast = true, receive = false} = {}) {
    const m = new T.Mesh(geo, mat);
    m.position.set(...p); m.scale.set(...s); m.rotation.set(...r);
    m.castShadow = cast; m.receiveShadow = receive;
    if (parent) parent.add(m);
    return m;
  }
  const ball = (mat, parent, r, p, s = [1, 1, 1], cast = true) => mesh(G.sphere, mat, parent, {p, s: [r * s[0], r * s[1], r * s[2]], cast});
  function placeLimb(cyl, a, b, r) {
    const d = b.clone().sub(a), len = Math.max(1e-4, d.length());
    cyl.position.copy(a).addScaledVector(d, .5);
    cyl.scale.set(r, len, r);
    cyl.quaternion.setFromUnitVectors(Y, d.normalize());
  }
  function ik(S, H, L1, L2, pole) {
    const d = H.clone().sub(S), dist = clamp(d.length(), .05, (L1 + L2) * .995), dir = d.normalize();
    const a = (L1 * L1 - L2 * L2 + dist * dist) / (2 * dist), h = Math.sqrt(Math.max(0, L1 * L1 - a * a));
    const perp = pole.clone().addScaledVector(dir, -pole.dot(dir)).normalize();
    return S.clone().addScaledVector(dir, a).addScaledVector(perp, h);
  }

  /* ---------- a person ---------- */
  /* person(mats, {skin, hairColor, style, shirt, pants, hat, kid, glasses, scale, hand}) → {group, set(p, reach), headWorld(), phoneLocal, holding, ...}
     style: 'short' | 'bob' | 'bun' | 'pigtails' | 'cap' | 'spiky' | 'bald'.  hand: 'r' (default) | 'l' holds the phone */
  function person(mats, o = {}) {
    const s = (o.scale || 1) * (o.kid ? .74 : 1), hs = o.kid ? 1.2 : 1;
    const hd = o.hand === 'l' ? 1 : -1;
    const skin = mats.m(o.skin || 'skin-1'), shirt = mats.m(o.shirt || 'cloth-a'), pants = mats.m(o.pants || 'cloth-f'),
      hairM = mats.m(o.hairColor || 'hair'), dark = mats.m('hair'), cheekM = mats.m('rose', {transparent: true, opacity: .55}), shoe = mats.m('pearl');
    const g = new T.Group();
    const body = new T.Group(); body.position.set(0, .6 * s, 0); g.add(body);
    const torso = mesh(new T.CapsuleGeometry(.34 * s, .42 * s, 6, 20), shirt, body, {p: [0, .52 * s, 0], s: [1.1, 1, .98]});
    mesh(G.sphere, pants, body, {p: [0, .08 * s, 0], s: [.37 * s, .24 * s, .35 * s]});
    /* legs (seated) */
    for (const sx of [-1, 1]) {
      const th = mesh(G.cyl, pants, g), sh = mesh(G.cyl, pants, g);
      placeLimb(th, new T.Vector3(sx * .2 * s, .64 * s, .02 * s), new T.Vector3(sx * .2 * s, .66 * s, .62 * s), .15 * s);
      placeLimb(sh, new T.Vector3(sx * .2 * s, .64 * s, .62 * s), new T.Vector3(sx * .2 * s, .1 * s, .68 * s), .13 * s);
      ball(pants, g, .15 * s, [sx * .2 * s, .65 * s, .62 * s]);
      ball(shoe, g, .15 * s, [sx * .2 * s, .07 * s, .76 * s], [.95, .55, 1.5]);
    }
    /* head */
    const neck = new T.Group(); neck.position.set(0, 1.02 * s, 0); body.add(neck);
    const head = new T.Group(); head.position.set(0, .4 * s * hs, .02 * s); neck.add(head);
    const R = .36 * s * hs;
    mesh(G.cyl, skin, neck, {p: [0, .08 * s, 0], s: [.13 * s, .16 * s, .13 * s]});
    ball(skin, head, R, [0, 0, 0]);
    ball(skin, head, R * .14, [-R * .98, -R * .02, 0], [.5, 1, 1]); ball(skin, head, R * .14, [R * .98, -R * .02, 0], [.5, 1, 1]);   /* ears */
    ball(skin, head, R * .12, [0, -R * .1, R * .96], [1, .85, .8]);                                                                 /* nose */
    const face = new T.Group(); head.add(face);
    const eyes = [-1, 1].map(sx => ball(dark, face, R * .13, [sx * R * .37, R * .08, R * .9], [1, 1.15, .45], false));
    const brows = [-1, 1].map(sx => mesh(G.box, dark, face, {p: [sx * R * .37, R * .34, R * .88], s: [R * .3, R * .055, R * .06], cast: false}));
    const cheeks = [-1, 1].map(sx => mesh(G.sphere, cheekM, face, {p: [sx * R * .6, -R * .22, R * .78], s: [R * .17, R * .12, R * .06], cast: false}));
    cheeks.forEach((c, i) => c.lookAt(c.position.clone().multiplyScalar(2)));
    let mouth = null, mouthKey = null;
    const setMouth = sml => {
      const key = Math.round(sml * 40);
      if (key === mouthKey) return; mouthKey = key;
      if (mouth) { face.remove(mouth); mouth.geometry.dispose(); }
      const pts = [], w = R * .24, base = -R * .3, amt = sml * R * .12;
      for (let i = 0; i <= 12; i++) {
        const x = -w + 2 * w * i / 12, y = base - amt * (1 - Math.pow(x / w, 2)) + (sml < 0 ? 0 : 0) - (sml > .5 ? 0 : 0);
        const yy = y - (sml > 0 ? 0 : 0), z = Math.sqrt(Math.max(.01, R * R - x * x - yy * yy)) + R * .012;
        pts.push(new T.Vector3(x, yy, z));
      }
      const tube = new T.TubeGeometry(new T.CatmullRomCurve3(pts), 16, R * (.034 + .02 * Math.max(0, sml)), 6, false);
      mouth = new T.Mesh(tube, dark); face.add(mouth);
    };
    setMouth(0);
    if (o.glasses) {
      for (const sx of [-1, 1]) { const t = mesh(new T.TorusGeometry(R * .2, R * .03, 8, 24), dark, face, {p: [sx * R * .38, R * .08, R * .93], cast: false}); }
      mesh(G.box, dark, face, {p: [0, R * .1, R * .97], s: [R * .2, R * .03, R * .03], cast: false});
    }
    /* hair */
    const cap = (th, r = 1.045, rotX = -.42, mat = hairM) => {
      const m = new T.Mesh(new T.SphereGeometry(R * r, 32, 18, 0, Math.PI * 2, 0, th), mat); m.rotation.x = rotX; m.castShadow = true; head.add(m); return m;
    };
    const st = o.style || 'short';
    if (st === 'short') { cap(1.9); ball(hairM, head, R * .5, [R * .28, R * .86, R * .22], [1, .45, .8]); }
    else if (st === 'spiky') { cap(1.85); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; mesh(G.cone, hairM, head, {p: [Math.sin(a) * R * .55, R * .95, Math.cos(a) * R * .45 - R * .1], s: [R * .2, R * .36, R * .2], r: [Math.cos(a) * .5, 0, -Math.sin(a) * .5]}); } }
    else if (st === 'bob') {
      cap(2.15, 1.05, -.3);
      mesh(G.sphere, hairM, head, {p: [0, -R * .12, -R * .1], s: [R * 1.1, R * 1.0, R * .98]});
      ball(hairM, head, R * .55, [R * .1, R * .78, R * .38], [1.2, .5, .6]);
    }
    else if (st === 'bun') { cap(1.95); ball(hairM, head, R * .34, [0, R * 1.05, -R * .15]); ball(hairM, head, R * .5, [R * .2, R * .8, R * .3], [1.1, .5, .7]); }
    else if (st === 'pigtails') { cap(1.95); for (const sx of [-1, 1]) { ball(hairM, head, R * .3, [sx * R * .98, R * .38, -R * .05]); ball(hairM, head, R * .2, [sx * R * 1.1, R * .02, -R * .05]); } ball(hairM, head, R * .5, [0, R * .8, R * .35], [1.2, .45, .6]); }
    else if (st === 'cap') {
      const hat = mats.m(o.hat || 'cloth-c');
      cap(1.7, 1.06, -.25, hat);
      mesh(G.cyl, hat, head, {p: [0, R * .5, R * .95], s: [R * .62, R * .06, R * .5], r: [.15, 0, 0]});
      ball(hairM, head, R * .5, [0, -R * .05, -R * .85], [1.05, .7, .45]);
    }
    /* arms */
    const armMat = shirt, mk = () => ({u: mesh(G.cyl, armMat, g), f: mesh(G.cyl, armMat, g), sh: ball(armMat, g, .14 * s, [0, 0, 0]), el: ball(armMat, g, .115 * s, [0, 0, 0]), hand: ball(skin, g, .12 * s, [0, 0, 0])});
    const arms = {dom: mk(), oth: mk()};
    const P = {
      lap: {dom: [hd * .3, .84, .34], oth: [-hd * .3, .84, .34]},
      hold: {dom: [hd * .13, 1.3, .62], oth: [-hd * .2, 1.17, .5]},
      photo: {dom: [hd * .26, 1.98, .7], oth: [-hd * .3, .94, .34]}
    };
    const V = new T.Vector3();
    function pose(arm, which) {
      const a = P.lap[which], b = P.hold[which], c = P.photo[which];
      const t = arm <= 1 ? [a, b, clamp(arm)] : [b, c, clamp(arm - 1)];
      return V.clone().set(lerp(t[0][0], t[1][0], t[2]), lerp(t[0][1], t[1][1], t[2]), lerp(t[0][2], t[1][2], t[2])).multiplyScalar(s);
    }
    const out = {group: g, body, head, phoneLocal: new T.Vector3(), holding: false, hs, s, R, nodMarks: null, hd};
    out.headWorld = (v = new T.Vector3()) => { head.updateWorldMatrix(true, false); return head.getWorldPosition(v); };
    out.set = (p, reach) => {
      const lean = (p.lean || 0) + (p.tilt || 0) * .24;
      body.rotation.x = lean;
      head.rotation.x = (p.tilt || 0) * .42 + (p.nod || 0) * .24 - lean * .15;
      head.rotation.y = p.turn || 0;
      const sml = clamp(p.smile || 0, -1, 1) + (p.nod || 0) * .15;
      setMouth(clamp(sml, -1, 1));
      eyes.forEach(e => { e.scale.y = R * .13 * (1.15 - .6 * clamp((p.smile || 0) * 1.1 + (p.nod || 0) * .8, 0, 1) - .1 * clamp(-(p.smile || 0), 0, 1)); });
      cheeks.forEach(c => { c.visible = (p.smile || 0) > .15 || (p.nod || 0) > .3; });
      brows.forEach((b, i) => { const sx = i ? 1 : -1, f = clamp(-(p.smile || 0), 0, 1), up = clamp(p.smile || 0, 0, 1); b.rotation.z = sx * -(f * .5) + sx * up * .08; b.position.y = R * (.34 + up * .05 - f * .02); });
      /* arms */
      const sh = sx => new T.Vector3(sx * .42 * s, 0, 0).setY(.82 * s).applyEuler(new T.Euler(lean, 0, 0)).add(new T.Vector3(0, .6 * s, 0));
      for (const which of ['dom', 'oth']) {
        const sx = which === 'dom' ? hd : -hd;
        const S = sh(sx), A = arms[which];
        let H = pose(p.arm || 0, which);
        if (which === 'dom') {
          out.phoneLocal.copy(H).add(new T.Vector3(0, .13 * s, .04 * s));
          out.holding = (p.arm || 0) > .03;
          if (reach && reach.amt > 0) { const lp = g.worldToLocal(reach.point.clone()); H.lerp(lp, reach.amt); }
        } else if ((p.arm || 0) > 1) H.lerp(pose(0, 'oth'), 0);
        const E = ik(S, H, .52 * s, .5 * s, new T.Vector3(sx * .7, -1, -.5));
        placeLimb(A.u, S, E, .105 * s); placeLimb(A.f, E, H, .095 * s);
        A.sh.position.copy(S); A.el.position.copy(E); A.hand.position.copy(H);
      }
    };
    out.set({}, null);
    return out;
  }

  /* ---------- a phone ---------- */
  function phoneObj(mats, scale = 1) {
    const g = new T.Group();
    const bodyM = mats.m('pearl'), scr = mats.m('pearl', {emissive: 'screen', emissiveIntensity: 0, roughness: .4});
    mesh(new T.BoxGeometry(.3 * scale, .56 * scale, .035 * scale), bodyM, g);
    const face = mesh(new T.PlaneGeometry(.27 * scale, .52 * scale), scr, g, {p: [0, 0, .0185 * scale], cast: false});
    const light = mats.light(new T.PointLight(0xffffff, 0, 4, 2), 'screen'); g.add(light);
    return {group: g, screen: scr, face, light, setGlow(v) { scr.emissiveIntensity = v * 1.25; scr.color.set(0x0b1c20); }, mats};
  }

  /* ---------- lighting rig shared by all sets ---------- */
  function rig(scene, mats, {shadow = true} = {}) {
    const hemi = new T.HemisphereLight(0xffffff, 0xffffff, 1); scene.add(hemi);
    const fill = new T.DirectionalLight(0xffffff, .5); fill.position.set(4, 8, 9); scene.add(fill);
    const lampLight = new T.SpotLight(0xffffff, 0, 0, .8, .65, 1.6);
    lampLight.position.set(0, 5.2, 0); lampLight.target.position.set(0, 0, 0);
    lampLight.castShadow = shadow; lampLight.shadow.mapSize.set(1024, 1024); lampLight.shadow.bias = -.0006; lampLight.shadow.radius = 5;
    lampLight.shadow.camera.near = 1; lampLight.shadow.camera.far = 14;
    scene.add(lampLight, lampLight.target);
    const warm = new T.PointLight(0xffffff, 0, 14, 1.6); warm.position.set(0, 3.4, 0); scene.add(warm);
    return {hemi, fill, lampLight, warm,
      apply(pal) {
        hemi.color.copy(pal.dark ? pal.line : pal.paper); hemi.groundColor.copy(pal.dark ? pal.bg : pal.line);
        hemi.intensity = pal.dark ? .72 : 1.25; fill.color.copy(pal.dark ? pal['broth-white'] : new T.Color(0xffffff)); fill.intensity = pal.dark ? .2 : .7;
        lampLight.color.copy(pal.lamp); warm.color.copy(pal.lamp);
      },
      setLamp(l) { lampLight.intensity = Math.pow(l, 1.4) * 90; warm.intensity = Math.pow(l, 1.4) * 8; }};
  }

  /* camera: orbit around (tx, ty, tz); yaw / pitch in radians, dist in world units.  A narrower view gets a wider lens, so the same set always fits. */
  function placeCamera(cam, p, v, base = 26) {
    const aspect = v.cfg.w / v.cfg.h, k = Math.max(1, (16 / 9) / aspect);
    cam.aspect = aspect; cam.fov = 2 * Math.atan(Math.tan(base * Math.PI / 360) * k) * 180 / Math.PI;
    const yaw = (p.yaw || 0) + v.orbit.yaw, pitch = clamp((p.pitch || .6) + v.orbit.pitch, .05, 1.45), d = p.dist || 15;
    cam.position.set((p.tx || 0) + Math.sin(yaw) * Math.cos(pitch) * d, (p.ty || 1) + Math.sin(pitch) * d, (p.tz || 0) + Math.cos(yaw) * Math.cos(pitch) * d);
    cam.lookAt(p.tx || 0, p.ty || 1, p.tz || 0);
    cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
  }

  /* ---------- pieces of furniture ---------- */
  function plinth(mats, scene, r) {
    const g = new T.Group();
    mesh(G.cyl, mats.m('paper', {roughness: .95}), g, {p: [0, -.16, 0], s: [r, .32, r], receive: true});
    mesh(G.cyl, mats.m('line'), g, {p: [0, -.34, 0], s: [r + .1, .08, r + .1], receive: true, cast: false});
    scene.add(g); return g;
  }
  function roundTable(mats, scene, r, {pedestal = true} = {}) {
    const g = new T.Group(), wood = mats.m('wood'), wd = mats.m('wood-dark');
    mesh(G.cyl, wood, g, {p: [0, .98, 0], s: [r, .1, r], receive: true});
    mesh(G.cyl, wd, g, {p: [0, .91, 0], s: [r * .96, .05, r * .96], cast: false});
    if (pedestal) { mesh(G.cyl, wd, g, {p: [0, .45, 0], s: [.3, .9, .3]}); mesh(G.cyl, wd, g, {p: [0, .04, 0], s: [.85, .08, .85]}); }
    scene.add(g); return g;
  }
  function stool(mats, parent, x, z, ang = 0, back = false) {
    const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = ang;
    const wd = mats.m('wood-dark'), seat = mats.m('cloth-f');
    mesh(G.cyl, wd, g, {p: [0, .27, 0], s: [.1, .54, .1]});
    mesh(G.cyl, wd, g, {p: [0, .03, 0], s: [.42, .06, .42]});
    mesh(G.cyl, seat, g, {p: [0, .56, 0], s: [.46, .1, .46], receive: true});
    if (back) { mesh(G.box, seat, g, {p: [0, 1.0, -.4], s: [.8, .6, .08]}); }
    parent.add(g); return g;
  }
  function pendant(mats, scene, y = 4.3) {
    const g = new T.Group(), shadeM = mats.m('lamp', {emissive: 'lamp', emissiveIntensity: .2, side: T.DoubleSide, roughness: .6});
    mesh(G.cyl, mats.m('ink'), g, {p: [0, y + 2.6, 0], s: [.025, 5.2, .025], cast: false});
    const shade = mesh(new T.CylinderGeometry(.2, .68, .46, 36, 1, true), shadeM, g, {p: [0, y, 0], cast: false});
    const bulbM = mats.basic('lamp', {transparent: true, opacity: 1});
    const bulb = ball(bulbM, g, .16, [0, y - .2, 0], [1, 1, 1], false);
    const beamM = mats.basic('lamp', {transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide});
    const beam = mesh(new T.CylinderGeometry(.66, 1.9, y - .75, 36, 1, true), beamM, g, {p: [0, (y - .75) / 2 + .55, 0], cast: false});
    scene.add(g);
    return {g, shadeM, bulbM, beamM, y, set(l) { shadeM.emissiveIntensity = .12 + .6 * l; beamM.opacity = .07 * l; bulbM.opacity = .5 + .5 * l; }};
  }
  function bowl(mats, parent, x, z) {
    mesh(new T.CylinderGeometry(.24, .13, .13, 24), mats.m('broth-white'), parent, {p: [x, 1.08, z], receive: false});
    mesh(new T.CylinderGeometry(.2, .2, .02, 24), mats.m('wood-dark'), parent, {p: [x, 1.12, z], cast: false});
  }

  /* resolve a params object into per-person params: base keys apply to all, key + index overrides */
  function pickPerson(p, i) { const r = {}; for (const k of PERSON_KEYS) { const v = p[k + i]; r[k] = v != null ? v : (p[k] || 0); } return r; }
  /* =========================== set 1: the 鴛鴦鍋 table for four =========================== */
  const HOT_DEFAULTS = {yaw: .34, pitch: .56, dist: 9.4, tx: 0, ty: 1.55, tz: 0, lamp: .2, steam: 0, food: 0, stack: 0};
  const SEATS = [-150, 150, -96, 96];
  const HOT_PEOPLE = [
    {skin: 'skin-1', style: 'short', shirt: 'cloth-c', glasses: true, scale: 1.04, pants: 'cloth-f'},                   /* dad */
    {skin: 'skin-2', style: 'bob', shirt: 'cloth-d', scale: .97, pants: 'cloth-f', hairColor: 'wood-dark'},             /* mom */
    {skin: 'skin-1', style: 'cap', shirt: 'cloth-b', hat: 'cloth-a', scale: .99, pants: 'ink', hand: 'l'},              /* teen */
    {skin: 'skin-3', style: 'pigtails', shirt: 'cloth-a', kid: true, scale: 1, pants: 'cloth-f'}                         /* kid */
  ];
  function hotpot(v, opt = {}) {
    const mats = makeMats(v.pal), scene = new T.Scene(), camera = new T.PerspectiveCamera(26, 1, .1, 100);
    const R = rig(scene, mats), lamp = pendant(mats, scene);
    plinth(mats, scene, 3.9); roundTable(mats, scene, 1.85);
    const TOP = 1.03, potY = TOP;
    /* pot + 鴛鴦 broth */
    const pot = new T.Group(); pot.position.set(0, potY, -.1); pot.scale.setScalar(.84); scene.add(pot);
    const potM = mats.m('pot', {side: T.DoubleSide, roughness: .55, metalness: .1});
    mesh(new T.CylinderGeometry(.86, .8, .34, 44, 1, true), potM, pot, {p: [0, .17, 0]});
    mesh(new T.TorusGeometry(.86, .045, 10, 44), potM, pot, {p: [0, .34, 0], r: [Math.PI / 2, 0, 0]});
    for (const sx of [-1, 1]) mesh(G.box, mats.m('wood-dark'), pot, {p: [sx * .98, .3, 0], s: [.22, .07, .16]});
    const whiteM = mats.m('broth-white', {roughness: .5}), redM = mats.m('broth', {roughness: .5});
    const Rb = .8;
    const disc = new T.Mesh(new T.CircleGeometry(Rb, 48), whiteM); disc.rotation.x = -Math.PI / 2; disc.position.y = .27; disc.receiveShadow = true; pot.add(disc);
    const sh = new T.Shape(); sh.moveTo(0, Rb); sh.absarc(0, 0, Rb, Math.PI / 2, -Math.PI / 2, true); sh.absarc(0, -Rb / 2, Rb / 2, -Math.PI / 2, Math.PI / 2, false); sh.absarc(0, Rb / 2, Rb / 2, -Math.PI / 2, Math.PI / 2, true);
    const red = new T.Mesh(new T.ShapeGeometry(sh, 40), redM); red.rotation.x = -Math.PI / 2; red.position.y = .275; pot.add(red);
    const dot = (x, y, m) => { const d = new T.Mesh(new T.CircleGeometry(.11, 20), m); d.rotation.x = -Math.PI / 2; d.position.set(x, .28, -y); pot.add(d); };
    dot(0, -Rb / 2, redM); dot(0, Rb / 2, whiteM);
    /* a few floating bits in the broth */
    for (const [x, z, c] of [[.4, .2, 'leaf'], [.45, -.3, 'mango'], [-.4, .3, 'broth-white'], [-.35, -.35, 'leaf']]) ball(mats.m(c), pot, .07, [x, .3, z], [1.4, .5, 1]);
    /* steam */
    const steamM = mats.basic('broth-white', {transparent: true, opacity: .22, depthWrite: false}), puffM = mats.basic('broth-white', {transparent: true, opacity: .1, depthWrite: false});
    const steamG = new T.Group(); steamG.position.set(0, potY + .35, -.1); scene.add(steamG);
    /* thin, soft wisps (three of them) with a few faint puffs drifting up with them */
    [[-.35, .1, 0], [.15, -.25, 2.1], [.4, .2, 4.2]].forEach(([x, z, ph], i) => {
      const pts = []; for (let k = 0; k <= 16; k++) { const t = k / 16; pts.push(new T.Vector3(x + Math.sin(t * 6 + ph) * .1 * (.4 + t), t * 1.7, z + Math.cos(t * 5 + ph) * .06 * t)); }
      mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 40, .026 - i * .002, 8, false), steamM, steamG, {cast: false});
      for (const t of [.35, .62, .88]) { const q = pts[Math.round(t * 16)]; ball(puffM, steamG, .09 + t * .12, [q.x, q.y, q.z], [1, .8, 1], false); }
    });
    /* bowls + chopsticks */
    const dishes = new T.Group(); scene.add(dishes);
    SEATS.forEach(a => { const r = a * Math.PI / 180; bowl(mats, dishes, Math.sin(r) * 1.5, Math.cos(r) * 1.5); });
    /* food platter */
    const food = new T.Group(); scene.add(food);
    food.scale.setScalar(.75);
    mesh(G.cyl, mats.m('broth-white'), food, {p: [0, .035, 0], s: [.56, .07, .56]});
    mesh(G.cyl, mats.m('line'), food, {p: [0, .075, 0], s: [.45, .02, .45], cast: false});
    const meat = mats.m('rose'), veg = mats.m('leaf'), cap = mats.m('wood'), tofu = mats.m('dough');
    for (let i = 0; i < 6; i++) { const a = i * 1.05; mesh(G.cyl, meat, food, {p: [Math.cos(a) * .2 - .1, .15, Math.sin(a) * .18], s: [.07, .26, .07], r: [0, a, Math.PI / 2 + .2 * (i % 2)]}); }
    for (let i = 0; i < 4; i++) ball(veg, food, .13, [.25 + (i % 2) * .08, .14 + (i > 1 ? .08 : 0), -.18 + i * .1], [1.2, .55, 1.0]);
    for (let i = 0; i < 3; i++) { ball(cap, food, .09, [-.2 + i * .1, .17, .28], [1, .7, 1]); mesh(G.cyl, tofu, food, {p: [-.3 + i * .08, .12, -.28 + i * .02], s: [.07, .06, .07]}); }
    /* people + their phones */
    const pers = [], phones = [];
    const cfgs = opt.people || HOT_PEOPLE;
    cfgs.forEach((c, i) => {
      const a = SEATS[i] * Math.PI / 180, x = Math.sin(a) * 2.4, z = Math.cos(a) * 2.4;
      stool(mats, scene, x, z, Math.atan2(-x, -z));
      const pr = person(mats, c); pr.group.position.set(x, .0, z); pr.group.rotation.y = Math.atan2(-x, -z); pr.group.position.y = .0; scene.add(pr.group);
      pr.group.position.y = -.0;
      pers.push(pr);
      const ph = phoneObj(mats); scene.add(ph.group); phones.push(ph);
    });
    scene.updateMatrixWorld(true);
    const stackBase = new T.Vector3(.95, TOP + .03, .72);
    const foodTarget = new T.Vector3(-.95, TOP, .72);
    const tmp = new T.Object3D(), qa = new T.Quaternion(), qb = new T.Quaternion(), hw = new T.Vector3(), hp = new T.Vector3(), ew = new T.Vector3();
    const anchors = {};
    const model = {
      camera, scene, mats, pal: v.pal,
      update(p) {
        placeCamera(camera, p, v);
        R.apply(v.pal); R.setLamp(p.lamp); lamp.set(p.lamp);
        steamG.visible = p.steam > .01; steamG.scale.set(1, Math.max(.01, p.steam), 1); steamM.opacity = .22 * clamp(p.steam * 1.4); puffM.opacity = .1 * clamp(p.steam * 1.4);
        /* platter slides in from the camera side */
        const f = sm(clamp(p.food)); food.visible = p.food > .005;
        food.position.set(foodTarget.x - (1 - f) * 1.8, foodTarget.y + (1 - f) * .15, foodTarget.z + (1 - f) * 3.2);
        const stk = clamp(p.stack), e = sm(stk);
        pers.forEach((pr, i) => {
          const pi = pickPerson(p, i), ph = phones[i];
          pr.set(pi, null);
          pr.group.updateWorldMatrix(true, true);
          hw.copy(pr.phoneLocal); pr.group.localToWorld(hw);                     /* the phone where the hand holds it */
          const sw = stackBase.clone().add(new T.Vector3((i % 2) * .03 - .015, i * .05, (i > 1 ? .04 : -.02)));
          hp.copy(hw).lerp(sw, e); hp.y += Math.sin(Math.PI * e) * .9;
          pr.headWorld(ew);
          tmp.position.copy(hw); tmp.lookAt(ew); qa.copy(tmp.quaternion);
          qb.setFromEuler(new T.Euler(Math.PI / 2, (i - 1.5) * .28, 0, 'YXZ'));
          ph.group.quaternion.copy(qa).slerp(qb, e);
          ph.group.position.copy(hp);
          ph.group.visible = pi.arm > .04 || stk > .02;
          const reach = stk > .001 && stk < .999 ? {point: hp, amt: Math.sin(Math.PI * stk)} : null;
          if (reach) pr.set(pi, reach);
          const gl = clamp(pi.glow) * (1 - e);
          ph.setGlow(ph.group.visible ? clamp(pi.glow) : 0);
          ph.screen.emissiveIntensity = (pi.glow > .001 ? .15 + 1.3 * clamp(pi.glow) : .0) * (1 - e) * 1;
          ph.light.intensity = gl * 2.2;
          ph.light.position.set(0, .05, .2);
          ph.group.updateWorldMatrix(true, false);
          anchors['phone' + i] = hp.clone();
        });
        pers.forEach((pr, i) => { anchors['head' + i] = pr.headWorld(new T.Vector3()); anchors['top' + i] = anchors['head' + i].clone().add(new T.Vector3(0, pr.R * 1.2, 0)); });
        anchors.pot = new T.Vector3(0, potY + .5, -.1); anchors.lamp = new T.Vector3(0, 4.1, 0); anchors.stack = stackBase.clone(); anchors.food = food.position.clone().add(new T.Vector3(0, .3, 0)); anchors.table = new T.Vector3(0, TOP, 0);
        scene.updateMatrixWorld(true);
      },
      render(r) { r.render(scene, camera); },
      recolor(pal) { mats.recolor(pal); },
      anchor(name, i = 0) { return anchors[name + (['head', 'top', 'phone'].includes(name) ? i : '')] || new T.Vector3(); }
    };
    return model;
  }

  /* =========================== set 2: the café table for two =========================== */
  const CAFE_DEFAULTS = {yaw: .14, pitch: .46, dist: 8.2, tx: 0, ty: 1.5, tz: 0, lamp: .3, distance: 0, phone: 0, faceDown: 0, phoneGlow: .5, notebook: 0, bag: 0};
  const CAFE_PEOPLE = [
    {skin: 'skin-2', style: 'bob', shirt: 'cloth-d', scale: 1, hairColor: 'wood-dark', pants: 'cloth-f'},
    {skin: 'skin-1', style: 'short', shirt: 'cloth-c', scale: 1.02, pants: 'ink', hand: 'l'}
  ];
  function cafe(v, opt = {}) {
    const mats = makeMats(v.pal), scene = new T.Scene(), camera = new T.PerspectiveCamera(26, 1, .1, 100);
    const R = rig(scene, mats), lamp = pendant(mats, scene);
    plinth(mats, scene, 3.4); roundTable(mats, scene, 1.0);
    const TOP = 1.03;
    /* mugs + a little vase */
    for (const sx of [-1, 1]) { const c = new T.Group(); c.position.set(sx * .55, TOP, sx * -.25); scene.add(c); mesh(new T.CylinderGeometry(.13, .1, .17, 20), mats.m('broth-white'), c, {p: [0, .085, 0]}); mesh(G.cyl, mats.m('tea'), c, {p: [0, .165, 0], s: [.115, .01, .115], cast: false}); }
    /* the notebook */
    const nb = new T.Group(); scene.add(nb);
    mesh(G.box, mats.m('cloth-a'), nb, {p: [0, .02, 0], s: [.62, .04, .82]});
    mesh(G.box, mats.m('cloth-e'), nb, {p: [.02, .05, 0], s: [.56, .03, .76]});
    for (let i = 0; i < 5; i++) mesh(G.box, mats.m('line'), nb, {p: [.02, .068, -.28 + i * .13], s: [.44, .004, .015], cast: false});
    /* the table phone */
    const tp = phoneObj(mats, 1.15); scene.add(tp.group);
    /* the bag */
    const bag = new T.Group(); scene.add(bag);
    mesh(G.box, mats.m('cloth-d'), bag, {p: [0, .35, 0], s: [.8, .7, .5]});
    mesh(new T.TorusGeometry(.22, .035, 8, 20, Math.PI), mats.m('ink'), bag, {p: [0, .7, 0], cast: false});
    mesh(G.box, mats.m('mango'), bag, {p: [0, .5, .26], s: [.14, .1, .02], cast: false});
    const pers = [], phones = [], chairs = [];
    (opt.people || CAFE_PEOPLE).forEach((c, i) => {
      const sx = i ? 1 : -1;
      const ch = stool(mats, scene, sx * 1.5, 0, sx > 0 ? -Math.PI / 2 : Math.PI / 2, true); chairs.push(ch);
      const pr = person(mats, c); scene.add(pr.group); pers.push(pr);
      const ph = phoneObj(mats); scene.add(ph.group); phones.push(ph);
    });
    const tmp = new T.Object3D(), ew = new T.Vector3(), hw = new T.Vector3(), anchors = {};
    const model = {
      camera, scene, mats, pal: v.pal,
      update(p) {
        placeCamera(camera, p, v);
        R.apply(v.pal); R.setLamp(p.lamp); lamp.set(p.lamp);
        const d = clamp(p.distance, 0, 1.6), px = 1.5 + d;
        pers.forEach((pr, i) => {
          const sx = i ? 1 : -1, pi = pickPerson(p, i);
          pr.group.position.set(sx * px, 0, 0); pr.group.rotation.y = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
          chairs[i].position.x = sx * px; pr.group.updateMatrixWorld(true);
          pr.set(pi, null); pr.group.updateWorldMatrix(true, true);
          const ph = phones[i];
          hw.copy(pr.phoneLocal); pr.group.localToWorld(hw); pr.headWorld(ew);
          tmp.position.copy(hw); tmp.lookAt(ew); ph.group.quaternion.copy(tmp.quaternion); ph.group.position.copy(hw);
          ph.group.visible = pi.arm > .04;
          ph.screen.emissiveIntensity = clamp(pi.glow) * 1.45; ph.light.intensity = clamp(pi.glow) * 2.2; ph.light.position.set(0, .05, .2);
          anchors['phone' + i] = hw.clone();
          anchors['head' + i] = pr.headWorld(new T.Vector3()); anchors['top' + i] = anchors['head' + i].clone().add(new T.Vector3(0, pr.R * 1.2, 0));
        });
        /* notebook / phone on the table; the bag takes the phone away */
        nb.visible = p.notebook > .01; nb.position.set(0, TOP, .0); nb.scale.setScalar(.4 + .6 * sm(clamp(p.notebook))); nb.rotation.y = .25;
        const bg = sm(clamp(p.bag));
        bag.visible = p.bag > .01; bag.position.set(.95 + d * .3, 0, 1.3); bag.rotation.y = -.6; bag.scale.setScalar(clamp(p.bag * 3) * .78);
        const onT = clamp(p.phone);
        tp.group.visible = onT > .01 && bg < .98;
        const down = sm(clamp(p.faceDown));
        const tpos = new T.Vector3(0, TOP + .02, .05), bpos = bag.position.clone().add(new T.Vector3(0, .75, 0));
        tp.group.position.copy(tpos).lerp(bpos, bg); tp.group.position.y += Math.sin(Math.PI * bg) * .6 + (1 - onT) * .5;
        tp.group.scale.setScalar(1 - bg * .35);
        tp.group.quaternion.setFromEuler(new T.Euler(lerp(-Math.PI / 2, Math.PI / 2, down), 0, 0.25, 'YXZ'));
        tp.screen.emissiveIntensity = (1 - down) * clamp(p.phoneGlow) * 1.6; tp.light.intensity = (1 - down) * clamp(p.phoneGlow) * 3.2; tp.light.position.set(0, .15, .2);
        anchors.phoneTable = tp.group.position.clone(); anchors.table = new T.Vector3(0, TOP, 0); anchors.lamp = new T.Vector3(0, 4.1, 0);
        scene.updateMatrixWorld(true);
      },
      render(r) { r.render(scene, camera); },
      recolor(pal) { mats.recolor(pal); },
      anchor(name, i = 0) { return anchors[name + (['head', 'top', 'phone'].includes(name) ? i : '')] || new T.Vector3(); }
    };
    return model;
  }

  /* =========================== set 3: one person alone with a phone (the cover) =========================== */
  const SOLO_DEFAULTS = {yaw: 2.6, pitch: .42, dist: 7.4, tx: 0, ty: 1.45, tz: .5, lamp: .12};
  function solo(v, opt = {}) {
    const mats = makeMats(v.pal), scene = new T.Scene(), camera = new T.PerspectiveCamera(26, 1, .1, 100);
    const R = rig(scene, mats), lamp = pendant(mats, scene);
    plinth(mats, scene, 2.5); roundTable(mats, scene, 1.0);
    const TOP = 1.03;
    const c = new T.Group(); c.position.set(.2, TOP, -.4); scene.add(c); mesh(new T.CylinderGeometry(.13, .1, .17, 20), mats.m('broth-white'), c, {p: [0, .085, 0]}); mesh(G.cyl, mats.m('tea'), c, {p: [0, .165, 0], s: [.115, .01, .115], cast: false});
    stool(mats, scene, 0, 1.55, Math.PI, true);
    const pr = person(mats, opt.person || {skin: 'skin-1', style: 'short', shirt: 'cloth-a', scale: 1.02, pants: 'cloth-f', glasses: false});
    pr.group.position.set(0, 0, 1.55); pr.group.rotation.y = Math.PI; scene.add(pr.group);
    const ph = phoneObj(mats); scene.add(ph.group);
    const tmp = new T.Object3D(), ew = new T.Vector3(), hw = new T.Vector3(), anchors = {};
    return {
      camera, scene, mats, pal: v.pal,
      update(p) {
        placeCamera(camera, p, v);
        R.apply(v.pal); R.setLamp(p.lamp); lamp.set(p.lamp);
        const pi = pickPerson(p, 0);
        pr.set(pi, null); pr.group.updateWorldMatrix(true, true);
        hw.copy(pr.phoneLocal); pr.group.localToWorld(hw); pr.headWorld(ew);
        tmp.position.copy(hw); tmp.lookAt(ew); ph.group.quaternion.copy(tmp.quaternion); ph.group.position.copy(hw); ph.group.visible = pi.arm > .04;
        ph.screen.emissiveIntensity = clamp(pi.glow) * 1.45; ph.light.intensity = clamp(pi.glow) * 2.2; ph.light.position.set(0, .05, .2);
        anchors.head0 = pr.headWorld(new T.Vector3()); anchors.phone0 = hw.clone(); anchors.lamp = new T.Vector3(0, 4.1, 0);
        scene.updateMatrixWorld(true);
      },
      render(r) { r.render(scene, camera); },
      recolor(pal) { mats.recolor(pal); },
      anchor(name, i = 0) { return anchors[name + (['head', 'phone'].includes(name) ? i : '')] || new T.Vector3(); }
    };
  }

  /* params(kind, over): the full numeric param object for a set; per-person keys (tilt, turn, arm, glow, smile, nod, lean)
     given without a number apply to everybody, with a number (tilt2) to that person only */
  function params(kind, over = {}) {
    const d = {hotpot: HOT_DEFAULTS, cafe: CAFE_DEFAULTS, solo: SOLO_DEFAULTS}[kind], n = {hotpot: 4, cafe: 2, solo: 1}[kind];
    const out = Object.assign({}, d);
    for (const k in over) if (!PERSON_KEYS.includes(k) && !/^(tilt|turn|arm|glow|smile|nod|lean)\d$/.test(k)) out[k] = over[k];
    for (const k of PERSON_KEYS) for (let i = 0; i < n; i++) out[k + i] = over[k + i] != null ? over[k + i] : (over[k] != null ? over[k] : 0);
    return out;
  }
  /* stagePoint(view, name, i) → {x, y} in stage px of a named anchor (head, top, phone, pot, lamp, stack, food, table, phoneTable) */
  function stagePoint(v, name, i = 0) { const a = v.model.anchor(name, i); return v.toStage(a.x, a.y, a.z); }

  return {person, phone: phoneObj, hotpot, cafe, solo, params, stagePoint, makeMats, PERSON_KEYS, HOT_DEFAULTS, CAFE_DEFAULTS, SOLO_DEFAULTS};
})();
