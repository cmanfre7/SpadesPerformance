import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = (searchParams.get('code') || '').trim();

  if (!/^SPADES-[A-Z0-9]{6}$/.test(code)) {
    return NextResponse.json({ ok: true, valid: false });
  }

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from('invites')
    .select('code, used_at')
    .eq('code', code)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ ok: true, valid: false });
  }

  return NextResponse.json({ ok: true, valid: data.used_at == null });
}


