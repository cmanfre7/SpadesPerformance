import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// DELETE - remove a comment
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ username: string; id: string }> }
) {
  const { username, id } = await params;
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

  // Get comment and check ownership
  const { data: comment, error: commentError } = await supabase
    .from("garage_comments")
    .select("user_id, garage_id")
    .eq("id", id)
    .single();

  if (commentError || !comment) {
    return NextResponse.json({ ok: false, error: "Comment not found" }, { status: 404 });
  }

  // Get garage owner
  const { data: garage } = await supabase
    .from("garages")
    .select("user_id")
    .eq("id", comment.garage_id)
    .single();

  // Check if user is comment author, garage owner, or admin
  const { data: userData } = await supabase
    .from("join_requests")
    .select("rank")
    .eq("id", session.id)
    .single();

  const isCommentAuthor = comment.user_id === session.id;
  const isGarageOwner = garage?.user_id === session.id;
  const isAdmin = userData?.rank === "admin";

  if (!isCommentAuthor && !isGarageOwner && !isAdmin) {
    return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 403 });
  }

  // Delete comment
  const { error: deleteError } = await supabase
    .from("garage_comments")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Error deleting comment:", deleteError);
    return NextResponse.json({ ok: false, error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

