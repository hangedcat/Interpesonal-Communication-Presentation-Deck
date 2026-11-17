/* Screenshot checks for this deck (developer tool, not needed to present).
   node tools/shot.cjs sheet <out.jpg> <beat> [beat ...]   contact sheet of end states (still mode; COLS=4 columns, 640x360 tiles)
   node tools/shot.cjs one <out.png> <beat>                one full-size (1920x1080) end-state frame
   node tools/shot.cjs idle <beat> [beat ...]              click-only check: two shots 5 s apart must be identical
   node tools/shot.cjs walk <from> <to> [out.jpg]          press → through the beats, then ← back; settle check + PSNR forward vs back
   Env: THEME=light (day theme), DECK=gallery.html (another page in this folder), WAIT=ms (walk settle time), NOBACK=1, PUPPETEER_CORE, CHROME.
   Uses puppeteer-core from the npx cache + installed Chrome. */
const path = require('path'), fs = require('fs'), {execFileSync, spawnSync} = require('child_process');
const PUP = process.env.PUPPETEER_CORE || 'C:/Users/ASUS/AppData/Local/npm-cache/_npx/702923228c2ce1e6/node_modules/puppeteer-core';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const puppeteer = require(PUP);
const DECK = 'file:///' + path.resolve(__dirname, '..', process.env.DECK || 'index.html').split(String.fromCharCode(92)).join('/');
const TMP = path.resolve(__dirname, '.shots', String(process.pid) + '-' + Date.now());
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function open(query, b) {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--hide-scrollbars', '--mute-audio']
  });
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1080, deviceScaleFactor: 1});
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('requestfailed', r => errors.push('requestfailed: ' + r.url()));
  await page.goto(`${DECK}${query}#${b}`, {waitUntil: 'load'});
  await page.waitForFunction('window.__deckReady === true', {timeout: 60000});
  await page.addStyleTag({content: '#hint{display:none!important}'});   /* the hint bar disappears on the first click: keep it out of every frame */
  if (process.env.THEME) { await page.evaluate(t => setTheme(t), process.env.THEME); }
  await sleep(500);
  return {browser, page, errors};
}
async function shoot(page, file) { await page.screenshot({path: file, type: 'png'}); return file; }
function psnrOf(a, b) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-i', a, '-i', b, '-lavfi', 'psnr', '-f', 'null', '-'], {encoding: 'utf8'});
  const m = /average:(\S+)/.exec(r.stderr || '');
  return m ? m[1] : '?';
}
function tile(files, out) {
  const dir = path.join(TMP, 'tile');
  fs.rmSync(dir, {recursive: true, force: true}); fs.mkdirSync(dir, {recursive: true});
  files.forEach((f, i) => fs.copyFileSync(f, path.join(dir, `s${String(i).padStart(3, '0')}.png`)));
  const cols = +process.env.COLS || 4, rows = Math.ceil(files.length / cols);
  /* fill the last row with grey frames: ffmpeg's tile filter drops a part-filled page */
  const pad = path.join(TMP, 'pad.png');
  if (files.length % cols) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'color=c=0x777777:s=1920x1080', '-frames:v', '1', pad]);
  for (let i = files.length; i < cols * rows; i++) fs.copyFileSync(pad, path.join(dir, `s${String(i).padStart(3, '0')}.png`));
  fs.mkdirSync(path.dirname(out), {recursive: true});
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '1', '-i', path.join(dir, 's%03d.png'),
    '-vf', `scale=640:360,tile=${cols}x${rows}:padding=6:color=0x777777`, '-frames:v', '1', '-q:v', '3', out]);
}

(async () => {
  const [mode, ...rest] = process.argv.slice(2);
  fs.mkdirSync(TMP, {recursive: true});
  let code = 0;
  try {
    if (mode === 'sheet' || mode === 'one') {
      const [out, ...beats] = rest;
      const {browser, page, errors} = await open('?still', beats[0]);
      const files = [];
      for (const b of beats) {
        await page.evaluate(n => { location.hash = '#' + n; }, b);
        await sleep(450);
        files.push(await shoot(page, path.join(TMP, `b${String(b).padStart(3, '0')}.png`)));
      }
      await browser.close();
      if (mode === 'one') { fs.mkdirSync(path.dirname(path.resolve(out)), {recursive: true}); fs.copyFileSync(files[0], path.resolve(out)); }
      else tile(files, path.resolve(out));
      console.log('wrote', out, files.length, 'frame(s)');
      if (errors.length) console.log(errors.slice(0, 15).join('\n'));
    } else if (mode === 'idle') {
      const {browser, page, errors} = await open('', rest[0]);
      for (const b of rest) {
        await page.evaluate(n => { location.hash = '#' + n; }, b);
        await sleep(3000);
        const a = await shoot(page, path.join(TMP, `i${b}a.png`));
        await sleep(5000);
        const c = await shoot(page, path.join(TMP, `i${b}b.png`));
        const same = fs.readFileSync(a).equals(fs.readFileSync(c));
        console.log(`beat ${b}: ${same ? 'still (identical)' : 'CHANGED by itself, psnr ' + psnrOf(a, c)}`);
        if (!same) code = 2;
      }
      await browser.close();
      if (errors.length) console.log(errors.slice(0, 15).join('\n'));
    } else if (mode === 'walk') {
      const [from, to, out] = rest;
      const {browser, page, errors} = await open('', from);
      const fwd = {}, files = [], wait = +process.env.WAIT || 2600;
      await sleep(2500);   /* let the first beat finish its own entrance sequence */
      fwd[from] = await shoot(page, path.join(TMP, `f${from}.png`));
      files.push(fwd[from]);
      for (let b = +from + 1; b <= +to; b++) {
        await page.keyboard.press('ArrowRight');
        await sleep(wait);
        fwd[b] = await shoot(page, path.join(TMP, `f${b}.png`)); files.push(fwd[b]);
        await sleep(1500);
        const again = await shoot(page, path.join(TMP, `g${b}.png`));
        const ok = fs.readFileSync(again).equals(fs.readFileSync(fwd[b]));
        console.log(`beat ${b}: ${ok ? 'settled' : 'STILL MOVING (psnr ' + psnrOf(fwd[b], again) + ')'}`);
        if (!ok) code = 2;
      }
      for (let b = +to - 1; !process.env.NOBACK && b >= +from; b--) {
        await page.keyboard.press('ArrowLeft');
        await sleep(wait);
        const f = await shoot(page, path.join(TMP, `r${b}.png`));
        const same = fs.readFileSync(f).equals(fs.readFileSync(fwd[b]));
        const ps = same ? 'identical' : psnrOf(fwd[b], f);
        console.log(`beat ${b}: forward vs back ${same ? 'identical' : 'psnr ' + ps}`);
        if (!same && !(parseFloat(ps) >= 40)) code = 2;
      }
      await browser.close();
      if (out && files.length) { tile(files, path.resolve(out)); console.log('wrote', out); }
      if (errors.length) console.log(errors.slice(0, 15).join('\n'));
    } else {
      console.log('usage: sheet <out.jpg> <beats…> | one <out.png> <beat> | idle <beats…> | walk <from> <to> [out.jpg]');
    }
  } catch (e) { console.error(e); code = 1; }
  try { fs.rmSync(TMP, {recursive: true, force: true}); } catch (e) {}
  process.exit(code);
})();
