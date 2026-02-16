# Smart Bookmark App

A private bookmark manager with **Google-only sign-in** and **real-time sync** across tabs. Built with Next.js (App Router), Supabase (Auth, Database, Realtime), and Tailwind CSS.

## Features

- **Google OAuth only** — no email/password
- **Add bookmarks** — URL + optional title
- **Private bookmarks** — User A cannot see User B’s; each user sees only their own list (RLS + filter by `user_id`)
- **Real-time sync (same user, multiple tabs)** — open two tabs as the same user; add or remove a bookmark in one tab and the other tab’s list updates immediately, no refresh (sync is between your own sessions only, not across different users)
- **Delete your own** — user can delete only their own bookmarks
- **Deployable on Vercel** — ready for a live URL

## Tech stack

- **Next.js** (App Router)
- **Supabase** — Auth (Google), Postgres, Realtime
- **Tailwind CSS** — styling

## Supabase setup (you do this, then add credentials)

Create a Supabase project, enable Google OAuth, run SQL for `bookmarks` table + RLS. Get **Project URL** and **anon key** from Dashboard → Project Settings → API. Create `.env` or `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Enable real-time sync (Supabase Realtime)

Multi-tab sync uses **Supabase Realtime** (`postgres_changes`). Add the `bookmarks` table to the Realtime publication once (Supabase Dashboard → **SQL Editor**):

```sql
alter publication supabase_realtime add table public.bookmarks;
```

After this, when you add or delete a bookmark in one tab, other tabs of the same user get the event and refetch the list (no refresh). If you skip this step, the app still syncs across tabs via the browser’s `BroadcastChannel` (same origin only).

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
- **Realtime:** App subscribes to `postgres_changes` on `bookmarks`; run `alter publication supabase_realtime add table public.bookmarks;` so events are broadcast. Fallback: `BroadcastChannel` for same-origin tabs.
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


---

## License

MIT.
