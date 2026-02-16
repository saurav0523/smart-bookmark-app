'use client';

import { createClient } from '@/frontend/lib/supabase/client';
import { IconGoogle, IconSpinner } from '@/frontend/components/icons';
import { useTransition } from 'react';

export function SignInButton() {
  const [isPending, startTransition] = useTransition();

  const signIn = () => {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
    });
  };

  return (
    <button
      type="button"
      onClick={signIn}
      disabled={isPending}
      className="inline-flex items-center justify-center gap-3 min-w-[260px] px-6 py-3.5 rounded-xl font-semibold border border-stone-600/80 bg-stone-100 text-stone-900 shadow-md hover:bg-stone-200 hover:border-stone-500/80 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-900 active:translate-y-0 active:shadow-md transition-all duration-200 disabled:opacity-70 disabled:pointer-events-none disabled:translate-y-0 cursor-pointer select-none"
    >
      {isPending ? (
        <span className="flex items-center gap-2 text-stone-600">
          <IconSpinner className="h-5 w-5 animate-spin text-amber-500" />
          Signing in…
        </span>
      ) : (
        <>
          <IconGoogle className="h-5 w-5 shrink-0" />
          <span>Sign in with Google</span>
        </>
      )}
    </button>
  );
}
