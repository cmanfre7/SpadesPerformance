import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const { data, error } = await supabase
    .from("social_posts")
    .update({
      platform: body.platform,
      post_url: body.postUrl,
      caption: body.caption,
      thumbnail: body.thumbnail,
      display_order: body.displayOrder,
      visible: body.visible,
      date_added: body.dateAdded,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating social post:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, post: data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error } = await supabase.from("social_posts").delete().eq("id", id);

  if (error) {
    console.error("Error deleting social post:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
