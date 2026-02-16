'use client';

import { useBookmarks } from '@/frontend/hooks/use-bookmarks';
import { AddBookmarkForm } from './add-bookmark-form';
import { BookmarkCard } from './bookmark-card';

export function BookmarkList() {
  const { bookmarks, loading, error, addBookmark, deleteBookmark } = useBookmarks();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-50 mb-1">Bookmarks</h1>
        <p className="text-stone-500 text-sm">Add links — they sync across tabs.</p>
      </div>

      <AddBookmarkForm onAdd={addBookmark} />

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">
          {error.message}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <svg className="animate-spin h-8 w-8 text-amber-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-700 bg-stone-900/30 py-12 px-6 text-center">
          <p className="text-stone-500">No links yet. Add one above.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id}>
              <BookmarkCard bookmark={bookmark} onDelete={deleteBookmark} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
