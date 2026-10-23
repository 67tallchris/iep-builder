-- IEP Builder D1 schema
-- Apply locally:  npx wrangler d1 execute iep-builder-db --file schema.sql --local
-- Apply remotely: npx wrangler d1 execute iep-builder-db --file schema.sql --remote

CREATE TABLE IF NOT EXISTS examples (
  id TEXT PRIMARY KEY,
  title TEXT,
  grade INTEGER,
  grade_band TEXT,
  az_category TEXT,
  document_type TEXT,
  has_behavior_plan INTEGER DEFAULT 0,
  payload TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS snippets (
  id TEXT PRIMARY KEY,
  component TEXT,
  category TEXT,
  grade_band TEXT,
  text TEXT NOT NULL,
  payload TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_snippets_component ON snippets(component);
CREATE INDEX IF NOT EXISTS idx_examples_category ON examples(az_category);
CREATE INDEX IF NOT EXISTS idx_examples_band ON examples(grade_band);

CREATE TABLE IF NOT EXISTS drafts (
  id TEXT PRIMARY KEY,
  title TEXT,
  grade_band TEXT,
  category TEXT,
  payload TEXT NOT NULL,
  edit_token TEXT NOT NULL,
  shared INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_drafts_updated ON drafts(updated_at);
