import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

// Sample marketplace data - will be replaced with Supabase
const listings = [
  {
    id: "1",
    title: "Volk TE37 18x9.5 +22",
    category: "Wheels",
    price: 2800,
    condition: "Used - Good",
    seller: "mike_evo",
    isVerified: true,
    location: "Denver",
    specs: {
      size: "18x9.5",
      offset: "+22",
      bolt: "5x114.3",
      tires: "265/35/18 Pilot Sport 4S (80%)",
    },
    postedDate: "2024-12-10",
    images: 0,
  },
  {
    id: "2",
    title: "Invidia Q300 Cat-back Exhaust",
    category: "Exhaust",
    price: 650,
    condition: "Used - Excellent",
    seller: "stisnow",
    isVerified: true,
    location: "Aurora",
    specs: {
      fitment: "2015-2021 Subaru WRX/STI",
      material: "Stainless Steel",
      tips: "Titanium burnt tips",
    },
    postedDate: "2024-12-08",
    images: 0,
  },
  {
    id: "3",
    title: "BC Racing BR Coilovers",
    category: "Suspension",
    price: 800,
    condition: "Used - Good",
    seller: "boosted_civic",
    isVerified: false,
    location: "Littleton",
    specs: {
      fitment: "10th Gen Civic",
      dampening: "30-way adjustable",
      condition: "15k miles",
    },
    postedDate: "2024-12-05",
    images: 0,
  },
];

const categories = [
  "All",
  "Wheels",
  "Tires",
  "Suspension",
  "Exhaust",
  "Engine",
  "Interior",
  "Exterior",
  "Services",
];

export default function MarketplacePage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 px-4 bg-spades-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-4">Marketplace</h1>
            <p className="text-white/60 max-w-2xl">
              Members-only parts market. Verified sellers. No scams.
            </p>
          </div>
          <Link href="/marketplace/new" className="btn-primary shrink-0">
            + Post Listing
          </Link>
        </div>
      </section>

      {/* Members Only Notice */}
      <section className="py-4 px-4 bg-spades-gold/10 border-b border-spades-gold/30">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-sm">
          <svg className="w-5 h-5 text-spades-gold" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span className="text-white/80">
            <strong className="text-spades-gold">Members only.</strong> You must be a member to buy or sell.
            <Link href="/join" className="ml-2 underline hover:text-white">
              Join now →
            </Link>
          </span>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  category === "All"
                    ? "bg-white text-black"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <select className="bg-spades-gray border border-white/10 rounded-lg px-4 py-2 text-sm">
              <option>All Locations</option>
              <option>Denver</option>
              <option>Aurora</option>
              <option>Lakewood</option>
            </select>
            <select className="bg-spades-gray border border-white/10 rounded-lg px-4 py-2 text-sm">
              <option>Sort: Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" className="rounded border-white/20" />
              Verified sellers only
            </label>
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/marketplace/${listing.id}`}
                className="card hover:border-white/30 transition-colors group"
              >
                {/* Image Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-white/5 to-white/10 rounded-lg mb-4 flex items-center justify-center">
                  <SpadeIcon className="w-12 h-12 text-white/10" />
                </div>

                {/* Listing Info */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-semibold group-hover:text-white/80 transition-colors">
                      {listing.title}
                    </h3>
                    <p className="text-sm text-white/50">{listing.category}</p>
                  </div>
                  <span className="text-xl font-bold text-green-400">
                    ${listing.price.toLocaleString()}
                  </span>
                </div>

                {/* Specs Preview */}
                <div className="space-y-1 mb-4 text-sm text-white/60">
                  {Object.entries(listing.specs)
                    .slice(0, 2)
                    .map(([key, value]) => (
                      <p key={key}>
                        <span className="text-white/40">{key}:</span> {value}
                      </p>
                    ))}
                </div>

                {/* Seller & Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                      <SpadeIcon className="w-3 h-3 text-white/30" />
                    </div>
                    <span className="text-sm text-white/60">@{listing.seller}</span>
                    {listing.isVerified && (
                      <svg className="w-4 h-4 text-spades-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-white/40">{listing.location}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Selling Guidelines */}
      <section className="py-12 px-4 bg-spades-dark border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Marketplace Rules</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Verified Sellers</h3>
              <p className="text-white/50 text-sm">
                Verified members get a badge. More trust, more sales.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Use Templates</h3>
              <p className="text-white/50 text-sm">
                Wheels/tires have required fields. Size, offset, bolt pattern.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Report Scams</h3>
              <p className="text-white/50 text-sm">
                See something sketchy? Report it. We ban scammers fast.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
