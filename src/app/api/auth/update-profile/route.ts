import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("spades_member_session")?.value;

  if (!session) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  let userId: string;
  try {
    const sessionUser = JSON.parse(session);
    userId = sessionUser.id;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid session" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const { name, bio, car, instagram, tiktok, profile_pic } = body;

  if (!name || name.trim().length === 0) {
    return NextResponse.json({ ok: false, error: "Name is required" }, { status: 400 });
  }

  const supabase = getSupabaseServer();

  const { error } = await supabase
    .from("join_requests")
    .update({
      name: name.trim(),
      bio: bio?.trim() || null,
      car: car?.trim() || null,
      instagram: instagram?.trim() || null,
      tiktok: tiktok?.trim() || null,
      profile_pic: profile_pic || null,
    })
    .eq("id", userId);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

