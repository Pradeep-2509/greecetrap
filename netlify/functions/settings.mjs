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
  isoLogo: ""
};

function mapSettings(row) {
  if (!row) return defaults;
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
    isoLogo: row.iso_logo || ""
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
          footer_text, tin_cst_text, signatory_name, company_logo, iso_logo,
          updated_at
        ) VALUES (
          1,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,CURRENT_TIMESTAMP
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
          updated_at = CURRENT_TIMESTAMP
        RETURNING *`,
        [
          s.companyName, s.phone, s.address, s.email, s.website, s.gstNo,
          s.bankName, s.bankAccountNo, s.branch, s.ifscCode, s.terms,
          s.footerText, s.tinCstText, s.signatoryName, s.companyLogo, s.isoLogo
        ]
      );
      return json(mapSettings(result.rows[0]));
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (error) {
    return errorResponse(error);
  }
};
