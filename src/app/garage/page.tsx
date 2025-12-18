"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

type GarageEntry = {
  id: string;
  user_id: string;
  username: string;
  owner_name: string;
  profile_pic: string | null;
  rank: string | null;
  year: number;
  make: string;
  model: string;
  power: string | null;
  platform: string | null;
  description: string | null;
  cover_image: string | null;
  created_at: string;
};

export default function GaragePage() {
  const [garages, setGarages] = useState<GarageEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/garages")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setGarages(data.garages || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-32 relative overflow-hidden">
      {/* Concrete Texture Background */}
      <div 
        className="fixed inset-0 -z-10 opacity-25"
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
      
      {/* Dark Lighting Effects - Spotlights */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-spades-gold/5 rounded-full blur-3xl opacity-10" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl opacity-8" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl opacity-5" />
      </div>

      {/* Subtle Grid Overlay */}
      <div 
        className="fixed inset-0 -z-10 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Header */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Spotlight effect on header */}
            <div className="absolute -top-10 left-0 w-64 h-32 bg-spades-gold/10 rounded-full blur-2xl opacity-30" />
            <h1 className="relative text-6xl md:text-7xl font-black text-white mb-3 tracking-tight" style={{ textShadow: '0 0 30px rgba(212, 175, 55, 0.3)' }}>
              GARAGE
            </h1>
            <div className="relative flex items-center gap-4">
              <div className="h-px bg-gradient-to-r from-spades-gold/50 via-white/20 to-transparent flex-1" />
              <p className="text-white/60 text-sm font-mono tracking-wider uppercase">Member Builds</p>
              <div className="h-px bg-gradient-to-l from-spades-gold/50 via-white/20 to-transparent flex-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Builds */}
      <section className="relative py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-spades-gold/30 border-t-spades-gold rounded-full animate-spin" />
              <p className="mt-4 text-white/40 font-mono text-sm tracking-wider">Loading builds...</p>
            </div>
          ) : garages.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-8 bg-white/5 rounded-xl border border-white/10">
                <SpadeIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/40 font-mono text-sm tracking-wider">No builds yet</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {garages.map((garage, index) => (
                <Link
                  key={garage.id}
                  href={`/garage/${garage.username}`}
                  className="group relative block"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Card with concrete/industrial feel */}
                  <div className="relative bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden transition-all duration-500 group-hover:border-spades-gold/40 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] group-hover:scale-[1.02]">
                    {/* Subtle concrete texture overlay */}
                    <div 
                      className="absolute inset-0 opacity-20 pointer-events-none"
                      style={{
                        backgroundImage: `
                          repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px)
                        `
                      }}
                    />
                    
                    {/* Spotlight effect on hover */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%)'
                      }}
                    />
                    
                    {/* Content */}
                    <div className="relative p-6">
                      <div className="flex gap-4">
                        {/* Cover Image - Larger and more prominent */}
                        <div className="relative w-32 h-20 rounded overflow-hidden border border-white/10 group-hover:border-spades-gold/50 transition-colors shrink-0 shadow-lg">
                          {garage.cover_image ? (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                              <img 
                                src={garage.cover_image} 
                                alt={`${garage.year} ${garage.make} ${garage.model}`} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                              />
                            </>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                              <SpadeIcon className="w-8 h-8 text-white/20" />
                            </div>
                          )}
                        </div>

                        {/* Car Info */}
                        <div className="flex-1 min-w-0">
                          <div className="mb-2">
                            <h3 className="text-white font-black text-lg mb-1 group-hover:text-spades-gold transition-colors">
                              {garage.year} {garage.make} {garage.model}
                            </h3>
                            <div className="flex items-center gap-2 text-white/50 text-xs font-mono">
                              {garage.platform && (
                                <span className="px-2 py-0.5 bg-white/5 rounded border border-white/10">
                                  {garage.platform}
                                </span>
                              )}
                              {garage.power && (
                                <span className="px-2 py-0.5 bg-green-500/10 rounded border border-green-500/20 text-green-400">
                                  {garage.power}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Owner Info */}
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                            <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/20 group-hover:ring-spades-gold/50 transition-all shrink-0">
                              {garage.profile_pic ? (
                                <img src={garage.profile_pic} alt={garage.owner_name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/40 text-xs font-bold">
                                  {garage.owner_name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <div className="text-white/80 font-semibold text-sm truncate group-hover:text-white transition-colors">
                                  {garage.owner_name || garage.username}
                                </div>
                                {garage.rank && garage.rank !== "member" && (
                                  <span className={`px-2 py-0.5 text-[10px] rounded-full border font-bold shrink-0 ${
                                    garage.rank === "admin"
                                      ? "border-red-500/60 text-red-300 bg-red-500/20 backdrop-blur-sm"
                                      : garage.rank === "og"
                                      ? "border-spades-gold/60 text-spades-gold bg-spades-gold/20 backdrop-blur-sm"
                                      : "border-blue-400/60 text-blue-300 bg-blue-500/20 backdrop-blur-sm"
                                  }`}>
                                    {garage.rank.toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-white/40 font-mono truncate group-hover:text-white/60 transition-colors">
                                @{garage.username}
                              </div>
                            </div>
                            {/* Arrow indicator */}
                            <div className="text-white/30 group-hover:text-spades-gold group-hover:translate-x-1 transition-all">
                              →
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-spades-gold/0 to-transparent group-hover:via-spades-gold/50 transition-all duration-500" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
