import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

// Sample car data - will be replaced with Supabase
const cars = [
  {
    id: "1",
    owner: "mike_evo",
    ownerName: "Mike R.",
    year: 2006,
    make: "Mitsubishi",
    model: "Lancer Evolution IX",
    color: "Apex Silver",
    image: null,
    power: "420whp",
    platform: "4G63",
    highlights: ["Built motor", "FP Red turbo", "6-speed swap"],
    wheelSetup: "Volk TE37 18x9.5 +22",
  },
  {
    id: "2",
    owner: "stisnow",
    ownerName: "Sarah T.",
    year: 2020,
    make: "Subaru",
    model: "WRX STI",
    color: "WR Blue Pearl",
    image: null,
    power: "340whp",
    platform: "EJ257",
    highlights: ["Stage 2+", "Flex fuel", "Coilovers"],
    wheelSetup: "Enkei RPF1 18x9.5 +38",
  },
  {
    id: "3",
    owner: "m3_dan",
    ownerName: "Dan K.",
    year: 2019,
    make: "BMW",
    model: "M3 Competition",
    color: "San Marino Blue",
    image: null,
    power: "503whp",
    platform: "S55",
    highlights: ["Downpipes", "JB4", "Track pack"],
    wheelSetup: "Apex ARC-8 19x10/19x11",
  },
  {
    id: "4",
    owner: "boosted_civic",
    ownerName: "Chris M.",
    year: 2018,
    make: "Honda",
    model: "Civic Type R",
    color: "Championship White",
    image: null,
    power: "380whp",
    platform: "K20C1",
    highlights: ["PRL turbo", "Built trans", "E85"],
    wheelSetup: "Rays 57CR 19x9.5 +45",
  },
];

const platforms = ["All", "4G63", "EJ257", "S55", "K20C1", "LS", "2JZ", "RB26"];

export default function GaragePage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 px-4 bg-spades-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-4">Garage</h1>
            <p className="text-white/60 max-w-2xl">
              Member builds. Specs. Mods. The real deal.
            </p>
          </div>
          <Link href="/garage/add" className="btn-primary shrink-0">
            + Add Your Car
          </Link>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <button
                key={platform}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  platform === "All"
                    ? "bg-white text-black"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {cars.map((car) => (
              <Link
                key={car.id}
                href={`/garage/${car.id}`}
                className="card hover:border-white/30 transition-colors group overflow-hidden"
              >
                {/* Car Image Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-white/5 to-white/10 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                  <SpadeIcon className="w-16 h-16 text-white/10" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="text-sm font-semibold">{car.power}</span>
                  </div>
                </div>

                {/* Car Info */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <p className="text-white/50 text-sm mb-3">{car.color}</p>
                  </div>
                  <span className="px-2 py-1 bg-white/10 text-xs rounded">
                    {car.platform}
                  </span>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {car.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="px-2 py-1 bg-white/5 text-white/70 text-xs rounded"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* Wheel Setup */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-white/50">
                    <span className="text-white/30">Wheels:</span> {car.wheelSetup}
                  </p>
                </div>

                {/* Owner */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <SpadeIcon className="w-4 h-4 text-white/30" />
                  </div>
                  <span className="text-sm text-white/60">
                    @{car.owner}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Garage Tools Promo */}
      <section className="py-12 px-4 bg-spades-dark border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Garage Tools</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Wheel Fitment</h3>
              <p className="text-sm text-white/50">Calculate offset, poke, and clearance</p>
            </div>
            <div className="card text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Ethanol Calc</h3>
              <p className="text-sm text-white/50">E30/E40 blend ratios</p>
            </div>
            <div className="card text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Track Checklist</h3>
              <p className="text-sm text-white/50">Pre-track day prep list</p>
            </div>
            <div className="card text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Maintenance Log</h3>
              <p className="text-sm text-white/50">Track oil changes & services</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
