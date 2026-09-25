ALTER TABLE company_settings
  ADD COLUMN IF NOT EXISTS price_overrides JSONB NOT NULL DEFAULT '{}'::jsonb;
