import type { ReactNode } from 'react';
export function PageHeader({ kicker, title, sub, area = 'ice', image, children }: { kicker?: string; title: string; sub?: string; area?: 'ice' | 'roller'; image?: string | null; children?: ReactNode }) {
  const roller = area === 'roller';
  return (
    <section className={`relative overflow-hidden pb-14 pt-32 text-white sm:pb-20 sm:pt-40 ${roller ? 'bg-roller' : 'bg-navy-900'}`}>
      {image && <img src={image} alt="" className="kenburns absolute inset-0 h-full w-full object-cover opacity-35" />}
      <div className={`absolute inset-0 ${roller ? 'bg-gradient-to-t from-navy-950 via-navy-950/70 to-transparent' : 'bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/20'}`} />
      <div className="scratch absolute inset-0" />
      <svg className="absolute -bottom-px left-0 w-full text-ice-50" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 60V30c240 28 480 30 720 10s480-24 720 6v14z" fill="currentColor" /></svg>
      <div className="container-x relative">
        {kicker && <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${roller ? 'text-neon-orange' : 'text-ice-300'}`}>{kicker}</p>}
        <h1 className="font-display mt-3 max-w-4xl text-4xl font-bold leading-[1.05] sm:text-6xl">{title}</h1>
        {sub && <p className="mt-4 max-w-2xl text-base text-white/70 sm:text-lg">{sub}</p>}
        {children}
      </div>
    </section>
  );
}
