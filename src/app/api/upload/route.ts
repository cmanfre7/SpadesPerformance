import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "garage";
    
    if (!file) {
      return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/") || 
                    file.type === "application/octet-stream" || // Some browsers send this for videos
                    file.name.match(/\.(mp4|webm|mov|m4v)$/i);
    
    console.log("Upload request:", { 
      name: file.name, 
      type: file.type, 
      size: file.size, 
      isImage, 
      isVideo 
    });
    
    if (!isImage && !isVideo) {
      return NextResponse.json({ ok: false, error: "Only images and videos are allowed" }, { status: 400 });
    }

    // Validate file size
    const maxSize = isVideo ? 100 * 1024 * 1024 : 5 * 1024 * 1024; // 100MB for videos, 5MB for images
    if (file.size > maxSize) {
      return NextResponse.json({ 
        ok: false, 
        error: `File too large (max ${isVideo ? '100MB' : '5MB'})` 
      }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || (isImage ? "jpg" : "mp4");
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use same bucket for both images and videos (Supabase Storage supports any file type)
    const bucketName = "garage-images";
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: "31536000", // 1 year cache
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return NextResponse.json({ ok: true, url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ ok: false, error: "Upload failed" }, { status: 500 });
  }
}

