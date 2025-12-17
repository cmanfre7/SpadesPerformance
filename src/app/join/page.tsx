"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { SpadeIcon } from "@/components/ui/spade-icon";

function JoinForm() {
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get("invite") || "";

  const [isValidCode, setIsValidCode] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    instagram: "",
    tiktok: "",
    car: "",
    bio: "",
  });
  const [profilePic, setProfilePic] = useState<string>("");
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
          username: formData.username,
          email: formData.email,
          password: formData.password,
          instagram: formData.instagram,
          tiktok: formData.tiktok,
          car: formData.car,
          bio: formData.bio,
          profilePic,
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

          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden mb-2">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white/30 text-3xl">👤</span>
              )}
            </div>
            <label className="text-spades-gold text-sm cursor-pointer hover:underline">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setProfilePic(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 text-sm mb-1">Full Name *</label>
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
              <label className="block text-white/50 text-sm mb-1">Username *</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                placeholder="your_username"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white/50 text-sm mb-1">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 text-sm mb-1">Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Confirm Password *</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
                required
              />
            </div>
          </div>
          {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-red-400 text-xs">Passwords do not match</p>
          )}

          <div className="border-t border-white/10 pt-4 mt-4">
            <p className="text-white/30 text-xs mb-3">SOCIAL & CAR INFO</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 text-sm mb-1">Instagram</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="@yourhandle"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">TikTok</label>
              <input
                type="text"
                value={formData.tiktok}
                onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                placeholder="@yourhandle"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              />
            </div>
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
            <label className="block text-white/50 text-sm mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={3}
              maxLength={300}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none resize-none"
            />
            <p className="text-white/20 text-xs text-right">{formData.bio.length}/300</p>
          </div>

          <button
            type="submit"
            disabled={formData.password !== formData.confirmPassword}
            className="w-full py-3 bg-spades-gold text-black font-bold rounded-lg hover:bg-spades-gold/90 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default function JoinPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-12">
        <div className="text-white/30 font-mono text-sm">Loading...</div>
      </div>
    }>
      <JoinForm />
    </Suspense>
  );
}
