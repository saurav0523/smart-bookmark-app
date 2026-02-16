'use client';

import { useBookmarks } from '@/frontend/hooks/use-bookmarks';
import { IconSpinner } from '@/frontend/components/icons';
import { AddBookmarkForm } from './add-bookmark-form';
import { BookmarkCard } from './bookmark-card';

export function BookmarkList() {
  const { bookmarks, loading, error, userId, addBookmark, deleteBookmark } = useBookmarks();

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
          <IconSpinner className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-700 bg-stone-900/30 py-12 px-6 text-center">
          <p className="text-stone-500">No links yet. Add one above.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id}>
              <BookmarkCard bookmark={bookmark} currentUserId={userId} onDelete={deleteBookmark} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
