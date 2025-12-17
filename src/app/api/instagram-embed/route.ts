import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  
  if (!url) {
    return NextResponse.json({ ok: false, error: "No URL provided" }, { status: 400 });
  }

  try {
    // Use Instagram's oEmbed API
    const oembedUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=your_token&omitscript=true`;
    
    // Try without access token first (works for public posts)
    const response = await fetch(`https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}&omitscript=true`);
    
    if (!response.ok) {
      return NextResponse.json({ ok: false, error: "Failed to fetch embed" }, { status: response.status });
    }

    const data = await response.json();
    
    return NextResponse.json({ 
      ok: true, 
      html: data.html,
      thumbnail_url: data.thumbnail_url,
      author_name: data.author_name,
    });
  } catch (error) {
    console.error("Instagram embed error:", error);
    return NextResponse.json({ ok: false, error: "Failed to fetch embed" }, { status: 500 });
  }
}

