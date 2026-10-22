// SFV custom endpoints:
//  GET  /sfv/rankings?discipline=<slug>&age_group=U13&gender=M  -> season ranking (sum of points)
//  POST /sfv/import-results (multipart: file=.csv|.xlsx, competition=<slug>) -> import into `results`
//       requires an authenticated user with create permission on `results` (Admin / Competition Organizer)
import * as XLSX from 'xlsx';

function parseTime(s) {
  if (s == null || s === '') return null; s = String(s).trim();
  const m = s.match(/^(?:(\d+):)?(\d+(?:[.,]\d+)?)$/); if (!m) return null;
  return Math.round(((+(m[1] || 0)) * 60 + parseFloat(m[2].replace(',', '.'))) * 1000);
}
export default {
  id: 'sfv',
  handler: (router, { services, getSchema, database }) => {
    const { ItemsService } = services;
    router.get('/rankings', async (req, res, next) => {
      try {
        const { discipline, age_group, gender, season } = req.query;
        const q = database('results as r').join('competition_events as e', 'e.id', 'r.event').join('competitions as c', 'c.id', 'e.competition').join('disciplines as d', 'd.id', 'c.discipline').join('athletes as a', 'a.id', 'r.athlete').leftJoin('clubs as cl', 'cl.id', 'a.club')
          .select('a.id as athlete_id', 'a.slug', 'a.full_name', 'a.birth_year', 'a.gender', 'cl.name as club', 'd.slug as discipline')
          .sum({ points: 'r.points' }).count({ starts: 'r.id' }).min({ best_rank: 'r.rank' })
          .groupBy('a.id', 'cl.name', 'd.slug').orderBy([{ column: 'points', order: 'desc' }, { column: 'best_rank', order: 'asc' }]).limit(200);
        if (discipline) q.where('d.slug', discipline);
        if (age_group) q.where('r.age_group', age_group);
        if (gender) q.where('a.gender', gender);
        if (season) q.whereRaw('extract(year from c.start_date) = ?', [season]);
        const rows = await q;
        res.json({ data: rows.map((r, i) => ({ position: i + 1, ...r, points: Number(r.points), starts: Number(r.starts) })) });
      } catch (e) { next(e); }
    });
    router.post('/import-results', async (req, res, next) => {
      try {
        if (!req.accountability?.user) return res.status(401).json({ errors: [{ message: 'Login required' }] });
        const chunks = []; for await (const c of req) chunks.push(c);
        const buf = Buffer.concat(chunks);
        // Accept raw body (text/csv or xlsx) with ?competition=slug, or multipart with a single file
        let data = buf; const ct = req.headers['content-type'] || '';
        if (ct.startsWith('multipart/')) {
          const b = '--' + ct.split('boundary=')[1]; const s = buf.toString('latin1'); const parts = s.split(b).filter((p) => p.includes('filename='));
          if (!parts.length) return res.status(400).json({ errors: [{ message: 'No file' }] });
          const p = parts[0]; const start = p.indexOf('\r\n\r\n') + 4; data = Buffer.from(p.slice(start, p.lastIndexOf('\r\n')), 'latin1');
        }
        const wb = XLSX.read(data, { type: 'buffer', codepage: 65001 });
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '', raw: false });
        const schema = await getSchema(); const opts = { schema, accountability: req.accountability };
        const S = (c) => new ItemsService(c, opts);
        const compSlug = req.query.competition;
        const report = { imported: 0, created_athletes: 0, errors: [] };
        const cache = {};
        for (const [i, r] of rows.entries()) {
          try {
            const slug = r.competition_slug || compSlug;
            cache[slug] ??= (await S('competitions').readByQuery({ filter: { slug: { _eq: slug } }, fields: ['id', 'discipline'], limit: 1 }))[0];
            const comp = cache[slug]; if (!comp) throw new Error('competition not found: ' + slug);
            let ev = (await S('competition_events').readByQuery({ filter: { competition: { _eq: comp.id }, code: { _eq: r.event_code } }, fields: ['id', 'scoring', 'age_group'], limit: 1 }))[0];
            if (!ev) { const id = await S('competition_events').createOne({ competition: comp.id, discipline: comp.discipline, code: r.event_code, age_group: r.age_group || null, scoring: r.score ? 'score' : 'time', translations: [{ languages_code: 'vi-VN', name: r.event_name || r.event_code }, { languages_code: 'en-US', name: r.event_name || r.event_code }] }); ev = { id, scoring: r.score ? 'score' : 'time' }; }
            let ath = r.athlete_slug ? (await S('athletes').readByQuery({ filter: { slug: { _eq: r.athlete_slug } }, fields: ['id'], limit: 1 }))[0] : (await S('athletes').readByQuery({ filter: { full_name: { _eq: r.athlete_name }, birth_year: { _eq: Number(r.birth_year) || null } }, fields: ['id'], limit: 1 }))[0];
            if (!ath) { if (!r.athlete_name) throw new Error('athlete missing'); const id = await S('athletes').createOne({ full_name: r.athlete_name, birth_year: Number(r.birth_year) || null, gender: r.gender || null, discipline: comp.discipline, slug: 'vdv-' + Date.now().toString(36) + i }); ath = { id }; report.created_athletes++; }
            const time_ms = r.time ? parseTime(r.time) : null;
            await S('results').createOne({ event: ev.id, athlete: ath.id, rank: Number(r.rank) || null, time_ms, score: r.score ? Number(String(r.score).replace(',', '.')) : null, result_text: r.time || r.score || '', age_group: r.age_group || ev.age_group || null, points: Number(r.points) || 0, status: r.status || 'OK', notes: r.notes || null });
            report.imported++;
          } catch (e) { report.errors.push({ row: i + 2, message: e.message }); }
        }
        res.json({ data: report });
      } catch (e) { next(e); }
    });
  },
};
