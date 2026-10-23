// Import real posts from the SFV Facebook page (scraped JSON + downloaded images) as NON-demo news.
// Usage: DIRECTUS_URL=… ADMIN_EMAIL=… ADMIN_PASSWORD=… node scripts/import-fb.mjs <posts.json> <imgDir>
// Re-run cleanup: delete news/galleries with demo=false first if titles change.
// Images expected as <imgDir>/p<postIndex>_<imageIndex>.jpg. Idempotent (upsert by slug). Also applies real contact info.
import fs from 'node:fs';
import path from 'node:path';
import { api, upload } from './lib.mjs';
const [file, imgDir] = process.argv.slice(2);
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const DATES = ['2026-10-22T10:00:00+07:00', '2026-10-21T09:00:00+07:00', '2026-10-17T09:00:00+07:00', '2026-10-15T09:24:00+07:00', '2026-10-12T17:58:00+07:00', '2026-10-02T16:06:00+07:00', '2026-09-23T11:22:00+07:00'];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const link = (s) => esc(s).replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
const isUpper = (l) => l.length > 8 && l === l.toLocaleUpperCase('vi') && /\p{L}/u.test(l);
const slugify = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);
const cats = Object.fromEntries(((await api('GET', '/items/news_categories?fields=id,slug&limit=-1')) || []).map((c) => [c.slug, c.id]));
// site settings (real contact info)
if (!((await api('GET', '/fields/site_settings', null, { quiet: true })) || []).some((f) => f.field === 'website')) await api('POST', '/fields/site_settings', { field: 'website', type: 'string', meta: { interface: 'input', width: 'half' } });
const pi = data.page_info;
await api('PATCH', '/items/site_settings', { email: 'info@sfv.org.vn', phone: '090 292 03 88', address: 'Phố Trần Văn Lai, KĐT Mỹ Đình - Mễ Trì, phường Mỹ Đình 1, quận Nam Từ Liêm, Hà Nội', facebook: 'https://www.facebook.com/liendoantruotbangvarollervietnam', website: 'https://truotbangvietnam.com' });
console.log('site_settings updated', pi?.name ?? '');
let n = 0;
for (const [i, p] of data.posts.entries()) {
  const lines = p.text.split('\n').map((l) => l.trim());
  const ti = lines.findIndex(isUpper);
  const t0 = ti >= 0 ? ti : 0; const tl = [t0]; if (ti >= 0 && isUpper(lines[t0 + 1] ?? '') && lines[t0].length < 60) tl.push(t0 + 1);
  const title = tl.map((k) => lines[k].replace(/[.:]+$/, '')).join(' – ');
  const rest = lines.filter((_, k) => !tl.includes(k)).filter((l) => !/^(#\S+\s*)+$/.test(l) && !/^Author comment:/i.test(l));
  // paragraphs: blank lines split; consecutive lines become <br>
  const blocks = []; let cur = [];
  for (const l of rest) { if (!l) { if (cur.length) blocks.push(cur), (cur = []); } else if (/^━+$/.test(l)) { if (cur.length) blocks.push(cur), (cur = []); blocks.push(null); } else cur.push(l); }
  if (cur.length) blocks.push(cur);
  const html = blocks.map((b) => (b === null ? '<hr>' : b.length === 1 && isUpper(b[0]) ? `<h3>${esc(b[0])}</h3>` : `<p>${b.map(link).join('<br>')}</p>`)).join('\n')
    + `\n<p class="source"><em>Nguồn: <a href="${p.permalink}" target="_blank" rel="noopener">Facebook SFV</a></em></p>`;
  const plain = rest.filter((l) => l && !/^━/.test(l)).join(' ');
  const excerpt = plain.length > 220 ? plain.slice(0, 217).replace(/\s+\S*$/, '') + '…' : plain;
  const cat = /THÔNG BÁO|DANH SÁCH|ĐIỀU LỆ|ĐĂNG K[ÝÍ]/i.test(title + ' ' + lines.slice(0, 3).join(' ')) ? 'thong-bao' : 'hoat-dong';
  const slug = `${slugify(title)}-${DATES[i].slice(0, 10)}`;
  const imgs = (p.image_urls || []).map((_, j) => path.join(imgDir, `p${i}_${j}.jpg`)).filter((f) => fs.existsSync(f));
  const existing = (await api('GET', `/items/news?filter[slug][_eq]=${slug}&fields=id,cover`))?.[0];
  let ids = [];
  if (!existing) ids = await Promise.all(imgs.map((f, j) => upload(f, `${title.slice(0, 80)} (${j + 1}) – ảnh: Facebook SFV`)));
  const item = { status: 'published', publish_date: DATES[i], slug, category: cats[cat], is_announcement: cat === 'thong-bao', featured: i === 0, breaking: i < 3, author: 'Liên đoàn Trượt băng và Roller Việt Nam', demo: false,
    translations: [{ languages_code: 'vi-VN', title, excerpt, body: html }] };
  if (existing) { await api('PATCH', `/items/news/${existing.id}`, { ...item, translations: undefined }); console.log('updated', slug); continue; }
  await api('POST', '/items/news', { ...item, cover: ids[0] ?? null, views: 0 });
  if (ids.length > 1) await api('POST', '/items/galleries', { slug: `album-${slug}`.slice(0, 90), type: 'photo', cover: ids[0], date: DATES[i].slice(0, 10), demo: false, translations: [{ languages_code: 'vi-VN', title }], images: ids.map((id, k) => ({ directus_files_id: id, sort: k + 1 })) });
  n++; console.log('created', slug, `${ids.length} images`, cat);
}
console.log(`fb import done: ${n} new`);
