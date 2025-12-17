/**
 * Upload an image file to Supabase Storage
 * Returns the public URL of the uploaded image
 */
export async function uploadImage(file: File, folder = "garage"): Promise<string> {
  // Compress image before upload
  const compressedFile = await compressImage(file);
  
  const formData = new FormData();
  formData.append("file", compressedFile);
  formData.append("folder", folder);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  
  if (!data.ok) {
    throw new Error(data.error || "Upload failed");
  }

  return data.url;
}

/**
 * Compress an image file
 */
async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      // Scale down if larger than maxWidth
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          } else {
            resolve(file); // Fallback to original
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => resolve(file); // Fallback to original on error
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Upload multiple images
 */
export async function uploadImages(files: File[], folder = "garage"): Promise<string[]> {
  const urls: string[] = [];
  
  for (const file of files) {
    try {
      const url = await uploadImage(file, folder);
      urls.push(url);
    } catch (error) {
      console.error("Failed to upload image:", error);
      // Continue with other images
    }
  }
  
  return urls;
}

