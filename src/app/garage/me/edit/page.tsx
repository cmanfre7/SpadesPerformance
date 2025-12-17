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
};

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    car: "",
    instagram: "",
    tiktok: "",
  });
  const [profilePic, setProfilePic] = useState<string>("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.user) {
          setUser(data.user);
          setFormData({
            name: data.user.name || "",
            bio: data.user.bio || "",
            car: data.user.car || "",
            instagram: data.user.instagram || "",
            tiktok: data.user.tiktok || "",
          });
          setProfilePic(data.user.profile_pic || "");
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
          car: formData.car,
          instagram: formData.instagram,
          tiktok: formData.tiktok,
          profile_pic: profilePic,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update profile" });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-white/30 font-mono">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pt-32 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/garage/me" className="text-white/50 hover:text-white transition-colors">
              ← Back
            </Link>
            <span className="text-white/20">|</span>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <SpadeIcon className="w-5 h-5 text-spades-gold" />
              Edit Profile
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div className={`p-4 rounded-lg ${
              message.type === "success" 
                ? "bg-green-500/10 border border-green-500/20 text-green-400" 
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}>
              {message.text}
            </div>
          )}

          {/* Profile Picture */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-bold text-white mb-4">Profile Picture</h2>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30 text-3xl">
                    {formData.name.charAt(0) || "?"}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="inline-block px-4 py-2 bg-spades-gold text-black font-bold rounded-lg cursor-pointer hover:bg-spades-gold/90 transition-colors text-sm">
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
                {profilePic && (
                  <button
                    type="button"
                    onClick={() => setProfilePic("")}
                    className="ml-3 text-red-400 text-sm hover:underline"
                  >
                    Remove
                  </button>
                )}
                <p className="text-white/30 text-xs mt-2">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-bold text-white mb-4">Basic Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white/50 text-sm mb-1">Display Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-white/50 text-sm mb-1">Username</label>
                <input
                  type="text"
                  value={user.username}
                  disabled
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/50 cursor-not-allowed"
                />
                <p className="text-white/30 text-xs mt-1">Username cannot be changed</p>
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
            </div>
          </div>

          {/* Car & Social */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-bold text-white mb-4">Car & Social</h2>
            <div className="space-y-4">
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
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/garage/me"
              className="px-6 py-3 text-white/50 hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-spades-gold text-black font-bold rounded-lg hover:bg-spades-gold/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

