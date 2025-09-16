import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ProfileSettingsForm } from '@/components/profile/settings-form';
import { Database } from '@/lib/types/supabase';

export default async function SettingsPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', session.user.id)
    .single();

  if (error || !profile) {
    // This could happen if a user is authenticated but has no profile entry yet.
    // You might want to handle this case by creating a profile entry
    // or showing a specific message. For now, we redirect.
    console.error('Error fetching profile:', error);
    redirect('/dashboard');
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
        <ProfileSettingsForm user={profile} />
      </div>
    </div>
  );
}
