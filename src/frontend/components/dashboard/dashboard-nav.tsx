'use client';

import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { IconBookmark } from '@/frontend/components/icons';
import { SignOutModal } from '@/frontend/components/ui/sign-out-modal';

export function DashboardNav({ user }: { user: User }) {
  const [modalOpen, setModalOpen] = useState(false);
  const name = user.user_metadata?.full_name ?? user.email ?? 'User';
  const avatar = user.user_metadata?.avatar_url;

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <a
            href="/dashboard"
            className="flex items-center gap-2 text-stone-100 font-semibold transition hover:text-amber-400/90 cursor-pointer"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400">
              <IconBookmark className="w-4 h-4" />
            </span>
            Smart Bookmark
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm text-stone-400 hidden sm:inline truncate max-w-[140px] cursor-pointer py-2 px-1 rounded-lg hover:text-stone-300 hover:bg-stone-800/50 transition">
              {name}
            </span>
            {avatar ? (
              <span className="cursor-pointer rounded-full ring-2 ring-transparent hover:ring-stone-600 transition-all">
                <Image
                  src={avatar}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded-full border border-stone-700 w-8 h-8"
                />
              </span>
            ) : (
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-medium cursor-pointer ring-2 ring-transparent hover:ring-stone-600 transition-all">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="text-sm text-stone-500 hover:text-stone-300 hover:bg-stone-800/60 px-3 py-2 rounded-lg transition cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <SignOutModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
