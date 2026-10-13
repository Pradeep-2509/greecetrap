CREATE TABLE IF NOT EXISTS company_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  email VARCHAR(255),
  website VARCHAR(255),
  gst_no VARCHAR(100),
  bank_name VARCHAR(255),
  bank_account_no VARCHAR(100),
  branch VARCHAR(255),
  ifsc_code VARCHAR(50),
  terms TEXT,
  footer_text TEXT,
  tin_cst_text TEXT,
  signatory_name VARCHAR(255),
  company_logo TEXT,
  iso_logo TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offers (
  id BIGSERIAL PRIMARY KEY,
  offer_number VARCHAR(100) UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  grand_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  offer_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offer_items (
  id BIGSERIAL PRIMARY KEY,
  offer_id BIGINT NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  capacity VARCHAR(255),
  size VARCHAR(255),
  shaft_material VARCHAR(100),
  inlet_outlet VARCHAR(255),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_offer_items_offer_id ON offer_items(offer_id);
CREATE INDEX IF NOT EXISTS idx_offers_created_at ON offers(created_at DESC);

INSERT INTO company_settings (
  id, company_name, address, phone, email, website, gst_no,
  bank_name, bank_account_no, branch, ifsc_code, terms,
  footer_text, tin_cst_text, signatory_name, company_logo, iso_logo
)
VALUES (
  1,
  'SENTHIL ANDAVAR INDUSTRIES',
  'No. 1, Industrial Estate, Coimbatore - 641 001, Tamil Nadu',
  '+91 98765 43210',
  'info@senthilandavar.com',
  'www.senthilandavar.com',
  '33AAAAA0000A1Z5',
  'State Bank of India',
  '1234567890',
  'Coimbatore Main Branch',
  'SBIN0001234',
  E'1. Payment: 50% advance along with order, balance before delivery.\n2. Delivery: Within 15-20 working days from the date of order confirmation.\n3. Taxes: GST as applicable extra.\n4. Warranty: 1 year against manufacturing defects.\n5. Installation & commissioning charges extra, if applicable.\n6. Prices are valid for 30 days from the date of this offer.',
  'Manufacturers of: Oil & Grease Traps | Bio Digesters | STP & ETP Equipment | Water Treatment Plants',
  'TIN No: 33123456789 | CST No: 33987654321',
  'SUGANYA S',
  '',
  ''
)
ON CONFLICT (id) DO NOTHING;
