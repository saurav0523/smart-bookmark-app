'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/frontend/lib/supabase/client';
import type { BookmarkRow, BookmarkInsert } from '@/types/database';

function getHostname(url: string) {
  try { return new URL(url).hostname; } catch { return 'Untitled'; }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setBookmarks([]);
        setLoading(false);
        return;
      }
      const { data, error: err } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setBookmarks(data ?? []);
      setError(err as Error | null);
      setLoading(false);
    };
    load();
    const ch = supabase
      .channel('bookmarks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookmarks' }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const addBookmark = async (url: string, title: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const toInsert: BookmarkInsert = {
      user_id: user.id,
      url: url.trim(),
      title: title.trim() || getHostname(url),
    };
    const { error: err } = await supabase.from('bookmarks').insert(toInsert as any);
    if (err) throw err;
  };

  const deleteBookmark = async (id: string) => {
    const supabase = createClient();
    const { error: err } = await supabase.from('bookmarks').delete().eq('id', id);
    if (err) throw err;
  };

  return { bookmarks, loading, error, addBookmark, deleteBookmark };
}
