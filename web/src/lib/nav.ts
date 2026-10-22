export const HREF: Record<string, string> = { home: '/', about: '/about', disciplines: '/disciplines', competitions: '/competitions', results: '/results', records: '/records', athletes: '/athletes', teams: '/teams', clubs: '/clubs', news: '/news', documents: '/documents', gallery: '/gallery', register: '/register', contact: '/contact', search: '/search' };

/** VFF-style main menu. Labels are i18n keys under `menu.*`. */
export type MenuItem = { key: string; href: string; children?: { key: string; href: string }[] };
export const MENU: MenuItem[] = [
  { key: 'about', href: '/about', children: [{ key: 'history', href: '/about#history' }, { key: 'board', href: '/about#board' }, { key: 'departments', href: '/about#departments' }, { key: 'disciplines', href: '/disciplines' }, { key: 'contact', href: '/contact' }] },
  { key: 'news', href: '/news', children: [{ key: 'cat_hoat-dong', href: '/news?category=hoat-dong' }, { key: 'cat_thong-bao', href: '/news?category=thong-bao' }, { key: 'cat_truot-bang', href: '/news?category=truot-bang' }, { key: 'cat_roller', href: '/news?category=roller' }, { key: 'cat_quoc-te', href: '/news?category=quoc-te' }] },
  { key: 'teams', href: '/teams' },
  { key: 'national', href: '/competitions?level=national', children: [{ key: 'calendar', href: '/competitions' }, { key: 'register', href: '/register' }] },
  { key: 'international', href: '/competitions?level=international', children: [{ key: 'cat_quoc-te', href: '/news?category=quoc-te' }] },
  { key: 'results', href: '/results', children: [{ key: 'ranking', href: '/results' }, { key: 'records', href: '/records' }] },
  { key: 'athletes', href: '/athletes' },
  { key: 'clubs', href: '/clubs' },
  { key: 'training', href: '/news?category=dao-tao' },
  { key: 'documents', href: '/documents', children: [{ key: 'doc_regulation', href: '/documents?category=regulation' }, { key: 'doc_rulebook', href: '/documents?category=rulebook' }, { key: 'doc_form', href: '/documents?category=form' }, { key: 'doc_decision', href: '/documents?category=decision' }] },
  { key: 'gallery', href: '/gallery', children: [{ key: 'photos', href: '/gallery#photos' }, { key: 'videos', href: '/gallery#videos' }] },
];
