import { getTranslations, setRequestLocale } from 'next-intl/server';
import { asset, items, one, tr } from '@/lib/directus';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Motion';
import { SectionTitle, initials } from '@/components/Cards';
import { DemoBadge } from '@/components/Demo';
import { Link } from '@/i18n/navigation';

export const revalidate = 60;
export async function generateMetadata() { const t = await getTranslations('about'); return { title: t('title') }; }

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations('about');
  const [page, board, depts, clubs] = await Promise.all([
    one('pages', { fields: ['*', 'translations.*'], filter: { slug: { _eq: 'lich-su' } } }),
    items('board_members', { fields: ['*', 'translations.*'], sort: ['sort'] }),
    items('departments', { fields: ['*', 'translations.*'], sort: ['sort'] }),
    items('clubs', { fields: ['name', 'city', 'type', 'area', 'demo'], filter: { type: { _eq: 'federation' } }, sort: ['city'], limit: -1 }),
  ]);
  const pt = tr(page, locale);
  return (
    <>
      <PageHeader kicker="SFV" title={t('title')} sub={pt.summary} image={asset(page?.cover, { w: 1800 })} />
      <section className="section container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <Reveal><h2 className="font-display text-3xl font-bold sm:text-5xl">{t('history')}</h2></Reveal>
        <Reveal><div className="prose-sfv text-lg" dangerouslySetInnerHTML={{ __html: pt.body ?? '' }} /></Reveal>
      </section>
      <section className="section bg-ice-grad"><div className="container-x">
        <SectionTitle kicker="Board" title={t('board')} />
        {(['presidium', 'executive'] as const).map((g) => (
          <div key={g} className="mb-10">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-navy-800/60">{t(g)}</h3>
            <div className={`grid gap-4 ${g === 'presidium' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 lg:grid-cols-4'}`}>
              {board.filter((b) => b.group === g).map((b, i) => (
                <Reveal key={b.id} delay={i * 0.05}><div className="frost rounded-3xl p-5">
                  <div className="grid aspect-[4/3] place-items-center rounded-2xl bg-gradient-to-br from-ice-200 to-ice-100">
                    {b.photo ? <img src={asset(b.photo, { w: 400 })!} alt={b.name} className="h-full w-full rounded-2xl object-cover" /> : <span className="font-display text-4xl font-bold text-ice-500">{initials(b.name)}</span>}
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-2"><p className="font-display font-semibold">{b.name}</p><DemoBadge show={b.demo} /></div>
                  <p className="text-sm text-ice-600">{tr(b, locale).position}</p>
                </div></Reveal>
              ))}
            </div>
          </div>
        ))}
      </div></section>
      <section className="section container-x">
        <SectionTitle kicker="Committees" title={t('departments')} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {depts.map((d, i) => <Reveal key={d.id} delay={i * 0.05}><div className="h-full rounded-3xl bg-white p-6 ring-1 ring-navy-900/5"><span className="font-display text-3xl font-bold text-ice-300">0{i + 1}</span><p className="font-display mt-4 font-semibold">{tr(d, locale).name}</p><p className="mt-2 text-sm text-navy-800/60">{tr(d, locale).description}</p></div></Reveal>)}
        </div>
      </section>
      <section className="container-x">
        <SectionTitle kicker="Members" title={t('members')} href="/clubs" more="Map" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((c) => <Link key={c.name} href="/clubs" className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 ring-1 ring-navy-900/5 hover:ring-ice-400"><span className="font-medium">{c.name}</span><DemoBadge show={c.demo} /></Link>)}
        </div>
      </section>
    </>
  );
}
