# Kavya Labs (ANDP Simulator · Level 1)

Kavya Labs is a fictional Bengaluru AI startup building an AI back-office for Indian small businesses. Founder Rohan Mehta gave three weekly briefs before the investor demo:

| Week | Brief | What shipped |
|---|---|---|
| 1 | Landing page: hero, features, footer | Hero with product chat mock, features, how it works, testimonial, pricing, FAQ, waitlist, footer |
| 2 | User authentication: NextAuth + Google OAuth | Google sign-in, `/login`, protected `/dashboard`, signed-in navbar, sign-out, suspended-account handling |
| 3 | Admin dashboard: user management + analytics | `/admin` analytics, `/admin/users` management, CSV export, audit log, public `/admin/demo` preview |

## Week 2: Authentication

- **Auth.js (NextAuth v5) with the Google provider.** Sign-in is a server action, so there's no client-side auth code.
- **Postgres adapter with database sessions.** Users, accounts and sessions are stored in Postgres. Because sessions live in the database, suspending or deleting a user signs them out on their next request.
- **Protected routes.** `/dashboard` and `/admin` are checked on the server (`src/lib/session.ts`). Signed-out visitors go to `/login?callbackUrl=…`. Members who open `/admin` go back to their dashboard with a notice.
- **Roles.** Every user is a `user` or an `admin`. Emails listed in `ADMIN_EMAILS` become admins on their first sign-in.
- **Safe redirects.** `callbackUrl` only accepts local paths, so the login page can't be used as an open redirect.
- **Error handling.** Readable messages on `/login` for suspended accounts, denied access and configuration errors.
- **Dashboard.** Profile (Google photo, role, member since, last sign-in, sign-in count) and an onboarding checklist.

## Week 3: Admin dashboard

**Analytics (`/admin`)**
- KPIs: total users, new this week, active in the last 7 days, sign-ins in 30 days, waitlist size and waitlist → account conversion
- Daily charts of sign-ups and sign-ins for the last 30 days, in IST, with zero-filled days, hover tooltips and a table view
- Recent activity feed combining new sign-ups and admin actions, plus admin and suspended counts

**User management (`/admin/users`)**
- Search by name or email, filter by role and status, paginate 20 at a time
- Make or remove admin, suspend or reactivate, delete (asks for a second click to confirm)
- Admins can't change, suspend or delete their own account, so nobody can lock themselves out
- Every change runs in a transaction with a row in `admin_actions` (the audit log)
- **Export CSV**, with cells escaped so names can't run as spreadsheet formulas

**Demo (`/admin/demo`)**: the same components with sample data and every action disabled, so the dashboard can be shown in the investor demo without an admin login.

The Week 1 waitlist form now saves to Postgres and has a loading state; those signups feed the analytics.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- Auth.js v5 (`next-auth@beta`) + `@auth/pg-adapter`
- Postgres (Neon in production) via `pg`, schema in `db/schema.sql`
- Playwright end-to-end tests

## Project structure

```
src/app/            page.tsx (landing) · login/ · dashboard/ · admin/ (overview, users, export, demo, actions.ts) · api/
src/auth.ts         Auth.js config: Google provider, adapter, role + suspension callbacks, login events
src/lib/            db.ts · session.ts (guards) · analytics.ts · users.ts · format.ts · demo-data.ts
src/components/     landing sections · auth/ (buttons, header, avatar) · admin/ (charts, tables, actions)
db/schema.sql       idempotent schema, applied automatically before every build
tests/e2e.mjs       end-to-end suite (46 checks)
```

## Run locally

```bash
cp .env.example .env.local   # fill in DATABASE_URL, AUTH_SECRET, Google keys, ADMIN_EMAILS
npm install
npm run db:migrate
npm run dev                  # http://localhost:3000
```

**Google OAuth setup:** Google Cloud Console → APIs & Services → Credentials → OAuth client ID (Web application). Add the authorised redirect URI `http://localhost:3000/api/auth/callback/google`, plus the same path on your production domain.

## Tests

```bash
npm run build && npm start   # in one terminal
npm run test:e2e             # in another (uses DATABASE_URL from .env.local; it wipes that database)
```

The 46 checks cover the waitlist (validation, saving, duplicates), redirects for signed-out users and members, the Google sign-in redirect, the dashboard, KPI and chart numbers against the database, search and filters, every admin action (promote, demote, suspend with forced sign-out, reactivate, two-step delete), the audit log, CSV export and member access to it, the read-only demo, no sideways scroll at 375px, and no console errors.

## Deploy

Import the repo into Vercel and set `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` and `ADMIN_EMAILS`. The build runs the migration first, so the schema is always current.
