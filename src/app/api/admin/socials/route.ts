import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET all social posts
export async function GET() {
  const { data, error } = await supabase
    .from("social_posts")
    .select("*")
    .order("display_order", { ascending: true, nullsFirst: true })
    .order("date_added", { ascending: false });

  if (error) {
    console.error("Error fetching socials:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, posts: data || [] });
}

// CREATE new social post
export async function POST(req: NextRequest) {
  const body = await req.json();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("social_posts")
    .insert({
      platform: body.platform || "instagram",
      post_url: body.postUrl,
      caption: body.caption || null,
      thumbnail: body.thumbnail || null,
      display_order: body.displayOrder ?? null,
      visible: body.visible ?? true,
      date_added: body.dateAdded || now,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating social post:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, post: data });
}

