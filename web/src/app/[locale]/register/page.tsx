import { getTranslations, setRequestLocale } from 'next-intl/server';
import { items, tr } from '@/lib/directus';
import { PageHeader } from '@/components/PageHeader';
import { RegistrationForm } from '@/components/RegistrationForm';

export const revalidate = 60;
export async function generateMetadata() { const t = await getTranslations('reg'); return { title: t('title') }; }
export default async function Register({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ competition?: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const { competition } = await searchParams;
  const [t, tm] = [await getTranslations('reg'), await getTranslations('common')];
  const comps = await items('competitions', { fields: ['id', 'slug', 'translations.*', 'events.id', 'events.sort', 'events.translations.*'], filter: { status: { _eq: 'registration_open' } }, sort: ['start_date'], deep: { events: { _sort: ['sort'], _limit: -1 } } });
  const data = comps.map((c) => ({ id: c.id, slug: c.slug, name: tr(c, locale).name, events: (c.events ?? []).map((e: { id: number }) => ({ id: e.id, name: tr(e, locale).name })) }));
  const keys = ['competition', 'event', 'name', 'birthYear', 'gender', 'club', 'coach', 'email', 'phone', 'note', 'submit', 'ok', 'err'] as const;
  return (
    <>
      <PageHeader area="roller" kicker="Entry" title={t('title')} sub={t('sub')} />
      <section className="section container-x max-w-4xl">
        {data.length ? <RegistrationForm comps={data} initial={competition} l={{ ...Object.fromEntries(keys.map((k) => [k, t(k)])), men: tm('men'), women: tm('women') }} /> : <p>{t('none')}</p>}
      </section>
    </>
  );
}
