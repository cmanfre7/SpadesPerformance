import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

// Sample car data - will be replaced with Supabase
const cars = [
  {
    id: "1",
    owner: "mike_evo",
    year: 2006,
    make: "Mitsubishi",
    model: "Evo IX",
    power: "420whp",
    platform: "4G63",
  },
  {
    id: "2",
    owner: "stisnow",
    year: 2020,
    make: "Subaru",
    model: "STI",
    power: "340whp",
    platform: "EJ257",
  },
  {
    id: "3",
    owner: "m3_dan",
    year: 2019,
    make: "BMW",
    model: "M3",
    power: "503whp",
    platform: "S55",
  },
  {
    id: "4",
    owner: "boosted_civic",
    year: 2018,
    make: "Honda",
    model: "CTR",
    power: "380whp",
    platform: "K20C1",
  },
];

export default function GaragePage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 px-4 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xs text-white/30 font-mono tracking-widest mb-4">GARAGE</h1>
        </div>
      </section>

      {/* Builds */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-1">
            {cars.map((car) => (
              <Link
                key={car.id}
                href={`/garage/${car.id}`}
                className="block py-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    {/* Thumbnail placeholder */}
                    <div className="w-20 h-14 bg-spades-gray rounded flex items-center justify-center shrink-0">
                      <SpadeIcon className="w-6 h-6 text-white/10" />
                    </div>

                    <div className="font-mono text-sm">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-white/70">{car.year} {car.make} {car.model}</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/30">
                        <span>{car.platform}</span>
                        <span className="text-white/10">|</span>
                        <span>{car.power}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-white/20 font-mono group-hover:text-white/40 transition-colors">
                    @{car.owner}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/garage/add"
            className="block mt-8 text-xs text-white/20 hover:text-white/40 transition-colors font-mono text-center"
          >
            Add build
          </Link>
        </div>
      </section>
    </div>
  );
}
