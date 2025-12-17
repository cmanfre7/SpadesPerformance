import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const username = (body?.username || "").trim().toLowerCase();
  const password = body?.password || "";

  if (!username || !password) {
    return NextResponse.json({ ok: false, error: "Username and password required" }, { status: 400 });
  }

  const supabase = getSupabaseServer();

  // Find user by username
  const { data: user, error } = await supabase
    .from("join_requests")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error || !user) {
    return NextResponse.json({ ok: false, error: "Invalid username or password" }, { status: 401 });
  }

  // Check if approved
  if (user.status !== "approved") {
    if (user.status === "pending") {
      return NextResponse.json({ ok: false, error: "Your account is pending approval" }, { status: 401 });
    }
    return NextResponse.json({ ok: false, error: "Account not approved" }, { status: 401 });
  }

  // Verify password
  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    return NextResponse.json({ ok: false, error: "Invalid username or password" }, { status: 401 });
  }

  // Create session token (simple approach - in production use JWT or proper sessions)
  const sessionData = {
    id: user.id,
    username: user.username,
    name: user.name,
    rank: user.rank,
  };

  const cookieValue = serialize("spades_member_session", JSON.stringify(sessionData), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return new Response(JSON.stringify({ ok: true, user: sessionData }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": cookieValue,
    },
  });
}

