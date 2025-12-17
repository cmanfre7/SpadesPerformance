import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServer } from "@/lib/supabase/server";

async function requireAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("spades_admin_auth")?.value === "true";
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("join_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, requests: data });
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { id, status } = body || {};

  if (!id || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from("join_requests")
    .update({ status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { id } = body || {};

  if (!id) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  
  // First get the invite code to reset it
  const { data: request } = await supabase
    .from("join_requests")
    .select("invite_code")
    .eq("id", id)
    .maybeSingle();

  // Delete the request
  const { error } = await supabase
    .from("join_requests")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  // Reset the invite so it can be reused
  if (request?.invite_code) {
    await supabase
      .from("invites")
      .update({ used_at: null, used_name: null, used_instagram: null, used_email: null })
      .eq("code", request.invite_code);
  }

  return NextResponse.json({ ok: true });
}

