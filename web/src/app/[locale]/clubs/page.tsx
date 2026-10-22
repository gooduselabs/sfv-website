import { getTranslations, setRequestLocale } from 'next-intl/server';
import { items } from '@/lib/directus';
import { PageHeader } from '@/components/PageHeader';
import { ClubsMap } from '@/components/ClubsMap';

export const revalidate = 60;
export async function generateMetadata() { const t = await getTranslations('clubs'); return { title: t('title') }; }
export default async function Clubs({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const [t, tn, tm] = [await getTranslations('clubs'), await getTranslations('nav'), await getTranslations('common')];
  const clubs = await items('clubs', { fields: ['id', 'name', 'city', 'type', 'area', 'lat', 'lng', 'address', 'demo'], limit: -1 });
  return (
    <>
      <PageHeader kicker={`${clubs.length} ${t('club')}`} title={t('title')} sub={t('sub')} />
      <section className="section container-x">
        <p className="mb-3 text-sm text-amber-700">⚠ {tm('demoNote')}</p>
        <ClubsMap clubs={clubs.map((c) => ({ ...c, id: c.id, name: c.name, city: c.city, type: c.type, area: c.area, lat: c.lat, lng: c.lng }) as never)} labels={{ all: tm('all'), ice: tn('ice'), roller: tn('roller'), federation: t('federation'), club: t('club'), rink: t('rink') }} />
      </section>
    </>
  );
}
