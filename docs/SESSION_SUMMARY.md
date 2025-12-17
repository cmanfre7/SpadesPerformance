# Session Summary - Admin Dashboard + Supabase Invite Flow

## What Was Built

### Admin Dashboard (Shift+Ctrl+A → login with `spadesco2025`)
- **Events Manager**: Add/edit/publish events → populates homepage + events page
- **Members Manager**: Add/remove members, generate invite links, manage ranks (Member → Verified → OG hierarchy)
- **Merch Manager**: Add/edit merchandise items
- **Marketplace Manager**: Monitor market listings
- **Socials Manager**: Connect Instagram/TikTok, manage displayed posts
- **Content Manager**: Edit homepage text, stats, featured builds (with image upload/paste)
- **Collage Manager**: Manage homepage reel images/videos (Reset to Defaults button available)
- **Settings Manager**: Site config, data backup/import

### Supabase Invite System (NEW)
Real invite validation across devices. No more localStorage-only invites.

**API Routes Added:**
- `POST /api/admin/login` → sets HttpOnly admin cookie
- `POST /api/invites/generate` → creates invite in Supabase (admin-only)
- `GET /api/invites/validate?code=...` → checks if invite is valid/unused
- `POST /api/join` → submits join request + marks invite as used

**Database Schema:** `supabase/schema.sql`
- `invites` table (code, used, used_by, created_at)
- `join_requests` table (name, instagram, car, email, invite_code, created_at)

## Setup Required

1. Create Supabase project
2. Run `supabase/schema.sql` in Supabase SQL editor
3. Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=spadesco2025
```
4. `npm install`
5. `npm run dev`

## Key Files Changed/Added
- `src/app/admin/*` - Admin dashboard pages
- `src/components/admin/*` - All manager components
- `src/app/api/*` - API routes for login, invites, join
- `src/app/join/page.tsx` - Now validates via Supabase API
- `src/lib/supabase/server.ts` - Supabase server client
- `src/lib/admin-store.ts` - localStorage helpers (still used for non-invite data)
- `supabase/schema.sql` - Database schema
- `docs/env.example.txt` - Environment variable template

## Other Fixes
- Homepage events/countdown now loads from admin store
- Events page loads from admin store
- Invite links use `spadesdenver.club` domain
- Member ranks are hierarchical (OG includes Verified + Member)
- Single invite generation (not bulk 5)
- Dropdown menus styled for dark theme
- Featured builds support image upload/paste/URL

