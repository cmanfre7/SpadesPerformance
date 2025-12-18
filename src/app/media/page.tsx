"use client";

import { useEffect, useState, useMemo } from "react";
import { adminStore } from "@/lib/admin-store";

// Helper function to extract TikTok video ID from URL
function extractTikTokVideoId(url: string): string | null {
  const match = url.match(/video\/(\d+)/);
  return match?.[1] || null;
}

// TikTok Video Component
function TikTokVideoCard({ url }: { url: string }) {
  const videoId = useMemo(() => extractTikTokVideoId(url), [url]);
  
  if (!videoId) return null;

  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-spades-gold/60 transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] max-w-[380px] w-full mx-auto backdrop-blur-sm">
      {/* TikTok Badge */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2 py-1 bg-black/80 backdrop-blur-sm rounded-full shadow-lg">
        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
        <span className="text-white text-xs font-semibold">TikTok</span>
      </div>
      
      {/* External Link Icon */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-2 right-2 z-10 w-7 h-7 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>

      {/* Video Embed */}
      <div
        className="relative bg-black overflow-hidden aspect-[9/16] min-h-[520px] max-h-[80vh] rounded-b-2xl"
      >
        <iframe
          src={`https://www.tiktok.com/embed/v2/${videoId}`}
          className="absolute inset-0 w-full h-full"
          allow="encrypted-media; fullscreen"
          scrolling="no"
          frameBorder="0"
          style={{ border: "none" }}
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState<"all" | "instagram" | "tiktok">("all");
  const [tiktokVideos, setTiktokVideos] = useState<string[]>([]);

  useEffect(() => {
    // Load Elfsight script
    if (typeof window !== 'undefined' && !document.getElementById('elfsight-platform-script')) {
      const script = document.createElement('script');
      script.id = 'elfsight-platform-script';
      script.src = 'https://static.elfsight.com/platform/platform.js';
      script.async = true;
      document.body.appendChild(script);
    }

    // Load TikTok videos from admin store
    const siteContent = adminStore.getSiteContent();
    setTiktokVideos(siteContent.tiktokVideos || []);
  }, []);

  const validTikTokVideos = useMemo(() => {
    return tiktokVideos.filter(url => extractTikTokVideoId(url) !== null);
  }, [tiktokVideos]);

  return (
    <div className="min-h-screen pt-24 relative overflow-hidden">
      {/* Concrete Texture Background */}
      <div 
        className="fixed inset-0 -z-10 opacity-20"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px),
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.03) 0%, transparent 50%),
            linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%'
        }}
      />

      {/* Dark Lighting Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-spades-gold/5 rounded-full blur-3xl opacity-10" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl opacity-8" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl opacity-5" />
      </div>

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

      {/* Tab Navigation */}
      {(validTikTokVideos.length > 0) && (
        <section className="px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-2 rounded-lg font-mono text-sm transition-all ${
                  activeTab === "all"
                    ? "bg-spades-gold text-black font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("instagram")}
                className={`px-6 py-2 rounded-lg font-mono text-sm transition-all ${
                  activeTab === "instagram"
                    ? "bg-spades-gold text-black font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                Instagram
              </button>
              <button
                onClick={() => setActiveTab("tiktok")}
                className={`px-6 py-2 rounded-lg font-mono text-sm transition-all ${
                  activeTab === "tiktok"
                    ? "bg-spades-gold text-black font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                TikTok
              </button>
            </div>
          </div>
        </section>
      )}

      {/* TikTok Videos Section */}
      {validTikTokVideos.length > 0 && (activeTab === "all" || activeTab === "tiktok") && (
        <section className="px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <svg className="w-6 h-6 text-spades-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <span>TikTok Reels</span>
              </h2>
              <p className="text-white/40 text-sm font-mono">Latest from the streets</p>
            </div>

            {/* TikTok Grid - Masonry style for vertical videos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {validTikTokVideos.map((url, index) => (
                <TikTokVideoCard key={index} url={url} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Instagram Feed - Direct Elfsight Embed */}
      {(activeTab === "all" || activeTab === "instagram") && (
        <section className="px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            {activeTab === "all" && validTikTokVideos.length > 0 && (
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                  <svg className="w-6 h-6 text-spades-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram Feed</span>
                </h2>
                <p className="text-white/40 text-sm font-mono">Gallery of moments</p>
              </div>
            )}
            <div 
              className="elfsight-app-b221f54f-117e-4bb1-a34e-9d493ca8450e" 
              data-elfsight-app-lazy
            />
          </div>
        </section>
      )}
    </div>
  );
}
