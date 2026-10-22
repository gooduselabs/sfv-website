import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { Breadcrumb } from './Portal';
/** Compact portal-style page banner: breadcrumb + title on navy band. */
export async function PageHeader({ kicker, title, sub, area = 'ice', children, crumbs }: { kicker?: string; title: string; sub?: string; area?: 'ice' | 'roller'; image?: string | null; children?: ReactNode; crumbs?: { label: string; href?: string }[] }) {
  const t = await getTranslations('menu');
  return (
    <>
      <div className="border-b border-navy-900/10 bg-ice-50"><div className="container-x py-2.5"><Breadcrumb items={[{ label: t('home'), href: '/' }, ...(crumbs ?? []), { label: title }]} /></div></div>
      <section className={`relative overflow-hidden text-white ${area === 'roller' ? 'bg-gradient-to-r from-navy-900 via-navy-900 to-[#4a1430]' : 'bg-gradient-to-r from-navy-900 to-navy-700'}`}>
        <div className={`absolute inset-y-0 left-0 w-1.5 ${area === 'roller' ? 'bg-neon-orange' : 'bg-ice-400'}`} />
        <div className="container-x relative py-7 sm:py-9">
          {kicker && <p className={`text-[12px] font-bold uppercase tracking-[0.2em] ${area === 'roller' ? 'text-neon-orange' : 'text-ice-300'}`}>{kicker}</p>}
          <h1 className="mt-1 text-2xl font-extrabold leading-tight sm:text-4xl">{title}</h1>
          {sub && <p className="mt-2 max-w-3xl text-[15px] text-white/75">{sub}</p>}
          {children}
        </div>
      </section>
    </>
  );
}
