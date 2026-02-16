'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/frontend/lib/supabase/client';
import type { BookmarkRow, BookmarkInsert } from '@/types/database';

const BROADCAST_CHANNEL_NAME = 'smart-bookmark-sync';

function getHostname(url: string) {
  try { return new URL(url).hostname; } catch { return 'Untitled'; }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const loadRef = useRef<() => Promise<void>>(() => Promise.resolve());

  useEffect(() => {
    const supabase = createClient();
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setBookmarks([]);
        setUserId(null);
        setLoading(false);
        return;
      }
      setUserId(user.id);
      const { data, error: err } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setBookmarks(data ?? []);
      setError(err as Error | null);
      setLoading(false);
    };
    loadRef.current = load;
    load();
    const ch = supabase
      .channel('bookmarks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookmarks' }, load)
      .subscribe();

    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.onmessage = () => loadRef.current();
    }

    return () => {
      if (bc) bc.close();
      supabase.removeChannel(ch);
    };
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
    await loadRef.current();
    if (typeof BroadcastChannel !== 'undefined') {
      new BroadcastChannel(BROADCAST_CHANNEL_NAME).postMessage('refetch');
    }
  };

  const deleteBookmark = async (id: string) => {
    const supabase = createClient();
    const { error: err } = await supabase.from('bookmarks').delete().eq('id', id);
    if (err) throw err;
    await loadRef.current();
    if (typeof BroadcastChannel !== 'undefined') {
      new BroadcastChannel(BROADCAST_CHANNEL_NAME).postMessage('refetch');
    }
  };

  return { bookmarks, loading, error, userId, addBookmark, deleteBookmark };
}
