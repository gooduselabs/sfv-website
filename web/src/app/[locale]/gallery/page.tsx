import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Play } from 'lucide-react';
import { asset, fmtDate, items, tr, type Item } from '@/lib/directus';
import { PageHeader } from '@/components/PageHeader';
import { DemoBadge } from '@/components/Demo';
import { Reveal } from '@/components/Motion';

export const revalidate = 60;
export async function generateMetadata() { const t = await getTranslations('gallery'); return { title: t('title') }; }
export default async function Gallery({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations('gallery');
  const all = await items('galleries', { fields: ['*', 'translations.*', 'images.directus_files_id'], sort: ['-date'], limit: -1 });
  const photos = all.filter((g) => g.type === 'photo'), videos = all.filter((g) => g.type === 'video');
  return (
    <>
      <PageHeader kicker="Media" title={t('title')} />
      <section className="section container-x">
        <h2 className="font-display mb-6 text-3xl font-bold">{t('videos')}</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {videos.map((v) => (
            <div key={v.id} className="overflow-hidden rounded-3xl bg-navy-950 text-white">
              <div className="relative aspect-video">
                {v.youtube_id ? <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${v.youtube_id}`} title={tr(v, locale).title} allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" /> : (
                  <><img src={asset(v.cover, { w: 900 })!} alt="" className="h-full w-full object-cover opacity-50" /><div className="absolute inset-0 grid place-items-center"><span className="grid h-16 w-16 place-items-center rounded-full bg-white/15 backdrop-blur"><Play /></span></div><p className="absolute inset-x-0 bottom-3 text-center text-xs text-white/70">{t('videoPending')}</p></>
                )}
              </div>
              <p className="flex items-center gap-2 p-4 font-semibold">{tr(v, locale).title}<DemoBadge show={v.demo} /></p>
            </div>
          ))}
        </div>
        <h2 className="font-display mb-6 mt-16 text-3xl font-bold">{t('photos')}</h2>
        <div className="space-y-12">
          {photos.map((g) => (
            <Reveal key={g.id}>
              <div className="mb-3 flex items-baseline justify-between"><h3 className="flex items-center gap-2 font-display text-xl font-semibold">{tr(g, locale).title}<DemoBadge show={g.demo} /></h3><span className="text-sm text-navy-800/50">{fmtDate(g.date, locale)}</span></div>
              <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
                {(g.images ?? []).slice(0, 8).map((im: Item, k: number) => <img key={k} src={asset(im.directus_files_id, { w: 600 })!} alt="" loading="lazy" className={`w-full rounded-2xl object-cover ${k % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`} />)}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
