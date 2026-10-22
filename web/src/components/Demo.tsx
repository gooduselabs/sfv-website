export function DemoBadge({ show = true, className = '' }: { show?: boolean; className?: string }) {
  if (!show) return null;
  return <span title="Dữ liệu mẫu / Sample data" className={`tag bg-amber-300/90 text-amber-950 ${className}`}>Demo</span>;
}
