'use client';

import { useState } from 'react';

interface AddBookmarkFormProps {
  onAdd: (url: string, title: string) => Promise<void>;
}

export function AddBookmarkForm({ onAdd }: AddBookmarkFormProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const u = url.trim();
    if (!u) {
      setErr('Enter a URL');
      return;
    }
    const fullUrl = /^https?:\/\//i.test(u) ? u : `https://${u}`;
    try {
      setLoading(true);
      await onAdd(fullUrl, title.trim());
      setUrl('');
      setTitle('');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-stone-700/80 bg-stone-900/50 p-5 sm:p-6 shadow-xl">
      <div className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-stone-400 mb-1.5">
            URL
          </label>
          <input
            id="url"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="font-mono w-full px-4 py-3 rounded-xl bg-stone-800/80 border border-stone-600/80 text-stone-100 placeholder-stone-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-stone-400 mb-1.5">
            Title <span className="text-stone-600">(optional)</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="My favourite page"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-stone-800/80 border border-stone-600/80 text-stone-100 placeholder-stone-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition"
            disabled={loading}
          />
        </div>
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-amber-500 text-stone-900 font-semibold hover:bg-amber-400 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-900 transition disabled:opacity-60"
        >
          {loading ? 'Adding…' : 'Add bookmark'}
        </button>
      </div>
    </form>
  );
}
