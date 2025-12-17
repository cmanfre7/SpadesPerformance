"use client";

import { useState, useEffect } from "react";

type JoinRequest = {
  id: string;
  created_at: string;
  invite_code: string;
  name: string;
  username: string;
  email: string;
  instagram: string | null;
  tiktok: string | null;
  car: string | null;
  bio: string | null;
  profile_pic: string | null;
  status: string;
};

export function JoinRequestsManager() {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/join-requests");
      const json = await res.json();
      if (json.ok) {
        setRequests(json.requests || []);
      } else {
        setError(json.error || "Failed to load requests");
      }
    } catch {
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const request = requests.find((r) => r.id === id);
    if (!request) return;

    const res = await fetch("/api/admin/join-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );

      // If approved, member is now in Supabase join_requests with status='approved'
      // They will automatically appear in the members list
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this request? This cannot be undone.")) return;
    
    const res = await fetch("/api/admin/join-requests", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const processedRequests = requests.filter((r) => r.status !== "pending");

  if (loading) {
    return (
      <div className="text-white/50 text-center py-12">Loading requests...</div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-center py-12">
        {error}
        <button
          onClick={fetchRequests}
          className="block mx-auto mt-4 text-sm text-white/50 hover:text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Join Requests</h2>
          <p className="text-white/40 text-sm">
            Review and approve membership applications
          </p>
        </div>
        <button
          onClick={fetchRequests}
          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Pending Requests */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-spades-gold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
          Pending ({pendingRequests.length})
        </h3>
        {pendingRequests.length === 0 ? (
          <div className="bg-white/5 rounded-xl p-8 text-center text-white/30 border border-white/10">
            No pending requests
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white/5 rounded-xl p-5 border border-white/10"
              >
                <div className="flex items-start gap-4">
                  {/* Profile Pic */}
                  <div className="w-16 h-16 rounded-full bg-white/10 flex-shrink-0 overflow-hidden">
                    {req.profile_pic ? (
                      <img src={req.profile_pic} alt={req.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30 text-2xl">
                        {req.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white font-bold text-lg">{req.name}</span>
                      <span className="text-white/40 font-mono">@{req.username}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="text-white/40 text-xs">Email</div>
                        <div className="text-white/70">{req.email}</div>
                      </div>
                      {req.instagram && (
                        <div>
                          <div className="text-white/40 text-xs">Instagram</div>
                          <a
                            href={`https://instagram.com/${req.instagram.replace("@", "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-spades-gold hover:underline"
                          >
                            {req.instagram}
                          </a>
                        </div>
                      )}
                      {req.tiktok && (
                        <div>
                          <div className="text-white/40 text-xs">TikTok</div>
                          <a
                            href={`https://tiktok.com/@${req.tiktok.replace("@", "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/70 hover:underline"
                          >
                            {req.tiktok}
                          </a>
                        </div>
                      )}
                      {req.car && (
                        <div>
                          <div className="text-white/40 text-xs">Car</div>
                          <div className="text-white/70">{req.car}</div>
                        </div>
                      )}
                    </div>
                    
                    {req.bio && (
                      <div className="mt-2 text-white/50 text-sm italic">"{req.bio}"</div>
                    )}
                    
                    <div className="mt-2 flex items-center gap-4 text-xs text-white/30">
                      <span>Code: {req.invite_code}</span>
                      <span>Submitted: {new Date(req.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => updateStatus(req.id, "approved")}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors text-sm font-medium"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(req.id, "rejected")}
                      className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm font-medium"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => deleteRequest(req.id)}
                      className="px-4 py-2 text-white/30 hover:text-red-400 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white/60 mb-4">
            Processed ({processedRequests.length})
          </h3>
          <div className="space-y-2">
            {processedRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white/5 rounded-lg p-4 border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      req.status === "approved"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {req.status}
                  </span>
                  <span className="text-white">{req.name}</span>
                  <span className="text-white/40">{req.instagram}</span>
                  {req.car && (
                    <span className="text-white/30 text-sm">{req.car}</span>
                  )}
                </div>
                <span className="text-white/30 text-sm">
                  {new Date(req.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

