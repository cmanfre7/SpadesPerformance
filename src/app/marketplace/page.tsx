import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

// Sample marketplace data - will be replaced with Supabase
const listings = [
  {
    id: "1",
    title: "Volk TE37 18x9.5 +22",
    category: "Wheels",
    price: 2800,
    seller: "mike_evo",
    verified: true,
    location: "Denver",
  },
  {
    id: "2",
    title: "Invidia Q300 Cat-back",
    category: "Exhaust",
    price: 650,
    seller: "stisnow",
    verified: true,
    location: "Aurora",
  },
  {
    id: "3",
    title: "BC Racing BR Coilovers",
    category: "Suspension",
    price: 800,
    seller: "boosted_civic",
    verified: false,
    location: "Littleton",
  },
];

export default function MarketplacePage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 px-4 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xs text-white/30 font-mono tracking-widest mb-4">MARKET</h1>
          <p className="text-white/20 text-xs font-mono">
            Members only
          </p>
        </div>
      </section>

      {/* Listings */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-1">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/marketplace/${listing.id}`}
                className="block py-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    {/* Thumbnail placeholder */}
                    <div className="w-16 h-16 bg-spades-gray rounded flex items-center justify-center shrink-0">
                      <SpadeIcon className="w-5 h-5 text-white/10" />
                    </div>

                    <div className="font-mono text-sm">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-white/70">{listing.title}</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/30">
                        <span>{listing.category}</span>
                        <span className="text-white/10">|</span>
                        <span>{listing.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="text-sm text-white/50 font-mono">
                      ${listing.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-white/20 font-mono group-hover:text-white/40 transition-colors">
                      @{listing.seller}
                      {listing.verified && (
                        <span className="text-spades-gold/50 ml-1">*</span>
                      )}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/marketplace/new"
            className="block mt-8 text-xs text-white/20 hover:text-white/40 transition-colors font-mono text-center"
          >
            Post listing
          </Link>
        </div>
      </section>
    </div>
  );
}
