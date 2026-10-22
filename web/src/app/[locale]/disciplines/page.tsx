import { getTranslations, setRequestLocale } from 'next-intl/server';
import { asset, items, tr } from '@/lib/directus';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Motion';
import { Link } from '@/i18n/navigation';

export const revalidate = 60;
export async function generateMetadata() { const t = await getTranslations('disc'); return { title: t('title') }; }
export default async function Disciplines({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const [t, tn, tc] = [await getTranslations('disc'), await getTranslations('nav'), await getTranslations('common')];
  const list = await items('disciplines', { fields: ['*', 'translations.*'], sort: ['sort'] });
  return (
    <>
      <PageHeader kicker="ISU · World Skate" title={t('title')} sub={`${tn('ice')} & ${tn('roller')}`} />
      {(['ice', 'roller'] as const).map((area) => (
        <section key={area} className={`section ${area === 'roller' ? 'bg-roller text-white' : ''}`}><div className="container-x">
          <h2 className={`font-display mb-10 text-5xl font-extrabold sm:text-7xl ${area === 'roller' ? 'text-gradient-roller' : 'text-navy-950'}`}>{tn(area)}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.filter((d) => d.area === area).map((d, i) => (
              <Reveal key={d.id} delay={i * 0.06}>
                <Link href={`/disciplines/${d.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[2rem]">
                  <img src={asset(d.cover, { w: 700 })!} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className={`absolute inset-0 ${area === 'ice' ? 'bg-gradient-to-t from-navy-900 via-navy-900/30 to-transparent' : 'bg-gradient-to-t from-navy-950 via-neon-pink/10 to-transparent'}`} />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <div className="flex gap-1.5"><span className="tag bg-white/15 backdrop-blur">{d.governing_body}</span>{!d.confirmed && <span className="tag bg-amber-300 text-amber-950">{tc('pending')}</span>}</div>
                    <h3 className="font-display mt-3 text-2xl font-semibold leading-tight">{tr(d, locale).name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-white/70">{tr(d, locale).summary}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div></section>
      ))}
    </>
  );
}
