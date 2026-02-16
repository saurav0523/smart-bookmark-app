'use client';

import { useState } from 'react';
import type { BookmarkRow } from '@/types/database';

function hostname(url: string) {
  try { return new URL(url).hostname; } catch { return url; }
}

export function BookmarkCard({
  bookmark,
  currentUserId,
  onDelete,
}: {
  bookmark: BookmarkRow;
  currentUserId: string | null;
  onDelete: (id: string) => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);
  const isOwn = currentUserId === bookmark.user_id;

  const onDeleteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (deleting || !isOwn) return;
    setDeleting(true);
    try {
      await onDelete(bookmark.id);
    } finally {
      setDeleting(false);
    }
  };

  const title = bookmark.title || hostname(bookmark.url) || 'Untitled';

  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-stone-700/80 bg-stone-900/40 p-4 hover:border-amber-500/30 hover:bg-stone-800/40 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-stone-100 truncate group-hover:text-amber-400/90 transition">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="font-mono text-sm text-stone-500 truncate">
              {hostname(bookmark.url)}
            </p>
            {bookmark.owner_email && (
              <span className="text-xs text-stone-600">· {bookmark.owner_email}</span>
            )}
          </div>
        </div>
        {isOwn && (
        <button
          type="button"
          onClick={onDeleteClick}
          disabled={deleting}
          aria-label="Delete"
          className="shrink-0 p-2 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
        >
          {deleting ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          )}
        </button>
        )}
      </div>
    </a>
  );
}
