
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { Poll } from '@/lib/types';

/**
 * Revalidates the poll data every 60 seconds to provide caching.
 * In Next.js 15, GET Route Handlers are not cached by default.
 * This export opts into caching with a 60-second stale-while-revalidate strategy.
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/caching#route-handlers
 */
export const revalidate = 60;

export async function GET() {
  const supabase = createClient();
  const { data: polls, error } = await supabase.from('polls').select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(polls);
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const pollData: Omit<Poll, 'id' | 'created_at'> = await req.json();

  const { data: poll, error } = await supabase
    .from('polls')
    .insert([pollData])
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(poll, { status: 201 });
}
