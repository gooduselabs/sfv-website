'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Countdown } from './Countdown';

type Slide = { image: string | null; title: string; subtitle: string; area: string };
type Next = { name: string; date: string; slug: string; city: string } | null;
type L = { kicker: string; t1: string; t2: string; sub: string; c1: string; c2: string; next: string; units: [string, string, string, string] };

const FLAKES = Array.from({ length: 28 }, (_, i) => ({ left: (i * 37) % 100, size: 1 + ((i * 7) % 3), dur: 9 + ((i * 13) % 12), delay: -((i * 5) % 14) }));

export function Hero({ slides, next, l }: { slides: Slide[]; next: Next; l: L }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 160]);
  const o = useTransform(scrollY, [0, 500], [1, 0.2]);
  useEffect(() => { if (reduce || slides.length < 2) return; const t = setInterval(() => setI((x) => (x + 1) % slides.length), 6500); return () => clearInterval(t); }, [slides.length, reduce]);
  const s = slides[i];
  const roller = s?.area === 'roller';
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-navy-950 text-white">
      <motion.div style={{ y: reduce ? 0 : y }} className="absolute inset-0 -z-10">
        <AnimatePresence mode="sync">
          {s?.image && <motion.img key={s.image} src={s.image} alt="" className="kenburns absolute inset-0 h-full w-full object-cover" initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} exit={{ opacity: 0 }} transition={{ duration: 1.4 }} />}
        </AnimatePresence>
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/70 to-navy-950/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/50" />
      <div className={`absolute -right-40 top-1/4 -z-10 h-[40rem] w-[40rem] rounded-full blur-3xl transition-colors duration-1000 ${roller ? 'bg-neon-pink/25' : 'bg-ice-500/25'}`} />
      {!reduce && <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">{FLAKES.map((f, k) => <span key={k} className="flake" style={{ left: `${f.left}%`, width: f.size * 2, height: f.size * 2, opacity: 0.6, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} />)}</div>}
      {/* blade trails carving across the hero */}
      <svg className="absolute inset-0 -z-10 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="h-ice" x1="0" x2="1"><stop stopColor="#fff" stopOpacity="0" /><stop offset=".4" stopColor="#cfe4f6" /><stop offset="1" stopColor="#2f8ae0" stopOpacity="0" /></linearGradient>
          <linearGradient id="h-rol" x1="0" x2="1"><stop stopColor="#ff6a2b" stopOpacity="0" /><stop offset=".5" stopColor="#ff6a2b" /><stop offset="1" stopColor="#ff2f8e" stopOpacity="0" /></linearGradient>
        </defs>
        {[['M-40 700 C 300 520, 620 860, 960 600 S 1380 380, 1500 460', 'url(#h-ice)', 2.5, 0.2], ['M-40 740 C 320 560, 640 900, 980 640 S 1400 420, 1500 500', 'url(#h-ice)', 1, 0.5], ['M-60 820 C 380 700, 760 960, 1100 760 S 1400 640, 1500 690', 'url(#h-rol)', 2, 0.9]].map(([d, st, w, dl], k) => (
          <motion.path key={k} d={d as string} fill="none" stroke={st as string} strokeWidth={w as number} strokeLinecap="round" initial={reduce ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 2.4, delay: dl as number, ease: [0.65, 0, 0.35, 1] }} />
        ))}
      </svg>
      <motion.div style={{ opacity: reduce ? 1 : o }} className="container-x relative flex min-h-[100svh] flex-col justify-end gap-10 pb-14 pt-28 lg:flex-row lg:items-end lg:justify-between lg:pb-24">
        <div className="max-w-3xl">
          <motion.p initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-ice-200">
            <span className="h-px w-10 bg-gradient-to-r from-ice-300 to-neon-pink" />{l.kicker}
          </motion.p>
          <h1 className="font-display mt-6 text-[13vw] font-extrabold leading-[0.92] sm:text-7xl lg:text-[6.5rem]">
            <motion.span className="block" initial={reduce ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>{l.t1}</motion.span>
            <motion.span className={`block ${roller ? 'text-gradient-roller' : 'text-gradient-ice'} transition-all`} initial={reduce ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}>{l.t2}</motion.span>
          </h1>
          <AnimatePresence mode="wait">
            <motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-6 max-w-xl text-base text-white/75 sm:text-lg">
              <span className="font-semibold text-white">{s?.title}</span> {s?.subtitle}
            </motion.p>
          </AnimatePresence>
          <p className="mt-2 max-w-xl text-sm text-white/55">{l.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/competitions" className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy-950 transition hover:bg-ice-100">{l.c1}<ArrowRight size={16} className="transition group-hover:translate-x-1" /></Link>
            <Link href="/results" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/10">{l.c2}</Link>
          </div>
          <div className="mt-10 flex gap-2">{slides.map((_, k) => <button key={k} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className={`h-1 rounded-full transition-all ${k === i ? 'w-10 bg-white' : 'w-4 bg-white/30'}`} />)}</div>
        </div>
        {next && (
          <motion.div initial={reduce ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="frost-dark w-full max-w-sm rounded-3xl p-5 shadow-2xl shadow-black/40">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-neon-orange">{l.next}</p>
            <Link href={`/competitions/${next.slug}`} className="font-display mt-2 block text-xl font-semibold leading-snug hover:underline">{next.name}</Link>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-white/60"><MapPin size={14} />{next.city}</p>
            <div className="mt-4"><Countdown to={next.date} labels={l.units} /></div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
