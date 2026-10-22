// Headless Chrome screenshots of key pages (desktop + mobile) and Directus admin.
// usage: WEB=http://localhost:3100 CMS=http://localhost:8055 ADMIN_EMAIL=.. ADMIN_PASSWORD=.. node screenshots.mjs ../../screens
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const OUT = process.argv[2] || './screens'; fs.mkdirSync(OUT, { recursive: true });
const WEB = process.env.WEB || 'http://localhost:3000', CMS = process.env.CMS || 'http://localhost:8055';
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-proxy-server', '--no-sandbox', '--hide-scrollbars', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const pages = [['home', '/'], ['home-en', '/en'], ['about', '/about'], ['disciplines', '/disciplines'], ['discipline-inline', '/disciplines/inline-speed'], ['competitions', '/competitions'], ['competition-detail', '/competitions/demo-vd-inline-2026'], ['results', '/results'], ['records', '/records'], ['athletes', '/athletes'], ['athlete-profile', '/athletes/vdv-demo-4'], ['teams', '/teams'], ['clubs-map', '/clubs'], ['news', '/news'], ['news-detail', '/news/demo-tin-1'], ['documents', '/documents'], ['gallery', '/gallery'], ['register', '/register'], ['search', '/search?q=demo']];
async function shoot(name, url, vp, full = true) {
  const p = await browser.newPage();
  await p.setViewport(vp);
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await p.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
  // scroll to trigger in-view animations & lazy images
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 180)); } window.scrollTo(0, 0); });
  await new Promise((r) => setTimeout(r, 1800));
  await p.screenshot({ path: `${OUT}/${name}.png`, fullPage: full });
  await p.close();
}
const only = process.env.ONLY?.split(',');
for (const [n, path] of pages) {
  if (only && !only.includes(n)) continue;
  try { await shoot(`${n}-desktop`, WEB + path, { width: 1440, height: 900 });
  await shoot(`${n}-mobile`, WEB + path, { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); } catch (e) { console.log('fail', n, e.message); continue; }
  console.log('shot', n);
}
if (process.env.ADMIN_PASSWORD && process.env.ADMIN !== '0') {
  const p = await browser.newPage(); await p.setViewport({ width: 1440, height: 900 });
  await p.goto(CMS + '/admin/login', { waitUntil: 'networkidle0' });
  await p.type('input[type=email]', process.env.ADMIN_EMAIL); await p.type('input[type=password]', process.env.ADMIN_PASSWORD);
  await Promise.all([p.keyboard.press('Enter'), p.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {})]);
  const dismiss = async () => { await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /Remind Later/i.test(x.textContent || '')); b?.click(); }); await new Promise((r) => setTimeout(r, 600)); };
  for (const [n, path] of [['admin-competitions', '/admin/content/competitions'], ['admin-results', '/admin/content/results'], ['admin-news-item', '/admin/content/news/1'], ['admin-registrations', '/admin/content/registrations'], ['admin-roles', '/admin/settings/roles'], ['admin-data-model', '/admin/settings/data-model']]) {
    let target = path;
    if (n === 'admin-news-item') { const id = await p.evaluate(async (c) => { const r = await fetch(c + '/items/news?limit=1&fields=id'); return (await r.json()).data[0].id; }, CMS); target = '/admin/content/news/' + id; }
    await p.goto(CMS + target, { waitUntil: 'networkidle0' }); await new Promise((r) => setTimeout(r, 1500)); await dismiss();
    await p.screenshot({ path: `${OUT}/${n}.png` }); console.log('shot', n);
  }
}
await browser.close();
