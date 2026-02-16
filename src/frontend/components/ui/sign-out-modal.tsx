'use client';

import { useEffect } from 'react';

type SignOutModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SignOutModal({ open, onClose }: SignOutModalProps) {
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [open, onClose]);

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
        onClick={onClose}
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
            className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition cursor-pointer"
          >
            Cancel
          </button>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 font-medium transition cursor-pointer"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
