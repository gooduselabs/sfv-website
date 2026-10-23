// Custom Directus migration (MIGRATIONS_PATH=./migrations): indexes for ranking queries.
// On a fresh DB the collections don't exist yet at bootstrap (they're created later by setup-schema),
// so skip here; docker compose's `db-indexes` one-shot creates the same indexes after cms-init.
export async function up(knex) {
  if (!(await knex.schema.hasTable('results')) || !(await knex.schema.hasTable('competition_events'))) return;
  await knex.raw('CREATE INDEX IF NOT EXISTS results_event_idx ON results(event)');
  await knex.raw('CREATE INDEX IF NOT EXISTS results_athlete_idx ON results(athlete)');
  await knex.raw('CREATE INDEX IF NOT EXISTS competition_events_comp_idx ON competition_events(competition)');
}
export async function down(knex) {
  await knex.raw('DROP INDEX IF EXISTS results_event_idx; DROP INDEX IF EXISTS results_athlete_idx; DROP INDEX IF EXISTS competition_events_comp_idx');
}
