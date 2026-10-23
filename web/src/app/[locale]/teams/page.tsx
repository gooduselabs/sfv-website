import { getTranslations, setRequestLocale } from 'next-intl/server';
import { items, tr, type Item } from '@/lib/directus';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Motion';
import { Link } from '@/i18n/navigation';

export const revalidate = 60;
export async function generateMetadata() { const t = await getTranslations('teams'); return { title: t('title') }; }
export default async function Teams({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations('teams');
  const teams = await items('national_teams', { fields: ['*', 'translations.*', 'discipline.area', 'discipline.translations.*', 'members.role', 'members.sort', 'members.athlete.full_name', 'members.athlete.slug', 'members.athlete.birth_year', 'members.athlete.club.name'], sort: ['category'], deep: { members: { _sort: ['sort'] } } });
  return (
    <>
      <PageHeader kicker="Team Vietnam" title={t('title')} sub={t('sub')} />
      <section className="section container-x grid gap-6 lg:grid-cols-2">
        {teams.map((tm, i) => {
          const roller = tm.discipline?.area === 'roller';
          return (
            <Reveal key={tm.id} delay={i * 0.05}><div className={`h-full overflow-hidden rounded-[2rem] p-6 sm:p-8 ${roller ? 'bg-roller text-white' : 'bg-white ring-1 ring-navy-900/5'}`}>
              <div className="flex flex-wrap gap-2"><span className={`tag ${roller ? 'bg-white/10' : 'bg-slate-100 text-sky-700'}`}>{tr(tm.discipline, locale).name}</span><span className="tag bg-amber-300 text-amber-950">{tm.category}</span></div>
              <h2 className="font-display mt-4 text-2xl font-bold">{tr(tm, locale).name}</h2>
              <p className={`mt-1 text-sm ${roller ? 'text-white/60' : 'text-navy-800/60'}`}>{t('season')} {tm.season} · {t('coach')}: {tm.coach}</p>
              <p className={`mt-2 text-sm ${roller ? 'text-white/50' : 'text-navy-800/50'}`}>{tr(tm, locale).description}</p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {(tm.members ?? []).map((m: Item, k: number) => (
                  <li key={k}><Link href={`/athletes/${m.athlete?.slug}`} className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm ${roller ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100'}`}>
                    <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${roller ? 'bg-gradient-to-br from-neon-orange to-neon-pink' : 'bg-slate-500 text-white'}`}>{k + 1}</span>
                    <span className="min-w-0"><span className="block truncate font-semibold">{m.athlete?.full_name}</span><span className="block text-xs opacity-60">{m.role} · {m.athlete?.birth_year}</span></span>
                  </Link></li>
                ))}
              </ul>
            </div></Reveal>
          );
        })}
      </section>
    </>
  );
}
