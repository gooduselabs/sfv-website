import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { Breadcrumb } from './Portal';
import { Star, Swoosh } from './Logo';
/** Compact portal-style page banner: breadcrumb + title on navy band. */
export async function PageHeader({ kicker, title, sub, area = 'ice', children, crumbs }: { kicker?: string; title: string; sub?: string; area?: 'ice' | 'roller'; image?: string | null; children?: ReactNode; crumbs?: { label: string; href?: string }[] }) {
  const t = await getTranslations('menu');
  return (
    <>
      <div className="border-b border-navy-900/10 bg-slate-50"><div className="container-x py-2.5"><Breadcrumb items={[{ label: t('home'), href: '/' }, ...(crumbs ?? []), { label: title }]} /></div></div>
      <section className={`relative overflow-hidden text-white ${area === 'roller' ? 'bg-gradient-to-r from-navy-900 via-navy-900 to-[#4a1430]' : 'bg-gradient-to-r from-navy-900 via-sky-800 to-sky-700'}`}>
        <div className={`absolute inset-y-0 left-0 w-1.5 ${area === 'roller' ? 'bg-neon-orange' : 'bg-brand'} w-2`} />
        <div aria-hidden className="pattern-lines absolute inset-0" />
        <Swoosh className="pointer-events-none absolute -bottom-1 right-0 h-full w-[45%] text-brand/70" />
        <Star className="pointer-events-none absolute right-[8%] top-5 hidden h-7 w-7 text-gold sm:block" />
        <div className="container-x relative py-7 sm:py-10">
          {kicker && <p className={`text-[12px] font-bold uppercase tracking-[0.2em] ${area === 'roller' ? 'text-neon-orange' : 'text-gold'}`}>{kicker}</p>}
          <h1 className="mt-1 text-2xl font-extrabold uppercase leading-tight tracking-tight sm:text-[38px]">{title}</h1>
          <span className="mt-3 flex gap-1"><span className="h-1 w-12 bg-brand" /><span className="h-1 w-4 bg-gold" /></span>
          {sub && <p className="mt-2 max-w-3xl text-[15px] text-white/75">{sub}</p>}
          {children}
        </div>
      </section>
    </>
  );
}
