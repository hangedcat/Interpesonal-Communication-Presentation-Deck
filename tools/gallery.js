'use strict';
section('gal', ['hotpot down','hotpot photo','hotpot stack','cafe talk','cafe notebook/phone','solo','2d A','2d B','chat','call+banner','hot down far','cafe distance','cafe bag','close up up','close up down','header','header extra','cafe facedown','cafe bag2'], (b) => {
  const hv = view3d({x: 0, y: 0, w: 1600, h: 900, from: b, to: b + 3, model: v => Kit3D.hotpot(v),
    at: k => { k -= b;
      if (k === 0) return Kit3D.params('hotpot', {arm: 1, tilt: .95, glow: 1, lamp: .2});
      if (k === 1) return Kit3D.params('hotpot', {arm: 2, tilt: 0, glow: .9, lamp: .3, food: 1, steam: 1});
      return Kit3D.params('hotpot', {arm: 0, tilt: 0, glow: 0, lamp: 1, steam: 1, food: 1, stack: 1, smile: 1, turn0: .5, turn1: -.5, dist: 14});
    }});
  view3d({x: 0, y: 0, w: 1600, h: 900, from: b + 3, to: b + 5, model: v => Kit3D.cafe(v),
    at: k => { k -= b;
      if (k === 3) return Kit3D.params('cafe', {arm1: 1, tilt1: .9, glow1: 1, smile0: -.3, tilt0: .1});
      return Kit3D.params('cafe', {phone: 1, faceDown: 1, notebook: 1, nod1: 1, smile0: .8, smile1: .6, lamp: .9, arm: 0});
    }});
  view3d({x: 0, y: 0, w: 1600, h: 900, from: b + 5, to: b + 6, model: v => Kit3D.solo(v),
    at: k => Kit3D.params('solo', {arm: 1, tilt: .9, glow: 1})});
  view3d({x: 0, y: 0, w: 1600, h: 900, from: b + 10, to: b + 11, model: v => Kit3D.hotpot(v),
    at: k => Kit3D.params('hotpot', {arm: 1, tilt: 0.9, glow: 1, yaw: 0, pitch: .9, dist: 12})});
  view3d({x: 0, y: 0, w: 1600, h: 900, from: b + 11, to: b + 13, model: v => Kit3D.cafe(v),
    at: k => k - b === 11 ? Kit3D.params('cafe', {distance: 1, phone: 1, glow1: 0, arm: 0}) : Kit3D.params('cafe', {phone: 1, bag: 1, arm: 0, smile: .5})});

  view3d({x: 0, y: 0, w: 1600, h: 900, from: b + 13, to: b + 15, model: v => Kit3D.hotpot(v),
    at: k => k - b === 13 ? Kit3D.params('hotpot', {arm: 0, tilt: 0, smile: .9, lamp: .9, steam: 1, tx: -1.2, ty: 1.95, tz: -2.08, dist: 4.6, yaw: .5, pitch: .25, turn0: -.3})
      : Kit3D.params('hotpot', {arm: 1, tilt: 1, glow: 1, lamp: .2, tx: -1.2, ty: 1.95, tz: -2.08, dist: 4.6, yaw: .5, pitch: .25})});
  Kit2D.sectionHeader(item({from: b + 15, to: b + 16}), {active: 1, from: 0, title: '什麼才叫真正的溝通？'});
  Kit2D.sectionHeader(item({from: b + 16, to: b + 17}), {active: 'extra', extra: true, from: 2, title: '手機不是壞人'});
  view3d({x: 0, y: 0, w: 1600, h: 900, from: b + 17, to: b + 19, model: v => Kit3D.cafe(v),
    at: k => k - b === 17 ? Kit3D.params('cafe', {phone: 1, faceDown: 1, arm: 0, lamp: .9, smile: .6}) : Kit3D.params('cafe', {phone: 1, bag: 1, arm: 0, lamp: .9})});
  const A = item({from: b + 6, to: b + 7});
  ['happy','tired','cold','neutral','sad','sleepless','blank','meh'].forEach((m,i)=>Kit2D.face(A,{x:100+i*100,y:70,r:42,mood:m}));
  Kit2D.faceProfile(A,{x:900,y:70,r:42,dir:1}); Kit2D.faceProfile(A,{x:1000,y:70,r:42,dir:-1,mood:'happy'});
  ['stand','phone','wave','hand','shrug','arms','sleepless'].forEach((p,i)=>Kit2D.person(A,{x:100+i*80,y:230,h:130,pose:p,color:i==1?C.chili:C.ink}));
  Kit2D.ICONS.forEach((n,i)=>Kit2D.icon(A,n,{x:60+(i%14)*70,y:300+Math.floor(i/14)*70,s:1,color:C.ink}));
  Kit2D.phone(A,{x:1300,y:150,w:60,glow:true}); Kit2D.bubble(A,{x:1450,y:60,text:'其實我最近……',size:30}); Kit2D.bubble(A,{x:1450,y:160,text:'嗯',kind:'thought',tail:'right',size:36});
  Kit2D.dumpling(A,{x:100,y:560,s:1.4,wave:true}); Kit2D.teaCup(A,{x:300,y:560,s:1.1}); Kit2D.bag(A,{x:450,y:570}); Kit2D.badge(A,{x:560,y:520});
  Kit2D.stamp(A,'誤會',{x:700,y:560,color:C.chili}); Kit2D.sticky(A,'你有在聽\n我說。',{x:960,y:600,size:48,w:300,h:240}); Kit2D.source(A,'兒福聯盟 2024',{x:1150,y:520});
  Kit2D.poster(A,{x:1320,y:640,w:240,h:340}); Kit2D.underline(A,{x1:100,x2:400,y:800}); Kit2D.scribble(A,{x:600,y:800}); Kit2D.caret(A,{x:760,y:760}); Kit2D.burst(A,{x:900,y:800});
  Kit2D.silhouette(A,{x:1100,y:820,s:.5});
  const B = item({from: b + 7, to: b + 8});
  Kit2D.grid(B,{x:30,y:20,w:360,h:360,icon:'person',color:C.line});
  Kit2D.grid(B,{x:30,y:20,w:360,h:360,icon:'person-bubble',color:C.leaf,to:95});
  Kit2D.grid(B,{x:420,y:20,w:360,h:360,icon:'bubble',color:C.line}); Kit2D.grid(B,{x:420,y:20,w:360,h:360,icon:'bubble-crack',color:C.chili,to:82});
  Kit2D.grid(B,{x:810,y:20,w:360,h:360,icon:'person-phone',color:C.screen,to:89});
  Kit2D.dial(B,{x:1350,y:200,r:120,of:24,from:0,to:4,labels:[{v:0,str:'0'},{v:6,str:'6'},{v:12,str:'12'},{v:18,str:'18'}],ticks:1});
  Kit2D.calendar(B,{x:30,y:420,cols:53,rows:7,cell:22,gap:6,flow:'col',count:365,frac:1/6});
  Kit2D.wave(B,{x:30,y:600,w:300,h:120,kind:'bounce',color:C.leaf}); Kit2D.wave(B,{x:380,y:600,w:300,h:120,kind:'long',color:C.mango}); Kit2D.wave(B,{x:730,y:600,w:300,h:120,kind:'sharp',color:C.chili}); Kit2D.wave(B,{x:1080,y:600,w:300,h:120,kind:'bounce',gapAt:.5,color:C.ink});
  Kit2D.mrt(B,{x:200,y:780,w:900,active:1,rider:true}); Kit2D.mrt(B,{x:1180,y:780,w:380,active:'extra',extra:true,size:22});
  const C1 = item({from: b + 8, to: b + 9});
  Chat.phone({x:500,y:20,w:420,from:b+8,to:b+9,contact:'我們這一家',sub:'(4)',msgs:[
    {beat:b+8,who:'them',name:'媽',tile:'morning'},{beat:b+8,who:'them',name:'阿嬤',text:'吃飽沒',time:'18:02'},{beat:b+8,who:'me',sticker:'dumpling'},{beat:b+8,who:'them',name:'爸',text:'哈哈哈'},{beat:b+8,who:'them',name:'姑姑',tile:'article'},
    {beat:b+8,who:'me',text:'滑著手機的我們，還在真正溝通嗎？',time:'22:47',receipt:{beat:b+8,text:'已讀',time:'22:47',ring:b+8}}]});
  Chat.phone({x:60,y:20,w:360,from:b+8,to:b+9,contact:'阿哲',msgs:[{beat:b+8,who:'them',text:'好啊。'},{beat:b+8,who:'me',sticker:'thumb'}],typing:{from:b+8,to:b+9,who:'them'}});
  Chat.call({x:1000,y:20,w:360,from:b+8,to:b+9,name:'阿哲'});
  Chat.call({x:200,y:20,w:360,from:b+9,to:b+10,name:'阿哲'});
  Chat.banner({from:b+9,to:b+10,text:'你沒有手機重要。'});
});
