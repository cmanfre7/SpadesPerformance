"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { SpadeIcon } from "@/components/ui/spade-icon";

export default function JoinPage() {
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get("invite") || "";

  const [isValidCode, setIsValidCode] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    instagram: "",
    car: "",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setIsChecking(true);
      if (!/^SPADES-[A-Z0-9]{6}$/.test(inviteCode)) {
        setIsValidCode(false);
        setIsChecking(false);
        return;
      }
      try {
        const res = await fetch(`/api/invites/validate?code=${encodeURIComponent(inviteCode)}`, { cache: 'no-store' });
        const json = await res.json().catch(() => null);
        setIsValidCode(Boolean(json?.valid));
      } catch {
        setIsValidCode(false);
      } finally {
        setIsChecking(false);
      }
    })();
  }, [inviteCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      setSubmitError(null);
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inviteCode,
          name: formData.name,
          instagram: formData.instagram,
          car: formData.car,
          email: formData.email,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setSubmitError(json?.error || 'Could not submit. Please try again.');
        return;
      }
      setSubmitted(true);
    })();
  };

  if (isChecking) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-12">
        <div className="text-white/30 font-mono text-sm">Validating invite...</div>
      </div>
    );
  }

  if (!inviteCode || !isValidCode) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-12">
        <div className="max-w-sm w-full text-center">
          <SpadeIcon className="w-10 h-10 mx-auto mb-8 text-white/20" />
          <h1 className="text-xs text-white/30 font-mono tracking-widest mb-4">INVITE ONLY</h1>
          <p className="text-sm text-white/20 font-mono mb-8">
            {inviteCode ? "Invalid or expired invite code." : "Membership is by invite."}
          </p>
          <a
            href="https://www.instagram.com/spades_performance/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/30 hover:text-white/50 transition-colors font-mono"
          >
            @spades_performance
          </a>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-12">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Request Submitted</h1>
          <p className="text-sm text-white/40 font-mono mb-6">
            We'll review your application and get back to you on Instagram.
          </p>
          <p className="text-xs text-white/20 font-mono">Invite code: {inviteCode}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <SpadeIcon className="w-10 h-10 mx-auto mb-4 text-spades-gold" />
          <h1 className="text-xl font-bold text-white mb-2">You're Invited</h1>
          <p className="text-sm text-white/40 font-mono">Complete your membership request</p>
          <div className="mt-3 inline-block px-3 py-1 bg-spades-gold/10 rounded text-spades-gold text-xs font-mono">
            {inviteCode}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
          {submitError && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {submitError}
            </div>
          )}
          <div>
            <label className="block text-white/50 text-sm mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-white/50 text-sm mb-1">Instagram *</label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="@yourhandle"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-white/50 text-sm mb-1">Your Car</label>
            <input
              type="text"
              value={formData.car}
              onChange={(e) => setFormData({ ...formData, car: e.target.value })}
              placeholder="Year Make Model (e.g., 2020 Supra)"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white/50 text-sm mb-1">Email (optional)</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-spades-gold text-black font-bold rounded-lg hover:bg-spades-gold/90 transition-colors mt-6"
          >
            Submit Request
          </button>

          <p className="text-xs text-white/30 text-center mt-4">
            By submitting, you agree to follow the crew rules and respect the community.
          </p>
        </form>
      </div>
    </div>
  );
}
