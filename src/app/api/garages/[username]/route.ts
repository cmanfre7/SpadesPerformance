import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("spades_member_session");

  // Check if user is viewing their own garage
  let isOwner = false;
  if (sessionCookie?.value) {
    try {
      const session = JSON.parse(sessionCookie.value);
      const { data: garage } = await supabase
        .from("garages")
        .select("user_id")
        .eq("username", username)
        .maybeSingle();
      isOwner = garage?.user_id === session.id;
    } catch {}
  }

  // If owner, allow viewing even if unpublished. Otherwise, require published=true
  const query = supabase
    .from("garages")
    .select("*")
    .eq("username", username);
  
  if (!isOwner) {
    query.eq("published", true);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return NextResponse.json({ ok: false, error: "Garage not found" }, { status: 404 });
  }

  let profile_pic: string | null = null;
  let rank: string | null = null;
  if (data.user_id) {
    const { data: profile } = await supabase
      .from("join_requests")
      .select("profile_pic, rank")
      .eq("id", data.user_id)
      .maybeSingle();
    profile_pic = profile?.profile_pic || null;
    rank = profile?.rank || null;
  }

  const shaped = { ...data, profile_pic, rank };

  return NextResponse.json({ ok: true, garage: shaped });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("spades_member_session");

  if (!sessionCookie?.value) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  let session;
  try {
    session = JSON.parse(sessionCookie.value);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid session" }, { status: 401 });
  }

  // Check if user owns this garage or is admin
  const { data: garage } = await supabase
    .from("garages")
    .select("user_id")
    .eq("username", username)
    .single();

  if (!garage) {
    return NextResponse.json({ ok: false, error: "Garage not found" }, { status: 404 });
  }

  // Check if user is owner or admin
  const { data: userData } = await supabase
    .from("join_requests")
    .select("rank")
    .eq("id", session.id)
    .single();

  if (garage.user_id !== session.id && userData?.rank !== "admin") {
    return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();

  const updates: any = {};
  if (body.year !== undefined) updates.year = body.year;
  if (body.make !== undefined) updates.make = body.make;
  if (body.model !== undefined) updates.model = body.model;
  if (body.platform !== undefined) updates.platform = body.platform;
  if (body.power !== undefined) updates.power = body.power;
  if (body.location !== undefined) updates.location = body.location;
  if (body.description !== undefined) updates.description = body.description;
  if (body.cover_image !== undefined) updates.cover_image = body.cover_image;
  if (body.widgets !== undefined) updates.widgets = body.widgets;
  if (body.appearance !== undefined) updates.appearance = body.appearance;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("garages")
    .update(updates)
    .eq("username", username)
    .select()
    .single();

  if (error) {
    console.error("Error updating garage:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  // Fetch profile_pic and rank from join_requests (same as GET handler)
  let profile_pic: string | null = null;
  let rank: string | null = null;
  if (data.user_id) {
    const { data: profile } = await supabase
      .from("join_requests")
      .select("profile_pic, rank")
      .eq("id", data.user_id)
      .maybeSingle();
    profile_pic = profile?.profile_pic || null;
    rank = profile?.rank || null;
  }

  const shaped = { ...data, profile_pic, rank };

  return NextResponse.json({ ok: true, garage: shaped });
}
