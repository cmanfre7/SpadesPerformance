import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

// Sample media data - will be replaced with Supabase
const albums = [
  {
    id: "1",
    title: "Winter Night Meet - Dec 2024",
    date: "2024-12-14",
    coverImage: null,
    photoCount: 48,
    photographer: "mike_evo",
  },
  {
    id: "2",
    title: "Mountain Cruise - Nov 2024",
    date: "2024-11-23",
    coverImage: null,
    photoCount: 32,
    photographer: "photo_dan",
  },
  {
    id: "3",
    title: "Track Day @ CMP",
    date: "2024-11-10",
    coverImage: null,
    photoCount: 67,
    photographer: "speedshots",
  },
];

const shotOfTheWeek = {
  id: "featured-1",
  title: "Evo in the Snow",
  photographer: "mike_evo",
  car: "2006 Mitsubishi Evo IX",
  owner: "mike_evo",
  likes: 124,
};

const recentSubmissions = [
  { id: "sub-1", thumbnail: null, status: "approved" },
  { id: "sub-2", thumbnail: null, status: "approved" },
  { id: "sub-3", thumbnail: null, status: "pending" },
  { id: "sub-4", thumbnail: null, status: "approved" },
];

export default function MediaPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 px-4 bg-spades-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-4">Media</h1>
            <p className="text-white/60 max-w-2xl">
              Event photos, featured shots, and member submissions.
            </p>
          </div>
          <Link href="/media/submit" className="btn-secondary shrink-0">
            Submit Media
          </Link>
        </div>
      </section>

      {/* Shot of the Week */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-6">
            Shot of the Week
          </h2>
          <div className="card p-0 overflow-hidden">
            <div className="aspect-[21/9] bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center relative">
              <SpadeIcon className="w-24 h-24 text-white/10" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{shotOfTheWeek.title}</h3>
                    <p className="text-white/60">
                      {shotOfTheWeek.car} • @{shotOfTheWeek.owner}
                    </p>
                    <p className="text-sm text-white/40 mt-1">
                      Shot by @{shotOfTheWeek.photographer}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span>{shotOfTheWeek.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Albums */}
      <section className="py-12 px-4 bg-spades-dark">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-6">
            Event Albums
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/media/albums/${album.id}`}
                className="card p-0 overflow-hidden group"
              >
                <div className="aspect-video bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center relative">
                  <SpadeIcon className="w-12 h-12 text-white/10 group-hover:scale-110 transition-transform" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="text-sm font-semibold">{album.photoCount} photos</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 group-hover:text-white/80 transition-colors">
                    {album.title}
                  </h3>
                  <p className="text-sm text-white/50">
                    {new Date(album.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-white/40 mt-2">
                    📷 @{album.photographer}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/media/albums" className="text-sm text-white/50 hover:text-white transition-colors">
              View all albums →
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Submissions Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">
              Recent Submissions
            </h2>
            <Link href="/media/submit" className="text-sm text-white/50 hover:text-white transition-colors">
              Submit yours →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="aspect-square bg-gradient-to-br from-white/5 to-white/10 rounded-lg flex items-center justify-center relative overflow-hidden group"
              >
                <SpadeIcon className="w-8 h-8 text-white/10" />
                {submission.status === "pending" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                      Pending
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit CTA */}
      <section className="py-12 px-4 bg-spades-gray border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Got shots from an event?</h2>
          <p className="text-white/50 mb-6">
            Submit your photos for review. Approved shots get credited and featured.
          </p>
          <Link href="/media/submit" className="btn-primary">
            Submit Media
          </Link>
        </div>
      </section>
    </div>
  );
}
