import { createClient } from '@/server/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardNav } from '@/frontend/components/dashboard/dashboard-nav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return (
    <div className="bg-grid min-h-screen">
      <DashboardNav user={user} />
      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {children}
      </main>
    </div>
  );
}
