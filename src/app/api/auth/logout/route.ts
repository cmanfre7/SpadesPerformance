import { NextResponse } from "next/server";
import { serialize } from "cookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const clear = serialize("spades_member_session", "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": clear,
    },
  });
}

