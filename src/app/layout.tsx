import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Smart Bookmark — Save & sync your links',
  description: 'Private bookmark manager with real-time sync. Sign in with Google and access your bookmarks everywhere.',
};

import { ToastFromUrl } from '@/frontend/components/ui/toast-from-url';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${outfit.variable} ${jetbrainsMono.variable} antialiased`} suppressHydrationWarning>
        {children}
        <ToastFromUrl />
      </body>
    </html>
  );
}
