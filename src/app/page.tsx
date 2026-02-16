import { createClient } from '@/server/supabase/server';
import { redirect } from 'next/navigation';
import { SignInButton } from '@/frontend/components/auth/sign-in-button';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { error: queryError } = await searchParams;

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="bg-grid min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        {queryError === 'auth' && (
          <p className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3">
            Sign in failed. Try again.
          </p>
        )}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-8">
          <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-50 mb-3">
          Smart Bookmark
        </h1>
        <p className="text-stone-400 text-lg mb-10 max-w-sm mx-auto">
          Save your links privately. Syncs in real time across all your tabs and devices.
        </p>
        <SignInButton />
        <p className="text-stone-500 text-sm mt-8">
          No email/password — sign in with Google only.
        </p>
      </div>
    </div>
  );
}
