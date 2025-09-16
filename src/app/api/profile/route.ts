import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/types/supabase';

export async function PATCH(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, avatar_url } = await req.json();

    if (!username || typeof username !== 'string' || username.length < 3) {
      return NextResponse.json(
        { error: 'Invalid username. Must be at least 3 characters.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        username,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id)
      .select()
      .single();

    if (error) {
      // Log the detailed error on the server
      console.error('Supabase PATCH error:', error.message);
      // Return a generic error to the client
      return NextResponse.json({ error: 'Could not update profile.' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e: unknown) {
    // Log the detailed error on the server
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    console.error('API Route error:', errorMessage);
    // Return a generic error to the client
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
