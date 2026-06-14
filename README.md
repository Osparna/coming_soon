# Osparna — coming soon

Static coming-soon page with server-side email capture into Supabase.

## Structure
```
/
├─ index.html        dark landing page + email form (posts to /api/subscribe)
├─ logo.png          ADD THIS: transparent white-wordmark (dark-bg) logo
├─ package.json      dependency: postgres
└─ api/
   └─ subscribe.js   Vercel serverless function -> inserts into waitlist_signups
```

## Data
- Table: `public.waitlist_signups` (email, contacted boolean default false, id, created_at)
- Writer role: `waitlist_writer` — INSERT-only on that one table, nothing else. RLS on.
- `contacted` is internal only; never publicly displayed.

## Deploy (Vercel)
1. Add your logo to the repo root as `logo.png` (or update the src in index.html).
2. Set the role password in the Supabase SQL editor:
   `alter role waitlist_writer with password '<<strong-password>>';`
3. In Vercel -> Settings -> Environment Variables add:
   `WAITLIST_DB_URL` = the Transaction pooler connection string (Supabase -> Connect),
   with user `waitlist_writer` and the password above.
4. Deploy. Vercel installs `postgres` and serves /api/subscribe automatically.

The browser never sees a Supabase credential — the page only calls /api/subscribe,
which connects as the insert-only role.
