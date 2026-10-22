// Default (global) table columns in Directus Admin for key collections.
import { api } from './lib.mjs';
const P = { competitions: ['translations', 'status', 'start_date', 'city', 'discipline', 'demo'], results: ['event', 'rank', 'athlete', 'result_text', 'points', 'age_group', 'demo'], news: ['translations', 'status', 'publish_date', 'category', 'featured', 'demo'], registrations: ['athlete_name', 'competition', 'event', 'club_name', 'status', 'date_created'], athletes: ['full_name', 'discipline', 'club', 'birth_year', 'gender', 'demo'], clubs: ['name', 'type', 'area', 'city', 'demo'], competition_events: ['code', 'competition', 'age_group', 'gender', 'scheduled_at'] };
for (const [collection, fields] of Object.entries(P)) {
  const ex = await api('GET', `/presets?filter[collection][_eq]=${collection}&filter[user][_null]=true&filter[role][_null]=true`);
  const body = { collection, layout: 'tabular', layout_query: { tabular: { fields, sort: [collection === 'news' ? '-publish_date' : collection === 'results' ? 'rank' : 'id'] } }, layout_options: { tabular: { widths: {} } } };
  if (ex[0]) await api('PATCH', `/presets/${ex[0].id}`, body); else await api('POST', '/presets', { ...body, user: null, role: null });
}
console.log('presets done');
