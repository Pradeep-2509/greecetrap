# Netlify Database deployment

This version replaces browser localStorage with Netlify Database (Postgres).

## What was added
- `netlify/database/migrations/0001_initial_schema.sql`
- `netlify/functions/offers.mjs`
- `netlify/functions/settings.mjs`
- `netlify/functions/_db.mjs`
- `package.json`

## Database tables
- `company_settings`
- `offers`
- `offer_items`

## Deploy
1. Keep the existing Netlify Database enabled for this site.
2. Deploy this whole project as a repository/build-based deploy so Netlify can install npm dependencies and deploy Functions.
3. Netlify Database migrations in `netlify/database/migrations` are applied by Netlify during the deploy lifecycle.
4. After the deploy succeeds, open Database > production and verify the three tables.
5. Open Company Settings and save your real company/bank/PDF details.
6. Create a test offer.
7. Return to Database > production and confirm rows appear in `offers` and `offer_items`.

Do not paste a database connection string into browser JavaScript.
