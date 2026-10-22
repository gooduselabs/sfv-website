'use server';
// Public competition entry -> Directus `registrations` (public role has create-only on whitelisted fields; status defaults to pending).
const API = process.env.DIRECTUS_URL || 'http://localhost:8055';
export type RegState = { ok: boolean; error?: string } | null;
export async function submitRegistration(_: RegState, fd: FormData): Promise<RegState> {
  const s = (k: string) => String(fd.get(k) ?? '').trim();
  if (s('website')) return { ok: true }; // honeypot
  const body = { competition: Number(s('competition')), event: Number(s('event')) || null, athlete_name: s('athlete_name'), birth_year: Number(s('birth_year')) || null, gender: s('gender') || null, club_name: s('club_name'), coach_name: s('coach_name'), contact_email: s('contact_email'), phone: s('phone'), note: s('note') };
  if (!body.competition || body.athlete_name.length < 3 || !/^\S+@\S+\.\S+$/.test(body.contact_email) || !body.birth_year || body.birth_year < 1950 || body.birth_year > new Date().getFullYear()) return { ok: false, error: 'validation' };
  const r = await fetch(`${API}/items/registrations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), cache: 'no-store' });
  return r.ok || r.status === 204 ? { ok: true } : { ok: false, error: String(r.status) };
}
