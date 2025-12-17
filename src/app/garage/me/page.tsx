"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  profile_pic: string | null;
  bio: string | null;
  car: string | null;
  instagram: string | null;
  tiktok: string | null;
  rank: string | null;
};

export default function MyGaragePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.user) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-white/30 font-mono">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const getRankDisplay = (rank: string | null) => {
    switch (rank) {
      case "admin":
        return { label: "ADMIN", color: "text-red-400" };
      case "og":
        return { label: "OG", color: "text-spades-gold" };
      case "verified":
        return { label: "VERIFIED", color: "text-blue-400" };
      default:
        return { label: "MEMBER", color: "text-white" };
    }
  };

  const rankDisplay = getRankDisplay(user.rank);

  return (
    <div className="min-h-screen pt-32 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/10 overflow-hidden">
              {user.profile_pic ? (
                <img src={user.profile_pic} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/30 text-3xl">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <span className={`px-2 py-0.5 text-xs rounded ${
                  user.rank === "admin" ? "bg-red-500/20 text-red-400" :
                  user.rank === "og" ? "bg-spades-gold/20 text-spades-gold" :
                  user.rank === "verified" ? "bg-blue-500/20 text-blue-400" :
                  "bg-white/10 text-white/50"
                }`}>
                  {rankDisplay.label}
                </span>
              </div>
              <p className="text-white/40 font-mono">@{user.username}</p>
              {user.bio && <p className="text-white/50 text-sm mt-1">{user.bio}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/garage/${user.username}`}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
            >
              View Public Profile
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white/50 hover:text-white transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/garage/me/edit"
            className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-spades-gold/30 transition-colors group"
          >
            <div className="text-2xl mb-2">👤</div>
            <h3 className="text-white font-bold mb-1 group-hover:text-spades-gold transition-colors text-sm">Edit Profile</h3>
            <p className="text-white/40 text-xs">Update your bio & info</p>
          </Link>

          {/* Garage Card - different based on rank */}
          {["verified", "og", "admin"].includes(user.rank || "") ? (
            <Link
              href="/garage/create"
              className="bg-spades-gold/10 rounded-xl p-5 border border-spades-gold/20 hover:border-spades-gold/40 transition-colors group"
            >
              <div className="text-2xl mb-2">🚗</div>
              <h3 className="text-spades-gold font-bold mb-1 text-sm">My Garage</h3>
              <p className="text-white/40 text-xs">Create your public build page</p>
            </Link>
          ) : (
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 opacity-50">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="text-white/50 font-bold mb-1 text-sm">Garage Locked</h3>
              <p className="text-white/30 text-xs">Get Verified to unlock</p>
            </div>
          )}

          <Link
            href="/market/my-listings"
            className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-spades-gold/30 transition-colors group"
          >
            <div className="text-2xl mb-2">🏪</div>
            <h3 className="text-white font-bold mb-1 group-hover:text-spades-gold transition-colors text-sm">My Listings</h3>
            <p className="text-white/40 text-xs">Marketplace posts</p>
          </Link>

          <Link
            href="/market/new"
            className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-spades-gold/30 transition-colors group"
          >
            <div className="text-2xl mb-2">➕</div>
            <h3 className="text-white font-bold mb-1 group-hover:text-spades-gold transition-colors text-sm">New Listing</h3>
            <p className="text-white/40 text-xs">Post something for sale</p>
          </Link>
        </div>

        {/* User Info */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Profile Info</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {user.car && (
              <div>
                <div className="text-white/40">Car</div>
                <div className="text-white">{user.car}</div>
              </div>
            )}
            {user.instagram && (
              <div>
                <div className="text-white/40">Instagram</div>
                <a href={`https://instagram.com/${user.instagram.replace("@", "")}`} target="_blank" className="text-spades-gold hover:underline">{user.instagram}</a>
              </div>
            )}
            {user.tiktok && (
              <div>
                <div className="text-white/40">TikTok</div>
                <a href={`https://tiktok.com/@${user.tiktok.replace("@", "")}`} target="_blank" className="text-white/70 hover:underline">{user.tiktok}</a>
              </div>
            )}
            <div>
              <div className="text-white/40">Email</div>
              <div className="text-white/70">{user.email}</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <SpadeIcon className="w-5 h-5 text-spades-gold" />
            Member Dashboard
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-white/40 text-sm">Events Attended</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-white/40 text-sm">Marketplace Listings</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-white/40 text-sm">Garage Photos</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className={`text-2xl font-bold ${rankDisplay.color}`}>{rankDisplay.label}</div>
              <div className="text-white/40 text-sm">Rank</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
