import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - fetch all approved members
export async function GET() {
  const { data, error } = await supabase
    .from("join_requests")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  // Map join_requests to Member format
  const members = (data || []).map((user) => ({
    id: user.id,
    name: user.name,
    instagram: user.instagram || "",
    car: user.car || "",
    email: user.email || "",
    tags: user.rank === "admin" ? ["member", "verified", "og", "admin"] :
          user.rank === "og" ? ["member", "verified", "og"] :
          user.rank === "verified" ? ["member", "verified"] :
          ["member"],
    joinedDate: user.created_at ? new Date(user.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    eventsAttended: 0, // TODO: track this separately if needed
    active: true,
    notes: "", // TODO: add notes column if needed
  }));

  return NextResponse.json({ ok: true, members });
}

// POST - create new member directly
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

  // Check if user is admin
  const { data: userData } = await supabase
    .from("join_requests")
    .select("rank")
    .eq("id", session.id)
    .single();

  if (userData?.rank !== "admin") {
    return NextResponse.json({ ok: false, error: "Admin only" }, { status: 403 });
  }

  const body = await req.json();
  const { name, instagram, car, email, rank, username, password } = body;

  if (!name || !username) {
    return NextResponse.json({ ok: false, error: "Name and username required" }, { status: 400 });
  }

  // Check if username already exists
  const { data: existing } = await supabase
    .from("join_requests")
    .select("id")
    .eq("username", username.toLowerCase())
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ ok: false, error: "Username already taken" }, { status: 400 });
  }

  // Generate a dummy invite code (or use a system code)
  const { data: inviteData } = await supabase
    .from("invites")
    .select("code")
    .limit(1)
    .maybeSingle();

  let inviteCode = inviteData?.code || "ADMIN-CREATED";

  // If no invite exists, create one
  if (!inviteData) {
    const { data: newInvite } = await supabase
      .from("invites")
      .insert({ code: inviteCode, created_by: session.id })
      .select()
      .single();
    if (newInvite) inviteCode = newInvite.code;
  }

  // Hash password if provided
  let passwordHash = null;
  if (password) {
    const bcrypt = await import("bcryptjs");
    passwordHash = await bcrypt.hash(password, 10);
  }

  // Create member directly with approved status
  const { data, error } = await supabase
    .from("join_requests")
    .insert({
      invite_code: inviteCode,
      name,
      instagram: instagram || "",
      car: car || null,
      email: email || null,
      username: username.toLowerCase(),
      password_hash: passwordHash,
      rank: rank || "member",
      status: "approved",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating member:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, member: data });
}

// PATCH - update member (rank, profile, etc.)
export async function PATCH(req: NextRequest) {
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

  // Check if user is admin
  const { data: userData } = await supabase
    .from("join_requests")
    .select("rank")
    .eq("id", session.id)
    .single();

  if (userData?.rank !== "admin") {
    return NextResponse.json({ ok: false, error: "Admin only" }, { status: 403 });
  }

  const body = await req.json();
  const { id, rank, name, instagram, car, email, bio, profile_pic } = body;

  const updates: any = {};
  if (rank !== undefined) updates.rank = rank;
  if (name !== undefined) updates.name = name;
  if (instagram !== undefined) updates.instagram = instagram;
  if (car !== undefined) updates.car = car;
  if (email !== undefined) updates.email = email;
  if (bio !== undefined) updates.bio = bio;
  if (profile_pic !== undefined) updates.profile_pic = profile_pic;

  const { data, error } = await supabase
    .from("join_requests")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating member:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, member: data });
}

// DELETE - remove member (set status to rejected or delete)
export async function DELETE(req: NextRequest) {
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

  // Check if user is admin
  const { data: userData } = await supabase
    .from("join_requests")
    .select("rank")
    .eq("id", session.id)
    .single();

  if (userData?.rank !== "admin") {
    return NextResponse.json({ ok: false, error: "Admin only" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ ok: false, error: "Member ID required" }, { status: 400 });
  }

  // Set status to rejected instead of deleting (preserve history)
  const { error } = await supabase
    .from("join_requests")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) {
    console.error("Error removing member:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

