// Shared helpers for Directus REST API (pattern reused from GoodUseLabs cms.py)
import fs from 'node:fs';
import path from 'node:path';
const envFile = path.resolve(import.meta.dirname, '../.env');
if (fs.existsSync(envFile)) for (const l of fs.readFileSync(envFile, 'utf8').split('\n')) { const m = l.match(/^([A-Z_]+)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2]; }
export const URL_ = process.env.DIRECTUS_URL || process.env.PUBLIC_URL || 'http://localhost:8055';
let TOKEN = process.env.DIRECTUS_TOKEN;
export async function login() {
  if (TOKEN) return TOKEN;
  const r = await fetch(URL_ + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }) });
  const j = await r.json(); if (!j.data) throw new Error('login failed ' + JSON.stringify(j)); TOKEN = j.data.access_token; return TOKEN;
}
export async function api(method, p, body, { raw = false, quiet = false } = {}) {
  const headers = { Authorization: 'Bearer ' + (await login()) };
  let b = body; if (body && !(body instanceof FormData)) { headers['Content-Type'] = 'application/json'; b = JSON.stringify(body); }
  const r = await fetch(URL_ + p, { method, headers, body: b });
  if (r.status === 204) return null;
  const t = await r.text(); let j; try { j = JSON.parse(t); } catch { j = { raw: t }; }
  if (!r.ok) { if (!quiet) console.error(method, p, r.status, t.slice(0, 400)); const e = new Error(t); e.status = r.status; throw e; }
  return raw ? j : j.data;
}
export async function upload(file, title) {
  const fd = new FormData(); fd.append('title', title);
  const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.pdf': 'application/pdf', '.csv': 'text/csv' };
  fd.append('file', new Blob([fs.readFileSync(file)], { type: MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' }), path.basename(file));
  return (await api('POST', '/files', fd)).id;
}
