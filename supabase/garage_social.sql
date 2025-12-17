-- Garage Likes and Comments Schema

-- Garage Likes table
CREATE TABLE IF NOT EXISTS public.garage_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  garage_id uuid NOT NULL REFERENCES public.garages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.join_requests(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(garage_id, user_id) -- Prevent duplicate likes
);

CREATE INDEX IF NOT EXISTS garage_likes_garage_id_idx ON public.garage_likes(garage_id);
CREATE INDEX IF NOT EXISTS garage_likes_user_id_idx ON public.garage_likes(user_id);

-- Garage Comments table
CREATE TABLE IF NOT EXISTS public.garage_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  garage_id uuid NOT NULL REFERENCES public.garages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.join_requests(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS garage_comments_garage_id_idx ON public.garage_comments(garage_id);
CREATE INDEX IF NOT EXISTS garage_comments_user_id_idx ON public.garage_comments(user_id);
CREATE INDEX IF NOT EXISTS garage_comments_created_at_idx ON public.garage_comments(created_at DESC);

