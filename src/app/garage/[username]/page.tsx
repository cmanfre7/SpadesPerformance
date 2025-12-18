"use client";

import { useState, useEffect, useRef, memo, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";
import { uploadImage, uploadVideo } from "@/lib/upload";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editingGarage, setEditingGarage] = useState<Garage | null>(null);
  const [saving, setSaving] = useState(false);
  const [showWidgetPicker, setShowWidgetPicker] = useState(false);
  const [editingWidget, setEditingWidget] = useState<GarageWidget | null>(null);
  
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
          <h1 className="text-2xl font-bold text-white mb-2">Garage Not Found</h1>
          <p className="text-white/50 mb-6">{error || "This garage doesn't exist."}</p>
          <Link href="/garage" className="text-spades-gold hover:underline">
            ← Back to Garages
          </Link>
        </div>
      </div>
    );
  }

  // Use editing garage when in edit mode, otherwise use regular garage
  const displayGarage = isEditing && editingGarage ? editingGarage : garage;

  const accentMap: Record<string, { text: string; ring: string; bg: string; border: string; hover: string }> = {
    spades: { text: "text-spades-gold", ring: "ring-spades-gold/40", bg: "bg-spades-gold", border: "border-spades-gold/50", hover: "hover:bg-spades-gold/90" },
    crimson: { text: "text-red-400", ring: "ring-red-400/40", bg: "bg-red-400", border: "border-red-400/50", hover: "hover:bg-red-400/90" },
    electric: { text: "text-cyan-300", ring: "ring-cyan-300/40", bg: "bg-cyan-300", border: "border-cyan-300/50", hover: "hover:bg-cyan-300/90" },
    neon: { text: "text-emerald-300", ring: "ring-emerald-300/40", bg: "bg-emerald-300", border: "border-emerald-300/50", hover: "hover:bg-emerald-300/90" },
    purple: { text: "text-purple-300", ring: "ring-purple-300/40", bg: "bg-purple-300", border: "border-purple-300/50", hover: "hover:bg-purple-300/90" },
    white: { text: "text-white", ring: "ring-white/30", bg: "bg-white", border: "border-white/50", hover: "hover:bg-white/90" },
  };

  const accent = accentMap[displayGarage.appearance?.accent || "spades"];
  const cardStyle = displayGarage.appearance?.cardStyle || "glass";
  const background = displayGarage.appearance?.background || "grid";

  const cardClass =
    cardStyle === "carbon"
      ? "bg-gradient-to-br from-black via-black/70 to-black border border-white/10 shadow-lg shadow-black/30"
      : cardStyle === "dark"
      ? "bg-white/5 border border-white/10"
      : cardStyle === "outline"
      ? "bg-black border border-white/20"
      : cardStyle === "transparent"
      ? "bg-transparent border-transparent"
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

  // Edit mode functions
  const handleStartEdit = () => {
    setEditingGarage({ 
      ...garage, 
      widgets: garage.widgets || [],
      appearance: garage.appearance || {
        accent: "spades",
        cardStyle: "glass",
        background: "grid",
        showRank: true,
      }
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditingGarage(null);
    setIsEditing(false);
    setEditingWidget(null);
    setShowWidgetPicker(false);
  };

  const handleSaveEdit = async () => {
    if (!editingGarage) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/garages/${username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          year: editingGarage.year,
          make: editingGarage.make,
          model: editingGarage.model,
          platform: editingGarage.platform,
          power: editingGarage.power,
          location: editingGarage.location,
          description: editingGarage.description,
          cover_image: editingGarage.cover_image,
          widgets: editingGarage.widgets,
          appearance: editingGarage.appearance,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setGarage(data.garage);
        setIsEditing(false);
        setEditingGarage(null);
      } else {
        alert(data.error || "Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!editingGarage) return;
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const currentWidgets = editingGarage.widgets || [];
      const oldIndex = currentWidgets.findIndex((w: GarageWidget) => w.id === active.id);
      const newIndex = currentWidgets.findIndex((w: GarageWidget) => w.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newWidgets = arrayMove(currentWidgets, oldIndex, newIndex);
        setEditingGarage({ ...editingGarage, widgets: newWidgets });
      }
    }
  };

  const addWidget = (type: string) => {
    if (!editingGarage) {
      console.warn("Cannot add widget: editingGarage is null");
      return;
    }
    const WIDGET_TYPES = [
      { type: "photos", label: "Photo Gallery" },
      { type: "video", label: "Video" },
      { type: "spotify", label: "Theme Song" },
      { type: "stats", label: "Car Stats" },
      { type: "mods", label: "Mod List" },
      { type: "text", label: "Text Block" },
      { type: "rollrace", label: "Roll Race Record" },
      { type: "social", label: "Social Links" },
      { type: "buttons", label: "CTA Buttons" },
    ];
    
    const getDefaultWidgetData = (type: string) => {
      switch (type) {
        case "photos": return { images: [] };
        case "video": return { videos: [] };
        case "spotify": return { trackUrl: "" };
        case "stats": return { power: "", torque: "", zeroToSixty: "", quarterMile: "", topSpeed: "" };
        case "mods": return { categories: [{ name: "Engine", items: [] }, { name: "Fuel system", items: [] }, { name: "Drivetrain", items: [] }, { name: "Suspension", items: [] }, { name: "Wheels and Tires", items: [] }, { name: "Exterior", items: [] }, { name: "Extras", items: [] }] };
        case "text": return { content: "" };
        case "rollrace": return { wins: 0, losses: 0, notable: [] };
        case "social": return { links: [] };
        case "buttons": return { buttons: [] };
        default: return {};
      }
    };

    setEditingGarage((prev) => {
      if (!prev) {
        console.warn("Cannot add widget: prev is null in state update");
        return prev;
      }
      const currentWidgets = prev.widgets || [];
    const newWidget: GarageWidget = {
        id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: type as GarageWidget["type"],
      title: WIDGET_TYPES.find(w => w.type === type)?.label || type,
      data: getDefaultWidgetData(type),
      order: currentWidgets.length,
      size: "full",
    };
    const updatedWidgets = [...currentWidgets, newWidget];
      console.log("Adding widget:", newWidget.id, newWidget.type, "Total widgets:", updatedWidgets.length);
      return {
        ...prev,
      widgets: updatedWidgets,
      };
    });
    setShowWidgetPicker(false);
  };

  const removeWidget = (id: string) => {
    if (!editingGarage) return;
    const currentWidgets = editingGarage.widgets || [];
    setEditingGarage({
      ...editingGarage,
      widgets: currentWidgets.filter((w: GarageWidget) => w.id !== id),
    });
  };

  const updateWidget = (id: string, updates: Partial<GarageWidget>) => {
    if (!editingGarage) return;
    const currentWidgets = editingGarage.widgets || [];
    setEditingGarage({
      ...editingGarage,
      widgets: currentWidgets.map((w: GarageWidget) =>
        w.id === id ? { ...w, ...updates } : w
      ),
    });
  };

  // Widget Editor Function
  const renderWidgetEditor = (widget: GarageWidget) => {
    const updateWidgetData = (data: any) => {
      if (!editingGarage) return;
      const updatedWidget = { ...widget, data };
      setEditingWidget(updatedWidget);
      updateWidget(widget.id, { data });
    };

    switch (widget.type) {
      case "photos":
        return <PhotosWidgetEditor widget={widget} updateWidget={updateWidgetData} />;
      case "video":
        return <VideoWidgetEditor widget={widget} updateWidget={updateWidgetData} />;
      case "spotify":
        return <SpotifyWidgetEditor widget={widget} updateWidget={updateWidgetData} />;
      case "stats":
        return <StatsWidgetEditor widget={widget} updateWidget={updateWidgetData} />;
      case "mods":
        return <ModsWidgetEditor widget={widget} updateWidget={updateWidgetData} />;
      case "text":
        return <TextWidgetEditor widget={widget} updateWidget={updateWidgetData} />;
      case "rollrace":
        return <RollRaceWidgetEditor widget={widget} updateWidget={updateWidgetData} />;
      case "social":
        return <SocialWidgetEditor widget={widget} updateWidget={updateWidgetData} />;
      case "buttons":
        return <ButtonsWidgetEditor widget={widget} updateWidget={updateWidgetData} />;
      default:
        return <div className="text-white/50">Unknown widget type</div>;
    }
  };

  // Sortable Widget Item Component
  function SortableWidgetItem({
    widget,
    sizeClasses,
    onEdit,
    onRemove,
    onSizeChange,
    renderWidget,
  }: {
    widget: GarageWidget;
    sizeClasses: string;
    onEdit: () => void;
    onRemove: () => void;
    onSizeChange: (size: GarageWidget["size"]) => void;
    renderWidget: () => React.ReactNode;
  }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: widget.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    const SIZE_LABELS: Record<string, string> = {
      small: "Narrow",
      medium: "Medium",
      large: "Wide",
      full: "Full Width",
    };

    return (
      <div ref={setNodeRef} style={style} className={sizeClasses}>
        <div className="relative group">
          {/* Edit Controls Overlay */}
          <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
              className={`px-2 py-1 ${accent.bg} text-black text-xs font-bold rounded ${accent.hover}`}
            >
              Edit
            </button>
            <select
              value={widget.size || "full"}
              onChange={(e) => onSizeChange(e.target.value as GarageWidget["size"])}
              onClick={(e) => e.stopPropagation()}
              className="px-2 py-1 bg-white/90 text-black text-xs rounded border-none focus:outline-none"
            >
              <option value="small">Narrow</option>
              <option value="medium">Medium</option>
              <option value="large">Wide</option>
              <option value="full">Full Width</option>
            </select>
            <button
              onClick={onRemove}
              className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600"
            >
              ×
            </button>
          </div>
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="absolute top-2 left-2 z-10 w-6 h-6 bg-white/20 rounded cursor-grab active:cursor-grabbing flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-4 h-4 border-t-2 border-b-2 border-white/60" />
          </div>
          {renderWidget()}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px]">
        {displayGarage.cover_image ? (
          <img 
            src={displayGarage.cover_image} 
            alt={`${displayGarage.year} ${displayGarage.make} ${displayGarage.model}`} 
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
            {currentUserId && displayGarage.user_id && currentUserId === displayGarage.user_id && (
              <div className="float-right flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={handleStartEdit}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm hover:bg-white/20 transition-colors"
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm hover:bg-white/20 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={saving}
                      className={`px-4 py-2 ${accent.bg} text-black font-bold rounded-lg text-sm ${accent.hover} transition-colors disabled:opacity-50`}
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </>
                )}
              </div>
            )}
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={displayGarage.year}
                    onChange={(e) => setEditingGarage({ ...editingGarage!, year: e.target.value })}
                    className="text-4xl md:text-5xl font-black text-white bg-transparent border-b border-white/30 focus:border-white focus:outline-none w-24"
                    placeholder="Year"
                  />
                  <input
                    type="text"
                    value={displayGarage.make}
                    onChange={(e) => setEditingGarage({ ...editingGarage!, make: e.target.value })}
                    className="text-4xl md:text-5xl font-black text-white bg-transparent border-b border-white/30 focus:border-white focus:outline-none flex-1"
                    placeholder="Make"
                  />
                  <input
                    type="text"
                    value={displayGarage.model}
                    onChange={(e) => setEditingGarage({ ...editingGarage!, model: e.target.value })}
                    className="text-4xl md:text-5xl font-black text-white bg-transparent border-b border-white/30 focus:border-white focus:outline-none flex-1"
                    placeholder="Model"
                  />
                </div>
                <div className="flex items-center gap-4 text-white/70">
                  <span>@{displayGarage.username}</span>
                  <input
                    type="text"
                    value={displayGarage.location || ""}
                    onChange={(e) => setEditingGarage({ ...editingGarage!, location: e.target.value })}
                    className="bg-transparent border-b border-white/30 focus:border-white focus:outline-none text-sm w-32"
                    placeholder="Location"
                  />
                  <input
                    type="text"
                    value={displayGarage.platform || ""}
                    onChange={(e) => setEditingGarage({ ...editingGarage!, platform: e.target.value })}
                    className="bg-transparent border-b border-white/30 focus:border-white focus:outline-none text-sm text-spades-gold w-32"
                    placeholder="Platform"
                  />
                  <input
                    type="text"
                    value={displayGarage.power || ""}
                    onChange={(e) => setEditingGarage({ ...editingGarage!, power: e.target.value })}
                    className="bg-transparent border-b border-white/30 focus:border-white focus:outline-none text-sm text-green-400 w-32"
                    placeholder="Power"
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                  {displayGarage.year} {displayGarage.make} {displayGarage.model}
                </h1>
                <div className="flex items-center gap-4 text-white/70">
                  <span>@{displayGarage.username}</span>
                  {displayGarage.location && <span>{displayGarage.location}</span>}
                  {displayGarage.platform && <span className={accent.text}>{displayGarage.platform}</span>}
                  {displayGarage.power && <span className="text-green-400">{displayGarage.power}</span>}
                  {displayGarage.appearance?.showRank !== false && displayGarage.rank && (
                    <span className={`px-2 py-1 text-xs rounded-full border ${accent.ring} ${accent.text}`}>
                      {displayGarage.rank.toUpperCase()}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Appearance Settings */}
        {isEditing && (
          <div className="bg-gradient-to-r from-spades-gold/10 to-transparent rounded-lg p-3 mb-3 border border-spades-gold/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white">Appearance</h3>
              <label className="flex items-center gap-1.5 text-white/60 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingGarage?.appearance?.showRank !== false}
                  onChange={(e) => setEditingGarage({ 
                    ...editingGarage!, 
                    appearance: { 
                      ...editingGarage!.appearance, 
                      showRank: e.target.checked 
                    } 
                  })}
                  className="w-3 h-3 rounded border-white/20 bg-white/5"
                />
                <span>Show rank</span>
              </label>
          </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Accent Color */}
              <div>
                <label className="block text-white/40 text-[10px] mb-1.5 uppercase tracking-wide">Accent</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { key: "spades", label: "Gold", swatch: "bg-spades-gold" },
                    { key: "crimson", label: "Crimson", swatch: "bg-red-500" },
                    { key: "electric", label: "Electric", swatch: "bg-cyan-400" },
                    { key: "neon", label: "Neon", swatch: "bg-emerald-400" },
                    { key: "purple", label: "Purple", swatch: "bg-purple-500" },
                    { key: "white", label: "White", swatch: "bg-white" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setEditingGarage({ 
                        ...editingGarage!, 
                        appearance: { 
                          ...editingGarage!.appearance, 
                          accent: opt.key 
                        } 
                      })}
                      className={`flex flex-col items-center gap-0.5 px-1 py-1 rounded border transition-colors ${
                        (editingGarage?.appearance?.accent || "spades") === opt.key 
                          ? "border-white/60 bg-white/10" 
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                      title={opt.label}
                    >
                      <span className={`w-3 h-3 rounded-full ${opt.swatch}`}></span>
                      <span className="text-white/60 text-[9px] leading-tight">{opt.label}</span>
                    </button>
                  ))}
            </div>
              </div>

              {/* Card Style */}
              <div>
                <label className="block text-white/40 text-[10px] mb-1.5 uppercase tracking-wide">Card</label>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { key: "glass", label: "Glass" },
                    { key: "carbon", label: "Carbon" },
                    { key: "dark", label: "Dark" },
                    { key: "outline", label: "Outline" },
                    { key: "transparent", label: "Clear" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setEditingGarage({ 
                        ...editingGarage!, 
                        appearance: { 
                          ...editingGarage!.appearance, 
                          cardStyle: opt.key 
                        } 
                      })}
                      className={`px-1.5 py-1 rounded border text-[10px] transition-colors ${
                        (editingGarage?.appearance?.cardStyle || "glass") === opt.key 
                          ? "border-white/60 text-white bg-white/10" 
                          : "border-white/10 text-white/50 hover:border-white/20"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background */}
              <div>
                <label className="block text-white/40 text-[10px] mb-1.5 uppercase tracking-wide">Background</label>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { key: "grid", label: "Grid" },
                    { key: "gradient", label: "Gradient" },
                    { key: "noise", label: "Noise" },
                    { key: "clean", label: "Clean" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setEditingGarage({ 
                        ...editingGarage!, 
                        appearance: { 
                          ...editingGarage!.appearance, 
                          background: opt.key 
                        } 
                      })}
                      className={`px-1.5 py-1 rounded border text-[10px] transition-colors ${
                        (editingGarage?.appearance?.background || "grid") === opt.key 
                          ? "border-white/60 text-white bg-white/10" 
                          : "border-white/10 text-white/50 hover:border-white/20"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Widgets Grid */}
        {isEditing ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => setShowWidgetPicker(true)}
                className={`px-4 py-2 ${accent.bg} text-black font-bold rounded-lg text-sm ${accent.hover} transition-colors`}
              >
                Add Widget
              </button>
            </div>
            <SortableContext items={(displayGarage.widgets || []).map((w: GarageWidget) => w.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-12 gap-4">
                {(displayGarage.widgets || []).map((widget: GarageWidget) => {
                  const sizeClasses = {
                    small: "col-span-12 md:col-span-4",
                    medium: "col-span-12 md:col-span-6",
                    large: "col-span-12 md:col-span-8",
                    full: "col-span-12",
                  };
                  const size = widget.size || "full";
                  return (
                    <SortableWidgetItem
                      key={widget.id}
                      widget={widget}
                      sizeClasses={sizeClasses[size]}
                      onEdit={() => setEditingWidget(widget)}
                      onRemove={() => removeWidget(widget.id)}
                      onSizeChange={(newSize) => updateWidget(widget.id, { size: newSize })}
                      renderWidget={() => renderWidget(widget, setLightboxImage, cardClass, accent.text, true)}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="grid grid-cols-12 gap-4">
            {displayGarage.widgets?.map((widget: GarageWidget) => {
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
        )}

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
                <span className="text-lg">{currentUserLiked ? "Liked" : "Like"}</span>
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
                          <span className="text-xs text-white/30">U</span>
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
            <h3 className="text-sm font-bold text-white mb-3">
              Comments ({comments.length})
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
                    className={`px-4 py-2 ${accent.bg} text-black font-bold rounded-lg ${accent.hover} transition-colors disabled:opacity-50 text-sm`}
                  >
                    Post
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10 text-center">
                <Link href="/login" className={`${accent.text} hover:underline text-sm`}>
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
                        <span className="text-sm text-white/30">U</span>
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

      {/* Widget Picker Modal */}
      {showWidgetPicker && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowWidgetPicker(false)}>
          <div className="bg-spades-gray rounded-xl border border-white/10 max-w-3xl w-full max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Add a Widget</h3>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { type: "photos", label: "Photo Gallery", description: "Add multiple photos of your build" },
                { type: "video", label: "Video", description: "Upload videos or embed from YouTube, TikTok" },
                { type: "spotify", label: "Theme Song", description: "Add a Spotify track to your page" },
                { type: "stats", label: "Car Stats", description: "Power, torque, 0-60, quarter mile" },
                { type: "mods", label: "Mod List", description: "List your modifications" },
                { type: "text", label: "Text Block", description: "Custom text section" },
                { type: "rollrace", label: "Roll Race Record", description: "Track your wins and losses" },
                { type: "social", label: "Social Links", description: "Link your socials" },
                { type: "buttons", label: "CTA Buttons", description: "Add custom buttons/links" },
              ].map((wt) => (
                <button
                  key={wt.type}
                  onClick={() => addWidget(wt.type)}
                  className={`p-4 bg-white/5 rounded-lg border border-white/10 transition-colors text-left ${
                    displayGarage.appearance?.accent === "spades" ? "hover:border-spades-gold/50" :
                    displayGarage.appearance?.accent === "crimson" ? "hover:border-red-400/50" :
                    displayGarage.appearance?.accent === "electric" ? "hover:border-cyan-300/50" :
                    displayGarage.appearance?.accent === "neon" ? "hover:border-emerald-300/50" :
                    displayGarage.appearance?.accent === "purple" ? "hover:border-purple-300/50" :
                    displayGarage.appearance?.accent === "white" ? "hover:border-white/50" :
                    "hover:border-spades-gold/50"
                  }`}
                >
                  <div className="font-bold text-white text-sm mb-1">{wt.label}</div>
                  <div className="text-white/40 text-xs">{wt.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Widget Editor Modal */}
      {editingWidget && isEditing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setEditingWidget(null)}>
          <div className="bg-spades-gray rounded-xl border border-white/10 max-w-2xl w-full max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 p-4 border-b border-white/10 bg-spades-gray flex items-center justify-between">
              <input
                type="text"
                value={editingWidget.title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setEditingWidget({ ...editingWidget, title: newTitle });
                  updateWidget(editingWidget.id, { title: newTitle });
                }}
                className={`text-lg font-bold text-white bg-transparent border-b border-transparent hover:border-white/20 focus:outline-none ${
                  displayGarage.appearance?.accent === "spades" ? "focus:border-spades-gold" :
                  displayGarage.appearance?.accent === "crimson" ? "focus:border-red-400" :
                  displayGarage.appearance?.accent === "electric" ? "focus:border-cyan-300" :
                  displayGarage.appearance?.accent === "neon" ? "focus:border-emerald-300" :
                  displayGarage.appearance?.accent === "purple" ? "focus:border-purple-300" :
                  displayGarage.appearance?.accent === "white" ? "focus:border-white" :
                  "focus:border-spades-gold"
                }`}
              />
              <button onClick={() => setEditingWidget(null)} className="text-white/50 hover:text-white text-xl">×</button>
            </div>
            <div className="p-6">
              {renderWidgetEditor(editingWidget)}
            </div>
            <div className="sticky bottom-0 p-4 border-t border-white/10 bg-spades-gray flex justify-end">
              <button
                onClick={() => setEditingWidget(null)}
                className={`px-6 py-2 ${accent.bg} text-black font-bold rounded-lg ${accent.hover} transition-colors`}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <img src={lightboxImage} alt="" className="max-w-full max-h-full object-contain" />
          <button className="absolute top-4 right-4 text-white/50 hover:text-white text-2xl">×</button>
        </div>
      )}
    </div>
  );
}

function isWidgetEmpty(widget: GarageWidget): boolean {
  if (!widget.data) return true;
  
  switch (widget.type) {
    case "photos":
      return !widget.data.images || widget.data.images.length === 0;
    case "video":
      const videos = widget.data.videos || (widget.data.url ? [{ url: widget.data.url }] : []);
      return videos.length === 0 || !videos.some((v: any) => v.url);
    case "spotify":
      return !widget.data.trackUrl;
    case "stats":
      const stats = ["power", "torque", "zeroToSixty", "quarterMile", "topSpeed"];
      return !stats.some(key => widget.data[key]);
    case "mods":
      const categories = widget.data.categories || [];
      return categories.length === 0 || categories.every((c: any) => !c.items || c.items.length === 0);
    case "text":
      return !widget.data.content;
    case "rollrace":
      return (widget.data.wins === 0 || !widget.data.wins) && (widget.data.losses === 0 || !widget.data.losses);
    case "social":
      return !widget.data.links || widget.data.links.length === 0;
    case "buttons":
      return !widget.data.buttons || widget.data.buttons.length === 0;
    default:
      return true;
  }
}

function renderWidget(widget: GarageWidget, setLightboxImage: (img: string | null) => void, cardClass: string, accentText: string, isEditing: boolean = false) {
  const isEmpty = isWidgetEmpty(widget);
  
  // In edit mode, always show widgets - either the actual widget or a placeholder
  if (isEditing) {
    if (isEmpty) {
    return (
        <div className={`${cardClass} rounded-xl p-6 border-2 border-dashed border-spades-gold/50 min-h-[200px] flex flex-col items-center justify-center bg-white/5`}>
        <h3 className="text-lg font-bold text-white mb-2">{widget.title}</h3>
          <p className="text-white/50 text-sm text-center mb-4">Empty widget</p>
          <p className="text-spades-gold/70 text-xs text-center">Click Edit button above to add content</p>
      </div>
    );
    }
  }

  // Render the actual widget
  let widgetContent: React.ReactNode = null;
  switch (widget.type) {
    case "photos":
      widgetContent = <PhotosWidget widget={widget} setLightboxImage={setLightboxImage} cardClass={cardClass} />;
      break;
    case "video":
      widgetContent = <VideoWidget widget={widget} cardClass={cardClass} />;
      break;
    case "spotify":
      widgetContent = <SpotifyWidget widget={widget} cardClass={cardClass} />;
      break;
    case "stats":
      widgetContent = <StatsWidget widget={widget} cardClass={cardClass} accentText={accentText} />;
      break;
    case "mods":
      widgetContent = <ModsWidget widget={widget} cardClass={cardClass} accentText={accentText} />;
      break;
    case "text":
      widgetContent = <TextWidget widget={widget} cardClass={cardClass} />;
      break;
    case "rollrace":
      widgetContent = <RollRaceWidget widget={widget} cardClass={cardClass} />;
      break;
    case "social":
      widgetContent = <SocialWidget widget={widget} cardClass={cardClass} />;
      break;
    case "buttons":
      widgetContent = <ButtonsWidget widget={widget} cardClass={cardClass} />;
      break;
  }

  // If widget content is null and we're not in edit mode, return null
  if (!widgetContent && !isEditing) {
      return null;
  }

  // If widget content is null in edit mode, show placeholder (shouldn't happen but safety check)
  if (!widgetContent && isEditing) {
    return (
      <div className={`${cardClass} rounded-xl p-6 border-2 border-dashed border-spades-gold/50 min-h-[200px] flex flex-col items-center justify-center bg-white/5`}>
        <h3 className="text-lg font-bold text-white mb-2">{widget.title}</h3>
        <p className="text-white/50 text-sm text-center">Widget content unavailable</p>
      </div>
    );
  }

  return widgetContent;
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
          <h3 className="font-semibold text-white text-sm">
            {widget.title}
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
  // Support both old format (single url) and new format (videos array)
  const videos = widget.data.videos || (widget.data.url ? [{ url: widget.data.url, type: widget.data.type || "url" }] : []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Filter to only direct/uploaded videos for reel (exclude YouTube/TikTok)
  const directVideos = videos.filter((v: any) => {
    const url = v.url || "";
  const isSupabaseVideo = url?.includes("supabase.co") && url?.includes("/storage/");
  const isDirectVideo = url?.match(/\.(mp4|webm|mov|ogg)$/i) || isSupabaseVideo;
    return isDirectVideo;
  });

  // Handle video end - move to next video or loop
  const handleVideoEnd = () => {
    if (directVideos.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % directVideos.length);
    } else if (directVideos.length === 1) {
      // Loop single video
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }
  };

  // Play next video when index changes
  useEffect(() => {
    if (videoRef.current && directVideos.length > 0) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked, user can click to play
      });
    }
  }, [currentIndex, directVideos.length]);

  if (directVideos.length === 0) {
    // Fallback to old single video format or handle YouTube/TikTok
    const url = widget.data.url;
  if (!url) return null;

  const isYouTube = url?.includes("youtube.com") || url?.includes("youtu.be");
  const isTikTok = url?.includes("tiktok.com");
    
    if (isYouTube || isTikTok) {
      // Handle YouTube/TikTok as before (single video, not in reel)
  if (isYouTube) {
    let videoId = "";
    if (url.includes("youtube.com/watch")) {
      videoId = new URL(url).searchParams.get("v") || "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    }
    
    return (
      <div className="flex justify-center">
        <div className={`${cardClass} rounded-xl overflow-hidden w-full max-w-[480px]`}>
          <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <span>🎬</span> {widget.title}
            </h3>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    );
  }

  if (isTikTok) {
    const match = url.match(/video\/(\d+)/);
    const videoId = match?.[1];
    
    return (
      <div className="flex justify-center">
        <div className={`${cardClass} rounded-xl overflow-hidden w-[280px]`}>
          <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <span>🎬</span> {widget.title}
            </h3>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          <div className="relative bg-black" style={{ aspectRatio: '9/16' }}>
            {videoId && (
              <iframe
                src={`https://www.tiktok.com/embed/v2/${videoId}`}
                className="absolute inset-0 w-full h-full"
                allow="encrypted-media"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </div>
    );
      }
    }
    return null;
  }

  // Render video reel for direct/uploaded videos
  const currentVideo = directVideos[currentIndex];
  if (!currentVideo?.url) return null;

  return (
    <div className="flex justify-center">
      <div className={`${cardClass} rounded-xl overflow-hidden w-full max-w-[400px]`}>
          {/* Header */}
        <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm">
            {widget.title}
          </h3>
          {directVideos.length > 1 && (
            <span className="text-white/40 text-xs">{currentIndex + 1}/{directVideos.length}</span>
          )}
        </div>
          
        {/* Video Reel */}
        <div className="bg-black relative">
          <video
            ref={videoRef}
            key={currentVideo.url}
            src={currentVideo.url}
            controls
            muted
            onEnded={handleVideoEnd}
            className="w-full max-h-[600px] object-contain"
            preload="auto"
            playsInline
            loop={directVideos.length === 1}
          />
          
          {/* Navigation for multiple videos */}
          {directVideos.length > 1 && (
            <>
              <button
                onClick={() => {
                  const prevIndex = (currentIndex - 1 + directVideos.length) % directVideos.length;
                  setCurrentIndex(prevIndex);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 text-white text-lg flex items-center justify-center hover:bg-black/90 transition-opacity"
              >
                ‹
              </button>
              <button
                onClick={() => {
                  const nextIndex = (currentIndex + 1) % directVideos.length;
                  setCurrentIndex(nextIndex);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 text-white text-lg flex items-center justify-center hover:bg-black/90 transition-opacity"
              >
                ›
              </button>
            </>
          )}
        </div>
        
        {/* Dots indicator for multiple videos */}
        {directVideos.length > 1 && (
          <div className="flex justify-center gap-1 py-2">
            {directVideos.map((_: any, i: number) => (
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
      <h3 className="text-lg font-bold text-white mb-4">
        Theme Song
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
    { key: "power", label: "Power" },
    { key: "torque", label: "Torque" },
    { key: "zeroToSixty", label: "0-60" },
    { key: "quarterMile", label: "1/4 Mile" },
    { key: "topSpeed", label: "Top Speed" },
  ].filter((s) => widget.data[s.key]);

  if (stats.length === 0) return null;

  return (
    <div className={`${cardClass} rounded-xl p-6`}>
      <h3 className="text-lg font-bold text-white mb-4">
        {widget.title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.key} className="text-center p-4 bg-white/5 rounded-lg">
            <div className={`text-xl font-bold ${accentText}`}>{widget.data[stat.key]}</div>
            <div className="text-white/40 text-xs uppercase">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

const ModsWidget = memo(function ModsWidget({ widget, cardClass, accentText }: { widget: GarageWidget; cardClass: string; accentText: string }) {
  const categories = widget.data.categories?.filter((c: any) => c.items?.length > 0) || [];
  if (categories.length === 0) return null;

  return (
    <div className={`${cardClass} rounded-xl p-6`}>
      <h3 className="text-lg font-bold text-white mb-4">
        {widget.title}
      </h3>
      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((cat: any, i: number) => (
          <div key={i}>
            <h4 className={`${accentText} font-bold mb-2`}>{cat.name}</h4>
            <ul className="space-y-1">
              {cat.items.map((item: string, j: number) => (
                <li key={j} className="text-white/60 text-sm flex items-center gap-2">
                  <span className={accentText}>♠</span> {item}
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
      <h3 className="text-lg font-bold text-white mb-4">
        {widget.title}
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
      <h3 className="text-lg font-bold text-white mb-4">
        Roll Race Record
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
    instagram: "IG",
    tiktok: "TT",
    youtube: "YT",
    twitter: "X",
    website: "WEB",
  };

  return (
    <div className={`${cardClass} rounded-xl p-6`}>
      <h3 className="text-lg font-bold text-white mb-4">
        {widget.title}
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
            <span>{platformIcons[link.platform] || "Link"}</span>
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
      <h3 className="text-lg font-bold text-white mb-4">
        {widget.title}
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
            {btn.emoji && <span>{btn.emoji}</span>}
            <span className="font-semibold text-sm">{btn.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
});

// Widget Editor Components
function SortablePhotoItem({ url, index, onRemove }: { url: string; index: number; onRemove: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `photo-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <img src={url} alt="" className="w-full aspect-square object-cover rounded" />
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 w-6 h-6 bg-black/70 text-white rounded text-xs flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100"
        title="Drag to reorder"
      >
        ⋮⋮
      </div>
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded text-xs opacity-0 group-hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}

function PhotosWidgetEditor({ widget, updateWidget }: { widget: GarageWidget; updateWidget: (data: any) => void }) {
  const [uploading, setUploading] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const currentImages = widget.data.images || [];
    const newUrls: string[] = [];
    for (const file of Array.from(files).slice(0, 20 - currentImages.length)) {
      try {
        const url = await uploadImage(file, "garage/photos");
        newUrls.push(url);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
    updateWidget({ ...widget.data, images: [...currentImages, ...newUrls] });
    setUploading(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const images = widget.data.images || [];
    const oldIndex = parseInt(active.id.toString().split("-")[1]);
    const newIndex = parseInt(over.id.toString().split("-")[1]);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newImages = arrayMove(images, oldIndex, newIndex);
      updateWidget({ ...widget.data, images: newImages });
    }
  };

  return (
    <div>
      <label className="block w-full p-6 border-2 border-dashed border-white/20 rounded-lg text-center cursor-pointer hover:border-white/40">
        <input type="file" accept="image/*" multiple onChange={addPhotos} disabled={uploading} className="hidden" />
        {uploading ? "Uploading..." : "Add Photos"}
      </label>
      {widget.data.images?.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={(widget.data.images || []).map((_: string, i: number) => `photo-${i}`)} strategy={rectSortingStrategy}>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {widget.data.images.map((url: string, i: number) => (
                <SortablePhotoItem
                  key={`photo-${i}`}
                  url={url}
                  index={i}
                  onRemove={() => updateWidget({ ...widget.data, images: widget.data.images.filter((_: string, idx: number) => idx !== i) })}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function VideoWidgetEditor({ widget, updateWidget }: { widget: GarageWidget; updateWidget: (data: any) => void }) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const videos = widget.data.videos || (widget.data.url ? [{ url: widget.data.url, type: widget.data.type || "url" }] : []);
  
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const currentVideos = [...videos];
    const newVideos: any[] = [];
    
    for (const file of Array.from(files)) {
    try {
      const url = await uploadVideo(file);
        newVideos.push({ url, type: "upload", fileName: file.name });
    } catch (error: any) {
        console.error("Upload failed:", error);
      }
    }
    
    updateWidget({ ...widget.data, videos: [...currentVideos, ...newVideos] });
    setUploading(false);
  };
  
  const handleAddUrl = (url: string) => {
    if (!url.trim()) return;
    const newVideos = [...videos, { url: url.trim(), type: "url" }];
    updateWidget({ ...widget.data, videos: newVideos });
  };
  
  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_: any, i: number) => i !== index);
    updateWidget({ ...widget.data, videos: newVideos });
  };
  
  const [urlInput, setUrlInput] = useState("");
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode("upload")} className={`flex-1 py-2 px-4 rounded-lg text-sm ${mode === "upload" ? "bg-spades-gold text-black" : "bg-white/5 text-white/60"}`}>
          Upload Videos
        </button>
        <button onClick={() => setMode("url")} className={`flex-1 py-2 px-4 rounded-lg text-sm ${mode === "url" ? "bg-spades-gold text-black" : "bg-white/5 text-white/60"}`}>
          Add URL
        </button>
      </div>
      
      {mode === "upload" ? (
        <label className="block w-full p-6 border-2 border-dashed border-white/20 rounded-lg text-center cursor-pointer">
          <input type="file" accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov" onChange={handleVideoUpload} disabled={uploading} multiple className="hidden" />
          {uploading ? "Uploading..." : "Click to upload videos (multiple allowed)"}
        </label>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
        <input
          type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && urlInput.trim()) {
                  handleAddUrl(urlInput);
                  setUrlInput("");
                }
              }}
              placeholder="Paste video URL and press Enter"
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
            />
            <button
              onClick={() => {
                if (urlInput.trim()) {
                  handleAddUrl(urlInput);
                  setUrlInput("");
                }
              }}
              className="px-4 py-3 bg-spades-gold text-black font-bold rounded-lg hover:bg-spades-gold/90"
            >
              Add
            </button>
          </div>
          <p className="text-white/40 text-xs">Note: Only direct video URLs will play in the reel. YouTube/TikTok links will display separately.</p>
        </div>
      )}
      
      {videos.length > 0 && (
        <div className="space-y-2">
          <label className="block text-white/50 text-sm">Videos ({videos.length})</label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {videos.map((video: any, i: number) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                <span className="flex-1 text-white/70 text-sm truncate">{video.url || video.fileName || `Video ${i + 1}`}</span>
                <button
                  onClick={() => removeVideo(i)}
                  className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <p className="text-white/40 text-xs">Videos will play sequentially and loop automatically</p>
        </div>
      )}
    </div>
  );
}

function SpotifyWidgetEditor({ widget, updateWidget }: { widget: GarageWidget; updateWidget: (data: any) => void }) {
  return (
    <input
      type="text"
      value={widget.data.trackUrl || ""}
      onChange={(e) => updateWidget({ ...widget.data, trackUrl: e.target.value })}
      placeholder="Paste Spotify track URL"
      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
    />
  );
}

function StatsWidgetEditor({ widget, updateWidget }: { widget: GarageWidget; updateWidget: (data: any) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {["power", "torque", "zeroToSixty", "quarterMile", "topSpeed"].map((key) => (
        <div key={key}>
          <label className="block text-white/50 text-xs mb-1 capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
          <input
            type="text"
            value={widget.data[key] || ""}
            onChange={(e) => updateWidget({ ...widget.data, [key]: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-spades-gold/50 focus:outline-none"
          />
        </div>
      ))}
    </div>
  );
}

function ModsWidgetEditor({ widget, updateWidget }: { widget: GarageWidget; updateWidget: (data: any) => void }) {
  const categories = widget.data.categories || [{ name: "Engine", items: [] }, { name: "Fuel system", items: [] }, { name: "Drivetrain", items: [] }, { name: "Suspension", items: [] }, { name: "Wheels and Tires", items: [] }, { name: "Exterior", items: [] }, { name: "Extras", items: [] }];
  return (
    <div className="space-y-4">
      {categories.map((cat: any, i: number) => (
        <div key={i}>
          <input
            type="text"
            value={cat.name}
            onChange={(e) => {
              const newCats = [...categories];
              newCats[i].name = e.target.value;
              updateWidget({ ...widget.data, categories: newCats });
            }}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm mb-2 focus:border-spades-gold/50 focus:outline-none"
          />
          <div className="space-y-2">
            {cat.items.map((item: string, j: number) => (
              <div key={j} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newCats = [...categories];
                    newCats[i].items[j] = e.target.value;
                    updateWidget({ ...widget.data, categories: newCats });
                  }}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-spades-gold/50 focus:outline-none"
                />
                <button
                  onClick={() => {
                    const newCats = [...categories];
                    newCats[i].items = newCats[i].items.filter((_: string, idx: number) => idx !== j);
                    updateWidget({ ...widget.data, categories: newCats });
                  }}
                  className="px-3 py-2 bg-red-500/20 text-red-400 rounded text-sm"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newCats = [...categories];
                newCats[i].items.push("");
                updateWidget({ ...widget.data, categories: newCats });
              }}
              className="text-spades-gold text-sm hover:underline"
            >
              + Add item
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TextWidgetEditor({ widget, updateWidget }: { widget: GarageWidget; updateWidget: (data: any) => void }) {
  return (
    <textarea
      value={widget.data.content || ""}
      onChange={(e) => updateWidget({ ...widget.data, content: e.target.value })}
      placeholder="Enter your text..."
      rows={8}
      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none resize-none"
    />
  );
}

function RollRaceWidgetEditor({ widget, updateWidget }: { widget: GarageWidget; updateWidget: (data: any) => void }) {
  const [notableWinsText, setNotableWinsText] = useState((widget.data.notable || []).join(", "));
  
  // Update local state when widget data changes externally
  useEffect(() => {
    setNotableWinsText((widget.data.notable || []).join(", "));
  }, [widget.data.notable]);
  
  return (
    <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-white/50 text-sm mb-1">Wins</label>
        <input
          type="number"
          value={widget.data.wins || 0}
          onChange={(e) => updateWidget({ ...widget.data, wins: parseInt(e.target.value) || 0 })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-white/50 text-sm mb-1">Losses</label>
        <input
          type="number"
          value={widget.data.losses || 0}
          onChange={(e) => updateWidget({ ...widget.data, losses: parseInt(e.target.value) || 0 })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
        />
        </div>
      </div>
      <div>
        <label className="block text-white/50 text-sm mb-1">Notable Wins</label>
        <textarea
          value={notableWinsText}
          onChange={(e) => {
            setNotableWinsText(e.target.value);
          }}
          onBlur={(e) => {
            // Update widget data when user finishes editing
            const notable = e.target.value
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item.length > 0);
            updateWidget({ ...widget.data, notable });
          }}
          placeholder="Enter notable wins separated by commas (e.g., FBO Magnussen blower, Chevy SS)"
          rows={3}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none resize-none text-sm"
        />
        <p className="text-white/30 text-xs mt-1">Separate multiple wins with commas</p>
      </div>
    </div>
  );
}

function SocialWidgetEditor({ widget, updateWidget }: { widget: GarageWidget; updateWidget: (data: any) => void }) {
  const links = widget.data.links || [];
  return (
    <div className="space-y-3">
      {links.map((link: any, i: number) => (
        <div key={i} className="flex gap-2">
          <select
            value={link.platform}
            onChange={(e) => {
              const newLinks = [...links];
              newLinks[i].platform = e.target.value;
              updateWidget({ ...widget.data, links: newLinks });
            }}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none"
          >
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
            <option value="twitter">Twitter</option>
            <option value="website">Website</option>
          </select>
          <input
            type="text"
            value={link.url}
            onChange={(e) => {
              const newLinks = [...links];
              newLinks[i].url = e.target.value;
              updateWidget({ ...widget.data, links: newLinks });
            }}
            placeholder="URL"
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-spades-gold/50 focus:outline-none"
          />
          <button
            onClick={() => updateWidget({ ...widget.data, links: links.filter((_: any, idx: number) => idx !== i) })}
            className="px-3 py-2 bg-red-500/20 text-red-400 rounded text-sm"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={() => updateWidget({ ...widget.data, links: [...links, { platform: "instagram", url: "" }] })}
        className="text-spades-gold text-sm hover:underline"
      >
        + Add link
      </button>
    </div>
  );
}

function ButtonsWidgetEditor({ widget, updateWidget }: { widget: GarageWidget; updateWidget: (data: any) => void }) {
  const buttons = widget.data.buttons || [];
  return (
    <div className="space-y-3">
      {buttons.map((btn: any, i: number) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={btn.emoji || ""}
            onChange={(e) => {
              const newButtons = [...buttons];
              newButtons[i].emoji = e.target.value;
              updateWidget({ ...widget.data, buttons: newButtons });
            }}
            placeholder="Emoji"
            className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none"
          />
          <input
            type="text"
            value={btn.label}
            onChange={(e) => {
              const newButtons = [...buttons];
              newButtons[i].label = e.target.value;
              updateWidget({ ...widget.data, buttons: newButtons });
            }}
            placeholder="Label"
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none"
          />
          <input
            type="text"
            value={btn.url}
            onChange={(e) => {
              const newButtons = [...buttons];
              newButtons[i].url = e.target.value;
              updateWidget({ ...widget.data, buttons: newButtons });
            }}
            placeholder="URL"
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none"
          />
          <button
            onClick={() => updateWidget({ ...widget.data, buttons: buttons.filter((_: any, idx: number) => idx !== i) })}
            className="px-3 py-2 bg-red-500/20 text-red-400 rounded text-sm"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={() => updateWidget({ ...widget.data, buttons: [...buttons, { emoji: "", label: "", url: "" }] })}
        className="text-spades-gold text-sm hover:underline"
      >
        + Add button
      </button>
    </div>
  );
}
