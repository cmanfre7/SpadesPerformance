import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ ok: false, error: "No URL provided" }, { status: 400 });
  }

  try {
    const res = await fetch(url, { redirect: "follow" });
    const finalUrl = res.url || url;
    return NextResponse.json({ ok: true, url: finalUrl });
  } catch (error) {
    console.error("SoundCloud resolve error:", error);
    return NextResponse.json({ ok: false, error: "Failed to resolve SoundCloud URL" }, { status: 500 });
  }
}

