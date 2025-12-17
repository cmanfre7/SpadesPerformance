"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Redirect to member dashboard/garage
      window.location.href = "/garage/me";
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-12">
      <div className="max-w-sm w-full">
        {/* Logo */}
        <div className="text-center mb-12">
          <SpadeIcon className="w-10 h-10 mx-auto mb-4 text-white/30" />
          <h1 className="text-xs text-white/30 font-mono tracking-widest">MEMBER SIGN IN</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-center">
              {error}
            </div>
          )}
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              className="w-full bg-spades-gray border border-white/5 rounded px-4 py-3 text-sm font-mono focus:outline-none focus:border-white/20 transition-colors placeholder:text-white/20 text-white"
              placeholder="Username"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-spades-gray border border-white/5 rounded px-4 py-3 text-sm font-mono focus:outline-none focus:border-white/20 transition-colors placeholder:text-white/20 text-white"
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-spades-gold hover:bg-spades-gold/90 text-black font-bold text-sm py-3 rounded transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Links */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-xs text-white/30 font-mono">
            Membership is invite only
          </p>
          <p className="text-xs text-white/20 font-mono">
            <Link href="https://instagram.com/spades_performance" target="_blank" className="hover:text-white/40 transition-colors">
              @spades_performance
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
