"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";
import { uploadImage } from "@/lib/upload";
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

type User = {
  id: string;
  username: string;
  name: string;
  rank: string | null;
};

type GarageWidget = {
  id: string;
  type: "photos" | "video" | "spotify" | "stats" | "mods" | "text" | "rollrace" | "social" | "buttons";
  title: string;
  data: any;
  order: number;
  size?: "small" | "medium" | "large" | "full";
};

const WIDGET_TYPES = [
  { type: "photos", label: "Photo Gallery", icon: "📸", description: "Add multiple photos of your build" },
  { type: "video", label: "Clips", icon: "🎬", description: "Embed YouTube or TikTok videos" },
  { type: "spotify", label: "Tracks", icon: "🎵", description: "Add a track to your page" },
  { type: "stats", label: "Car Stats", icon: "📊", description: "Power, torque, 0-60, quarter mile" },
  { type: "mods", label: "Mod List", icon: "🔧", description: "List your modifications" },
  { type: "text", label: "Text Block", icon: "📝", description: "Custom text section" },
  { type: "rollrace", label: "Roll Race Record", icon: "🏁", description: "Track your wins and losses" },
  { type: "social", label: "Social Links", icon: "🔗", description: "Link your socials" },
  { type: "buttons", label: "CTA Buttons", icon: "🔘", description: "Add custom buttons/links with emoji" },
];

// Sortable Widget Card for drag-and-drop
function SortableWidgetCard({ 
  widget, 
  onRemove, 
  onSizeChange, 
  onEdit 
}: { 
  widget: GarageWidget; 
  onRemove: () => void; 
  onSizeChange: (size: GarageWidget["size"]) => void;
  onEdit: () => void;
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
    zIndex: isDragging ? 100 : 1,
  };

  const widgetInfo = WIDGET_TYPES.find(w => w.type === widget.type);
  const sizeLabels: Record<string, string> = {
    small: "S",
    medium: "M", 
    large: "L",
    full: "F",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-spades-gold/30 transition-all ${
        isDragging ? "shadow-2xl shadow-spades-gold/20 scale-105" : ""
      }`}
    >
      {/* Drag Handle + Header */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/10 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{widgetInfo?.icon}</span>
          <span className="font-medium text-white text-sm truncate max-w-[100px]">{widget.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-white/40 bg-white/10 px-1.5 py-0.5 rounded">
            {sizeLabels[widget.size || "full"]}
          </span>
        </div>
      </div>

      {/* Preview */}
      <div 
        className="p-3 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={onEdit}
      >
        <p className="text-white/40 text-xs line-clamp-2">
          {widgetInfo?.description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex border-t border-white/10">
        <button
          onClick={onEdit}
          className="flex-1 py-2 text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          Edit
        </button>
        <select
          value={widget.size || "full"}
          onChange={(e) => onSizeChange(e.target.value as GarageWidget["size"])}
          className="flex-1 py-2 text-xs text-white/60 bg-transparent border-l border-white/10 hover:bg-white/5 focus:outline-none text-center"
        >
          <option value="small">1/3</option>
          <option value="medium">1/2</option>
          <option value="large">2/3</option>
          <option value="full">Full</option>
        </select>
        <button
          onClick={onRemove}
          className="flex-1 py-2 text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors border-l border-white/10"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function CreateGaragePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: basic info, 2: customize widgets

  // Basic car info
  const [formData, setFormData] = useState({
    year: "",
    make: "",
    model: "",
    power: "",
    platform: "",
    location: "",
    description: "",
  });
  const [coverImage, setCoverImage] = useState<string>("");
  const [appearance, setAppearance] = useState({
    accent: "spades",
    cardStyle: "glass",
    background: "grid",
    showRank: true,
    stickers: ["🚗", "🏁", "🛠️"],
  });

  // Widgets
  const [widgets, setWidgets] = useState<GarageWidget[]>([]);
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

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.user) {
          setUser(data.user);
          const allowedRanks = ["verified", "og", "admin"];
          if (!allowedRanks.includes(data.user.rank || "")) {
            setError("Only Verified, OG, and Admin members can create garages.");
          }
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const addWidget = (type: string) => {
    const newWidget: GarageWidget = {
      id: `widget-${Date.now()}`,
      type: type as GarageWidget["type"],
      title: WIDGET_TYPES.find(w => w.type === type)?.label || type,
      data: getDefaultWidgetData(type),
      order: widgets.length,
    };
    setWidgets([...widgets, newWidget]);
    setShowWidgetPicker(false);
  };

  const getDefaultWidgetData = (type: string) => {
    switch (type) {
      case "photos": return { images: [] };
      case "video": return { type: "url", url: "", videoData: "", fileName: "", fileType: "" };
      case "spotify": return { trackUrl: "" };
      case "stats": return { power: "", torque: "", zeroToSixty: "", quarterMile: "", topSpeed: "" };
      case "mods": return { categories: [{ name: "Engine", items: [] }, { name: "Fuel system", items: [] }, { name: "Drivetrain", items: [] }, { name: "Suspension", items: [] }, { name: "Wheels and Tires", items: [] }, { name: "Exterior", items: [] }, { name: "Extras", items: [] }] };
      case "text": return { content: "" };
      case "rollrace": return { wins: 0, losses: 0, notable: [] };
      case "social": return { links: [] };
      case "buttons": return { buttons: [{ label: "Follow", url: "https://instagram.com/", emoji: "🚀" }] };
      default: return {};
    }
  };

  const updateWidget = (id: string, data: any) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, data } : w));
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  const moveWidget = (id: string, direction: "up" | "down") => {
    const index = widgets.findIndex(w => w.id === id);
    if (direction === "up" && index > 0) {
      const newWidgets = [...widgets];
      [newWidgets[index - 1], newWidgets[index]] = [newWidgets[index], newWidgets[index - 1]];
      setWidgets(newWidgets);
    } else if (direction === "down" && index < widgets.length - 1) {
      const newWidgets = [...widgets];
      [newWidgets[index], newWidgets[index + 1]] = [newWidgets[index + 1], newWidgets[index]];
      setWidgets(newWidgets);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/garages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cover_image: coverImage,
          appearance,
          widgets: widgets,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/garage/me");
      } else {
        setError(data.error || "Failed to create garage");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-white/30 font-mono">Loading...</div>
      </div>
    );
  }

  const allowedRanks = ["verified", "og", "admin"];
  const canCreate = user && allowedRanks.includes(user.rank || "");

  if (!canCreate) {
    return (
      <div className="min-h-screen pt-32 px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-bold text-white mb-2">Garage Access Restricted</h2>
            <p className="text-white/50 mb-4">Only Verified, OG, and Admin members can create public garages.</p>
            <p className="text-white/30 text-sm">Your current rank: <span className="text-white/50">{user?.rank?.toUpperCase() || "MEMBER"}</span></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/garage/me" className="text-white/50 hover:text-white transition-colors">
              ← Back
            </Link>
            <span className="text-white/20">|</span>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <SpadeIcon className="w-5 h-5 text-spades-gold" />
              Create Your Garage
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className={`px-3 py-1 rounded-full ${step === 1 ? 'bg-spades-gold text-black' : 'bg-white/10 text-white/50'}`}>1. Basic Info</span>
            <span className={`px-3 py-1 rounded-full ${step === 2 ? 'bg-spades-gold text-black' : 'bg-white/10 text-white/50'}`}>2. Customize</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Cover Image */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-lg font-bold text-white mb-4">Cover Photo</h2>
              <div className="flex items-start gap-6">
                <div className="w-48 h-32 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                  {coverImage ? (
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <SpadeIcon className="w-10 h-10" />
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
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const url = await uploadImage(file, "garage/covers");
                            setCoverImage(url);
                          } catch (error) {
                            console.error("Failed to upload cover:", error);
                            alert("Failed to upload image. Please try again.");
                          }
                        }
                      }}
                    />
                  </label>
                  {coverImage && (
                    <button type="button" onClick={() => setCoverImage("")} className="ml-3 text-red-400 text-sm hover:underline">
                      Remove
                    </button>
                  )}
                  <p className="text-white/30 text-xs mt-2">This is the hero image at the top of your garage page.</p>
                </div>
              </div>
            </div>

            {/* Car Info */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-lg font-bold text-white mb-4">Car Information</h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-white/50 text-sm mb-1">Year *</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2020"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-sm mb-1">Make *</label>
                  <input
                    type="text"
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    placeholder="Toyota"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-sm mb-1">Model *</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Supra"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-white/50 text-sm mb-1">Platform/Engine</label>
                  <input
                    type="text"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    placeholder="2JZ-GTE, B58, LS3, etc."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-sm mb-1">Power</label>
                  <input
                    type="text"
                    value={formData.power}
                    onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                    placeholder="500whp"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/50 text-sm mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Denver, CO"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/50 text-sm mb-1">About Your Build</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell the story of your build..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Appearance */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Appearance</h2>
                  <p className="text-white/40 text-sm">Dial in theme, card style, and flair</p>
                </div>
                <div className="flex gap-2 text-xs text-white/40">
                  {appearance.stickers.map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-white/10 rounded-full">{s}</span>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Accent */}
                <div>
                  <label className="block text-white/50 text-xs mb-2">Accent Color</label>
                  <div className="grid grid-cols-3 gap-2">
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
                        onClick={() => setAppearance({ ...appearance, accent: opt.key })}
                        className={`flex items-center gap-2 px-2 py-2 rounded-lg border ${
                          appearance.accent === opt.key ? "border-white/60 bg-white/10" : "border-white/10 bg-white/5"
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full ${opt.swatch}`}></span>
                        <span className="text-white/70 text-xs">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card style */}
                <div>
                  <label className="block text-white/50 text-xs mb-2">Card Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: "glass", label: "Glass" },
                      { key: "carbon", label: "Carbon" },
                      { key: "dark", label: "Dark" },
                      { key: "outline", label: "Outline" },
                      { key: "transparent", label: "Clear" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setAppearance({ ...appearance, cardStyle: opt.key })}
                        className={`px-3 py-2 rounded-lg border text-sm ${
                          appearance.cardStyle === opt.key ? "border-white/60 text-white" : "border-white/10 text-white/50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background flair */}
                <div>
                  <label className="block text-white/50 text-xs mb-2">Background Flair</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: "grid", label: "Grid" },
                      { key: "gradient", label: "Gradient" },
                      { key: "noise", label: "Noise" },
                      { key: "clean", label: "Clean" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setAppearance({ ...appearance, background: opt.key })}
                        className={`px-3 py-2 rounded-lg border text-sm ${
                          appearance.background === opt.key ? "border-white/60 text-white" : "border-white/10 text-white/50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-white/70 text-sm">
                  <input
                    type="checkbox"
                    checked={appearance.showRank}
                    onChange={(e) => setAppearance({ ...appearance, showRank: e.target.checked })}
                    className="rounded border-white/20 bg-white/5"
                  />
                  Show rank badge
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (!formData.year || !formData.make || !formData.model) {
                    setError("Please fill in year, make, and model");
                    return;
                  }
                  setError(null);
                  setStep(2);
                }}
                className="px-6 py-3 bg-spades-gold text-black font-bold rounded-lg hover:bg-spades-gold/90 transition-colors"
              >
                Next: Customize →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Customize Widgets */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-spades-gold/20 to-transparent rounded-xl p-6 border border-spades-gold/20">
              <h2 className="text-lg font-bold text-spades-gold mb-2">🎨 Customize Your Garage</h2>
              <p className="text-white/50 text-sm">Add widgets to make your garage page unique. Drag to reorder, click to edit.</p>
            </div>

            {/* Draggable Widget Grid */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {widgets.map((widget) => (
                    <SortableWidgetCard
                      key={widget.id}
                      widget={widget}
                      onRemove={() => removeWidget(widget.id)}
                      onSizeChange={(size) => {
                        setWidgets(widgets.map(w => 
                          w.id === widget.id ? { ...w, size } : w
                        ));
                      }}
                      onEdit={() => setEditingWidget(widget)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Add Widget Button */}
            <button
              onClick={() => setShowWidgetPicker(true)}
              className="w-full py-4 border-2 border-dashed border-white/20 rounded-xl text-white/50 hover:border-spades-gold/50 hover:text-spades-gold transition-colors"
            >
              + Add Widget
            </button>

            {/* Widget Picker Modal */}
            {showWidgetPicker && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowWidgetPicker(false)}>
                <div className="bg-spades-gray rounded-xl border border-white/10 max-w-2xl w-full max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-lg font-bold text-white">Add a Widget</h3>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-3">
                    {WIDGET_TYPES.map((wt) => (
                      <button
                        key={wt.type}
                        onClick={() => addWidget(wt.type)}
                        className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-spades-gold/50 transition-colors text-left"
                      >
                        <div className="text-2xl mb-2">{wt.icon}</div>
                        <div className="font-bold text-white text-sm">{wt.label}</div>
                        <div className="text-white/40 text-xs">{wt.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Widget Edit Modal */}
            {editingWidget && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setEditingWidget(null)}>
                <div className="bg-spades-gray rounded-xl border border-white/10 max-w-2xl w-full max-h-[85vh] overflow-auto" onClick={e => e.stopPropagation()}>
                  <div className="sticky top-0 p-4 border-b border-white/10 bg-spades-gray flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{WIDGET_TYPES.find(w => w.type === editingWidget.type)?.icon}</span>
                      <input
                        type="text"
                        value={editingWidget.title}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          setEditingWidget({ ...editingWidget, title: newTitle });
                          setWidgets(widgets.map(w => w.id === editingWidget.id ? { ...w, title: newTitle } : w));
                        }}
                        className="text-lg font-bold text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-spades-gold focus:outline-none"
                      />
                    </div>
                    <button onClick={() => setEditingWidget(null)} className="text-white/50 hover:text-white text-xl">✕</button>
                  </div>
                  <div className="p-6">
                    {renderWidgetEditor(editingWidget, (id, data) => {
                      const newWidget = { ...editingWidget, data };
                      setEditingWidget(newWidget);
                      setWidgets(widgets.map(w => w.id === id ? { ...w, data } : w));
                    })}
                  </div>
                  <div className="sticky bottom-0 p-4 border-t border-white/10 bg-spades-gray flex justify-end gap-3">
                    <button
                      onClick={() => setEditingWidget(null)}
                      className="px-6 py-2 bg-spades-gold text-black font-bold rounded-lg hover:bg-spades-gold/90 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 text-white/50 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-8 py-3 bg-spades-gold text-black font-bold rounded-lg hover:bg-spades-gold/90 transition-colors disabled:opacity-50"
              >
                {saving ? "Creating..." : "🚀 Publish Garage"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Widget Editor Components
function renderWidgetEditor(widget: GarageWidget, updateWidget: (id: string, data: any) => void) {
  switch (widget.type) {
    case "photos":
      return <PhotosWidgetEditor widget={widget} updateWidget={updateWidget} />;
    case "video":
      return <VideoWidgetEditor widget={widget} updateWidget={updateWidget} />;
    case "spotify":
      return <SpotifyWidgetEditor widget={widget} updateWidget={updateWidget} />;
    case "stats":
      return <StatsWidgetEditor widget={widget} updateWidget={updateWidget} />;
    case "mods":
      return <ModsWidgetEditor widget={widget} updateWidget={updateWidget} />;
    case "text":
      return <TextWidgetEditor widget={widget} updateWidget={updateWidget} />;
    case "rollrace":
      return <RollRaceWidgetEditor widget={widget} updateWidget={updateWidget} />;
    case "social":
      return <SocialWidgetEditor widget={widget} updateWidget={updateWidget} />;
    case "buttons":
      return <ButtonsWidgetEditor widget={widget} updateWidget={updateWidget} />;
    default:
      return <div className="text-white/50">Unknown widget type</div>;
  }
}

function PhotosWidgetEditor({ widget, updateWidget }: { widget: GarageWidget; updateWidget: (id: string, data: any) => void }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const addPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    const currentImages = widget.data.images || [];
    const newUrls: string[] = [];
    const filesToUpload = Array.from(files).slice(0, 20 - currentImages.length);
    
    for (let i = 0; i < filesToUpload.length; i++) {
      setUploadProgress(`Uploading ${i + 1}/${filesToUpload.length}...`);
      try {
        const url = await uploadImage(filesToUpload[i], "garage/photos");
        newUrls.push(url);
      } catch (error) {
        console.error("Failed to upload:", error);
      }
    }
    
    updateWidget(widget.id, { images: [...currentImages, ...newUrls] });
    setUploading(false);
    setUploadProgress("");
    e.target.value = "";
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {(widget.data.images || []).map((img: string, i: number) => (
          <div key={i} className="aspect-square bg-white/10 rounded overflow-hidden relative group">
            <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
            <button
              onClick={() => updateWidget(widget.id, { images: widget.data.images.filter((_: any, idx: number) => idx !== i) })}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
        <label className={`aspect-square bg-white/5 rounded border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-spades-gold/50 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
          {uploading ? (
            <span className="text-white/50 text-xs text-center px-1">{uploadProgress}</span>
          ) : (
            <span className="text-white/30 text-2xl">+</span>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={addPhotos} multiple disabled={uploading} />
        </label>
      </div>
      <p className="text-white/30 text-xs">Add up to 20 photos • Uploaded to cloud storage for fast loading</p>
    </div>
  );
}

function VideoWidgetEditor({ widget, updateWidget }: { widget: GarageWidget; updateWidget: (id: string, data: any) => void }) {
  return (
    <div>
      <input
        type="text"
        value={widget.data.url || ""}
        onChange={(e) => updateWidget(widget.id, { ...widget.data, type: "url", url: e.target.value })}
        placeholder="Paste YouTube, TikTok, or Google Drive link"
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
      />
      <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10 space-y-2">
        <p className="text-white/60 text-xs">
          ✅ <strong className="text-white/80">Supported:</strong> YouTube, TikTok, Google Drive, direct .mp4 links
        </p>
        <p className="text-white/50 text-xs">
          💡 <strong className="text-white/70">Google Drive:</strong> Right-click video → Share → Copy link
        </p>
      </div>
    </div>
  );
}

function SpotifyWidgetEditor({ widget, updateWidget }: { widget: GarageWidget; updateWidget: (id: string, data: any) => void }) {
  return (
    <div>
      <input
        type="text"
        value={widget.data.trackUrl || ""}
        onChange={(e) => updateWidget(widget.id, { ...widget.data, trackUrl: e.target.value })}
        placeholder="Paste track link (Spotify, Apple Music, SoundCloud, etc.)"
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
      />
      <p className="text-white/30 text-xs mt-2">🎵 Your garage tracks - most providers work; we auto-embed Spotify, Apple Music, and SoundCloud.</p>
    </div>
  );
}

function StatsWidgetEditor({ widget, updateWidget }: { widget: GarageWidget; updateWidget: (id: string, data: any) => void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {[
        { key: "power", label: "Power", placeholder: "500whp" },
        { key: "torque", label: "Torque", placeholder: "450wtq" },
        { key: "zeroToSixty", label: "0-60", placeholder: "3.5s" },
        { key: "quarterMile", label: "1/4 Mile", placeholder: "11.2 @ 125" },
        { key: "topSpeed", label: "Top Speed", placeholder: "180mph" },
      ].map((stat) => (
        <div key={stat.key}>
          <label className="block text-white/40 text-xs mb-1">{stat.label}</label>
          <input
            type="text"
            value={widget.data[stat.key] || ""}
            onChange={(e) => updateWidget(widget.id, { ...widget.data, [stat.key]: e.target.value })}
            placeholder={stat.placeholder}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-spades-gold/50 focus:outline-none"
          />
        </div>
      ))}
    </div>
  );
}

function ModsWidgetEditor({ widget, updateWidget }: { widget: GarageWidget; updateWidget: (id: string, data: any) => void }) {
  const [newMod, setNewMod] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);

  const addMod = () => {
    if (!newMod.trim()) return;
    const categories = [...widget.data.categories];
    categories[selectedCategory].items = [...categories[selectedCategory].items, newMod.trim()];
    updateWidget(widget.id, { categories });
    setNewMod("");
  };

  return (
    <div>
      <div className="flex gap-2 mb-3 flex-wrap">
        {widget.data.categories.map((cat: any, i: number) => (
          <button
            key={i}
            onClick={() => setSelectedCategory(i)}
            className={`px-3 py-1 rounded text-sm ${selectedCategory === i ? 'bg-spades-gold text-black' : 'bg-white/10 text-white/50'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newMod}
          onChange={(e) => setNewMod(e.target.value)}
          placeholder="Add a mod..."
          onKeyDown={(e) => e.key === "Enter" && addMod()}
          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-spades-gold/50 focus:outline-none"
        />
        <button onClick={addMod} className="px-4 py-2 bg-spades-gold text-black font-bold rounded text-sm">Add</button>
      </div>
      <div className="space-y-1">
        {widget.data.categories[selectedCategory]?.items.map((mod: string, i: number) => (
          <div key={i} className="flex items-center justify-between px-3 py-2 bg-white/5 rounded text-sm">
            <span className="text-white/70">{mod}</span>
            <button
              onClick={() => {
                const categories = [...widget.data.categories];
                categories[selectedCategory].items = categories[selectedCategory].items.filter((_: any, idx: number) => idx !== i);
                updateWidget(widget.id, { categories });
              }}
              className="text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextWidgetEditor({ widget, updateWidget }: { widget: GarageWidget; updateWidget: (id: string, data: any) => void }) {
  return (
    <textarea
      value={widget.data.content || ""}
      onChange={(e) => updateWidget(widget.id, { content: e.target.value })}
      placeholder="Write anything... build story, shoutouts, future plans..."
      rows={4}
      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none resize-none"
    />
  );
}

function RollRaceWidgetEditor({ widget, updateWidget }: { widget: GarageWidget; updateWidget: (id: string, data: any) => void }) {
  const [newNotable, setNewNotable] = useState("");

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-green-400 text-sm mb-1">Wins</label>
          <input
            type="number"
            value={widget.data.wins || 0}
            onChange={(e) => updateWidget(widget.id, { ...widget.data, wins: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-2xl font-bold text-center focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="block text-red-400 text-sm mb-1">Losses</label>
          <input
            type="number"
            value={widget.data.losses || 0}
            onChange={(e) => updateWidget(widget.id, { ...widget.data, losses: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-2xl font-bold text-center focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="block text-white/50 text-sm mb-1">Notable Wins (optional)</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newNotable}
            onChange={(e) => setNewNotable(e.target.value)}
            placeholder="e.g., C8 Z06, Hellcat, GT500..."
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-spades-gold/50 focus:outline-none"
          />
          <button
            onClick={() => {
              if (newNotable.trim()) {
                updateWidget(widget.id, { ...widget.data, notable: [...(widget.data.notable || []), newNotable.trim()] });
                setNewNotable("");
              }
            }}
            className="px-4 py-2 bg-spades-gold text-black font-bold rounded text-sm"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(widget.data.notable || []).map((car: string, i: number) => (
            <span key={i} className="px-2 py-1 bg-spades-gold/20 text-spades-gold rounded text-xs flex items-center gap-1">
              {car}
              <button onClick={() => updateWidget(widget.id, { ...widget.data, notable: widget.data.notable.filter((_: any, idx: number) => idx !== i) })}>✕</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SocialWidgetEditor({ widget, updateWidget }: { widget: GarageWidget; updateWidget: (id: string, data: any) => void }) {
  const [platform, setPlatform] = useState("instagram");
  const [url, setUrl] = useState("");

  const addLink = () => {
    if (!url.trim()) return;
    updateWidget(widget.id, { links: [...(widget.data.links || []), { platform, url: url.trim() }] });
    setUrl("");
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none"
        >
          <option value="instagram">Instagram</option>
          <option value="tiktok">TikTok</option>
          <option value="youtube">YouTube</option>
          <option value="twitter">Twitter/X</option>
          <option value="website">Website</option>
        </select>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL or @handle"
          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-spades-gold/50 focus:outline-none"
        />
        <button onClick={addLink} className="px-4 py-2 bg-spades-gold text-black font-bold rounded text-sm">Add</button>
      </div>
      <div className="space-y-2">
        {(widget.data.links || []).map((link: any, i: number) => (
          <div key={i} className="flex items-center justify-between px-3 py-2 bg-white/5 rounded text-sm">
            <span className="text-white/70">{link.platform}: {link.url}</span>
            <button
              onClick={() => updateWidget(widget.id, { links: widget.data.links.filter((_: any, idx: number) => idx !== i) })}
              className="text-red-400"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ButtonsWidgetEditor({ widget, updateWidget }: { widget: GarageWidget; updateWidget: (id: string, data: any) => void }) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [emoji, setEmoji] = useState("🚀");

  const addButton = () => {
    if (!label.trim() || !url.trim()) return;
    const buttons = [...(widget.data.buttons || []), { label: label.trim(), url: url.trim(), emoji }];
    updateWidget(widget.id, { buttons });
    setLabel("");
    setUrl("");
    setEmoji("🚀");
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <input
          type="text"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          placeholder="Emoji"
          className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-spades-gold/50 focus:outline-none"
        />
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label"
          className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-spades-gold/50 focus:outline-none"
        />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-spades-gold/50 focus:outline-none"
        />
      </div>
      <button
        onClick={addButton}
        className="px-4 py-2 bg-spades-gold text-black font-bold rounded text-sm hover:bg-spades-gold/90 transition-colors"
      >
        Add Button
      </button>
      <div className="space-y-2">
        {(widget.data.buttons || []).map((btn: any, i: number) => (
          <div key={i} className="flex items-center justify-between px-3 py-2 bg-white/5 rounded text-sm">
            <div className="flex items-center gap-2">
              <span>{btn.emoji}</span>
              <span className="text-white/80">{btn.label}</span>
              <span className="text-white/40 text-xs">{btn.url}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const buttons = widget.data.buttons.filter((_: any, idx: number) => idx !== i);
                  updateWidget(widget.id, { buttons });
                }}
                className="text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
