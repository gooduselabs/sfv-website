// Roles & policies: Administrator (built-in), Editor (news/media), Competition Organizer (competitions/results/athletes)
// + Public read policy and public "create" on registrations.
import crypto from 'node:crypto';
import { api } from './lib.mjs';
const PUBLIC_READ = ['languages', 'site_settings', 'pages', 'departments', 'board_members', 'disciplines', 'clubs', 'news_categories', 'news', 'competitions', 'competition_events', 'athletes', 'results', 'national_records', 'national_teams', 'national_team_members', 'documents', 'galleries', 'galleries_files', 'sponsors', 'home_banners', 'directus_files'];
const tr = (c) => [c, c + '_translations'];
const EDITOR = [...tr('news'), ...tr('news_categories'), ...tr('galleries'), 'galleries_files', ...tr('home_banners'), 'sponsors', ...tr('documents'), ...tr('pages'), 'directus_files', 'directus_folders'];
const ORGANIZER = [...tr('competitions'), ...tr('competition_events'), 'results', ...tr('athletes'), 'clubs', 'national_records', ...tr('national_teams'), 'national_team_members', 'registrations', 'directus_files', 'directus_folders'];
const withTr = (l) => l.flatMap((c) => (c.startsWith('directus_') || ['languages', 'clubs', 'results', 'national_records', 'national_team_members', 'galleries_files', 'sponsors'].includes(c) ? [c] : [c, c + '_translations']));

async function policy(name, icon, app = true) {
  const ex = await api('GET', `/policies?filter[name][_eq]=${encodeURIComponent(name)}`);
  return ex[0]?.id ?? (await api('POST', '/policies', { name, icon, app_access: app, admin_access: false })).id;
}
async function grant(policy, collection, actions, extra = {}, fields = ['*']) {
  for (const action of actions) {
    const ex = await api('GET', `/permissions?filter[policy][_eq]=${policy}&filter[collection][_eq]=${collection}&filter[action][_eq]=${action}`);
    if (!ex.length) await api('POST', '/permissions', { policy, collection, action, fields, permissions: extra[action] ?? {}, validation: {} });
  }
}
async function role(name, icon, policyId) {
  const ex = await api('GET', `/roles?filter[name][_eq]=${encodeURIComponent(name)}`);
  const id = ex[0]?.id ?? (await api('POST', '/roles', { name, icon })).id;
  const acc = await api('GET', `/access?filter[role][_eq]=${id}&filter[policy][_eq]=${policyId}`);
  if (!acc.length) await api('POST', '/access', { role: id, policy: policyId });
  return id;
}
const CRUD = ['create', 'read', 'update', 'delete'];
// Public
const pub = (await api('GET', '/policies?filter[admin_access][_eq]=false&filter[app_access][_eq]=false&limit=-1')).find((p) => p.name.includes('public'));
const now = '$NOW';
for (const c of withTr(PUBLIC_READ)) await grant(pub.id, c, ['read'], c === 'news' ? { read: { _and: [{ status: { _in: ['published', 'scheduled'] } }, { publish_date: { _lte: now } }] } } : ['competitions', 'pages', 'home_banners'].includes(c) ? { read: { status: { _neq: 'draft' } } } : {});
await grant(pub.id, 'registrations', ['create'], {}, ['competition', 'event', 'athlete_name', 'birth_year', 'gender', 'club_name', 'coach_name', 'contact_email', 'phone', 'note']);
// public start list: only approved entries, only non-personal fields
await grant(pub.id, 'registrations', ['read'], { read: { status: { _eq: 'approved' } } }, ['id', 'competition', 'event', 'athlete_name', 'birth_year', 'gender', 'club_name', 'status']);
// Editor
const ed = await policy('Biên tập tin (Editor)', 'edit_note');
for (const c of EDITOR) await grant(ed, c, CRUD);
for (const c of ['languages', 'disciplines', 'disciplines_translations']) await grant(ed, c, ['read']);
// Organizer
const org = await policy('Ban tổ chức giải (Competition Organizer)', 'emoji_events');
for (const c of ORGANIZER) await grant(org, c, CRUD);
for (const c of ['languages', 'disciplines', 'disciplines_translations']) await grant(org, c, ['read']);
const rEd = await role('Editor', 'edit_note', ed);
const rOrg = await role('Competition Organizer', 'emoji_events', org);
// demo users
const users = [['editor@sfv.org.vn', rEd], ['organizer@sfv.org.vn', rOrg]];
const pw = process.env.DEMO_USER_PASSWORD || 'Sfv-' + crypto.randomBytes(6).toString('hex');
if (!process.env.DEMO_USER_PASSWORD) console.log('DEMO_USER_PASSWORD not set; generated:', pw);
for (const [email, r] of users) { const ex = await api('GET', `/users?filter[email][_eq]=${email}`); if (!ex.length) await api('POST', '/users', { email, password: pw, role: r, first_name: email.split('@')[0] }); else if (process.env.DEMO_USER_PASSWORD) await api('PATCH', `/users/${ex[0].id}`, { password: pw }); }
console.log('roles done');
