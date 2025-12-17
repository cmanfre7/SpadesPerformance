import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - fetch comments for a garage
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

  // Get all comments with user info
  const { data: comments, error: commentsError } = await supabase
    .from("garage_comments")
    .select(`
      id,
      content,
      created_at,
      updated_at,
      user_id,
      join_requests!garage_comments_user_id_fkey (
        id,
        username,
        name,
        profile_pic
      )
    `)
    .eq("garage_id", garage.id)
    .order("created_at", { ascending: true });

  if (commentsError) {
    console.error("Error fetching comments:", commentsError);
    return NextResponse.json({ ok: false, error: commentsError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, comments: comments || [] });
}

// POST - add a comment
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

  const body = await req.json();
  const { content } = body;

  if (!content || !content.trim()) {
    return NextResponse.json({ ok: false, error: "Comment cannot be empty" }, { status: 400 });
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

  // Create comment
  const { data: comment, error: insertError } = await supabase
    .from("garage_comments")
    .insert({
      garage_id: garage.id,
      user_id: session.id,
      content: content.trim(),
    })
    .select(`
      id,
      content,
      created_at,
      updated_at,
      user_id,
      join_requests!garage_comments_user_id_fkey (
        id,
        username,
        name,
        profile_pic
      )
    `)
    .single();

  if (insertError) {
    console.error("Error creating comment:", insertError);
    return NextResponse.json({ ok: false, error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, comment });
}

