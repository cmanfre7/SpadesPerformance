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
    <div className="min-h-screen pt-32">
      {/* Header */}
      <section className="py-16 px-4 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xs text-white/30 font-mono tracking-widest mb-4">GARAGE</h1>
          <p className="text-white/50 text-sm">Member builds from the Spades crew</p>
        </div>
      </section>

      {/* Builds */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="text-center py-12 text-white/30 font-mono">Loading garages...</div>
          ) : garages.length === 0 ? (
            <div className="text-center py-12 text-white/30 font-mono">No garages yet</div>
          ) : (
            <div className="space-y-1">
              {garages.map((garage) => (
                <Link
                  key={garage.id}
                  href={`/garage/${garage.username}`}
                  className="block py-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      {/* Cover Image or Placeholder */}
                      <div className="w-24 h-16 bg-spades-gray rounded overflow-hidden flex items-center justify-center shrink-0">
                        {garage.cover_image ? (
                          <img src={garage.cover_image} alt={`${garage.year} ${garage.make} ${garage.model}`} className="w-full h-full object-cover" />
                        ) : (
                          <SpadeIcon className="w-6 h-6 text-white/10" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-white font-semibold text-base">
                            {garage.year} {garage.make} {garage.model}
                          </span>
                          {garage.rank && garage.rank !== "member" && (
                            <span className={`px-2 py-0.5 text-xs rounded-full border ${
                              garage.rank === "admin"
                                ? "border-red-500/40 text-red-300 bg-red-500/10"
                                : garage.rank === "og"
                                ? "border-spades-gold/50 text-spades-gold bg-spades-gold/10"
                                : "border-blue-400/50 text-blue-300 bg-blue-500/10"
                            }`}>
                              {garage.rank.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-white/40 text-sm font-mono">
                          {garage.platform && <span>{garage.platform}</span>}
                          {garage.platform && garage.power && <span className="text-white/10">|</span>}
                          {garage.power && <span>{garage.power}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/10 group-hover:ring-white/30 transition">
                        {garage.profile_pic ? (
                          <img src={garage.profile_pic} alt={garage.owner_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/40 text-sm font-semibold">
                            {garage.owner_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="leading-tight">
                        <div className="text-white/70 font-semibold text-sm group-hover:text-white transition-colors">
                          {garage.owner_name || garage.username}
                        </div>
                        <div className="text-xs text-white/30 font-mono group-hover:text-white/50 transition-colors">
                          @{garage.username}
                        </div>
                      </div>
                    </div>
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
