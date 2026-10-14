ALTER TABLE company_settings
  ADD COLUMN IF NOT EXISTS grease_trap_image TEXT,
  ADD COLUMN IF NOT EXISTS oil_skimmer_image TEXT,
  ADD COLUMN IF NOT EXISTS agitator_image TEXT,
  ADD COLUMN IF NOT EXISTS product_image_selections JSONB NOT NULL DEFAULT '{}'::jsonb;
