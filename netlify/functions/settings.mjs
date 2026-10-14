import { getPool, json, errorResponse } from "./_db.mjs";

const defaults = {
  companyName: "SENTHIL ANDAVAR INDUSTRIES",
  address: "",
  phone: "",
  email: "",
  website: "",
  gstNo: "",
  bankName: "",
  bankAccountNo: "",
  branch: "",
  ifscCode: "",
  terms: "",
  footerText: "",
  tinCstText: "",
  signatoryName: "",
  companyLogo: "",
  isoLogo: "",
  productImages: {
    "Grease Trap": [],
    "Oil Skimmer": [],
    Agitator: []
  },
  productImageSelections: {
    "Grease Trap": 0,
    "Oil Skimmer": 0,
    Agitator: 0
  },
  priceOverrides: {}
};

function mapSettings(row) {
  if (!row) return defaults;
  const parseImages = (value) => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [{ data: value, name: "Uploaded image" }];
    } catch {
      return [{ data: value, name: "Uploaded image" }];
    }
  };
  return {
    companyName: row.company_name || "",
    phone: row.phone || "",
    address: row.address || "",
    email: row.email || "",
    website: row.website || "",
    gstNo: row.gst_no || "",
    bankName: row.bank_name || "",
    bankAccountNo: row.bank_account_no || "",
    branch: row.branch || "",
    ifscCode: row.ifsc_code || "",
    terms: row.terms || "",
    footerText: row.footer_text || "",
    tinCstText: row.tin_cst_text || "",
    signatoryName: row.signatory_name || "",
    companyLogo: row.company_logo || "",
    isoLogo: row.iso_logo || "",
    productImages: {
      "Grease Trap": parseImages(row.grease_trap_image),
      "Oil Skimmer": parseImages(row.oil_skimmer_image),
      Agitator: parseImages(row.agitator_image)
    },
    productImageSelections: row.product_image_selections || {
      "Grease Trap": 0,
      "Oil Skimmer": 0,
      Agitator: 0
    },
    priceOverrides: row.price_overrides || {}
  };
}

export default async (req) => {
  const pool = getPool();
  try {
    if (req.method === "GET") {
      const result = await pool.query("SELECT * FROM company_settings WHERE id = 1");
      return json(mapSettings(result.rows[0]));
    }

    if (req.method === "PUT" || req.method === "POST") {
      const s = { ...defaults, ...(await req.json()) };
      const result = await pool.query(
        `INSERT INTO company_settings (
          id, company_name, phone, address, email, website, gst_no,
          bank_name, bank_account_no, branch, ifsc_code, terms,
          footer_text, tin_cst_text, signatory_name, company_logo, iso_logo, price_overrides,
          grease_trap_image, oil_skimmer_image, agitator_image, product_image_selections,
          updated_at
        ) VALUES (
          1,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,CURRENT_TIMESTAMP
        )
        ON CONFLICT (id) DO UPDATE SET
          company_name = EXCLUDED.company_name,
          phone = EXCLUDED.phone,
          address = EXCLUDED.address,
          email = EXCLUDED.email,
          website = EXCLUDED.website,
          gst_no = EXCLUDED.gst_no,
          bank_name = EXCLUDED.bank_name,
          bank_account_no = EXCLUDED.bank_account_no,
          branch = EXCLUDED.branch,
          ifsc_code = EXCLUDED.ifsc_code,
          terms = EXCLUDED.terms,
          footer_text = EXCLUDED.footer_text,
          tin_cst_text = EXCLUDED.tin_cst_text,
          signatory_name = EXCLUDED.signatory_name,
          company_logo = EXCLUDED.company_logo,
          iso_logo = EXCLUDED.iso_logo,
          price_overrides = EXCLUDED.price_overrides,
          grease_trap_image = EXCLUDED.grease_trap_image,
          oil_skimmer_image = EXCLUDED.oil_skimmer_image,
          agitator_image = EXCLUDED.agitator_image,
          product_image_selections = EXCLUDED.product_image_selections,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *`,
        [
          s.companyName, s.phone, s.address, s.email, s.website, s.gstNo,
          s.bankName, s.bankAccountNo, s.branch, s.ifscCode, s.terms,
          s.footerText, s.tinCstText, s.signatoryName, s.companyLogo, s.isoLogo,
          JSON.stringify(s.priceOverrides || {}),
          JSON.stringify(s.productImages?.["Grease Trap"] || []),
          JSON.stringify(s.productImages?.["Oil Skimmer"] || []),
          JSON.stringify(s.productImages?.Agitator || []),
          JSON.stringify(s.productImageSelections || {})
        ]
      );
      return json(mapSettings(result.rows[0]));
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (error) {
    return errorResponse(error);
  }
};
