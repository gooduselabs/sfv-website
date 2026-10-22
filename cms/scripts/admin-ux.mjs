import { api } from './lib.mjs';
for (const c of ['registrations','news','pages','home_banners','competitions']) await api('PATCH', `/fields/${c}/status`, { schema: { default_value: c === 'registrations' ? 'pending' : 'draft' } });
// nicer admin: display templates
const tpl = { news: '{{translations.title}}', competitions: '{{translations.name}}', athletes: '{{full_name}}', clubs: '{{name}}', disciplines: '{{translations.name}}', competition_events: '{{code}}', registrations: '{{athlete_name}} – {{status}}', results: '{{rank}}. {{athlete.full_name}}', national_teams: '{{translations.name}}', departments: '{{translations.name}}', board_members: '{{name}}', galleries: '{{translations.title}}', documents: '{{translations.title}}', news_categories: '{{translations.name}}', sponsors: '{{name}}', pages: '{{slug}}', home_banners: '{{translations.title}}' };
const groups = { Content: ['news','news_categories','pages','home_banners','galleries','documents','sponsors'], Competition: ['competitions','competition_events','results','registrations','national_records','athletes','national_teams','national_team_members'], Federation: ['disciplines','clubs','departments','board_members','site_settings','languages'] };
for (const [c, t] of Object.entries(tpl)) await api('PATCH', `/collections/${c}`, { meta: { display_template: t } });
let i = 0; for (const [g, list] of Object.entries(groups)) for (const c of list) await api('PATCH', `/collections/${c}`, { meta: { sort: i++ } });
console.log('ok');
