import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

// Sample sponsor data - will be replaced with Supabase
const sponsors = [
  {
    id: "1",
    name: "Elite Wraps Denver",
    category: "Wrap Shop",
    description: "Full vehicle wraps, PPF, and custom designs. Spades-approved quality.",
    discount: "15% off full wraps",
    code: "SPADES15",
    tier: "verified",
    website: "https://elitewrapsdenver.com",
    rating: 4.9,
    reviewCount: 24,
  },
  {
    id: "2",
    name: "Denver Detail Co",
    category: "Detailing",
    description: "Premium paint correction, ceramic coating, and interior detailing.",
    discount: "10% off any service",
    code: "SPADESDETAIL",
    tier: "verified",
    website: "https://denverdetailco.com",
    rating: 5.0,
    reviewCount: 18,
  },
  {
    id: "3",
    name: "Apex Alignment",
    category: "Performance",
    description: "Corner balancing, alignments, and suspension setup. Track-ready.",
    discount: "Free alignment check",
    code: "SPADESAPEX",
    tier: "member",
    website: "https://apexalignment.com",
    rating: 4.8,
    reviewCount: 31,
  },
  {
    id: "4",
    name: "Mile High Tint",
    category: "Tint & PPF",
    description: "Window tint, PPF installation, and headlight protection.",
    discount: "$50 off PPF packages",
    code: "SPADES50",
    tier: "member",
    website: "https://milehightint.com",
    rating: 4.7,
    reviewCount: 12,
  },
  {
    id: "5",
    name: "High Plains Raceway",
    category: "Track",
    description: "2.55-mile road course. Track days and private rentals.",
    discount: "Early bird pricing",
    code: "Contact for details",
    tier: "verified",
    website: "https://highplainsraceway.com",
    rating: 4.9,
    reviewCount: 45,
  },
];

const categories = ["All", "Wrap Shop", "Detailing", "Performance", "Tint & PPF", "Track", "Parts"];

export default function SponsorsPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 px-4 bg-spades-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Partners & Sponsors</h1>
          <p className="text-white/60 max-w-2xl">
            Trusted shops supporting Denver&apos;s performance community. Exclusive discounts for members.
          </p>
        </div>
      </section>

      {/* Discount Access Notice */}
      <section className="py-4 px-4 bg-spades-gold/10 border-b border-spades-gold/30">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-sm">
          <svg className="w-5 h-5 text-spades-gold" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
          </svg>
          <span className="text-white/80">
            <strong className="text-spades-gold">Verified members</strong> unlock exclusive discount codes.
            <Link href="/join" className="ml-2 underline hover:text-white">
              Get verified →
            </Link>
          </span>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2">
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
        </div>
      </section>

      {/* Sponsors Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="card hover:border-white/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Logo Placeholder */}
                  <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <SpadeIcon className="w-10 h-10 text-white/20" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-lg">{sponsor.name}</h3>
                      {sponsor.tier === "verified" && (
                        <svg className="w-5 h-5 text-spades-gold" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-white/50">{sponsor.category}</span>
                    <p className="text-white/70 mt-2">{sponsor.description}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold">{sponsor.rating}</span>
                    <span className="text-white/50 text-sm">({sponsor.reviewCount} reviews)</span>
                  </div>
                </div>

                {/* Discount Section */}
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-400 font-semibold">{sponsor.discount}</p>
                      <p className="text-sm text-white/50 mt-1">
                        Code: <code className="bg-white/10 px-2 py-0.5 rounded">{sponsor.code}</code>
                      </p>
                    </div>
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm py-2"
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Sponsor CTA */}
      <section className="py-12 px-4 bg-spades-dark border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Want to partner with Spades?</h2>
          <p className="text-white/50 mb-6">
            We partner with quality shops that serve the Colorado performance community.
            Reach our verified members directly.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
