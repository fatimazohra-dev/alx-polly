import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { Poll } from '@/lib/types';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: poll, error } = await supabase
    .from('polls')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
  }

  return NextResponse.json(poll);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const pollData: Partial<Poll> = await req.json();

  const { data: poll, error } = await supabase
    .from('polls')
    .update(pollData)
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
  }

  return NextResponse.json(poll);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { error } = await supabase.from('polls').delete().eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}