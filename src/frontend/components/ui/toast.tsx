'use client';

import { useEffect, useState } from 'react';

type ToastProps = {
  message: string;
  variant?: 'success' | 'info';
  onDismiss?: () => void;
  duration?: number;
};

export function Toast({ message, variant = 'success', onDismiss, duration = 3500 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onDismiss]);

  if (!visible) return null;

  const styles =
    variant === 'success'
      ? 'bg-emerald-500/95 text-white border-emerald-400/30'
      : 'bg-stone-700/95 text-stone-100 border-stone-600/50';

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-300 ${styles}`}
      style={{ animation: 'toastIn 0.3s ease-out' }}
    >
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
