'use client';
import { useActionState, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { submitRegistration, type RegState } from '@/lib/actions';

type Comp = { id: number; slug: string; name: string; events: { id: number; name: string }[] };
export function RegistrationForm({ comps, initial, l }: { comps: Comp[]; initial?: string; l: Record<string, string> }) {
  const [state, action, pending] = useActionState<RegState, FormData>(submitRegistration, null);
  const [cid, setCid] = useState(String(comps.find((c) => c.slug === initial)?.id ?? comps[0]?.id ?? ''));
  const comp = comps.find((c) => String(c.id) === cid);
  if (state?.ok) return <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-navy-900/5"><CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" /><p className="font-display mt-4 text-xl font-semibold">{l.ok}</p></div>;
  const input = 'w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm ring-1 ring-navy-900/10 outline-none transition focus:bg-white focus:ring-2 focus:ring-brand';
  const F = ({ name, label, type = 'text', req = false }: { name: string; label: string; type?: string; req?: boolean }) => <label className="block"><span className="mb-1.5 block text-sm font-medium">{label}{req && ' *'}</span><input name={name} type={type} required={req} className={input} /></label>;
  return (
    <form action={action} className="grid gap-4 rounded-[2rem] bg-white p-6 ring-1 ring-navy-900/5 sm:grid-cols-2 sm:p-8">
      <label className="block sm:col-span-2"><span className="mb-1.5 block text-sm font-medium">{l.competition} *</span><select name="competition" value={cid} onChange={(e) => setCid(e.target.value)} className={input}>{comps.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label className="block sm:col-span-2"><span className="mb-1.5 block text-sm font-medium">{l.event}</span><select name="event" className={input}>{comp?.events.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select></label>
      <F name="athlete_name" label={l.name} req />
      <div className="grid grid-cols-2 gap-4"><F name="birth_year" label={l.birthYear} type="number" req /><label className="block"><span className="mb-1.5 block text-sm font-medium">{l.gender}</span><select name="gender" className={input}><option value="M">{l.men}</option><option value="F">{l.women}</option></select></label></div>
      <F name="club_name" label={l.club} /><F name="coach_name" label={l.coach} />
      <F name="contact_email" label={l.email} type="email" req /><F name="phone" label={l.phone} type="tel" />
      <label className="block sm:col-span-2"><span className="mb-1.5 block text-sm font-medium">{l.note}</span><textarea name="note" rows={3} className={input} /></label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {state && !state.ok && <p className="text-sm font-medium text-brand sm:col-span-2">{l.err}</p>}
      <button disabled={pending} className="rounded-full bg-gradient-to-r from-neon-orange to-neon-pink px-6 py-3.5 font-semibold text-white shadow-lg shadow-neon-pink/25 transition hover:brightness-110 disabled:opacity-60 sm:col-span-2 sm:justify-self-start">{pending ? '…' : l.submit}</button>
    </form>
  );
}
