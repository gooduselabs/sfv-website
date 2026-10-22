// Creates the SFV data model in Directus via REST API (idempotent: skips existing).
// After running, `npm run schema:snapshot` writes schema/snapshot.yaml for `schema apply`.
import { api } from './lib.mjs';

const sel = (...o) => ({ interface: 'select-dropdown', options: { choices: o.map((v) => ({ text: v, value: v })) } });
// Field spec: [name, type, meta?]  types: string text wysiwyg int float decimal bool date datetime json tags file m2o:<coll> select:<a|b>
const C = {
  languages: { pk: 'code', icon: 'translate', fields: [['name', 'string'], ['direction', 'string']] },
  site_settings: { singleton: true, icon: 'settings', fields: [['site_name', 'string'], ['email', 'string'], ['phone', 'string'], ['address', 'string'], ['facebook', 'string'], ['youtube', 'string'], ['hero_video', 'string'], ['stats', 'json']], tr: [['tagline', 'string'], ['footer_text', 'text'], ['seo_description', 'text']] },
  pages: { icon: 'article', fields: [['slug', 'string'], ['status', 'select:published|draft'], ['sort', 'int'], ['cover', 'file']], tr: [['title', 'string'], ['summary', 'text'], ['body', 'wysiwyg']] },
  departments: { icon: 'account_tree', fields: [['slug', 'string'], ['sort', 'int']], tr: [['name', 'string'], ['description', 'text']] },
  board_members: { icon: 'groups', fields: [['name', 'string'], ['photo', 'file'], ['sort', 'int'], ['group', 'select:presidium|executive'], ['department', 'm2o:departments'], ['demo', 'bool']], tr: [['position', 'string'], ['bio', 'text']] },
  disciplines: { icon: 'downhill_skiing', fields: [['slug', 'string'], ['area', 'select:ice|roller'], ['governing_body', 'string'], ['confirmed', 'bool'], ['status_note', 'string'], ['cover', 'file'], ['sort', 'int']], tr: [['name', 'string'], ['summary', 'text'], ['rules', 'wysiwyg'], ['events_desc', 'text']] },
  clubs: { icon: 'location_on', fields: [['name', 'string'], ['slug', 'string'], ['type', 'select:federation|club|rink'], ['area', 'select:ice|roller|both'], ['city', 'string'], ['address', 'string'], ['lat', 'float'], ['lng', 'float'], ['website', 'string'], ['phone', 'string'], ['logo', 'file'], ['demo', 'bool']] },
  news_categories: { icon: 'label', fields: [['slug', 'string']], tr: [['name', 'string']] },
  news: { icon: 'newspaper', fields: [['status', 'select:published|scheduled|draft'], ['publish_date', 'datetime'], ['slug', 'string'], ['category', 'm2o:news_categories'], ['discipline', 'm2o:disciplines'], ['cover', 'file'], ['is_announcement', 'bool'], ['featured', 'bool'], ['demo', 'bool']], tr: [['title', 'string'], ['excerpt', 'text'], ['body', 'wysiwyg']] },
  competitions: { icon: 'emoji_events', fields: [['slug', 'string'], ['status', 'select:upcoming|registration_open|ongoing|finished|draft'], ['level', 'select:national|international|youth'], ['discipline', 'm2o:disciplines'], ['venue', 'string'], ['city', 'string'], ['start_date', 'date'], ['end_date', 'date'], ['age_groups', 'tags'], ['regulations_file', 'file'], ['results_file', 'file'], ['registration_open', 'datetime'], ['registration_close', 'datetime'], ['cover', 'file'], ['demo', 'bool']], tr: [['name', 'string'], ['description', 'wysiwyg']] },
  competition_events: { icon: 'event', fields: [['competition', 'm2o:competitions'], ['discipline', 'm2o:disciplines'], ['code', 'string'], ['age_group', 'string'], ['gender', 'select:M|F|X'], ['scoring', 'select:time|score'], ['scheduled_at', 'datetime'], ['sort', 'int']], tr: [['name', 'string']] },
  athletes: { icon: 'sports', fields: [['slug', 'string'], ['full_name', 'string'], ['club', 'm2o:clubs'], ['discipline', 'm2o:disciplines'], ['birth_year', 'int'], ['gender', 'select:M|F'], ['photo', 'file'], ['featured', 'bool'], ['demo', 'bool']], tr: [['bio', 'text'], ['achievements', 'wysiwyg']] },
  results: { icon: 'leaderboard', fields: [['event', 'm2o:competition_events'], ['athlete', 'm2o:athletes'], ['rank', 'int'], ['time_ms', 'int'], ['score', 'decimal'], ['result_text', 'string'], ['age_group', 'string'], ['points', 'int'], ['status', 'select:OK|DNF|DNS|DSQ'], ['notes', 'string'], ['demo', 'bool']] },
  national_records: { icon: 'military_tech', fields: [['discipline', 'm2o:disciplines'], ['event_name', 'string'], ['age_group', 'string'], ['gender', 'select:M|F'], ['athlete', 'm2o:athletes'], ['mark', 'string'], ['record_date', 'date'], ['venue', 'string'], ['demo', 'bool']] },
  national_teams: { icon: 'flag', fields: [['slug', 'string'], ['discipline', 'm2o:disciplines'], ['season', 'string'], ['category', 'select:senior|junior|youth'], ['coach', 'string']], tr: [['name', 'string'], ['description', 'text']] },
  national_team_members: { icon: 'person_add', fields: [['team', 'm2o:national_teams'], ['athlete', 'm2o:athletes'], ['role', 'string'], ['sort', 'int']] },
  documents: { icon: 'description', fields: [['file', 'file'], ['category', 'select:regulation|form|decision|rulebook'], ['discipline', 'm2o:disciplines'], ['published_date', 'date'], ['demo', 'bool']], tr: [['title', 'string'], ['description', 'text']] },
  galleries: { icon: 'photo_library', fields: [['slug', 'string'], ['type', 'select:photo|video'], ['youtube_id', 'string'], ['cover', 'file'], ['date', 'date'], ['discipline', 'm2o:disciplines'], ['demo', 'bool']], tr: [['title', 'string']] },
  sponsors: { icon: 'handshake', fields: [['name', 'string'], ['logo', 'file'], ['url', 'string'], ['tier', 'select:main|official|partner'], ['sort', 'int'], ['demo', 'bool']] },
  home_banners: { icon: 'view_carousel', fields: [['status', 'select:published|draft'], ['image', 'file'], ['video_url', 'string'], ['link', 'string'], ['area', 'select:ice|roller|both'], ['sort', 'int']], tr: [['title', 'string'], ['subtitle', 'text'], ['cta', 'string']] },
  registrations: { icon: 'how_to_reg', fields: [['competition', 'm2o:competitions'], ['event', 'm2o:competition_events'], ['athlete_name', 'string'], ['birth_year', 'int'], ['gender', 'select:M|F'], ['club_name', 'string'], ['coach_name', 'string'], ['contact_email', 'string'], ['phone', 'string'], ['note', 'text'], ['status', 'select:pending|approved|rejected'], ['date_created', 'datetime']] },
};

function fieldDef(coll, [name, type]) {
  let t = type, meta = {}, schema = {}, rel = null;
  if (type.startsWith('select:')) { t = 'string'; Object.assign(meta, sel(...type.slice(7).split('|'))); }
  else if (type.startsWith('m2o:')) { t = 'integer'; meta = { interface: 'select-dropdown-m2o', special: ['m2o'] }; rel = type.slice(4); }
  else if (type === 'file') { t = 'uuid'; meta = { interface: 'file', special: ['file'] }; rel = 'directus_files'; }
  else if (type === 'wysiwyg') { t = 'text'; meta = { interface: 'input-rich-text-html' }; }
  else if (type === 'tags') { t = 'json'; meta = { interface: 'tags', special: ['cast-json'] }; }
  else if (type === 'json') { meta = { interface: 'input-code', options: { language: 'json' }, special: ['cast-json'] }; }
  else if (type === 'bool') { t = 'boolean'; meta = { interface: 'boolean', special: ['cast-boolean'] }; schema.default_value = false; }
  else if (type === 'int') t = 'integer';
  else if (type === 'datetime') t = 'timestamp';
  if (name === 'date_created') meta.special = ['date-created'];
  if (name === 'status') schema.default_value = coll === 'registrations' ? 'pending' : 'draft';
  if (name === 'demo') meta.note = 'Dữ liệu DEMO – không phải dữ liệu thật';
  if (name === 'status_note') meta.note = 'Ví dụ: Chờ khách hàng xác nhận';
  return { field: { field: name, type: t, meta, schema }, rel };
}
const ONE = { 'competition_events.competition': ['events'], 'results.event': ['results'], 'national_team_members.team': ['members'], 'results.athlete': ['results'], 'galleries_files.galleries_id': ['images', 'directus_files_id', 'sort'] };
const ONE_PARENT = { 'competition_events.competition': 'competitions', 'results.event': 'competition_events', 'national_team_members.team': 'national_teams', 'results.athlete': 'athletes', 'galleries_files.galleries_id': 'galleries' };
const exists = async (p) => { try { await api('GET', p, null, { quiet: true }); return true; } catch { return false; } };

async function ensureCollection(name, def) {
  if (await exists('/collections/' + name)) return console.log('skip', name);
  const pk = def.pk === 'code' ? { field: 'code', type: 'string', schema: { is_primary_key: true, length: 10 }, meta: { interface: 'input' } } : { field: 'id', type: 'integer', schema: { is_primary_key: true, has_auto_increment: true }, meta: { hidden: true } };
  await api('POST', '/collections', { collection: name, meta: { icon: def.icon, singleton: !!def.singleton, hidden: !!def.hidden, archive_field: null }, schema: {}, fields: [pk] });
  console.log('created', name);
}
async function ensureField(coll, spec) {
  const { field, rel } = fieldDef(coll, spec);
  if (!(await exists(`/fields/${coll}/${field.field}`))) await api('POST', `/fields/${coll}`, field);
  const one = ONE[`${coll}.${field.field}`];
  if (rel && !(await exists(`/relations/${coll}/${field.field}`))) await api('POST', '/relations', { collection: coll, field: field.field, related_collection: rel, meta: one ? { one_field: one[0], junction_field: one[1] || null, sort_field: one[2] || null } : undefined, schema: { on_delete: one?.[1] ? 'CASCADE' : 'SET NULL' } });
}
async function ensureTranslations(coll, fields) {
  const tc = coll + '_translations';
  await ensureCollection(tc, { icon: 'translate', hidden: true });
  if (!(await exists(`/fields/${tc}/${coll}_id`))) await api('POST', `/fields/${tc}`, { field: coll + '_id', type: 'integer', meta: { hidden: true } });
  if (!(await exists(`/fields/${tc}/languages_code`))) await api('POST', `/fields/${tc}`, { field: 'languages_code', type: 'string', meta: { hidden: true } });
  for (const f of fields) await ensureField(tc, f);
  if (!(await exists(`/fields/${coll}/translations`))) await api('POST', `/fields/${coll}`, { field: 'translations', type: 'alias', meta: { special: ['translations'], interface: 'translations', options: { languageField: 'name', defaultLanguage: 'vi-VN', userLanguage: false } } });
  if (!(await exists(`/relations/${tc}/${coll}_id`))) await api('POST', '/relations', { collection: tc, field: coll + '_id', related_collection: coll, meta: { one_field: 'translations', junction_field: 'languages_code' }, schema: { on_delete: 'CASCADE' } });
  if (!(await exists(`/relations/${tc}/languages_code`))) await api('POST', '/relations', { collection: tc, field: 'languages_code', related_collection: 'languages', meta: { one_field: null, junction_field: coll + '_id' }, schema: { on_delete: 'CASCADE' } });
}

for (const [n, d] of Object.entries(C)) await ensureCollection(n, d);
for (const [k, [alias, junction]] of Object.entries(ONE)) { const one = ONE_PARENT[k]; const special = junction ? ['files'] : ['o2m']; if (!(await exists(`/fields/${one}/${alias}`))) await api('POST', `/fields/${one}`, { field: alias, type: 'alias', meta: { special, interface: junction ? 'files' : 'list-o2m' } }); }
for (const [n, d] of Object.entries(C)) { for (const f of d.fields) await ensureField(n, f); if (d.tr) await ensureTranslations(n, d.tr); }
// galleries <-> files (M2M)
await ensureCollection('galleries_files', { icon: 'image', hidden: true });
if (!(await exists('/fields/galleries_files/directus_files_id'))) await api('POST', '/fields/galleries_files', { field: 'directus_files_id', type: 'uuid', meta: { hidden: true } });
await ensureField('galleries_files', ['sort', 'int']);
await ensureField('galleries_files', ['galleries_id', 'm2o:galleries']);
if (!(await exists('/relations/galleries_files/directus_files_id'))) await api('POST', '/relations', { collection: 'galleries_files', field: 'directus_files_id', related_collection: 'directus_files', meta: { junction_field: 'galleries_id' }, schema: { on_delete: 'CASCADE' } });
// languages
for (const l of [{ code: 'vi-VN', name: 'Tiếng Việt', direction: 'ltr' }, { code: 'en-US', name: 'English', direction: 'ltr' }]) if (!(await exists('/items/languages/' + l.code))) await api('POST', '/items/languages', l);
console.log('schema done');
