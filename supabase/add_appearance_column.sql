-- Add appearance column to garages table
-- This column stores customization settings for garage pages

ALTER TABLE public.garages 
ADD COLUMN IF NOT EXISTS appearance jsonb DEFAULT '{}'::jsonb;

-- Update existing garages to have default appearance if they don't have one
UPDATE public.garages 
SET appearance = '{}'::jsonb 
WHERE appearance IS NULL;

