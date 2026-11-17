/* Extra checks (developer tool): screen sizes + live resize, the presenter window as used, and mid-animation frames.
   node tools/verify.cjs <outDir> */
const path = require('path'), fs = require('fs'), {execFileSync} = require('child_process');
const PUP = process.env.PUPPETEER_CORE || 'C:/Users/ASUS/AppData/Local/npm-cache/_npx/702923228c2ce1e6/node_modules/puppeteer-core';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const puppeteer = require(PUP);
const DECK = 'file:///' + path.resolve(__dirname, '..', 'index.html').split(String.fromCharCode(92)).join('/');
const OUT = path.resolve(process.argv[2] || 'verify-out');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const errors = [];
const watch = (p, tag) => {
  p.on('pageerror', e => errors.push(`${tag} pageerror: ${e.message}`));
  p.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
};
function sheet(files, out, cols) {
  const list = path.join(OUT, 'list.txt');
  fs.writeFileSync(list, files.map(f => `file '${f.split(String.fromCharCode(92)).join('/')}'\nduration 1`).join('\n'));
  const rows = Math.ceil(files.length / cols);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list,
    '-vf', `scale=640:360:force_original_aspect_ratio=decrease,pad=640:360:(ow-iw)/2:(oh-ih)/2:color=0x777777,tile=${cols}x${rows}:padding=6:color=0x777777`,
    '-frames:v', '1', '-q:v', '3', out]);
}
async function open(browser, query, b, w = 1920, h = 1080, tag = 'main') {
  const page = await browser.newPage(); watch(page, tag);
  await page.setViewport({width: w, height: h, deviceScaleFactor: 1});
  await page.goto(`${DECK}${query}#${b}`, {waitUntil: 'load'});
  await page.waitForFunction('window.__deckReady === true', {timeout: 30000});
  await sleep(500);
  return page;
}
(async () => {
  fs.mkdirSync(OUT, {recursive: true});
  const browser = await puppeteer.launch({executablePath: CHROME, headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--hide-scrollbars', '--mute-audio']});
  /* 1. sizes (still mode) + live resize */
  const sizeFiles = [];
  for (const [w, h] of [[1280, 720], [1024, 768], [1366, 768]]) {
    const p = await open(browser, '?still', 5, w, h, `size${w}`);
    for (const b of [5, 6, 57, 90]) {
      await p.evaluate(n => { location.hash = '#' + n; }, b); await sleep(700);
      const f = path.join(OUT, `size_${w}x${h}_b${b}.png`); await p.screenshot({path: f}); sizeFiles.push(f);
    }
    await p.close();
  }
  for (const [start, presses] of [[4, 2], [56, 1], [89, 1]]) {
    const p = await open(browser, '', start, 1920, 1080, `resize${start}`);
    for (let i = 0; i < presses; i++) { await p.keyboard.press('ArrowRight'); await sleep(2800); }
    await p.setViewport({width: 1280, height: 720, deviceScaleFactor: 1}); await sleep(900);
    const f = path.join(OUT, `resize_to720_b${start + presses}.png`); await p.screenshot({path: f}); sizeFiles.push(f);
    await p.close();
  }
  sheet(sizeFiles, path.join(OUT, 'sizes.jpg'), 4);
  /* 2. presenter window, as used: press P, read the popup, navigate from both windows */
  const main = await open(browser, '', 20, 1920, 1080, 'presenterMain');
  const popupP = new Promise(r => main.once('popup', r));
  await main.keyboard.press('p');
  const pop = await popupP; watch(pop, 'popup');
  await pop.waitForSelector('#pvNow', {timeout: 15000}); await sleep(2500);
  const notes = await main.evaluate(() => NOTES);
  const read = async () => ({mainBeat: await main.evaluate(() => beat), pvNow: await pop.$eval('#pvNow', e => e.textContent), pvCount: await pop.$eval('#pvCount', e => e.textContent)});
  const r0 = await read();
  await main.keyboard.press('ArrowRight'); await sleep(1200);
  const r1 = await read();
  await pop.keyboard.press('ArrowRight'); await sleep(1200);
  const r2 = await read();
  await pop.keyboard.press('ArrowLeft'); await sleep(1200);
  const r3 = await read();
  const ok = (r, b) => r.mainBeat === b && r.pvNow === notes[b];
  console.log('presenter: open at 20 ->', ok(r0, 20) ? 'OK' : 'FAIL', JSON.stringify(r0).slice(0, 120));
  console.log('presenter: main → ->', ok(r1, 21) ? 'OK' : 'FAIL', r1.pvCount);
  console.log('presenter: popup → ->', ok(r2, 22) ? 'OK' : 'FAIL', r2.pvCount);
  console.log('presenter: popup ← ->', ok(r3, 21) ? 'OK' : 'FAIL', r3.pvCount);
  await pop.close(); await main.close();
  /* 3. motion: a frame 400 ms after the click, then the settled frame */
  const mid = [];
  for (const b of [6, 13, 19, 35, 51, 73, 90]) {
    const p = await open(browser, '', b - 1, 1920, 1080, `motion${b}`);
    await p.keyboard.press('ArrowRight'); await sleep(400);
    const f1 = path.join(OUT, `motion_b${b}_400ms.png`); await p.screenshot({path: f1});
    await sleep(2600);
    const f2 = path.join(OUT, `motion_b${b}_end.png`); await p.screenshot({path: f2});
    mid.push(f1, f2); await p.close();
  }
  sheet(mid, path.join(OUT, 'motion.jpg'), 4);
  await browser.close();
  console.log('wrote', path.join(OUT, 'sizes.jpg'), path.join(OUT, 'motion.jpg'));
  console.log(errors.length ? errors.slice(0, 20).join('\n') : 'no page or console errors');
})().catch(e => { console.error(e); process.exit(1); });
