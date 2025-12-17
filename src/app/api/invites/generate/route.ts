import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';
import { getSupabaseServer } from '@/lib/supabase/server';

async function requireAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get('spades_admin_auth')?.value === 'true';
}

function generateCode(): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = randomBytes(6);
  let suffix = '';
  for (let i = 0; i < bytes.length; i++) {
    suffix += alphabet[bytes[i] % alphabet.length];
  }
  return `SPADES-${suffix}`;
}

export async function POST() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseServer();

  // Try a few times to avoid collisions
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    const { error } = await supabase.from('invites').insert({ code }).select('code').single();
    if (!error) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://spadesdenver.club';
      return NextResponse.json({ ok: true, code, link: `${baseUrl}/join?invite=${code}` });
    }
  }

  return NextResponse.json({ ok: false, error: 'could_not_generate' }, { status: 500 });
}


