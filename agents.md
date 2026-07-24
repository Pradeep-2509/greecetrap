# AGENTS.md

## Architecture

This is a static, framework-free site (HTML/CSS/vanilla JS) meant for Netlify's static hosting. There is no server, no build step, and no bundler — every `.js`/`.css` file is served as-is.

Persistence is entirely client-side via `localStorage` (see `assets/js/storage.js`). There is no Netlify Function or database involved; all data lives in the visitor's browser.

## Key directories/files

- `index.html`, `create-offer.html`, `settings.html`, `offer-pdf.html` — the four pages, each self-contained with its own `<script>` includes
- `assets/css/style.css` — shared UI styling for the dashboard/form pages
- `assets/css/pdf.css` — print-specific styling for the two-page A4 offer layout (`@page`, `@media print`)
- `assets/js/data.js` — hardcoded catalogue of the 10 Oil & Grease Trap products (capacity, size, M.S price, SS304 price) and the `getUnitPrice(capacity, material)` lookup
- `assets/js/storage.js` — `Storage` object wrapping `localStorage` reads/writes for offers (`sai_offers`) and company settings (`sai_company_settings`), plus `DEFAULT_SETTINGS`
- `assets/js/toast.js` — shared `formatCurrency()` and `showToast()` helpers, included on every page that needs them
- `assets/js/dashboard.js`, `create-offer.js`, `settings.js`, `pdf.js` — per-page logic

## Conventions

- Each HTML page loads only the JS files it needs, in dependency order (e.g. `data.js` and `storage.js` before the page-specific script). If you add a script that calls `formatCurrency`/`showToast`, include `toast.js` before it.
- Offer IDs are generated as `SAI/<year>/<sequence>` via `Storage.nextOfferId()`.
- Currency is always rendered with `formatCurrency()`, which appends `/-` to match the source document's Indian-invoice style.
- Company logo and ISO logo uploads are converted to Base64 data URLs client-side (`FileReader.readAsDataURL`) and stored directly in `DEFAULT_SETTINGS`/`Storage.saveSettings` — there is no separate object storage.

## Non-obvious decisions

- `offer-pdf.html` renders both offer pages into a single scrollable DOM (`#pdfRoot`) with two `.a4-page` divs; `@media print` forces a page break between them via `page-break-after`. This means "Download" and "View" both open the same page — "Download" just also triggers `window.print()` on load via a `?print=1` query param.
- The 10 product capacities and their M.S/SS304 prices in `assets/js/data.js` are fixed business data from the source offer-letter template — do not treat them as placeholder/sample data.
