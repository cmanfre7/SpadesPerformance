import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("spades_member_session")?.value;

  if (!session) {
    return NextResponse.json({ ok: false, user: null }, { status: 401 });
  }

  try {
    const sessionUser = JSON.parse(session);
    
    // Fetch full user data from database
    const supabase = getSupabaseServer();
    const { data: user } = await supabase
      .from("join_requests")
      .select("*")
      .eq("id", sessionUser.id)
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ ok: false, user: null }, { status: 401 });
    }

    // Don't send password hash to client
    const { password_hash, ...safeUser } = user;
    
    return NextResponse.json({ ok: true, user: safeUser });
  } catch {
    return NextResponse.json({ ok: false, user: null }, { status: 401 });
  }
}
