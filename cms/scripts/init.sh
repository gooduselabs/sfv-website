#!/bin/sh
# One-shot init: apply schema snapshot, roles/permissions, admin UX, demo seed.
set -e
cd "$(dirname "$0")/.."
URL=${DIRECTUS_URL:-${PUBLIC_URL:-http://localhost:8055}}
echo "waiting for Directus at $URL"; until wget -qO- "$URL/server/ping" >/dev/null 2>&1 || curl -sf "$URL/server/ping" >/dev/null 2>&1; do sleep 2; done
if [ -z "$SKIP_SCHEMA" ]; then npx directus schema apply --yes ./schema/snapshot.yaml || node scripts/setup-schema.mjs; fi
node scripts/setup-roles.mjs
node scripts/admin-ux.mjs
node scripts/admin-presets.mjs
node scripts/admin-display.mjs
[ -n "$SKIP_SEED" ] || node scripts/seed.mjs
