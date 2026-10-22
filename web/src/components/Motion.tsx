'use client';
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export function Reveal({ children, delay = 0, className = '', y = 24 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setV(to); return; }
    const c = animate(0, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to, reduce]);
  return <span ref={ref}>{v.toLocaleString('vi-VN')}{suffix}</span>;
}

/** Skate-blade trail: an SVG path that "carves" down the page as you scroll. */
export function BladeTrail() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const len = useTransform(p, [0, 1], [0.02, 1]);
  return (
    <svg className="pointer-events-none fixed inset-y-0 right-0 z-0 hidden h-screen w-[180px] opacity-70 lg:block" viewBox="0 0 180 1000" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="trail" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6aaee6" /><stop offset=".55" stopColor="#2f8ae0" /><stop offset=".8" stopColor="#ff6a2b" /><stop offset="1" stopColor="#ff2f8e" /></linearGradient>
      </defs>
      <motion.path d="M150 0 C 40 120, 170 260, 90 380 S 20 620, 120 720 S 160 900, 60 1000" fill="none" stroke="url(#trail)" strokeWidth="2.2" strokeLinecap="round" style={{ pathLength: reduce ? 1 : len }} />
      <motion.path d="M158 0 C 48 120, 178 260, 98 380 S 28 620, 128 720 S 168 900, 68 1000" fill="none" stroke="url(#trail)" strokeWidth="0.8" strokeLinecap="round" opacity=".5" style={{ pathLength: reduce ? 1 : len }} />
    </svg>
  );
}

export function Parallax({ children, speed = 0.15, className = '' }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y: reduce ? 0 : y }} className="h-[120%] -mt-[10%]">{children}</motion.div>
    </div>
  );
}

/** Animated carve line used as section divider. */
export function CarveLine({ color = 'ice' }: { color?: 'ice' | 'roller' }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 600 40" className="h-8 w-40 sm:w-56" aria-hidden="true">
      <motion.path d="M2 30 C 120 -6, 260 44, 380 18 S 560 6, 598 22" fill="none" stroke={color === 'ice' ? '#2f8ae0' : 'url(#cv-r)'} strokeWidth="3" strokeLinecap="round" initial={reduce ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: 'easeInOut' }} />
      <defs><linearGradient id="cv-r"><stop stopColor="#ff6a2b" /><stop offset="1" stopColor="#ff2f8e" /></linearGradient></defs>
    </svg>
  );
}
