"use client";

import { useState, useEffect, useRef, memo, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

// Lazy image component with loading state
const LazyImage = memo(function LazyImage({ 
  src, 
  alt = "", 
  className = "",
  onClick
}: { 
  src: string; 
  alt?: string; 
  className?: string;
  onClick?: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <div className={`${className} bg-white/5 flex items-center justify-center`}>
        <span className="text-white/20">📷</span>
      </div>
    );
  }
  
  return (
    <div className={`${className} relative`} onClick={onClick}>
      {!loaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
});

type GarageWidget = {
  id: string;
  type: "photos" | "video" | "spotify" | "stats" | "mods" | "text" | "rollrace" | "social" | "buttons";
  title: string;
  data: any;
  order: number;
  size?: "small" | "medium" | "large" | "full"; // Widget width
};

type Garage = {
  id: string;
  user_id?: string;
  username: string;
  owner_name: string;
  year: string;
  make: string;
  model: string;
  platform: string | null;
  power: string | null;
  location: string | null;
  description: string | null;
  cover_image: string | null;
  rank?: string | null;
  appearance?: {
    accent?: string;
    cardStyle?: string;
    background?: string;
    showRank?: boolean;
    stickers?: string[];
  };
  widgets: GarageWidget[];
  created_at: string;
};

export default function GarageViewPage() {
  const params = useParams();
  const username = params.username as string;
  const [garage, setGarage] = useState<Garage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [likes, setLikes] = useState<any[]>([]);
  const [likeCount, setLikeCount] = useState(0);
  const [currentUserLiked, setCurrentUserLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    fetch(`/api/garages/${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setGarage(data.garage);
        } else {
          setError(data.error || "Garage not found");
        }
      })
      .catch(() => setError("Failed to load garage"))
      .finally(() => setLoading(false));
  }, [username]);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        if (data?.user?.id) setCurrentUserId(data.user.id);
      })
      .catch(() => {});
  }, []);

  // Load likes
  useEffect(() => {
    if (garage?.id) {
      fetch(`/api/garages/${username}/likes`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            setLikes(data.likes || []);
            setLikeCount(data.count || 0);
            setCurrentUserLiked(data.currentUserLiked || false);
          }
        })
        .catch(() => {});
    }
  }, [garage?.id, username]);

  // Load comments
  useEffect(() => {
    if (garage?.id) {
      fetch(`/api/garages/${username}/comments`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            setComments(data.comments || []);
          }
        })
        .catch(() => {});
    }
  }, [garage?.id, username]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-white/30 font-mono animate-pulse">Loading garage...</div>
      </div>
    );
  }

  if (error || !garage) {
    return (
      <div className="min-h-screen pt-32 px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h1 className="text-2xl font-bold text-white mb-2">Garage Not Found</h1>
          <p className="text-white/50 mb-6">{error || "This garage doesn't exist."}</p>
          <Link href="/garage" className="text-spades-gold hover:underline">
            ← Back to Garages
          </Link>
        </div>
      </div>
    );
  }

  const accentMap: Record<string, { text: string; ring: string }> = {
    spades: { text: "text-spades-gold", ring: "ring-spades-gold/40" },
    crimson: { text: "text-red-400", ring: "ring-red-400/40" },
    electric: { text: "text-cyan-300", ring: "ring-cyan-300/40" },
    neon: { text: "text-emerald-300", ring: "ring-emerald-300/40" },
    purple: { text: "text-purple-300", ring: "ring-purple-300/40" },
    white: { text: "text-white", ring: "ring-white/30" },
  };

  const accent = accentMap[garage.appearance?.accent || "spades"];
  const cardStyle = garage.appearance?.cardStyle || "glass";
  const background = garage.appearance?.background || "grid";

  const cardClass =
    cardStyle === "carbon"
      ? "bg-gradient-to-br from-black via-black/70 to-black border border-white/10 shadow-lg shadow-black/30"
      : cardStyle === "dark"
      ? "bg-white/5 border border-white/10"
      : cardStyle === "outline"
      ? "bg-black border border-white/20"
      : "bg-white/5 backdrop-blur-xl border border-white/10";

  const bgClass =
    background === "gradient"
      ? "bg-gradient-to-b from-white/5 via-transparent to-black"
      : background === "noise"
      ? "bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:22px_22px]"
      : background === "clean"
      ? ""
      : "bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]";

  const handleLike = async () => {
    if (!currentUserId || liking) return;
    setLiking(true);
    try {
      const res = await fetch(`/api/garages/${username}/likes`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.ok) {
        setCurrentUserLiked(data.liked);
        setLikeCount(data.count);
        // Refresh likes list
        const likesRes = await fetch(`/api/garages/${username}/likes`, { credentials: "include" });
        const likesData = await likesRes.json();
        if (likesData.ok) {
          setLikes(likesData.likes || []);
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLiking(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || submittingComment || !currentUserId) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/garages/${username}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: newComment }),
      });
      const data = await res.json();
      if (data.ok) {
        setComments([...comments, data.comment]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;
    try {
      const res = await fetch(`/api/garages/${username}/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.ok) {
        setComments(comments.filter((c: any) => c.id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px]">
        {garage.cover_image ? (
          <img 
            src={garage.cover_image} 
            alt={`${garage.year} ${garage.make} ${garage.model}`} 
            className="w-full h-full object-cover" 
            loading="eager"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-spades-gray to-black flex items-center justify-center">
            <SpadeIcon className="w-32 h-32 text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-5xl mx-auto">
            <Link href="/garage" className="text-white/50 hover:text-white text-sm mb-4 inline-block">
              ← All Garages
            </Link>
            {currentUserId && garage.user_id && currentUserId === garage.user_id && (
              <Link
                href={`/garage/${username}/edit`}
                className="float-right px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm hover:bg-white/20 transition-colors"
              >
                ✏️ Edit Garage
              </Link>
            )}
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
              {garage.year} {garage.make} {garage.model}
            </h1>
            <div className="flex items-center gap-4 text-white/70">
              <span>@{garage.username}</span>
              {garage.location && <span className="flex items-center gap-1">📍 {garage.location}</span>}
              {garage.platform && <span className="text-spades-gold">{garage.platform}</span>}
              {garage.power && <span className="text-green-400">{garage.power}</span>}
              {garage.appearance?.showRank !== false && garage.rank && (
                <span className={`px-2 py-1 text-xs rounded-full border ${accent.ring} ${accent.text}`}>
                  {garage.rank.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Description */}
        {garage.description && (
          <div className={`${cardClass} rounded-xl p-4 mb-4`}>
            <p className="text-white/70 leading-relaxed whitespace-pre-wrap text-sm">{garage.description}</p>
          </div>
        )}

        {/* Widgets Grid */}
        <div className="grid grid-cols-12 gap-4">
          {garage.widgets?.map((widget) => {
            const sizeClasses = {
              small: "col-span-12 md:col-span-4",
              medium: "col-span-12 md:col-span-6",
              large: "col-span-12 md:col-span-8",
              full: "col-span-12",
            };
            const size = widget.size || "full";
            return (
              <div key={widget.id} className={sizeClasses[size]}>
                {renderWidget(widget, setLightboxImage, cardClass, accent.text)}
              </div>
            );
          })}
        </div>

        {/* Likes and Comments - Two Column Layout */}
        <div className="grid grid-cols-12 gap-4 mt-4">
          {/* Likes */}
          <div className={`col-span-12 md:col-span-4 ${cardClass} rounded-xl p-4`}>
            <div className="flex flex-col items-center text-center">
              <button
                onClick={handleLike}
                disabled={liking || !currentUserId}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all mb-3 ${
                  currentUserLiked
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
                } disabled:opacity-50`}
              >
                <span className="text-xl">{currentUserLiked ? "❤️" : "🤍"}</span>
                <span className="font-bold">{likeCount}</span>
              </button>
              {likes.length > 0 && (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex -space-x-2">
                    {likes.slice(0, 5).map((like: any) => (
                      <div
                        key={like.id}
                        className="w-7 h-7 rounded-full border-2 border-spades-gray bg-white/10 flex items-center justify-center overflow-hidden"
                        title={like.join_requests?.name || like.join_requests?.username}
                      >
                        {like.join_requests?.profile_pic ? (
                          <img src={like.join_requests.profile_pic} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs">👤</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <span className="text-white/40 text-xs">
                    {likes.length} {likes.length === 1 ? "person likes" : "people like"} this
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className={`col-span-12 md:col-span-8 ${cardClass} rounded-xl p-4`}>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span>💬</span> Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            {currentUserId ? (
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:border-spades-gold/50 focus:outline-none"
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || submittingComment}
                    className="px-4 py-2 bg-spades-gold text-black font-bold rounded-lg hover:bg-spades-gold/90 transition-colors disabled:opacity-50 text-sm"
                  >
                    Post
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10 text-center">
                <Link href="/login" className="text-spades-gold hover:underline text-sm">
                  Sign in to comment →
                </Link>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {comments.length === 0 ? (
                <div className="text-center py-4 text-white/30 text-sm">
                  <p>No comments yet</p>
                </div>
              ) : (
                comments.map((comment: any) => (
                  <div key={comment.id} className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {comment.join_requests?.profile_pic ? (
                        <img
                          src={comment.join_requests.profile_pic}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm">👤</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-white text-xs">
                          {comment.join_requests?.name || comment.join_requests?.username || "Anonymous"}
                        </span>
                        <span className="text-white/20 text-xs">
                          · {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                        {(currentUserId === comment.user_id || currentUserId === garage.user_id) && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-400/50 hover:text-red-400 text-xs ml-auto"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      <p className="text-white/70 text-xs">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <img src={lightboxImage} alt="" className="max-w-full max-h-full object-contain" />
          <button className="absolute top-4 right-4 text-white/50 hover:text-white text-2xl">✕</button>
        </div>
      )}
    </div>
  );
}

function renderWidget(widget: GarageWidget, setLightboxImage: (img: string | null) => void, cardClass: string, accentText: string) {
  switch (widget.type) {
    case "photos":
      return <PhotosWidget widget={widget} setLightboxImage={setLightboxImage} cardClass={cardClass} />;
    case "video":
      return <VideoWidget widget={widget} cardClass={cardClass} />;
    case "spotify":
      return <SpotifyWidget widget={widget} cardClass={cardClass} />;
    case "stats":
      return <StatsWidget widget={widget} cardClass={cardClass} accentText={accentText} />;
    case "mods":
      return <ModsWidget widget={widget} cardClass={cardClass} />;
    case "text":
      return <TextWidget widget={widget} cardClass={cardClass} />;
    case "rollrace":
      return <RollRaceWidget widget={widget} cardClass={cardClass} />;
    case "social":
      return <SocialWidget widget={widget} cardClass={cardClass} />;
    case "buttons":
      return <ButtonsWidget widget={widget} cardClass={cardClass} />;
    default:
      return null;
  }
}

const PhotosWidget = memo(function PhotosWidget({ widget, setLightboxImage, cardClass }: { widget: GarageWidget; setLightboxImage: (img: string | null) => void; cardClass: string }) {
  const images = widget.data.images || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (images.length === 0) return null;

  return (
    <div className="flex justify-center">
      <div className={`${cardClass} rounded-xl overflow-hidden w-full max-w-[350px]`}>
        {/* Header */}
        <div className="px-3 py-2 flex items-center justify-between border-b border-white/10">
          <h3 className="font-semibold text-white text-sm flex items-center gap-2">
            <span>📸</span> {widget.title}
          </h3>
          {images.length > 1 && (
            <span className="text-white/40 text-xs">{currentIndex + 1}/{images.length}</span>
          )}
        </div>
        
        {/* Photo */}
        <div className="relative group">
          <LazyImage 
            src={images[currentIndex]} 
            className="aspect-square cursor-pointer"
            onClick={() => setLightboxImage(images[currentIndex])}
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                className={`absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/70 text-white text-sm flex items-center justify-center ${
                  currentIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-0 group-hover:opacity-100"
                } transition-opacity`}
              >
                ‹
              </button>
              <button
                onClick={() => setCurrentIndex(Math.min(images.length - 1, currentIndex + 1))}
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/70 text-white text-sm flex items-center justify-center ${
                  currentIndex === images.length - 1 ? "opacity-0 pointer-events-none" : "opacity-0 group-hover:opacity-100"
                } transition-opacity`}
              >
                ›
              </button>
            </>
          )}
        </div>
        
        {/* Dots */}
        {images.length > 1 && (
          <div className="flex justify-center gap-1 py-2">
            {images.map((_: string, i: number) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentIndex ? "bg-spades-gold" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

const VideoWidget = memo(function VideoWidget({ widget, cardClass }: { widget: GarageWidget; cardClass: string }) {
  const url = widget.data.url;

  if (!url) return null;

  // Determine video type
  const isYouTube = url?.includes("youtube.com") || url?.includes("youtu.be");
  const isTikTok = url?.includes("tiktok.com");
  const isGoogleDrive = url?.includes("drive.google.com");

  // Convert Google Drive share link to embed/preview link
  const getGoogleDriveEmbedUrl = (driveUrl: string) => {
    const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return driveUrl;
  };

  // YouTube gets 16:9, everything else gets vertical phone format
  const isHorizontal = isYouTube;

  return (
    <div className="flex justify-center">
      <div className={`${cardClass} rounded-xl overflow-hidden ${isHorizontal ? 'w-full max-w-[480px]' : 'w-[280px]'}`}>
        {/* Header */}
        <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm flex items-center gap-2">
            <span>🎬</span> {widget.title}
          </h3>
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
        
        {/* Video Container - tight fit */}
        <div 
          className="relative bg-black overflow-hidden"
          style={{ 
            aspectRatio: isHorizontal ? '16/9' : '9/16',
          }}
        >
          {(() => {
            // YouTube
            if (url.includes("youtube.com/watch")) {
              const videoId = new URL(url).searchParams.get("v");
              return (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              );
            }
            
            if (url.includes("youtu.be/")) {
              const videoId = url.split("youtu.be/")[1]?.split("?")[0];
              return (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              );
            }
            
            // TikTok - use their embed which has its own aspect handling
            if (isTikTok) {
              const match = url.match(/video\/(\d+)/);
              const videoId = match?.[1];
              if (videoId) {
                return (
                  <iframe
                    src={`https://www.tiktok.com/embed/v2/${videoId}`}
                    className="absolute inset-0 w-full h-full"
                    allow="encrypted-media"
                    allowFullScreen
                  />
                );
              }
            }
            
            // Google Drive - scale up to fill and crop overflow
            if (isGoogleDrive) {
              return (
                <div className="absolute inset-0 overflow-hidden">
                  <iframe
                    src={getGoogleDriveEmbedUrl(url)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      width: '180%',
                      height: '180%',
                    }}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              );
            }
            
            // Direct video file URL
            if (url.match(/\.(mp4|webm|mov|ogg)$/i)) {
              return (
                <video
                  src={url}
                  controls
                  className="absolute inset-0 w-full h-full object-cover"
                  preload="metadata"
                  playsInline
                />
              );
            }

            // Default: try as iframe
            return (
              <iframe
                src={url}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            );
          })()}
        </div>
      </div>
    </div>
  );
});

const SpotifyWidget = memo(function SpotifyWidget({ widget, cardClass }: { widget: GarageWidget; cardClass: string }) {
  const trackUrl = widget.data.trackUrl;
  if (!trackUrl) return null;

  // Convert Spotify URL to embed
  let embedUrl = trackUrl;
  if (trackUrl.includes("open.spotify.com/track/")) {
    const trackId = trackUrl.split("/track/")[1]?.split("?")[0];
    embedUrl = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
  }

  return (
    <div className={`${cardClass} rounded-xl p-6 border border-green-500/20 bg-gradient-to-r from-green-500/10 to-transparent`}>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>🎵</span> Theme Song
      </h3>
      <iframe
        src={embedUrl}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-lg"
      />
    </div>
  );
});

const StatsWidget = memo(function StatsWidget({ widget, cardClass, accentText }: { widget: GarageWidget; cardClass: string; accentText: string }) {
  const stats = [
    { key: "power", label: "Power", icon: "⚡" },
    { key: "torque", label: "Torque", icon: "🔧" },
    { key: "zeroToSixty", label: "0-60", icon: "🚀" },
    { key: "quarterMile", label: "1/4 Mile", icon: "🏁" },
    { key: "topSpeed", label: "Top Speed", icon: "💨" },
  ].filter((s) => widget.data[s.key]);

  if (stats.length === 0) return null;

  return (
    <div className={`${cardClass} rounded-xl p-6`}>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>📊</span> {widget.title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.key} className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`text-xl font-bold ${accentText}`}>{widget.data[stat.key]}</div>
            <div className="text-white/40 text-xs uppercase">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

const ModsWidget = memo(function ModsWidget({ widget, cardClass }: { widget: GarageWidget; cardClass: string }) {
  const categories = widget.data.categories?.filter((c: any) => c.items?.length > 0) || [];
  if (categories.length === 0) return null;

  return (
    <div className={`${cardClass} rounded-xl p-6`}>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>🔧</span> {widget.title}
      </h3>
      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((cat: any, i: number) => (
          <div key={i}>
            <h4 className="text-spades-gold font-bold mb-2">{cat.name}</h4>
            <ul className="space-y-1">
              {cat.items.map((item: string, j: number) => (
                <li key={j} className="text-white/60 text-sm flex items-center gap-2">
                  <span className="text-spades-gold">♠</span> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
});

const TextWidget = memo(function TextWidget({ widget, cardClass }: { widget: GarageWidget; cardClass: string }) {
  if (!widget.data.content) return null;

  return (
    <div className={`${cardClass} rounded-xl p-6`}>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>📝</span> {widget.title}
      </h3>
      <p className="text-white/70 leading-relaxed whitespace-pre-wrap">{widget.data.content}</p>
    </div>
  );
});

const RollRaceWidget = memo(function RollRaceWidget({ widget, cardClass }: { widget: GarageWidget; cardClass: string }) {
  const { wins = 0, losses = 0, notable = [] } = widget.data;
  const total = wins + losses;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  return (
    <div className={`${cardClass} rounded-xl p-6 border border-spades-gold/20 bg-gradient-to-r from-spades-gold/10 to-transparent`}>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>🏁</span> Roll Race Record
      </h3>
      <div className="flex items-center gap-8">
        <div className="text-center">
          <div className="text-4xl font-black text-green-400">{wins}</div>
          <div className="text-white/40 text-sm uppercase">Wins</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-black text-red-400">{losses}</div>
          <div className="text-white/40 text-sm uppercase">Losses</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-black text-spades-gold">{winRate}%</div>
          <div className="text-white/40 text-sm uppercase">Win Rate</div>
        </div>
      </div>
      {notable.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-white/40 text-sm mb-2">Notable Wins:</div>
          <div className="flex flex-wrap gap-2">
            {notable.map((car: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-spades-gold/20 text-spades-gold rounded-full text-sm">
                {car}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

const SocialWidget = memo(function SocialWidget({ widget, cardClass }: { widget: GarageWidget; cardClass: string }) {
  const links = widget.data.links || [];
  if (links.length === 0) return null;

  const platformIcons: Record<string, string> = {
    instagram: "📷",
    tiktok: "🎵",
    youtube: "▶️",
    twitter: "🐦",
    website: "🌐",
  };

  return (
    <div className={`${cardClass} rounded-xl p-6`}>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>🔗</span> {widget.title}
      </h3>
      <div className="flex flex-wrap gap-3">
        {links.map((link: any, i: number) => (
          <a
            key={i}
            href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            <span>{platformIcons[link.platform] || "🔗"}</span>
            <span className="text-white capitalize">{link.platform}</span>
          </a>
        ))}
      </div>
    </div>
  );
});

const ButtonsWidget = memo(function ButtonsWidget({ widget, cardClass }: { widget: GarageWidget; cardClass: string }) {
  const buttons = widget.data.buttons || [];
  if (buttons.length === 0) return null;

  return (
    <div className={`${cardClass} rounded-xl p-6`}>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>🔘</span> {widget.title}
      </h3>
      <div className="flex flex-wrap gap-3">
        {buttons.map((btn: any, i: number) => (
          <a
            key={i}
            href={btn.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 border border-white/15"
          >
            <span>{btn.emoji || "🔘"}</span>
            <span className="font-semibold text-sm">{btn.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
});
