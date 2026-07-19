# Cognitio+ Digital Wellbeing Ecosystem

Personalized mental-health and resilience platform for the Philippine context — serving
individuals, mental-health professionals, community leaders, and organizations.

## Stack

Vite 5 · React 18 · TypeScript (strict) · Tailwind CSS · shadcn/ui · Supabase
(Auth + Postgres + RLS + Storage) · Vitest · GitHub Actions

## Getting started

```bash
npm install
cp .env.example .env   # fill in your Supabase values (see table below)
npm run dev            # http://localhost:8080
```

### Environment variables

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Same page → `anon` `public` key |

The app **fails fast at startup** if either is missing. Never commit `.env`
(gitignored), and never put a `service_role` key in this client.

## Database

Two ways to set up — pick one:

| Situation | Use |
|---|---|
| **Fresh project** | Run `supabase/schema.sql` in the SQL Editor (complete reference schema: all tables, RLS, indexes, triggers, storage bucket, seed promos) |
| **Existing project with earlier migrations** | Apply `supabase/migrations/` in filename order (001 → 002 → 003) |

Schema overview (see `supabase/schema.sql` header for the full design):

- **Identity:** `cognitio_onboarding` (drafts + enrollments, session-scoped for
  anonymous users, user-scoped after sign-in), `profiles` (auto-provisioned from `auth.users`)
- **Verification:** `verification_documents` metadata + **private** `verification-docs`
  storage bucket (owner-folder access only, signed URLs)
- **Wellbeing:** `assessments`, `tracker_entries`, `habit_plans`, `habit_checkins`
- **Care:** `professionals` (verified directory), `appointments`
- **Engagement:** `growth_points_ledger` (+ balance view), `community_posts` (moderated, pseudonymous)
- **Billing & comms:** `subscriptions`, `promo_codes` (seeded), `crm_contacts` (consent-gated)
- **Audit:** `audit_log` (service-role only)

**Every table has RLS enabled + forced; users only ever see their own rows.**

## Authentication

Magic-link (passwordless) sign-in via Supabase Auth:

- `/auth` — request a link; new accounts are created on first use.
- On sign-in, the browser's anonymous onboarding draft is **claimed**
  (`claim_onboarding_draft` RPC) so nothing is lost.
- `/dashboard/:userType` requires a session and redirects to `/auth` otherwise.
- **Sign Out** ends the Supabase session and clears the local draft session.

Dashboard setup required in Supabase: Authentication → Providers → Email enabled;
Authentication → URL Configuration → Site URL = your domain (+ localhost:8080 for dev).

## Verification documents

User types that require documents (MHP, community, organization) must be signed in;
files upload to the private bucket at `<user.id>/<session>/<file>` and are recorded in
`verification_documents` for review. Files are only ever reachable via short-lived
signed URLs (`src/lib/verification.ts`).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server (port 8080) |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | ESLint (0 errors; stock shadcn fast-refresh warnings only) |
| `npm test` | Vitest unit tests (pricing engine + growing) |
| `npx tsc --noEmit -p tsconfig.app.json` | Type-check (strict mode) |

## CI

`.github/workflows/ci.yml` runs **lint → type-check → tests → production build** on
every push to `main` and every pull request. Do not merge red.

## Deployment

Optimized for Vercel (see `vercel.json`):

- SPA rewrites for `/onboarding`, `/auth`, `/dashboard/*`
- 301 redirects consolidating `www.` / `.net` / legacy `appimize.app` domains to the
  canonical `https://cognitio-plus.com`
- Set the two `VITE_SUPABASE_*` env vars in the project settings.

## Repository layout

```
src/                    React SPA
  pages/                Index (landing), Onboarding (6-step wizard), Dashboard, Auth
  components/           Landing sections, shadcn ui/, onboarding/ wizard parts
  lib/                  supabase client, pricing engine, verification storage, types
  hooks/                use-auth (session + draft claiming)
  data/                 journey/user-type data
public/
  *.html                Legacy content pages (aiwa assets vendored under vendor/)
  vendor/aiwaapp/       Previously hotlinked JS/CSS/fonts/images — now local
  icons/, og.jpg        PWA icons + social card
supabase/
  schema.sql            Complete reference schema (fresh installs)
  migrations/           Incremental migrations (001 RLS, 002 auth, 003 storage)
.github/workflows/      CI
```

## Contributing

1. Branch from `main` (`feat/…`, `fix/…`), open a PR, get CI green, request review.
2. No direct pushes to `main` (enable branch protection: require PR + status checks).
3. Write meaningful commit messages; one logical change per PR.

## License

MIT — see `LICENSE`.
