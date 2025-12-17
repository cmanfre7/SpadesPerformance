import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

// Sample archive data - will be replaced with Supabase
const archive = [
  { id: "1", date: "12.14.25", location: "DENVER", count: 48 },
  { id: "2", date: "12.07.25", location: "COMMERCE CITY", count: 32 },
  { id: "3", date: "11.30.25", location: "DENVER", count: 67 },
  { id: "4", date: "11.23.25", location: "PRIVATE", count: 24 },
  { id: "5", date: "11.16.25", location: "DENVER", count: 41 },
  { id: "6", date: "11.09.25", location: "DENVER", count: 38 },
];

// Grid items - individual shots
const shots = Array.from({ length: 12 }, (_, i) => ({
  id: `shot-${i + 1}`,
  date: `${12 - Math.floor(i / 4)}.${14 - (i % 4) * 7}.25`,
}));

export default function MediaPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xs text-white/30 font-mono tracking-widest mb-4">ARCHIVE</h1>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-1">
            {shots.map((shot) => (
              <div
                key={shot.id}
                className="aspect-square bg-spades-gray relative group cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                <SpadeIcon className="absolute inset-0 m-auto w-8 h-8 text-white/5" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-xs text-white/50 font-mono">{shot.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sets */}
      <section className="py-12 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs text-white/20 font-mono mb-8 tracking-widest">SETS</h2>

          <div className="space-y-1">
            {archive.map((set) => (
              <Link
                key={set.id}
                href={`/media/${set.id}`}
                className="block py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
              >
                <div className="font-mono text-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-white/40">{set.date}</span>
                    <span className="text-white/10">/</span>
                    <span className="text-white/50">{set.location}</span>
                  </div>
                  <span className="text-xs text-white/20 group-hover:text-white/40 transition-colors">
                    {set.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Submit - Minimal */}
      <section className="py-12 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/media/submit"
            className="text-xs text-white/30 hover:text-white/50 transition-colors font-mono"
          >
            Submit
          </Link>
        </div>
      </section>
    </div>
  );
}
