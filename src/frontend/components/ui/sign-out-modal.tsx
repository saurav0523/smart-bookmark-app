'use client';

import { useEffect, useRef, useState } from 'react';
import { IconSpinner } from '@/frontend/components/icons';

type SignOutModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SignOutModal({ open, onClose }: SignOutModalProps) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && !loading && onClose();
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [open, onClose, loading]);

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    formRef.current?.submit();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signout-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        onClick={loading ? undefined : onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-stone-700 bg-stone-900 shadow-xl p-6">
        <h2 id="signout-title" className="text-lg font-semibold text-stone-100 mb-1">
          Sign out?
        </h2>
        <p className="text-sm text-stone-400 mb-6">You can sign in again anytime with Google.</p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <form ref={formRef} action="/auth/signout" method="post">
            <button
              type="submit"
              onClick={handleSignOut}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 min-w-[100px] px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 font-medium transition cursor-pointer disabled:opacity-90 disabled:cursor-wait"
            >
              {loading ? (
                <>
                  <IconSpinner className="h-4 w-4 animate-spin" />
                  Signing out…
                </>
              ) : (
                'Sign out'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
