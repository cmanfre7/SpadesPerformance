import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';

type JoinPayload = {
  inviteCode: string;
  name: string;
  instagram: string;
  car?: string;
  email?: string;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as JoinPayload | null;
  const inviteCode = (body?.inviteCode || '').trim().toUpperCase();
  const name = (body?.name || '').trim();
  const instagram = (body?.instagram || '').trim();
  const car = (body?.car || '').trim() || null;
  const email = (body?.email || '').trim() || null;

  if (!/^SPADES-[A-Z0-9]{6}$/.test(inviteCode) || !name || !instagram) {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  const supabase = getSupabaseServer();

  // Check invite exists + unused
  const { data: invite, error: inviteErr } = await supabase
    .from('invites')
    .select('code, used_at')
    .eq('code', inviteCode)
    .maybeSingle();

  if (inviteErr || !invite || invite.used_at) {
    return NextResponse.json({ ok: false, error: 'invalid_invite' }, { status: 400 });
  }

  // Create join request
  const { error: reqErr } = await supabase.from('join_requests').insert({
    invite_code: inviteCode,
    name,
    instagram,
    car,
    email,
  });

  if (reqErr) {
    return NextResponse.json({ ok: false, error: 'failed_create' }, { status: 500 });
  }

  // Mark invite used (best-effort)
  await supabase
    .from('invites')
    .update({
      used_at: new Date().toISOString(),
      used_name: name,
      used_instagram: instagram,
      used_email: email,
    })
    .eq('code', inviteCode);

  return NextResponse.json({ ok: true });
}


