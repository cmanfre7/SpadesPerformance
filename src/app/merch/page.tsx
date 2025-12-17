import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

// Sample merch data
const merch = [
  { id: "1", name: "Logo Tee", price: 35, inStock: true },
  { id: "2", name: "Hoodie", price: 65, inStock: true },
  { id: "3", name: "Sticker Pack", price: 12, inStock: true },
  { id: "4", name: "Snapback", price: 30, inStock: false },
];

export default function MerchPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 px-4 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xs text-white/30 font-mono tracking-widest mb-4">MERCH</h1>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {merch.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer"
              >
                {/* Image Placeholder */}
                <div className="aspect-square bg-spades-gray rounded mb-3 flex items-center justify-center relative overflow-hidden">
                  <SpadeIcon className="w-8 h-8 text-white/10" />
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <span className="text-xs text-white/40 font-mono">SOLD OUT</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="font-mono text-sm">
                  <p className="text-white/50 group-hover:text-white/70 transition-colors">{item.name}</p>
                  <p className="text-white/30">${item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Follow */}
      <section className="py-12 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <a
            href="https://www.instagram.com/spades_performance/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/20 hover:text-white/40 transition-colors font-mono"
          >
            @spades_performance
          </a>
        </div>
      </section>
    </div>
  );
}
