"use client";

import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";
import { useState } from "react";

// Merch data with lifestyle shots
const merch = [
  { 
    id: "1", 
    name: "SPADES LOGO TEE", 
    price: 35, 
    inStock: true,
    description: "Premium heavyweight cotton. Gold embroidered spade.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White"],
  },
  { 
    id: "2", 
    name: "MIDNIGHT HOODIE", 
    price: 75, 
    inStock: true,
    description: "Oversized fit. Puff print logo. Built for the cold nights.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    featured: true,
  },
  { 
    id: "3", 
    name: "CREW CREWNECK", 
    price: 60, 
    inStock: true,
    description: "Fleece lined. Embroidered chest hit.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Charcoal"],
  },
  { 
    id: "4", 
    name: "RACING CAP", 
    price: 32, 
    inStock: true,
    description: "Structured snapback. Gold metal spade clasp.",
    sizes: ["One Size"],
    colors: ["Black"],
  },
  { 
    id: "5", 
    name: "STICKER PACK", 
    price: 15, 
    inStock: true,
    description: "10 die-cut stickers. Weatherproof vinyl.",
    sizes: ["N/A"],
    colors: ["Multi"],
  },
  { 
    id: "6", 
    name: "PERFORMANCE JACKET", 
    price: 120, 
    inStock: false,
    description: "Windbreaker. Reflective details. Limited drop.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    limited: true,
  },
];

export default function MerchPage() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Background texture */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} 
      />

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-spades-gold/5 rounded-full blur-[150px]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tight mb-6">
                MERCH
              </h1>
              <p className="text-white/30 text-base mb-8 max-w-sm">
                Members only. Limited quantities.
              </p>
              <div className="flex gap-4">
                <a href="#shop" className="px-6 py-3 bg-white text-black font-bold uppercase text-sm tracking-wider hover:bg-white/90 transition-all">
                  View
                </a>
              </div>
            </div>

            {/* Hero Image - Lifestyle Shot Mockup */}
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-spades-gray to-spades-black rounded-lg overflow-hidden relative group">
                {/* Placeholder for lifestyle shot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 relative">
                      {/* Hoodie mockup illustration */}
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Hoodie shape */}
                        <path d="M20 35 L30 25 L40 30 L50 20 L60 30 L70 25 L80 35 L85 80 L15 80 Z" fill="#1a1a1a" stroke="#d4af37" strokeWidth="1"/>
                        {/* Hood */}
                        <path d="M30 25 Q50 5 70 25" fill="none" stroke="#d4af37" strokeWidth="1"/>
                        {/* Spade logo on chest */}
                        <path d="M50 45 C50 45 42 55 42 60 C42 64 45 67 48 67 C48 67 47 70 50 70 C53 70 52 67 52 67 C55 67 58 64 58 60 C58 55 50 45 50 45Z" fill="#d4af37"/>
                      </svg>
                    </div>
                    <p className="text-white/20 text-sm font-mono">MIDNIGHT HOODIE</p>
                    <p className="text-spades-gold text-2xl font-bold mt-2">$75</p>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 text-xs text-white/20 font-mono">001/500</div>
                <div className="absolute bottom-4 left-4 text-xs text-spades-gold/40 font-mono tracking-widest">SPADES™</div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 px-4 py-2 bg-spades-gold text-black text-xs font-bold uppercase tracking-wider">
                New Drop
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="shop" className="py-20 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-xl font-bold text-white/40">Shop</h2>
            <span className="text-white/20 text-xs font-mono">{merch.length}</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {merch.map((item, index) => (
              <div
                key={item.id}
                className="group cursor-pointer"
                onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
              >
                {/* Product Image */}
                <div className="aspect-[3/4] bg-gradient-to-br from-spades-gray to-spades-dark rounded-lg mb-4 relative overflow-hidden">
                  {/* Product visualization */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    {item.name.includes("TEE") && (
                      <svg viewBox="0 0 100 100" className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity">
                        <path d="M25 20 L35 15 L50 25 L65 15 L75 20 L80 35 L70 40 L70 85 L30 85 L30 40 L20 35 Z" fill="#1a1a1a" stroke="#333" strokeWidth="0.5"/>
                        <path d="M50 45 C50 45 44 52 44 56 C44 59 46 61 48 61 C48 61 47 63 50 63 C53 63 52 61 52 61 C54 61 56 59 56 56 C56 52 50 45 50 45Z" fill="#d4af37"/>
                      </svg>
                    )}
                    {item.name.includes("HOODIE") && (
                      <svg viewBox="0 0 100 100" className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity">
                        <path d="M20 35 L30 25 L40 30 L50 20 L60 30 L70 25 L80 35 L85 85 L15 85 Z" fill="#1a1a1a" stroke="#333" strokeWidth="0.5"/>
                        <path d="M30 25 Q50 5 70 25" fill="none" stroke="#333" strokeWidth="0.5"/>
                        <path d="M50 45 C50 45 42 55 42 60 C42 64 45 67 48 67 C48 67 47 70 50 70 C53 70 52 67 52 67 C55 67 58 64 58 60 C58 55 50 45 50 45Z" fill="#d4af37"/>
                      </svg>
                    )}
                    {item.name.includes("CREWNECK") && (
                      <svg viewBox="0 0 100 100" className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity">
                        <path d="M25 25 L35 20 L50 30 L65 20 L75 25 L80 40 L70 45 L70 85 L30 85 L30 45 L20 40 Z" fill="#1a1a1a" stroke="#333" strokeWidth="0.5"/>
                        <ellipse cx="50" cy="28" rx="12" ry="6" fill="none" stroke="#333" strokeWidth="0.5"/>
                        <path d="M50 50 C50 50 46 54 46 56 C46 58 48 59 50 59 C52 59 54 58 54 56 C54 54 50 50 50 50Z" fill="#d4af37"/>
                      </svg>
                    )}
                    {item.name.includes("CAP") && (
                      <svg viewBox="0 0 100 100" className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity">
                        <ellipse cx="50" cy="55" rx="35" ry="15" fill="#1a1a1a" stroke="#333" strokeWidth="0.5"/>
                        <path d="M15 55 Q15 30 50 25 Q85 30 85 55" fill="#1a1a1a" stroke="#333" strokeWidth="0.5"/>
                        <path d="M20 55 L10 70 Q50 80 90 70 L80 55" fill="#1a1a1a" stroke="#333" strokeWidth="0.5"/>
                        <path d="M50 35 C50 35 46 40 46 43 C46 45 48 46 50 46 C52 46 54 45 54 43 C54 40 50 35 50 35Z" fill="#d4af37"/>
                      </svg>
                    )}
                    {item.name.includes("STICKER") && (
                      <div className="grid grid-cols-3 gap-2 p-4">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="aspect-square bg-spades-dark rounded flex items-center justify-center">
                            <SpadeIcon className="w-6 h-6 text-spades-gold/60" />
                          </div>
                        ))}
                      </div>
                    )}
                    {item.name.includes("JACKET") && (
                      <svg viewBox="0 0 100 100" className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity">
                        <path d="M20 25 L30 20 L40 25 L50 20 L60 25 L70 20 L80 25 L90 40 L85 85 L15 85 L10 40 Z" fill="#1a1a1a" stroke="#333" strokeWidth="0.5"/>
                        <line x1="50" y1="25" x2="50" y2="85" stroke="#333" strokeWidth="0.5"/>
                        <path d="M50 40 C50 40 44 48 44 52 C44 56 47 58 50 58 C53 58 56 56 56 52 C56 48 50 40 50 40Z" fill="#d4af37"/>
                      </svg>
                    )}
                  </div>

                  {/* Badges */}
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <span className="text-sm text-white/60 font-mono tracking-widest">SOLD OUT</span>
                    </div>
                  )}
                  {item.limited && item.inStock && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-spades-gold text-black text-[10px] font-bold uppercase tracking-wider">
                      Limited
                    </div>
                  )}
                  {item.featured && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-wider">
                      Best Seller
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-spades-gold/0 group-hover:bg-spades-gold/5 transition-colors duration-300" />
                </div>

                {/* Product Info */}
                <div>
                  <h3 className="text-sm font-bold text-white/80 group-hover:text-white transition-colors mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-white/30 mb-2 line-clamp-1">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-spades-gold font-bold">${item.price}</span>
                    <span className="text-[10px] text-white/20 font-mono">{item.sizes.join(" / ")}</span>
                  </div>
                </div>

                {/* Expanded details */}
                {selectedItem === item.id && (
                  <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-white/50 mb-3">{item.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.sizes.map(size => (
                        <span key={size} className="px-2 py-1 text-[10px] border border-white/20 text-white/40 rounded">
                          {size}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {item.colors.map(color => (
                        <span key={color} className="text-[10px] text-white/30">{color}</span>
                      ))}
                    </div>
                    {item.inStock && (
                      <button className="w-full mt-4 py-2 bg-spades-gold text-black text-xs font-bold uppercase tracking-wider hover:bg-spades-gold/90 transition-colors">
                        Coming Soon
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifestyle Section */}
      <section className="py-20 px-4 border-t border-white/5 bg-gradient-to-b from-transparent to-spades-dark/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white/60">Tagged</h2>
          </div>

          {/* Photo grid mockup */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-spades-gray rounded-lg overflow-hidden relative group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <SpadeIcon className="w-8 h-8 text-white/10 mx-auto mb-2" />
                    <p className="text-[10px] text-white/20 font-mono">@crew_member_{i}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-spades-gold/0 group-hover:bg-spades-gold/10 transition-colors" />
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a 
              href="https://www.instagram.com/spades_performance/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/20 hover:text-white/40 transition-colors font-mono text-xs"
            >
              @spades_performance
            </a>
          </div>
        </div>
      </section>

      {/* Size Guide */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-lg font-bold mb-4">Size Guide</h3>
          <p className="text-white/40 text-sm mb-6">All apparel runs true to size. Hoodies are oversized fit.</p>
          <div className="grid grid-cols-5 gap-2 text-xs font-mono">
            <div className="p-2 bg-white/5 rounded">
              <div className="text-white/60">S</div>
              <div className="text-white/30">34-36"</div>
            </div>
            <div className="p-2 bg-white/5 rounded">
              <div className="text-white/60">M</div>
              <div className="text-white/30">38-40"</div>
            </div>
            <div className="p-2 bg-white/5 rounded">
              <div className="text-white/60">L</div>
              <div className="text-white/30">42-44"</div>
            </div>
            <div className="p-2 bg-white/5 rounded">
              <div className="text-white/60">XL</div>
              <div className="text-white/30">46-48"</div>
            </div>
            <div className="p-2 bg-white/5 rounded">
              <div className="text-white/60">XXL</div>
              <div className="text-white/30">50-52"</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <SpadeIcon className="w-6 h-6 text-white/10 mx-auto mb-4" />
          <p className="text-white/20 text-xs font-mono">Updates on IG</p>
        </div>
      </section>
    </div>
  );
}
