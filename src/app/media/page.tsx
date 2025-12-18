"use client";

import { useEffect } from "react";

export default function MediaPage() {
  useEffect(() => {
    // Load Elfsight script
    if (typeof window !== 'undefined' && !document.getElementById('elfsight-platform-script')) {
      const script = document.createElement('script');
      script.id = 'elfsight-platform-script';
      script.src = 'https://static.elfsight.com/platform/platform.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen pt-24">
      {/* Atmospheric Archive Header */}
      <section className="relative py-12 px-4 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
        
        {/* Dim streetlight glow from above */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] opacity-20"
          style={{
            background: 'radial-gradient(ellipse at center top, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.08) 40%, transparent 70%)',
          }}
        />
        
        {/* Subtle noise texture overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Dust particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-spades-gold/20 rounded-full animate-pulse"
              style={{
                left: `${15 + (i * 9)}%`,
                top: `${25 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + (i % 3)}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto text-center">
          {/* Small spade icon above */}
          <div className="text-spades-gold/25 text-xl mb-3">♠</div>
          
          {/* Main title with glow */}
          <h1 
            className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight"
            style={{
              textShadow: '0 0 30px rgba(212, 175, 55, 0.2), 0 0 60px rgba(212, 175, 55, 0.08)',
            }}
          >
            ARCHIVE
          </h1>
          
          {/* Subtle tagline */}
          <p className="text-white/20 text-xs font-mono tracking-widest uppercase">
            The Vault • Est. 2024
          </p>
          
          {/* Decorative line */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="w-10 h-px bg-gradient-to-r from-transparent to-spades-gold/25" />
            <div className="w-1.5 h-1.5 bg-spades-gold/25 rotate-45" />
            <div className="w-10 h-px bg-gradient-to-l from-transparent to-spades-gold/25" />
          </div>
        </div>
      </section>

      {/* Instagram Feed - Direct Elfsight Embed */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div 
            className="elfsight-app-b221f54f-117e-4bb1-a34e-9d493ca8450e" 
            data-elfsight-app-lazy
          />
        </div>
      </section>
    </div>
  );
}
