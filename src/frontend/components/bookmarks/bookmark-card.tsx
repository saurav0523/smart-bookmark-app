'use client';

import { useState } from 'react';
import type { BookmarkRow } from '@/types/database';
import { IconSpinner, IconTrash } from '@/frontend/components/icons';

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
            <IconSpinner className="w-4 h-4 animate-spin" />
          ) : (
            <IconTrash className="w-4 h-4" />
          )}
        </button>
        )}
      </div>
    </a>
  );
}
