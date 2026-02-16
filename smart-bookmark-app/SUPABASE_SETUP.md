# Supabase Setup Guide for Smart Bookmark App

Follow these steps to create your Supabase project and get the credentials. Once done, add the values to `.env.local` and you're ready to run the app.

---

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create an account).
2. Click **New Project**.
3. Fill in:
   - **Name**: e.g. `smart-bookmark-app`
   - **Database Password**: Choose a strong password and **save it** (you may need it later).
   - **Region**: Pick the one closest to you.
4. Click **Create new project** and wait until the project is ready.

---

## Step 2: Get Your API Keys and URL

1. In the Supabase dashboard, open your project.
2. Go to **Project Settings** (gear icon in the left sidebar).
3. Click **API** in the left menu.
4. You will see:
   - **Project URL** (e.g. `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
   - **service_role** key (optional; we use only **anon** for this app)

Copy the **Project URL** and the **anon public** key. You will paste these into `.env.local`.

---

## Step 3: Enable Google OAuth

1. In the Supabase dashboard, go to **Authentication** → **Providers**.
2. Find **Google** and turn it **ON**.
3. You need a Google OAuth Client:
   - Go to [Google Cloud Console](https://console.cloud.google.com/).
   - Create a project (or select one) → **APIs & Services** → **Credentials**.
   - Click **Create Credentials** → **OAuth client ID**.
   - Application type: **Web application**.
   - Add **Authorized redirect URIs**:
     - For local dev: `http://localhost:3000/auth/callback`
     - For production: `https://YOUR_VERCEL_DOMAIN.vercel.app/auth/callback`
   - Copy the **Client ID** and **Client Secret**.
4. Back in Supabase (Google provider settings), paste:
   - **Client ID** (from Google)
   - **Client Secret** (from Google)
5. Click **Save**.

---

## Step 4: Create the Bookmarks Table

1. In Supabase, go to **SQL Editor**.
2. Click **New query** and run the following SQL (this creates the table and RLS so bookmarks are private per user):

```sql
-- Table: bookmarks (private per user)
create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  title text not null,
  created_at timestamptz not null default now()
);

-- Index for fast lookups by user
create index bookmarks_user_id_idx on public.bookmarks(user_id);

-- Enable Row Level Security (RLS)
alter table public.bookmarks enable row level security;

-- Users can only read/insert/update/delete their own bookmarks
create policy "Users can read own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own bookmarks"
  on public.bookmarks for update
  using (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Enable Realtime for this table (so other tabs get updates)
alter publication supabase_realtime add table public.bookmarks;
```

3. Click **Run**. You should see "Success. No rows returned."

---

## Step 5: Create Your Local Environment File

1. In the project root, copy the example env file:
   - Copy `.env` to `.env.local` (or edit `.env` with your values).
2. Open `.env.local` and set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace:
- `YOUR_PROJECT_REF` and the full URL with your **Project URL** from Step 2.
- `your_anon_key_here` with your **anon public** key from Step 2.

3. Save the file. Do not commit `.env.local` to git.

---

## Step 6: Production (Vercel) – Redirect URL

After you deploy to Vercel:

1. In Supabase: **Authentication** → **URL Configuration**.
2. Add your production URL to **Redirect URLs**, e.g.:
   - `https://your-app.vercel.app/**`
3. In Google Cloud Console, add the same URL to **Authorized redirect URIs**:
   - `https://your-app.vercel.app/auth/callback`

---

## Summary Checklist

- [ ] Supabase project created  
- [ ] Project URL and anon key copied into `.env.local`  
- [ ] Google provider enabled in Supabase with Client ID and Secret  
- [ ] `bookmarks` table and RLS policies created (SQL above)  
- [ ] Realtime enabled for `bookmarks` (included in SQL)  
- [ ] For production: redirect URLs set in Supabase and Google  

Once these are done, run `npm run dev` and sign in with Google to use the app.
