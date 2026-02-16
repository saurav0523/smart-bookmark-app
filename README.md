# Smart Bookmark App

A private bookmark manager with **Google-only sign-in** and **real-time sync** across tabs. Built with Next.js (App Router), Supabase (Auth, Database, Realtime), and Tailwind CSS.

## Features

- **Google OAuth only** — no email/password
- **Add bookmarks** — URL + optional title
- **Private per user** — Row Level Security (RLS) so User A cannot see User B’s bookmarks
- **Real-time updates** — open two tabs, add a bookmark in one, it appears in the other without refresh
- **Delete** — remove your own bookmarks
- **Deployable on Vercel** — ready for a live URL

## Tech stack

- **Next.js** (App Router)
- **Supabase** — Auth (Google), Postgres, Realtime
- **Tailwind CSS** — styling

## Supabase setup (you do this, then add credentials)

The app needs a Supabase project and Google OAuth. Follow the step-by-step guide:

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** — create project, get URL/anon key, enable Google, run SQL for `bookmarks` table + RLS + Realtime.

When done, create `.env` or `.env.local` with your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign in with Google, and add bookmarks.

## Deploy on Vercel

1. Push the repo to GitHub (or connect your Git provider in Vercel).
2. In Vercel: **New Project** → import this repo.
3. Add **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.
5. In **Supabase** → Authentication → URL Configuration, add your Vercel URL to **Redirect URLs** (e.g. `https://your-app.vercel.app/**`).
6. In **Google Cloud Console**, add `https://your-app.vercel.app/auth/callback` to **Authorized redirect URIs** for your OAuth client.

Your live URL will be something like `https://smart-bookmark-app-xxx.vercel.app`.

---

## Notes (setup / issues)

- **Auth session:** Middleware must write cookies to the **response** (`setAll` on `NextResponse`), not just read from request. Otherwise refresh doesn’t persist.
- **Realtime:** Subscribe to `postgres_changes` on `bookmarks` and refetch on event. Add table to `supabase_realtime` publication in SQL.
- **Privacy:** RLS on `bookmarks` with `auth.uid() = user_id` on all policies.
- **OAuth after deploy:** Add production URL in Supabase Redirect URLs and in Google Console Authorized redirect URIs (`/auth/callback`).

---

## Project structure

```
src/
├── app/                    # Next.js routes & layouts
│   ├── auth/callback/      # OAuth callback
│   ├── auth/signout/       # Sign out
│   └── dashboard/          # Protected dashboard
├── frontend/               # Client-side only
│   ├── components/         # auth, bookmarks, dashboard nav
│   ├── hooks/              # use-bookmarks (fetch + realtime)
│   └── lib/supabase/       # Browser Supabase client
├── server/                 # Server-side only
│   └── supabase/           # Server client + middleware helper
├── types/
│   └── database.ts         # BookmarkRow, BookmarkInsert
└── middleware.ts           # Session refresh (must stay at src root)
```

Root: `SUPABASE_SETUP.md` for setup steps.

---

## License

MIT.
