'use client';

import type { User } from '@supabase/supabase-js';
import Image from 'next/image';

export function DashboardNav({ user }: { user: User }) {
  const name = user.user_metadata?.full_name ?? user.email ?? 'User';
  const avatar = user.user_metadata?.avatar_url;

  return (
    <header className="sticky top-0 z-10 border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-md">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <a href="/dashboard" className="flex items-center gap-2 text-stone-100 font-semibold">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>
          </span>
          Smart Bookmark
        </a>
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-400 hidden sm:inline truncate max-w-[140px]">
            {name}
          </span>
          {avatar ? (
            <Image
              src={avatar}
              alt=""
              width={32}
              height={32}
              className="rounded-full border border-stone-700 w-8 h-8"
            />
          ) : (
            <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-medium">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-sm text-stone-500 hover:text-stone-300 transition"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
