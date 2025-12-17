import Link from "next/link";

// Sample partner data
const partners = [
  { id: "1", name: "Elite Wraps", category: "Wraps", code: "SPADES15" },
  { id: "2", name: "Denver Detail Co", category: "Detail", code: "SPADESDETAIL" },
  { id: "3", name: "Apex Alignment", category: "Performance", code: "SPADESAPEX" },
  { id: "4", name: "Mile High Tint", category: "Tint", code: "SPADES50" },
  { id: "5", name: "High Plains Raceway", category: "Track", code: null },
];

export default function SponsorsPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 px-4 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xs text-white/30 font-mono tracking-widest mb-4">PARTNERS</h1>
          <p className="text-white/20 text-xs font-mono">
            Codes for verified members
          </p>
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-1">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="py-6 border-b border-white/5"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="font-mono text-sm">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-white/70">{partner.name}</span>
                    </div>
                    <span className="text-white/30">{partner.category}</span>
                  </div>

                  {partner.code ? (
                    <code className="text-xs text-white/30 font-mono bg-white/5 px-3 py-1 rounded">
                      {partner.code}
                    </code>
                  ) : (
                    <span className="text-xs text-white/20 font-mono">Contact</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
