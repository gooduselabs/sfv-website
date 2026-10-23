// Official SFV logo (transparent PNG/WebP traced from owner-supplied artwork; design unaltered).
export function LogoMark({ className = 'h-10 w-auto' }: { className?: string }) {
  return <img src="/brand/sfv-mark-480.webp" alt="SFV" width={480} height={238} className={`object-contain ${className}`} />;
}
export function LogoFull({ className = 'h-16 w-auto' }: { className?: string }) {
  return <img src="/brand/sfv-logo-640.webp" alt="SFV – Skating Federation of Vietnam" width={640} height={382} className={`object-contain ${className}`} />;
}
/** Red swoosh arc echoing the logo's V-stroke (decorative). */
export function Swoosh({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 240" className={className} aria-hidden="true" preserveAspectRatio="none">
      <path d="M0 236C120 150 300 40 600 6c-250 40-430 140-560 234z" fill="currentColor" />
    </svg>
  );
}
export function Star({ className = 'h-3 w-3' }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path d="M12 1.5l3 7.1 7.6.6-5.8 5 1.8 7.4L12 17.6l-6.6 4 1.8-7.4-5.8-5 7.6-.6z" fill="currentColor" /></svg>;
}
export function Logo({ compact = false }: { dark?: boolean; compact?: boolean }) {
  return compact ? <LogoMark /> : <LogoFull className="h-12 w-auto" />;
}
