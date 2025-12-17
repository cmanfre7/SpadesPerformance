import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - fetch all published garages
export async function GET() {
  const { data, error } = await supabase
    .from("garages")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching garages:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const garages = data || [];

  // fetch profile_pic and rank from join_requests for each user_id
  const userIds = garages.map((g) => g.user_id).filter(Boolean);
  let userExtras: Record<string, { profile_pic: string | null; rank: string | null }> = {};
  if (userIds.length > 0) {
    const { data: profiles, error: profileErr } = await supabase
      .from("join_requests")
      .select("id, profile_pic, rank")
      .in("id", userIds);

    if (!profileErr && profiles) {
      userExtras = profiles.reduce((acc: any, p: any) => {
        acc[p.id] = { profile_pic: p.profile_pic || null, rank: p.rank || null };
        return acc;
      }, {});
    }
  }

  const shaped = garages.map((g) => ({
    ...g,
    profile_pic: userExtras[g.user_id]?.profile_pic || null,
    rank: userExtras[g.user_id]?.rank || null,
  }));

  return NextResponse.json({ ok: true, garages: shaped });
}

// POST - create a new garage
export async function POST(req: NextRequest) {
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

  // Verify user rank
  const { data: userData, error: userError } = await supabase
    .from("join_requests")
    .select("rank, username, name")
    .eq("id", session.id)
    .single();

  if (userError || !userData) {
    return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
  }

  const allowedRanks = ["verified", "og", "admin"];
  if (!allowedRanks.includes(userData.rank || "")) {
    return NextResponse.json({ ok: false, error: "Insufficient permissions" }, { status: 403 });
  }

  // Check if user already has a garage
  const { data: existingGarage } = await supabase
    .from("garages")
    .select("id")
    .eq("user_id", session.id)
    .single();

  if (existingGarage) {
    return NextResponse.json({ ok: false, error: "You already have a garage. Edit it instead." }, { status: 400 });
  }

  const body = await req.json();

  const { data, error } = await supabase
    .from("garages")
    .insert({
      user_id: session.id,
      username: userData.username,
      owner_name: userData.name,
      year: body.year,
      make: body.make,
      model: body.model,
      platform: body.platform || null,
      power: body.power || null,
      location: body.location || null,
      description: body.description || null,
      cover_image: body.cover_image || null,
      appearance: body.appearance || {},
      widgets: body.widgets || [],
      published: true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating garage:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, garage: data });
}
