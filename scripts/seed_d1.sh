#!/usr/bin/env bash
# Apply schema + seed to D1 (local or remote).
# Usage: ./scripts/seed_d1.sh local|remote
set -euo pipefail
cd "$(dirname "$0")/.."

MODE="${1:-local}"
python3 scripts/prepare_data.py

if [ "$MODE" = "remote" ]; then
  npx wrangler d1 execute iep-builder-db --file schema.sql --remote
  npx wrangler d1 execute iep-builder-db --file seed.sql --remote
else
  npx wrangler d1 execute iep-builder-db --file schema.sql --local
  npx wrangler d1 execute iep-builder-db --file seed.sql --local
fi
echo "D1 seed complete ($MODE)."
