import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight, Trophy } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { asset, items, newsFilter, single, tr } from '@/lib/directus';
import { Hero } from '@/components/Hero';
import { CountUp, Parallax, Reveal, CarveLine } from '@/components/Motion';
import { AthleteCard, CompetitionCard, NewsCard, SectionTitle } from '@/components/Cards';
import { DemoBadge } from '@/components/Demo';

export const revalidate = 60;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tc = await getTranslations('comp');
  const tm = await getTranslations('common');
  const today = new Date().toISOString().slice(0, 10);
  const [banners, settings, upcoming, finished, news, athletes, galleries, sponsors, disciplines] = await Promise.all([
    items('home_banners', { fields: ['*', 'translations.*'], filter: { status: { _eq: 'published' } }, sort: ['sort'] }),
    single('site_settings', { fields: ['stats'] }),
    items('competitions', { fields: ['*', 'translations.*', 'discipline.area', 'discipline.translations.*'], filter: { start_date: { _gte: today } }, sort: ['start_date'], limit: 4 }),
    items('competitions', { fields: ['id', 'slug', 'demo', 'start_date', 'city', 'translations.*', 'discipline.area', 'discipline.translations.*', 'events.id', 'events.sort', 'events.translations.*', 'events.results.rank', 'events.results.result_text', 'events.results.athlete.full_name', 'events.results.athlete.slug', 'events.results.athlete.club.name'], filter: { status: { _eq: 'finished' } }, sort: ['-start_date'], limit: 1, deep: { events: { _sort: ['sort'], _limit: 4, results: { _filter: { rank: { _lte: 3 } }, _sort: ['rank'] } } } }),
    items('news', { fields: ['*', 'translations.*', 'category.translations.*'], filter: newsFilter(), sort: ['-publish_date'], limit: 5 }),
    items('athletes', { fields: ['*', 'club.name', 'discipline.area', 'discipline.translations.*'], filter: { featured: { _eq: true } }, limit: 8 }),
    items('galleries', { fields: ['slug', 'cover', 'translations.*'], filter: { type: { _eq: 'photo' } }, sort: ['-date'], limit: 5 }),
    items('sponsors', { fields: ['*'], sort: ['sort'] }),
    items('disciplines', { fields: ['slug', 'area', 'cover', 'confirmed', 'translations.*'], sort: ['sort'] }),
  ]);
  const next = upcoming[0];
  const slides = banners.map((b) => ({ image: asset(b.image, { w: 2000, q: 72 }), title: tr(b, locale).title ?? '', subtitle: tr(b, locale).subtitle ?? '', area: b.area }));
  const stats = settings?.stats ?? {};
  const last = finished[0];
  const ice = disciplines.filter((d) => d.area === 'ice');
  const roller = disciplines.filter((d) => d.area === 'roller');
  return (
    <>
      <Hero slides={slides} next={next ? { name: tr(next, locale).name, date: next.start_date + 'T08:00:00+07:00', slug: next.slug, city: `${next.venue}, ${next.city}` } : null}
        l={{ kicker: t('kicker'), t1: t('heroTitle1'), t2: t('heroTitle2'), sub: t('heroSub'), c1: t('ctaCompetitions'), c2: t('ctaResults'), next: t('next'), units: [t('days'), t('hours'), t('minutes'), t('seconds')] }} />

      {/* stats */}
      <section className="container-x relative z-10 -mt-10">
        <div className="frost grid grid-cols-2 gap-px overflow-hidden rounded-3xl shadow-xl shadow-navy-900/10 md:grid-cols-4">
          {(['clubs', 'athletes', 'disciplines', 'competitions'] as const).map((k, i) => (
            <div key={k} className="bg-white/85 p-6 sm:p-8">
              <div className={`font-display text-3xl font-bold sm:text-5xl ${i % 2 ? 'text-gradient-roller' : 'text-ice-600'}`}><CountUp to={Number(stats[k] ?? 0)} suffix={k === 'athletes' ? '+' : ''} /></div>
              <div className="mt-1 text-sm font-medium text-navy-800/70">{t(`stats.${k}`)}</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-right text-[11px] text-navy-800/40">* {tm('demoNote')}</p>
      </section>

      {/* dual portals */}
      <section className="section container-x">
        <Reveal><SectionTitle kicker="Ice × Roller" title={t('portals')} /></Reveal>
        <div className="grid gap-5 lg:grid-cols-2">
          {[{ k: 'ice', list: ice, img: ice[0]?.cover, title: t('iceTitle'), desc: t('iceDesc') }, { k: 'roller', list: roller, img: roller[0]?.cover, title: t('rollerTitle'), desc: t('rollerDesc') }].map((p, i) => (
            <Reveal key={p.k} delay={i * 0.1}>
              <div className={`group relative isolate overflow-hidden rounded-[2rem] p-7 sm:p-10 ${p.k === 'ice' ? 'bg-ice-100 text-navy-950' : 'bg-navy-950 text-white'}`}>
                <Parallax className="absolute inset-0 -z-10" speed={0.08}><img src={asset(p.img, { w: 1200 })!} alt="" className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${p.k === 'ice' ? 'opacity-55' : 'opacity-45'}`} /></Parallax>
                <div className={`absolute inset-0 -z-10 ${p.k === 'ice' ? 'bg-gradient-to-br from-white/95 via-white/60 to-ice-300/10' : 'bg-gradient-to-br from-navy-950 via-navy-950/70 to-neon-pink/30'}`} />
                <div className="flex min-h-[360px] flex-col justify-between sm:min-h-[440px]">
                  <div>
                    <span className={`tag ${p.k === 'ice' ? 'bg-ice-500 text-white' : 'bg-gradient-to-r from-neon-orange to-neon-pink text-white'}`}>{p.k === 'ice' ? 'ISU' : 'World Skate'}</span>
                    <h3 className={`font-display mt-4 text-6xl font-extrabold sm:text-8xl ${p.k === 'ice' ? 'text-navy-950' : 'text-gradient-roller'}`}>{p.title}</h3>
                    <p className={`mt-3 max-w-md ${p.k === 'ice' ? 'text-navy-800/70' : 'text-white/70'}`}>{p.desc}</p>
                  </div>
                  <ul className="mt-8 grid gap-2 sm:grid-cols-2">
                    {p.list.map((d) => (
                      <li key={d.slug}>
                        <Link href={`/disciplines/${d.slug}`} className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${p.k === 'ice' ? 'frost hover:bg-white' : 'frost-dark hover:bg-white/10'}`}>
                          <span>{tr(d, locale).name}</span><ArrowUpRight size={16} className="opacity-50" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* competitions + latest results */}
      <section className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-24">
        <div className="scratch absolute inset-0" />
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-ice-500/20 blur-3xl" />
        <div className="container-x relative grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionTitle dark kicker={tc('upcoming')} title={tc('title')} href="/competitions" more={tm('viewAll')} />
            <div className="grid gap-3">{upcoming.map((c) => <CompetitionCard key={c.id} c={c} dark locale={locale} label={tc(c.status)} />)}</div>
          </div>
          <div>
            <SectionTitle dark kicker={last ? tr(last, locale).name : ''} title={t('latestResults')} href="/results" more={tm('viewAll')} />
            {last ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {last.events.filter((e: { results: unknown[] }) => e.results.length).map((e: { id: number; results: { rank: number; result_text: string; athlete: { full_name: string; slug: string; club?: { name: string } } }[] }) => (
                  <Reveal key={e.id}>
                    <Link href={`/competitions/${last.slug}#results`} className="frost-dark block rounded-3xl p-5 transition hover:bg-white/10">
                      <div className="flex items-center justify-between"><p className="text-sm font-semibold text-ice-200">{tr(e, locale).name}</p><DemoBadge show={last.demo} /></div>
                      <ol className="mt-3 space-y-2">
                        {e.results.map((r) => (
                          <li key={r.rank} className="flex items-center gap-3 text-sm">
                            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${r.rank === 1 ? 'bg-amber-300 text-amber-950' : r.rank === 2 ? 'bg-slate-200 text-slate-800' : 'bg-orange-300/80 text-orange-950'}`}>{r.rank}</span>
                            <span className="min-w-0 flex-1 truncate">{r.athlete?.full_name}</span>
                            <span className="font-mono text-xs tabular-nums text-white/70">{r.result_text}</span>
                          </li>
                        ))}
                      </ol>
                    </Link>
                  </Reveal>
                ))}
              </div>
            ) : <p className="text-white/60">{tm('noData')}</p>}
          </div>
        </div>
      </section>

      {/* news */}
      <section className="section container-x">
        <Reveal><SectionTitle kicker="SFV" title={t('latestNews')} href="/news" more={tm('viewAll')} /></Reveal>
        <div className="grid gap-5 md:grid-cols-3 md:grid-rows-2">
          {news.map((n, i) => <Reveal key={n.id} delay={i * 0.05} className={i === 0 ? 'md:row-span-2 md:flex' : ''}><NewsCard n={n} locale={locale} big={i === 0} /></Reveal>)}
        </div>
      </section>

      {/* featured athletes */}
      <section className="section bg-ice-grad">
        <div className="container-x">
          <Reveal><SectionTitle kicker={<CarveLine />} title={t('featured')} href="/athletes" more={tm('viewAll')} /></Reveal>
          <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {athletes.map((a) => <div key={a.id} className="w-[72%] shrink-0 snap-start sm:w-auto"><AthleteCard a={a} locale={locale} /></div>)}
          </div>
        </div>
      </section>

      {/* gallery */}
      <section className="section container-x">
        <Reveal><SectionTitle kicker="Gallery" title={t('gallery')} href="/gallery" more={tm('viewAll')} /></Reveal>
        <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] md:grid-cols-4">
          {galleries.map((g, i) => (
            <Link key={g.slug} href="/gallery" className={`group relative overflow-hidden rounded-3xl ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
              <Parallax className="absolute inset-0" speed={0.06}><img src={asset(g.cover, { w: i === 0 ? 1200 : 600 })!} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></Parallax>
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent opacity-0 transition group-hover:opacity-100" />
              <span className="absolute bottom-3 left-4 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">{tr(g, locale).title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* sponsors */}
      <section className="border-y border-navy-900/5 bg-white py-12">
        <div className="container-x mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-navy-800/50"><Trophy size={14} />{t('sponsors')}</div>
        <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="marquee flex w-max gap-4">
            {[...sponsors, ...sponsors].map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="flex h-20 w-56 shrink-0 items-center justify-center gap-2 rounded-2xl bg-ice-50 px-6 ring-1 ring-navy-900/5 grayscale transition hover:grayscale-0">
                <span className={`font-display text-sm font-bold ${s.tier === 'main' ? 'text-gradient-roller' : 'text-navy-800'}`}>{s.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
