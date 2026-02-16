'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Toast } from './toast';

export function ToastFromUrl() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'info' } | null>(null);

  useEffect(() => {
    const signedIn = searchParams.get('signed_in');
    const signedOut = searchParams.get('signed_out');
    if (pathname === '/dashboard' && signedIn === '1') {
      setToast({ message: 'Signed in successfully', variant: 'success' });
      router.replace('/dashboard');
    } else if (pathname === '/' && signedOut === '1') {
      setToast({ message: 'Signed out', variant: 'info' });
      router.replace('/');
    }
  }, [pathname, searchParams, router]);

  if (!toast) return null;
  return <Toast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} />;
}
