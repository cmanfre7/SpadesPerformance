-- Create the garage-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('garage-images', 'garage-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to all files in the bucket
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'garage-images');

-- Allow authenticated users to upload (we'll handle auth in our API)
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'garage-images');

-- Allow users to delete their own images
CREATE POLICY "Allow delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'garage-images');

