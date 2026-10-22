// Show translated names (VI) instead of ids in Admin tables.
import { api } from './lib.mjs';
const M = { competitions: 'name', news: 'title', disciplines: 'name', pages: 'title', departments: 'name', board_members: 'position', news_categories: 'name', competition_events: 'name', athletes: 'bio', national_teams: 'name', documents: 'title', galleries: 'title', home_banners: 'title', site_settings: 'tagline' };
for (const [c, f] of Object.entries(M)) await api('PATCH', `/fields/${c}/translations`, { meta: { display: 'translations', display_options: { template: `{{${f}}}`, languageField: 'name', defaultLanguage: 'vi-VN', userLanguage: false } } });
console.log('display done');
