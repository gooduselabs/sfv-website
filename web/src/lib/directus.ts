// Thin Directus REST client for server components (ISR via fetch revalidate).
const API = process.env.DIRECTUS_URL || 'http://localhost:8055';
export const PUBLIC_API = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Item = Record<string, any>;
type Query = { fields?: string[]; filter?: object; sort?: string[]; limit?: number; search?: string; deep?: object; aggregate?: object; groupBy?: string[] };

function qs(q: Query) {
  const p = new URLSearchParams();
  if (q.fields) p.set('fields', q.fields.join(','));
  if (q.filter) p.set('filter', JSON.stringify(q.filter));
  if (q.sort) p.set('sort', q.sort.join(','));
  if (q.limit !== undefined) p.set('limit', String(q.limit));
  if (q.search) p.set('search', q.search);
  if (q.deep) p.set('deep', JSON.stringify(q.deep));
  return p.toString();
}
export async function get<T = Item>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const r = await fetch(API + path, { next: { revalidate, tags: ['directus'] } });
    if (!r.ok) return null;
    return (await r.json()).data as T;
  } catch {
    return null;
  }
}
export async function items(collection: string, q: Query = {}, revalidate = 60): Promise<Item[]> {
  return (await get<Item[]>(`/items/${collection}?${qs(q)}`, revalidate)) ?? [];
}
export async function one(collection: string, q: Query = {}): Promise<Item | null> {
  return (await items(collection, { ...q, limit: 1 }))[0] ?? null;
}
export async function single(collection: string, q: Query = {}): Promise<Item | null> {
  return get<Item>(`/items/${collection}?${qs(q)}`);
}
export const LANG = { vi: 'vi-VN', en: 'en-US' } as const;
/** Pick translation for locale with VI fallback. */
export function tr(item: Item | null | undefined, locale: string): Item {
  const list: Item[] = item?.translations ?? [];
  const code = LANG[locale as keyof typeof LANG] ?? 'vi-VN';
  return list.find((t) => t.languages_code === code) ?? list.find((t) => t.languages_code === 'vi-VN') ?? {};
}
export function asset(id: string | null | undefined, opts: { w?: number; h?: number; q?: number; fit?: string } = {}) {
  if (!id) return null;
  const p = new URLSearchParams({ format: 'webp', quality: String(opts.q ?? 78) });
  if (opts.w) p.set('width', String(opts.w));
  if (opts.h) p.set('height', String(opts.h));
  if (opts.fit) p.set('fit', opts.fit);
  return `${PUBLIC_API}/assets/${id}?${p}`;
}
export const fileUrl = (id?: string | null) => (id ? `${PUBLIC_API}/assets/${id}?download` : null);
export const T_FIELDS = 'translations.*';
export function fmtDate(d: string | null | undefined, locale: string, opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }) {
  if (!d) return '';
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', ...opts }).format(new Date(d));
}
export const nowIso = () => new Date().toISOString();
/** Public news filter: published or scheduled-in-the-past. */
export const newsFilter = () => ({ _and: [{ status: { _in: ['published', 'scheduled'] } }, { publish_date: { _lte: nowIso() } }] });
/** Paged list with total count (Directus meta=filter_count). */
export async function paged(collection: string, q: Query & { page: number; limit: number }): Promise<{ data: Item[]; total: number }> {
  try {
    const p = new URLSearchParams(qs(q)); p.set('page', String(q.page)); p.set('meta', 'filter_count');
    const r = await fetch(`${API}/items/${collection}?${p}`, { next: { revalidate: 60, tags: ['directus'] } });
    if (!r.ok) return { data: [], total: 0 };
    const j = await r.json(); return { data: j.data ?? [], total: j.meta?.filter_count ?? 0 };
  } catch { return { data: [], total: 0 }; }
}
