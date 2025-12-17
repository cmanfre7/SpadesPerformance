import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';

type JoinPayload = {
  inviteCode: string;
  name: string;
  username: string;
  email: string;
  password: string;
  instagram?: string;
  tiktok?: string;
  car?: string;
  bio?: string;
  profilePic?: string;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as JoinPayload | null;
  const inviteCode = (body?.inviteCode || '').trim().toUpperCase();
  const name = (body?.name || '').trim();
  const username = (body?.username || '').trim().toLowerCase();
  const email = (body?.email || '').trim().toLowerCase();
  const password = body?.password || '';
  const instagram = (body?.instagram || '').trim() || null;
  const tiktok = (body?.tiktok || '').trim() || null;
  const car = (body?.car || '').trim() || null;
  const bio = (body?.bio || '').trim() || null;
  const profilePic = (body?.profilePic || '').trim() || null;

  // Validation
  if (!/^SPADES-[A-Z0-9]{6}$/.test(inviteCode)) {
    return NextResponse.json({ ok: false, error: 'Invalid invite code' }, { status: 400 });
  }
  if (!name || !username || !email || !password) {
    return NextResponse.json({ ok: false, error: 'Name, username, email, and password are required' }, { status: 400 });
  }
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return NextResponse.json({ ok: false, error: 'Username must be 3-20 characters (letters, numbers, underscores)' }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ ok: false, error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  const supabase = getSupabaseServer();

  // Check invite exists + unused
  const { data: invite, error: inviteErr } = await supabase
    .from('invites')
    .select('code, used_at')
    .eq('code', inviteCode)
    .maybeSingle();

  if (inviteErr || !invite || invite.used_at) {
    return NextResponse.json({ ok: false, error: 'Invalid or expired invite code' }, { status: 400 });
  }

  // Check username uniqueness
  const { data: existingUser } = await supabase
    .from('join_requests')
    .select('username')
    .eq('username', username)
    .maybeSingle();

  if (existingUser) {
    return NextResponse.json({ ok: false, error: 'Username already taken' }, { status: 400 });
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create join request
  const { error: reqErr } = await supabase.from('join_requests').insert({
    invite_code: inviteCode,
    name,
    username,
    email,
    password_hash: passwordHash,
    instagram,
    tiktok,
    car,
    bio,
    profile_pic: profilePic,
  });

  if (reqErr) {
    console.error('Join request error:', reqErr);
    return NextResponse.json({ ok: false, error: 'Failed to create request. Username or email may already exist.' }, { status: 500 });
  }

  // Mark invite used
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
