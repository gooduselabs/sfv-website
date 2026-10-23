// Seed DEMO data. Every person/result/record here is FICTIONAL ("demo": true) — for layout & workflow testing only.
import fs from 'node:fs';
import path from 'node:path';
import { api, upload } from './lib.mjs';
const A = path.resolve(import.meta.dirname, '../seed-assets');
const VI = 'vi-VN', EN = 'en-US';
const T = (vi, en) => [{ languages_code: VI, ...vi }, { languages_code: EN, ...en }];
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const pick = (a) => a[Math.floor(rnd() * a.length)];
async function wipe(c) { const ids = (await api('GET', `/items/${c}?fields=${c === 'site_settings' ? 'id' : 'id'}&limit=-1`)) || []; const list = Array.isArray(ids) ? ids : [ids]; if (list.length && c !== 'site_settings') await api('DELETE', `/items/${c}`, list.map((x) => x.id)); }
if (process.env.SEED_IF_EMPTY && ((await api('GET', '/items/news?limit=1&fields=id')) || []).length) { console.log('content exists — skip demo seed (unset SEED_IF_EMPTY to force)'); process.exit(0); }
const create = async (c, items) => api('POST', `/items/${c}`, items);

for (const c of ['registrations', 'results', 'national_team_members', 'national_teams', 'national_records', 'competition_events', 'competitions', 'athletes', 'clubs', 'news', 'news_categories', 'documents', 'galleries', 'sponsors', 'home_banners', 'board_members', 'departments', 'pages', 'disciplines']) await wipe(c);
const oldFiles = await api('GET', '/files?limit=-1&fields=id&filter[title][_starts_with]=DEMO');
if (oldFiles.length) await api('DELETE', '/files', oldFiles.map((f) => f.id));

// ---- files
const img = {};
for (const f of fs.readdirSync(A).filter((f) => /\.(jpg|png|svg|pdf)$/.test(f))) img[f.split('.')[0]] = await upload(path.join(A, f), 'DEMO ' + f);
console.log('uploaded', Object.keys(img).length);

// ---- disciplines
const D = [
  ['figure-skating', 'ice', 'ISU', 'Trượt băng nghệ thuật', 'Figure Skating', 'figure', true],
  ['speed-skating', 'ice', 'ISU', 'Trượt băng tốc độ', 'Speed Skating', 'shorttrack', true],
  ['short-track', 'ice', 'ISU', 'Trượt băng tốc độ cự ly ngắn (Short track)', 'Short Track Speed Skating', 'shorttrack', true],
  ['ice-hockey', 'ice', 'IIHF', 'Khúc côn cầu trên băng', 'Ice Hockey', 'hockey', false],
  ['inline-speed', 'roller', 'World Skate', 'Inline tốc độ', 'Inline Speed Skating', 'inline', true],
  ['artistic-roller', 'roller', 'World Skate', 'Roller nghệ thuật', 'Artistic Roller Skating', 'artistic', true],
  ['inline-freestyle', 'roller', 'World Skate', 'Inline freestyle (slalom)', 'Inline Freestyle (Slalom)', 'inline', true],
  ['skateboarding', 'roller', 'World Skate', 'Ván trượt (Skateboarding)', 'Skateboarding', 'skate', false],
  ['roller-hockey', 'roller', 'World Skate', 'Khúc côn cầu Roller/Inline', 'Roller / Inline Hockey', 'hockey', false],
];
const disc = {};
for (const [i, [slug, area, gb, vi, en, cover, conf]] of D.entries()) {
  const r = await create('disciplines', { slug, area, governing_body: gb, cover: img[cover], sort: i, confirmed: false, status_note: 'Chờ khách hàng xác nhận / Pending client confirmation',
    translations: T({ name: vi, summary: `${vi} — bộ môn thuộc hệ thống ${gb}. Nội dung giới thiệu mẫu, chờ SFV cung cấp.`, rules: `<p>Luật thi đấu áp dụng theo quy định hiện hành của ${gb}. <em>(Nội dung mẫu – cần SFV cung cấp văn bản chính thức.)</em></p>`, events_desc: area === 'ice' ? 'Nội dung đơn, đôi, cự ly 500m – 1500m (mẫu)' : 'Cự ly 200m, 500m, 1000m, tiếp sức (mẫu)' },
      { name: en, summary: `${en} — governed internationally by ${gb}. Placeholder text pending SFV content.`, rules: `<p>Rules follow current ${gb} regulations. <em>(Placeholder – official documents pending.)</em></p>`, events_desc: area === 'ice' ? 'Singles, pairs, 500m – 1500m (sample)' : '200m, 500m, 1000m, relay (sample)' }) });
  disc[slug] = r.id;
}
// ---- news categories & news (~40 DEMO items)
const cats = {};
for (const [slug, vi, en] of [['hoat-dong', 'Hoạt động SFV', 'SFV activities'], ['thong-bao', 'Thông báo', 'Announcements'], ['truot-bang', 'Trượt băng', 'Ice skating'], ['roller', 'Roller', 'Roller'], ['quoc-te', 'Quốc tế', 'International'], ['doi-tuyen', 'Đội tuyển', 'National team'], ['dao-tao', 'Đào tạo', 'Education']]) cats[slug] = (await create('news_categories', { slug, translations: T({ name: vi }, { name: en }) })).id;
const NEWS = [
  ['hoat-dong', null, 'meeting', 'Liên đoàn họp Ban Chấp hành mở rộng, thông qua kế hoạch năm 2027', 'Federation executive board approves 2027 plan'],
  ['hoat-dong', null, 'meeting', 'Ký kết hợp tác phát triển phong trào trượt băng học đường', 'Partnership signed to develop school skating'],
  ['hoat-dong', 'figure-skating', 'kids', 'Ngày hội “Cùng trượt băng” thu hút hàng trăm em nhỏ', '“Skate Together” day draws hundreds of children'],
  ['hoat-dong', 'inline-speed', 'clinic', 'Khảo sát hệ thống sân tập Roller tại các tỉnh phía Nam', 'Survey of roller venues in southern provinces'],
  ['hoat-dong', null, 'meeting', 'Tổng kết công tác chuyên môn 9 tháng đầu năm', 'Nine-month technical review'],
  ['hoat-dong', 'skateboarding', 'skate', 'Ra mắt chương trình kết nối các CLB ván trượt', 'Skateboarding club network launched'],
  ['thong-bao', 'inline-speed', 'inline', 'Thông báo số 1 Giải Inline trẻ toàn quốc 2026', 'Notice no.1 – National Youth Inline Cup 2026'],
  ['thong-bao', 'artistic-roller', 'artistic', 'Thông báo mở đăng ký Giải Roller nghệ thuật mở rộng 2026', 'Registration open – Artistic Roller Open 2026'],
  ['thong-bao', 'short-track', 'shorttrack', 'Điều chỉnh lịch thi đấu Giải Short track 2027', 'Schedule change – Short Track Championships 2027'],
  ['thong-bao', null, 'meeting', 'Thông báo tuyển chọn trọng tài cấp quốc gia', 'Call for national-level officials'],
  ['thong-bao', null, 'meeting', 'Thông báo đăng ký thẻ phóng viên tác nghiệp các giải 2026', 'Media accreditation for 2026 events'],
  ['thong-bao', 'figure-skating', 'figure', 'Danh sách VĐV đủ điều kiện dự Cúp Trượt băng nghệ thuật', 'Eligible athletes – Figure Skating Cup'],
  ['thong-bao', null, 'kids', 'Thông báo lịch nghỉ và lịch làm việc văn phòng Liên đoàn', 'Federation office hours notice'],
  ['truot-bang', 'figure-skating', 'figure', 'Trượt băng nghệ thuật: thế hệ VĐV nhí tiến bộ rõ rệt', 'Figure skating: young skaters show clear progress'],
  ['truot-bang', 'short-track', 'shorttrack', 'Short track: các cự ly 500m sôi động tại giải nhóm tuổi', 'Short track: thrilling 500m races at age-group cup'],
  ['truot-bang', 'figure-skating', 'podium', 'Trao giải Cúp Trượt băng nghệ thuật 2026', 'Awards at the Figure Skating Cup 2026'],
  ['truot-bang', 'speed-skating', 'shorttrack', 'Trượt băng tốc độ: bài toán sân tập tiêu chuẩn', 'Speed skating: the standard-rink challenge'],
  ['truot-bang', 'ice-hockey', 'hockey', 'Khúc côn cầu trên băng: giao hữu giữa các đội trẻ', 'Ice hockey: youth friendlies'],
  ['truot-bang', 'figure-skating', 'kids', 'Lớp năng khiếu trượt băng cho trẻ từ 5 tuổi', 'Talent classes for skaters aged 5+'],
  ['truot-bang', 'short-track', 'podium', 'Gương mặt trẻ nổi bật mùa giải short track', 'Rising faces of the short-track season'],
  ['roller', 'inline-speed', 'inline', 'Giải Vô địch Inline tốc độ: nhiều thành tích cá nhân tốt nhất', 'Inline Speed Championships: many personal bests'],
  ['roller', 'artistic-roller', 'artistic', 'Roller nghệ thuật bổ sung nội dung thi đôi', 'Artistic roller adds pairs events'],
  ['roller', 'inline-freestyle', 'inline', 'Inline freestyle: slalom tốc độ hút khán giả trẻ', 'Inline freestyle: speed slalom attracts young fans'],
  ['roller', 'skateboarding', 'skate', 'Ván trượt hướng tới hệ thống giải trẻ', 'Skateboarding towards a youth circuit'],
  ['roller', 'roller-hockey', 'hockey', 'Khúc côn cầu roller: thành lập nhóm CLB nòng cốt', 'Roller hockey: core club group formed'],
  ['roller', 'inline-speed', 'clinic', 'Tập huấn kỹ thuật vào cua cho VĐV inline trẻ', 'Cornering clinic for young inline skaters'],
  ['roller', 'inline-speed', 'podium', 'Lễ trao huy chương Giải Inline tốc độ toàn quốc', 'Medal ceremony – National Inline Speed'],
  ['quoc-te', 'short-track', 'shorttrack', 'Cập nhật lịch thi đấu quốc tế mùa giải 2026–2027', 'International calendar 2026–27 update'],
  ['quoc-te', 'inline-speed', 'inline', 'Tham dự hội thảo phát triển Roller khu vực châu Á', 'Attending Asian roller development seminar'],
  ['quoc-te', 'figure-skating', 'figure', 'Chuyên gia quốc tế chia sẻ phương pháp huấn luyện', 'International expert shares coaching methods'],
  ['quoc-te', null, 'meeting', 'Làm việc với đoàn công tác liên đoàn bạn', 'Meeting with a visiting federation delegation'],
  ['quoc-te', 'skateboarding', 'skate', 'Ván trượt và lộ trình hội nhập quốc tế', 'Skateboarding and the international pathway'],
  ['doi-tuyen', 'short-track', 'shorttrack', 'Đội tuyển Short track tập huấn mùa đông', 'Short track team winter training camp'],
  ['doi-tuyen', 'inline-speed', 'inline', 'Triệu tập đội tuyển Inline tốc độ chuẩn bị giải khu vực', 'Inline speed squad called up'],
  ['doi-tuyen', 'figure-skating', 'figure', 'Đội tuyển trẻ trượt băng nghệ thuật kiểm tra trình độ', 'Junior figure team assessment'],
  ['doi-tuyen', 'short-track', 'podium', 'Ban huấn luyện đội tuyển đặt mục tiêu mùa giải mới', 'Coaches set goals for the new season'],
  ['dao-tao', null, 'clinic', 'Khai giảng lớp huấn luyện viên cấp 1', 'Level-1 coaching course opens'],
  ['dao-tao', null, 'meeting', 'Tập huấn trọng tài khúc côn cầu', 'Hockey officials clinic'],
  ['dao-tao', 'figure-skating', 'kids', 'Bồi dưỡng giáo viên thể chất về trượt băng an toàn', 'Safe-skating training for PE teachers'],
  ['dao-tao', 'inline-speed', 'clinic', 'Hướng dẫn kỹ năng an toàn cho phụ huynh và VĐV nhí', 'Safety guidance for parents and young skaters'],
  ['hoat-dong', 'speed-skating', 'shorttrack', 'Bài viết lên lịch đăng (scheduled) – chỉ hiện sau ngày đăng', 'Scheduled post example'],
];
const AUTHORS = ['Ban Truyền thông SFV (demo)', 'Phóng viên Demo', 'Văn phòng Liên đoàn (demo)'];
const body = (t) => `<p><strong>Đây là bài viết DEMO</strong> để kiểm tra giao diện cổng tin. Nội dung không phản ánh sự kiện thật.</p><p>${t}. Liên đoàn khuyến khích các câu lạc bộ, phụ huynh và vận động viên theo dõi thông báo chính thức trên website.</p><h2>Thông tin chính</h2><ul><li>Thời gian: theo lịch thi đấu</li><li>Địa điểm: xem trang giải đấu</li><li>Liên hệ: văn phòng Liên đoàn</li></ul><p>Trong thời gian tới, Liên đoàn sẽ tiếp tục cập nhật các thông tin liên quan. Mọi thắc mắc xin liên hệ Ban Truyền thông.</p>`;
const bodyEn = (t) => `<p><strong>This is a DEMO article</strong> for layout testing. It does not describe real events.</p><p>${t}. Clubs, parents and athletes are encouraged to follow official notices on this website.</p>`;
for (const [i, [cat, d, cover, vi, en]] of NEWS.entries()) {
  const last = i === NEWS.length - 1;
  const dt = new Date(Date.UTC(2026, 9, 22, 3 - i * 9)); if (last) dt.setUTCDate(dt.getUTCDate() + 60);
  await create('news', { status: last ? 'scheduled' : 'published', publish_date: dt.toISOString(), slug: `demo-tin-${i + 1}`, category: cats[cat], discipline: d ? disc[d] : null, cover: img[cover], is_announcement: cat === 'thong-bao', featured: [0, 2, 13, 20, 32].includes(i), breaking: i < 5, author: AUTHORS[i % 3], views: 150 + Math.floor(rnd() * 4800), demo: true, translations: T({ title: '[Demo] ' + vi, excerpt: 'Bài viết mẫu (demo) phục vụ kiểm thử giao diện và quy trình biên tập của cổng tin Liên đoàn.', body: body(vi) }, { title: '[Demo] ' + en, excerpt: 'Sample (demo) article for UI and editorial workflow testing.', body: bodyEn(en) }) });
}
// ---- clubs (approx city coordinates; names fictional)
const CITIES = [['Hà Nội', 21.0278, 105.8342], ['TP. Hồ Chí Minh', 10.7769, 106.7009], ['Đà Nẵng', 16.0544, 108.2022], ['Hải Phòng', 20.8449, 106.6881], ['Cần Thơ', 10.0452, 105.7469], ['Nha Trang', 12.2388, 109.1967], ['Huế', 16.4637, 107.5909], ['Quảng Ninh', 20.9599, 107.0425], ['Bình Dương', 11.3254, 106.477], ['Vũng Tàu', 10.346, 107.0843], ['Thanh Hóa', 19.8067, 105.7852], ['Nghệ An', 18.6796, 105.6813], ['Lâm Đồng', 11.9404, 108.4583], ['Đồng Nai', 10.9574, 106.8427]];
const clubs = [];
let ci = 0;
for (const [city, lat, lng] of CITIES) for (let k = 0; k < (city.startsWith('Hà') || city.startsWith('TP') ? 6 : 2); k++) {
  const area = pick(['ice', 'roller', 'roller', 'both']); ci++;
  const type = k === 0 && ci < 20 ? 'federation' : pick(['club', 'club', 'rink']);
  const label = type === 'federation' ? `Liên đoàn/Hội Trượt (demo) ${city}` : `${area === 'ice' ? 'CLB Trượt băng' : area === 'roller' ? 'CLB Roller' : 'CLB Trượt'} Demo ${ci}`;
  clubs.push(await create('clubs', { name: label, slug: `club-${ci}`, type, area, city, address: `Địa chỉ mẫu, ${city}`, lat: +(lat + (rnd() - 0.5) * 0.08).toFixed(5), lng: +(lng + (rnd() - 0.5) * 0.08).toFixed(5), demo: true }));
}
// ---- athletes (fictional names)
const HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Ngô'];
const DEM_M = ['Minh', 'Đức', 'Quang', 'Gia', 'Hoàng', 'Anh'], DEM_F = ['Thị', 'Ngọc', 'Bảo', 'Khánh', 'Thu', 'Minh'];
const TEN_M = ['Khang', 'Phúc', 'Huy', 'Nam', 'Long', 'Bảo', 'Khôi', 'An'], TEN_F = ['Linh', 'Vy', 'Châu', 'Hà', 'Mai', 'Ngân', 'Trang', 'My'];
const athletes = [];
const ATH_D = ['figure-skating', 'short-track', 'speed-skating', 'inline-speed', 'inline-speed', 'artistic-roller', 'inline-freestyle', 'skateboarding'];
for (let i = 0; i < 64; i++) {
  const g = i % 2 ? 'F' : 'M'; const name = `${pick(HO)} ${pick(g === 'M' ? DEM_M : DEM_F)} ${pick(g === 'M' ? TEN_M : TEN_F)}`;
  const d = ATH_D[i % ATH_D.length]; const by = 2008 + Math.floor(rnd() * 12);
  const a = await create('athletes', { slug: `vdv-demo-${i + 1}`, full_name: name, club: pick(clubs).id, discipline: disc[d], birth_year: by, gender: g, featured: i < 8, demo: true,
    translations: T({ bio: `Vận động viên DEMO (nhân vật hư cấu) – bộ môn ${D.find((x) => x[0] === d)[3]}.`, achievements: '<ul><li>Thành tích mẫu – không phải dữ liệu thật</li></ul>' }, { bio: 'DEMO athlete (fictional person).', achievements: '<ul><li>Sample achievement – not real data</li></ul>' }) });
  athletes.push({ ...a, d, g, by });
}
// ---- competitions + events + results
const ag = (by, year) => { const age = year - by; return age <= 6 ? 'U7' : age <= 8 ? 'U9' : age <= 10 ? 'U11' : age <= 12 ? 'U13' : age <= 14 ? 'U15' : age <= 16 ? 'U17' : 'Open'; };
const COMPS = [
  ['demo-vd-inline-2026', 'inline-speed', 'finished', 'Giải Vô địch Inline tốc độ toàn quốc 2026 (Demo)', 'National Inline Speed Championships 2026 (Demo)', 'Sân Roller Demo', 'TP. Hồ Chí Minh', '2026-04-18', '2026-04-20', 'inline'],
  ['demo-short-track-2026', 'short-track', 'finished', 'Giải Short track các nhóm tuổi 2026 (Demo)', 'Short Track Age Group Cup 2026 (Demo)', 'Sân băng Demo', 'Hà Nội', '2026-06-06', '2026-06-07', 'shorttrack'],
  ['demo-figure-2026', 'figure-skating', 'finished', 'Cúp Trượt băng nghệ thuật 2026 (Demo)', 'Figure Skating Cup 2026 (Demo)', 'Sân băng Demo', 'Hà Nội', '2026-08-22', '2026-08-23', 'figure'],
  ['demo-artistic-2026', 'artistic-roller', 'registration_open', 'Giải Roller nghệ thuật mở rộng 2026 (Demo)', 'Artistic Roller Open 2026 (Demo)', 'Nhà thi đấu Demo', 'Đà Nẵng', '2026-11-28', '2026-11-29', 'artistic'],
  ['demo-inline-tre-2026', 'inline-speed', 'registration_open', 'Giải Inline trẻ toàn quốc 2026 (Demo)', 'National Youth Inline Cup 2026 (Demo)', 'Sân Roller Demo', 'Cần Thơ', '2026-12-12', '2026-12-13', 'inline'],
  ['demo-short-track-2027', 'short-track', 'upcoming', 'Giải Vô địch Short track 2027 (Demo)', 'Short Track Championships 2027 (Demo)', 'Sân băng Demo', 'TP. Hồ Chí Minh', '2027-03-20', '2027-03-21', 'shorttrack'],
  ['demo-skate-2027', 'skateboarding', 'upcoming', 'Festival Ván trượt 2027 (Demo)', 'Skateboarding Festival 2027 (Demo)', 'Công viên Demo', 'Nha Trang', '2027-04-10', '2027-04-11', 'skate'],
];
const pdf = img.dieu_le_mau;
const timed = (d) => !['figure-skating', 'artistic-roller', 'inline-freestyle', 'skateboarding'].includes(d);
for (const [slug, d, status, vi, en, venue, city, s, e, cover] of COMPS) {
  const c = await create('competitions', { slug, discipline: disc[d], status, level: 'national', venue, city, start_date: s, end_date: e, age_groups: ['U9', 'U11', 'U13', 'U15', 'U17', 'Open'], cover: img[cover], regulations_file: pdf, registration_open: status === 'registration_open' ? '2026-10-01T00:00:00' : null, registration_close: status === 'registration_open' ? s + 'T00:00:00' : null, demo: true,
    translations: T({ name: vi, description: `<p>Giải đấu DEMO dùng để kiểm thử. Lịch, địa điểm và kết quả là <strong>dữ liệu hư cấu</strong>.</p>` }, { name: en, description: '<p>DEMO competition for testing. Schedule, venue and results are <strong>fictional</strong>.</p>' }) });
  const groups = ['U11', 'U13', 'U15', 'Open'];
  const dists = timed(d) ? (d === 'short-track' ? ['500m', '1000m'] : ['200m', '500m']) : ['Free program'];
  let sort = 0;
  for (const g of ['M', 'F']) for (const grp of groups) for (const dist of dists) {
    const day = new Date(s + 'T01:00:00Z'); day.setUTCHours(1 + (sort % 8));
    const ev = await create('competition_events', { competition: c.id, discipline: disc[d], code: `${dist}-${grp}-${g}`, age_group: grp, gender: g, scoring: timed(d) ? 'time' : 'score', scheduled_at: day.toISOString(), sort: sort++,
      translations: T({ name: `${dist} ${g === 'M' ? 'Nam' : 'Nữ'} ${grp}` }, { name: `${dist} ${g === 'M' ? 'Men' : 'Women'} ${grp}` }) });
    if (status !== 'finished') continue;
    const pool = athletes.filter((a) => a.d === d || (d === 'short-track' && a.d === 'speed-skating')).filter((a) => a.g === g && (grp === 'Open' || ag(a.by, 2026) === grp));
    const base = d === 'short-track' ? (dist === '500m' ? 47000 : 98000) : (dist === '200m' ? 18500 : 44000);
    const rows = pool.map((a) => ({ a, v: timed(d) ? base + Math.floor(rnd() * 9000) + (grp === 'Open' ? 0 : 4000) : +(60 + rnd() * 70).toFixed(2) }));
    rows.sort((x, y) => (timed(d) ? x.v - y.v : y.v - x.v));
    const PTS = [25, 20, 16, 13, 11, 10, 9, 8, 7, 6];
    if (rows.length) await create('results', rows.map((r, i) => ({ event: ev.id, athlete: r.a.id, rank: i + 1, time_ms: timed(d) ? r.v : null, score: timed(d) ? null : r.v, result_text: timed(d) ? fmt(r.v) : r.v.toFixed(2), age_group: grp, points: PTS[i] ?? 5, status: 'OK', demo: true })));
  }
}
function fmt(ms) { const m = Math.floor(ms / 60000), s = ((ms % 60000) / 1000).toFixed(3); return m ? `${m}:${s.padStart(6, '0')}` : s; }
// ---- national records (demo)
for (const [d, ev, grp, g, mark] of [['inline-speed', '200m', 'Open', 'M', '17.902'], ['inline-speed', '200m', 'Open', 'F', '19.410'], ['inline-speed', '500m', 'U15', 'M', '44.871'], ['short-track', '500m', 'Open', 'M', '46.120'], ['short-track', '1000m', 'Open', 'F', '1:39.884'], ['short-track', '500m', 'U13', 'F', '52.330']]) {
  const a = athletes.find((x) => x.d === d && x.g === g) || athletes.find((x) => x.g === g);
  await create('national_records', { discipline: disc[d], event_name: ev, age_group: grp, gender: g, athlete: a.id, mark, record_date: '2026-04-19', venue: 'Demo venue', demo: true });
}
// ---- national teams
for (const [slug, d, cat, vi, en] of [['dt-short-track', 'short-track', 'senior', 'Đội tuyển Short track quốc gia (Demo)', 'National Short Track Team (Demo)'], ['dt-inline', 'inline-speed', 'senior', 'Đội tuyển Inline tốc độ (Demo)', 'National Inline Speed Team (Demo)'], ['dt-tre-figure', 'figure-skating', 'junior', 'Đội tuyển trẻ Trượt băng nghệ thuật (Demo)', 'Junior Figure Skating Team (Demo)']]) {
  const t = await create('national_teams', { slug, discipline: disc[d], season: '2026–2027', category: cat, coach: 'HLV Demo', translations: T({ name: vi, description: 'Danh sách mẫu – chờ quyết định triệu tập chính thức.' }, { name: en, description: 'Sample roster – pending official call-up.' }) });
  const mem = athletes.filter((a) => a.d === d || (d === 'short-track' && a.d === 'speed-skating')).slice(0, 8);
  if (mem.length) await create('national_team_members', mem.map((a, i) => ({ team: t.id, athlete: a.id, role: i === 0 ? 'Đội trưởng' : 'VĐV', sort: i })));
}
// ---- about
const depts = [];
for (const [i, [slug, vi, en]] of [['chuyen-mon', 'Ban Chuyên môn', 'Technical Committee'], ['trong-tai', 'Ban Trọng tài', 'Officials Committee'], ['phong-trao', 'Ban Phong trào & Đào tạo', 'Development & Education'], ['truyen-thong', 'Ban Truyền thông & Tài trợ', 'Media & Partnerships'], ['y-te', 'Ban Y học & Chống doping', 'Medical & Anti-doping']].entries()) depts.push((await create('departments', { slug, sort: i, translations: T({ name: vi, description: `${vi} (mô tả mẫu).` }, { name: en, description: `${en} (sample).` }) })).id);
for (const [i, [pos, posEn, g]] of [['Chủ tịch', 'President', 'presidium'], ['Phó Chủ tịch thường trực', 'Executive Vice President', 'presidium'], ['Phó Chủ tịch', 'Vice President', 'presidium'], ['Tổng Thư ký', 'Secretary General', 'presidium'], ['Ủy viên', 'Member', 'executive'], ['Ủy viên', 'Member', 'executive'], ['Ủy viên', 'Member', 'executive'], ['Ủy viên', 'Member', 'executive']].entries())
  await create('board_members', { name: `Thành viên Demo ${i + 1}`, sort: i, group: g, department: depts[i % depts.length], demo: true, translations: T({ position: pos, bio: 'Thông tin mẫu – chờ SFV cung cấp.' }, { position: posEn, bio: 'Placeholder – pending SFV.' }) });
await create('pages', { slug: 'lich-su', status: 'published', sort: 0, cover: img.kids, translations: T({ title: 'Lịch sử hình thành', summary: 'Nội dung mẫu – chờ SFV cung cấp lịch sử chính thức.', body: '<p><strong>[Nội dung mẫu]</strong> Liên đoàn Trượt băng và Roller Việt Nam (SFV) là tổ chức xã hội – nghề nghiệp quản lý, phát triển các môn trượt băng và roller tại Việt Nam. Phần lịch sử, các mốc hình thành và thành tích sẽ được cập nhật theo tư liệu chính thức của Liên đoàn.</p><p>Sứ mệnh: phát triển phong trào từ lứa tuổi nhỏ, nâng cao thành tích thể thao đỉnh cao và hội nhập với hệ thống ISU & World Skate.</p>' }, { title: 'Our history', summary: 'Placeholder – official history pending.', body: '<p><strong>[Placeholder]</strong> The Skating Federation of Vietnam (SFV) governs and develops ice skating and roller sports in Vietnam. Official history and milestones will be provided by the Federation.</p>' }) });
await create('pages', { slug: 'lien-he', status: 'published', sort: 1, translations: T({ title: 'Liên hệ', summary: 'Văn phòng Liên đoàn', body: '<p>Thông tin liên hệ mẫu.</p>' }, { title: 'Contact', summary: 'Federation office', body: '<p>Sample contact info.</p>' }) });
// ---- documents
for (const [i, [cat, vi, en]] of [['regulation', 'Điều lệ giải Inline tốc độ 2026 (mẫu)', 'Inline Speed 2026 regulations (sample)'], ['form', 'Mẫu đăng ký vận động viên (mẫu)', 'Athlete registration form (sample)'], ['decision', 'Quyết định thành lập Ban tổ chức (mẫu)', 'Organizing committee decision (sample)'], ['rulebook', 'Luật thi đấu Short track (bản dịch mẫu)', 'Short track rulebook (sample translation)'], ['form', 'Mẫu cam kết phụ huynh (mẫu)', 'Parental consent form (sample)']].entries())
  await create('documents', { file: pdf, category: cat, discipline: disc[pick(Object.keys(disc))], published_date: `2026-0${(i % 9) + 1}-15`, demo: true, translations: T({ title: vi, description: 'Tệp PDF mẫu.' }, { title: en, description: 'Sample PDF file.' }) });
// ---- galleries
const covers = ['figure', 'shorttrack', 'inline', 'artistic', 'skate', 'kids', 'hockey', 'podium', 'clinic'];
for (const [i, c] of covers.entries()) {
  const g = await create('galleries', { slug: `album-demo-${i + 1}`, type: 'photo', cover: img[c], date: `2026-0${(i % 9) + 1}-10`, demo: true, translations: T({ title: `Album ảnh mẫu ${i + 1}` }, { title: `Sample album ${i + 1}` }) });
  await create('galleries_files', covers.map((x, k) => ({ galleries_id: g.id, directus_files_id: img[covers[(i + k) % covers.length]], sort: k })));
}
// youtube_id left empty: fill with official SFV YouTube video IDs
for (const [i, yt] of [null, null].entries()) await create('galleries', { slug: `video-demo-${i + 1}`, type: 'video', youtube_id: yt, cover: img[covers[i + 2]], date: '2026-09-01', demo: true, translations: T({ title: `Video mẫu ${i + 1} (thay bằng kênh YouTube SFV)` }, { title: `Sample video ${i + 1} (replace with SFV channel)` }) });
// ---- sponsors (fictional)
for (const [i, [n, t]] of [['Nhà tài trợ Demo A', 'main'], ['Đối tác Demo B', 'official'], ['Đối tác Demo C', 'official'], ['Partner Demo D', 'partner'], ['Partner Demo E', 'partner'], ['Partner Demo F', 'partner']].entries()) await create('sponsors', { name: n, tier: t, sort: i, url: 'https://example.com', demo: true });
// ---- banners & settings
await create('home_banners', [{ status: 'published', image: img.shorttrack, area: 'ice', sort: 0, translations: T({ title: 'Lướt trên băng. Bứt phá giới hạn.', subtitle: 'Trượt băng nghệ thuật · Tốc độ · Short track', cta: 'Khám phá Băng' }, { title: 'Glide on ice. Break limits.', subtitle: 'Figure · Speed · Short track', cta: 'Explore Ice' }) }, { status: 'published', image: img.inline, area: 'roller', sort: 1, translations: T({ title: 'Tốc độ của thành phố.', subtitle: 'Inline · Roller nghệ thuật · Freestyle · Ván trượt', cta: 'Khám phá Roller' }, { title: 'The speed of the city.', subtitle: 'Inline · Artistic · Freestyle · Skateboarding', cta: 'Explore Roller' }) }]);
await api('PATCH', '/items/site_settings', { site_name: 'Liên đoàn Trượt băng và Roller Việt Nam', email: 'info@sfv.example', phone: '+84 (0)24 0000 0000', address: 'Địa chỉ văn phòng (mẫu), Hà Nội', facebook: 'https://facebook.com', youtube: 'https://youtube.com', stats: { clubs: clubs.length, athletes: 1200, disciplines: D.length, competitions: 18 },
  translations: T({ tagline: 'Băng & Roller — một nhịp chuyển động', footer_text: 'Website đang ở giai đoạn thử nghiệm. Dữ liệu gắn nhãn DEMO là dữ liệu mẫu.', seo_description: 'Cổng thông tin chính thức (bản thử nghiệm) của Liên đoàn Trượt băng và Roller Việt Nam.' }, { tagline: 'Ice & Roller — one motion', footer_text: 'Website in beta. Items labelled DEMO are sample data.', seo_description: 'Official portal (beta) of the Skating Federation of Vietnam.' }) });
console.log('seed done', { clubs: clubs.length, athletes: athletes.length });
// ---- sample approved registrations (start list demo)
{
  const open = await api('GET', '/items/competitions?filter[status][_eq]=registration_open&fields=id,events.id&limit=1');
  if (open[0]) await create('registrations', athletes.slice(0, 10).map((a, i) => ({ competition: open[0].id, event: open[0].events[i % open[0].events.length].id, athlete_name: a.full_name + ' (demo)', birth_year: a.by, gender: a.g, club_name: 'CLB Demo', contact_email: 'demo@example.com', status: i < 8 ? 'approved' : 'pending' })));
  console.log('registrations seeded');
}
