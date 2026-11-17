/* node tools/check.cjs — loads the deck headless and verifies:
   1. the concatenated NOTES_BY_SECTION strings (in ORDER) equal docs/script.txt with newlines removed
   2. the Huninn font is really loaded (a FontFace named Huninn with status 'loaded', and document.fonts.check)
   3. the deck has 93 beats
   4. no request leaves the machine: every request URL must be file:, data: or blob:
   It also prints any pageerror, console error or failed request.  Exit code 0 = all good. */
const path = require('path'), fs = require('fs');
const PUP = process.env.PUPPETEER_CORE || 'C:/Users/ASUS/AppData/Local/npm-cache/_npx/702923228c2ce1e6/node_modules/puppeteer-core';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const puppeteer = require(PUP);
const ROOT = path.resolve(__dirname, '..');
const DECK = 'file:///' + path.join(ROOT, 'index.html').split(String.fromCharCode(92)).join('/');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({executablePath: CHROME, headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--hide-scrollbars', '--mute-audio']});
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1080});
  const problems = [];
  page.on('pageerror', e => problems.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') problems.push('console error: ' + m.text()); });
  page.on('requestfailed', r => problems.push('request failed: ' + r.url()));
  const badNet = [];
  page.on('request', r => { if (!/^(file|data|blob):/i.test(r.url())) badNet.push(r.url()); });
  await page.goto(DECK + '?still', {waitUntil: 'load'});
  await page.waitForFunction('window.__deckReady === true', {timeout: 60000}).catch(() => problems.push('deck never became ready'));
  await sleep(300);
  const info = await page.evaluate(() => {
    const faces = [...document.fonts].filter(f => f.family.replace(/["']/g, '') === 'Huninn').map(f => f.status);
    return {
      notes: typeof NOTES_BY_SECTION === 'undefined' ? null : ORDER.map(id => (NOTES_BY_SECTION[id] || []).join('')).join(''),
      beats: typeof LAST === 'number' ? LAST + 1 : -1,
      faces, check: document.fonts.check('40px Huninn', '溝通'), order: ORDER.slice()
    };
  });
  await browser.close();
  const script = fs.readFileSync(path.join(ROOT, 'docs', 'script.txt'), 'utf8').replace(/[\r\n]/g, '');
  const ok = (cond, msg) => { console.log((cond ? 'PASS ' : 'FAIL ') + msg); if (!cond) problems.push(msg); };
  ok(info.notes === script, `notes rebuild docs/script.txt (${info.notes ? info.notes.length : 'n/a'} vs ${script.length} chars)`);
  if (info.notes !== script && info.notes) { let i = 0; while (i < script.length && info.notes[i] === script[i]) i++; console.log('  first difference at char', i, JSON.stringify(info.notes.slice(i, i + 20)), JSON.stringify(script.slice(i, i + 20))); }
  ok(info.faces.length > 0 && info.faces.every(s => s === 'loaded'), `Huninn FontFace loaded (${JSON.stringify(info.faces)})`);
  ok(info.check, 'document.fonts.check("40px Huninn")');
  ok(badNet.length === 0, 'no network requests (only file:, data:, blob:)' + (badNet.length ? ': ' + badNet.slice(0, 5).join(', ') : ''));
  ok(info.beats === 93, `beat count is ${info.beats} (want 93)`);
  const real = problems.filter(p => !/^(notes|Huninn|document|beat count|no network)/.test(p));
  if (real.length) console.log('PROBLEMS:\n' + real.join('\n')); else console.log('no page errors, console errors or failed requests');
  process.exit(problems.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
