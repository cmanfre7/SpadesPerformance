import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - fetch likes for a garage
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  // Get garage ID
  const { data: garage, error: garageError } = await supabase
    .from("garages")
    .select("id")
    .eq("username", username)
    .single();

  if (garageError || !garage) {
    return NextResponse.json({ ok: false, error: "Garage not found" }, { status: 404 });
  }

  // Get all likes for this garage with user info
  const { data: likes, error: likesError } = await supabase
    .from("garage_likes")
    .select(`
      id,
      user_id,
      created_at,
      join_requests!garage_likes_user_id_fkey (
        id,
        username,
        name,
        profile_pic
      )
    `)
    .eq("garage_id", garage.id)
    .order("created_at", { ascending: false });

  if (likesError) {
    console.error("Error fetching likes:", likesError);
    return NextResponse.json({ ok: false, error: likesError.message }, { status: 500 });
  }

  // Check if current user has liked
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("spades_member_session");
  let currentUserLiked = false;
  let currentUserId: string | null = null;

  if (sessionCookie?.value) {
    try {
      const session = JSON.parse(sessionCookie.value);
      currentUserId = session.id;
      currentUserLiked = likes?.some((like: any) => like.user_id === session.id) || false;
    } catch {}
  }

  return NextResponse.json({
    ok: true,
    likes: likes || [],
    count: likes?.length || 0,
    currentUserLiked,
    currentUserId,
  });
}

// POST - toggle like (add or remove)
export async function POST(
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

  // Get garage ID
  const { data: garage, error: garageError } = await supabase
    .from("garages")
    .select("id")
    .eq("username", username)
    .single();

  if (garageError || !garage) {
    return NextResponse.json({ ok: false, error: "Garage not found" }, { status: 404 });
  }

  // Check if user already liked
  const { data: existingLike } = await supabase
    .from("garage_likes")
    .select("id")
    .eq("garage_id", garage.id)
    .eq("user_id", session.id)
    .maybeSingle();

  if (existingLike) {
    // Unlike
    const { error: deleteError } = await supabase
      .from("garage_likes")
      .delete()
      .eq("id", existingLike.id);

    if (deleteError) {
      console.error("Error removing like:", deleteError);
      return NextResponse.json({ ok: false, error: deleteError.message }, { status: 500 });
    }

    // Get updated count
    const { count } = await supabase
      .from("garage_likes")
      .select("*", { count: "exact", head: true })
      .eq("garage_id", garage.id);

    return NextResponse.json({ ok: true, liked: false, count: count || 0 });
  } else {
    // Like
    const { data: newLike, error: insertError } = await supabase
      .from("garage_likes")
      .insert({
        garage_id: garage.id,
        user_id: session.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error adding like:", insertError);
      return NextResponse.json({ ok: false, error: insertError.message }, { status: 500 });
    }

    // Get updated count
    const { count } = await supabase
      .from("garage_likes")
      .select("*", { count: "exact", head: true })
      .eq("garage_id", garage.id);

    return NextResponse.json({ ok: true, liked: true, count: count || 0 });
  }
}

