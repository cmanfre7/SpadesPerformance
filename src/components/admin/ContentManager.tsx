"use client";

import { useState, useEffect } from 'react';
import { SiteContent } from '@/lib/admin-store';
import Link from 'next/link';

interface ContentManagerProps {
  content: SiteContent;
  onSave: (content: SiteContent) => void;
}

interface GarageSearchResult {
  username: string;
  title: string;
  cover_image: string | null;
  owner_name: string;
  carName: string;
}

export function ContentManager({ content, onSave }: ContentManagerProps) {
  const [formData, setFormData] = useState(content);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<'hero' | 'stats' | 'builds' | 'tiktok' | 'text'>('hero');
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<GarageSearchResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [availableGarages, setAvailableGarages] = useState<Array<{ username: string; title: string; owner_name: string; carName: string }>>([]);
  const [loadingGarages, setLoadingGarages] = useState(false);

  const handleSave = () => {
    onSave(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateFeaturedBuild = (index: number, field: string, value: string) => {
    const builds = [...formData.featuredBuilds];
    builds[index] = { ...builds[index], [field]: value };
    setFormData({ ...formData, featuredBuilds: builds });
  };

  const addFeaturedBuild = () => {
    setFormData({
      ...formData,
      featuredBuilds: [
        ...formData.featuredBuilds,
        { id: Date.now().toString(), name: '', owner: '', image: '' }
      ]
    });
  };

  const removeFeaturedBuild = (index: number) => {
    const builds = formData.featuredBuilds.filter((_, i) => i !== index);
    setFormData({ ...formData, featuredBuilds: builds });
  };

  const searchGarage = async (username: string) => {
    if (!username.trim()) {
      setSearchError('Please enter a username');
      return;
    }

    setSearching(true);
    setSearchError(null);
    setSearchResult(null);

    try {
      // Remove @ if user included it
      const cleanUsername = username.replace('@', '').trim();
      const response = await fetch(`/api/garages/${cleanUsername}`);
      const data = await response.json();

      if (data.ok && data.garage) {
        const carName = [data.garage.year, data.garage.make, data.garage.model].filter(Boolean).join(" ").trim();

        setSearchResult({
          username: data.garage.username,
          title: data.garage.title || data.garage.owner_name || 'Untitled Build',
          cover_image: data.garage.cover_image,
          owner_name: data.garage.owner_name || data.garage.username,
          carName: carName || data.garage.title || data.garage.owner_name || data.garage.username,
        });
        setSearchError(null);
      } else {
        setSearchError(data.error || 'Garage not found');
        setSearchResult(null);
      }
    } catch (error) {
      setSearchError('Failed to search garage');
      setSearchResult(null);
    } finally {
      setSearching(false);
    }
  };

  const addBuildFromSearch = () => {
    if (!searchResult) return;

    const displayName = searchResult.carName || searchResult.title;

    const newBuild = {
      id: Date.now().toString(),
      name: displayName,
      owner: `@${searchResult.username}`,
      image: searchResult.cover_image || '',
    };

    setFormData({
      ...formData,
      featuredBuilds: [...formData.featuredBuilds, newBuild],
    });

    // Reset search
    setSearchQuery('');
    setSearchResult(null);
    setSearchError(null);
  };

  // Load available garages when builds section is active
  useEffect(() => {
    if (activeSection === 'builds' && availableGarages.length === 0) {
      setLoadingGarages(true);
      fetch('/api/garages')
        .then((res) => res.json())
        .then((data) => {
          if (data.ok && data.garages) {
            const garages = data.garages.map((g: any) => {
              const carName = [g.year, g.make, g.model].filter(Boolean).join(" ").trim();
              return {
                username: g.username,
                title: g.title || g.owner_name || 'Untitled Build',
                owner_name: g.owner_name || g.username,
                carName: carName || g.title || g.owner_name || g.username,
              };
            });
            setAvailableGarages(garages);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingGarages(false));
    }
  }, [activeSection, availableGarages.length]);

  const handleGarageSelect = (username: string) => {
    if (!username) return;
    searchGarage(username);
  };

  const [tiktokUrlInput, setTiktokUrlInput] = useState('');

  const addTikTokVideo = () => {
    if (!tiktokUrlInput.trim()) return;
    
    const url = tiktokUrlInput.trim();
    // Validate TikTok URL
    if (!url.includes('tiktok.com')) {
      alert('Please enter a valid TikTok URL');
      return;
    }

    const videos = formData.tiktokVideos || [];
    if (videos.includes(url)) {
      alert('This TikTok video is already added');
      return;
    }

    setFormData({
      ...formData,
      tiktokVideos: [...videos, url],
    });

    setTiktokUrlInput('');
  };

  const removeTikTokVideo = (index: number) => {
    const videos = [...(formData.tiktokVideos || [])];
    videos.splice(index, 1);
    setFormData({
      ...formData,
      tiktokVideos: videos,
    });
  };

  const sections = [
    { id: 'hero', label: 'Hero Section', icon: '🏠' },
    { id: 'stats', label: 'Stats', icon: '📊' },
    { id: 'builds', label: 'Featured Builds', icon: '🚗' },
    { id: 'tiktok', label: 'TikTok Videos', icon: '🎬' },
    { id: 'text', label: 'Other Text', icon: '✏️' },
  ] as const;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Site Content</h2>
          <p className="text-white/40 text-sm mt-1">Edit text and content across your website.</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-6 py-2 font-bold text-sm rounded-lg transition-all ${
            saved 
              ? 'bg-green-500 text-white scale-105' 
              : 'bg-spades-gold text-black hover:bg-spades-gold/90'
          }`}
        >
          {saved ? '✓ Saved!' : 'Save All Changes'}
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              activeSection === section.id 
                ? 'bg-spades-gold/20 text-spades-gold border border-spades-gold/30' 
                : 'bg-white/5 text-white/50 hover:text-white border border-transparent'
            }`}
          >
            <span>{section.icon}</span>
            <span className="text-sm font-medium">{section.label}</span>
          </button>
        ))}
      </div>

      {/* Hero Section */}
      {activeSection === 'hero' && (
        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">🏠 Hero Section</h3>
            <p className="text-white/40 text-sm mb-4">The main headline visitors see first.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-white/50 text-sm mb-1">Main Title</label>
                <input
                  type="text"
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-2xl font-black italic focus:border-spades-gold/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/50 text-sm mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.heroTagline}
                  onChange={(e) => setFormData({ ...formData, heroTagline: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white italic focus:border-spades-gold/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Live Preview */}
            <div className="mt-6 p-6 bg-spades-black rounded-lg border border-white/5">
              <div className="text-xs text-white/30 mb-3 font-mono">PREVIEW</div>
              <h1 className="text-3xl font-black italic text-white mb-2">{formData.heroTitle}</h1>
              <p className="text-white/50 italic">{formData.heroTagline}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      {activeSection === 'stats' && (
        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">📊 Stats Display</h3>
            <p className="text-white/40 text-sm mb-4">Numbers that appear on the homepage.</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-white/50 text-sm mb-1">Members Count</label>
                <input
                  type="text"
                  value={formData.memberCount}
                  onChange={(e) => setFormData({ ...formData, memberCount: e.target.value })}
                  placeholder="130+"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-center text-xl font-bold focus:border-spades-gold/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/50 text-sm mb-1">Events Count</label>
                <input
                  type="text"
                  value={formData.eventCount}
                  onChange={(e) => setFormData({ ...formData, eventCount: e.target.value })}
                  placeholder="47"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-center text-xl font-bold focus:border-spades-gold/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/50 text-sm mb-1">Builds Count</label>
                <input
                  type="text"
                  value={formData.buildCount}
                  onChange={(e) => setFormData({ ...formData, buildCount: e.target.value })}
                  placeholder="70+"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-center text-xl font-bold focus:border-spades-gold/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Live Preview */}
            <div className="mt-6 p-6 bg-spades-black rounded-lg border border-white/5">
              <div className="text-xs text-white/30 mb-3 font-mono">PREVIEW</div>
              <div className="flex justify-center gap-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-spades-gold">{formData.memberCount}</div>
                  <div className="text-xs text-white/30 uppercase tracking-wider">MEMBERS</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-spades-gold">{formData.eventCount}</div>
                  <div className="text-xs text-white/30 uppercase tracking-wider">EVENTS</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-spades-gold">{formData.buildCount}</div>
                  <div className="text-xs text-white/30 uppercase tracking-wider">BUILDS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Builds Section */}
      {activeSection === 'builds' && (
        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">🚗 Featured Builds</h3>
                <p className="text-white/40 text-sm">Builds showcased on the homepage.</p>
              </div>
            </div>

            {/* Garage Dropdown */}
            <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <label className="block text-white/60 text-sm mb-2 font-medium">
                Select Garage
              </label>
              <select
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) {
                    handleGarageSelect(e.target.value);
                  }
                }}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
                disabled={searching || loadingGarages}
                autoComplete="off"
                data-form-type="other"
              >
                <option value="">-- Select a garage --</option>
                {availableGarages.map((garage) => (
                  <option key={garage.username} value={garage.username}>
                    @{garage.username} - {garage.carName || garage.title}
                  </option>
                ))}
              </select>
              {loadingGarages && (
                <p className="mt-2 text-white/40 text-xs">Loading garages...</p>
              )}
            </div>

              {/* Search Results */}
              {searchError && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{searchError}</p>
                </div>
              )}

              {searchResult && (
                <div className="mt-4 p-4 bg-spades-gold/10 border border-spades-gold/30 rounded-lg">
                  <div className="flex items-start gap-4">
                    {searchResult.cover_image ? (
                      <img
                        src={searchResult.cover_image}
                        alt={searchResult.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center">
                        <span className="text-white/30 text-2xl">🚗</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-sm mb-1">{searchResult.title}</h4>
                      <p className="text-white/60 text-xs mb-2">@{searchResult.username}</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={addBuildFromSearch}
                          className="px-4 py-2 bg-spades-gold text-black font-bold text-sm rounded-lg hover:bg-spades-gold/90 transition-colors"
                        >
                          Add to Featured Builds
                        </button>
                        <Link
                          href={`/garage/${searchResult.username}`}
                          target="_blank"
                          className="px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
                        >
                          View Garage
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* Manual Add Button */}
            <div className="mb-4 flex justify-end">
              <button
                onClick={addFeaturedBuild}
                className="px-3 py-1.5 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors border border-white/10"
              >
                + Add Build Manually
              </button>
            </div>

            <div className="space-y-4">
              {formData.featuredBuilds.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  <p className="text-sm">No featured builds yet. Select a garage above to add one!</p>
                </div>
              ) : (
                formData.featuredBuilds.map((build, index) => {
                  const username = build.owner?.replace('@', '') || '';
                  return (
                    <div key={build.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                      <div className="flex items-start gap-4">
                        {/* Image Preview/Upload */}
                        <div 
                          className="w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer border-2 border-dashed border-white/20 hover:border-spades-gold/50 transition-colors relative group"
                          onClick={() => document.getElementById(`build-image-${index}`)?.click()}
                          onPaste={(e) => {
                        const items = e.clipboardData?.items;
                        if (items) {
                          for (let i = 0; i < items.length; i++) {
                            if (items[i].type.indexOf('image') !== -1) {
                              const blob = items[i].getAsFile();
                              if (blob) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  updateFeaturedBuild(index, 'image', event.target?.result as string);
                                };
                                reader.readAsDataURL(blob);
                              }
                            }
                          }
                        }
                      }}
                      tabIndex={0}
                    >
                      {build.image ? (
                        <img src={build.image} alt={build.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center text-white/40 text-xs p-2">
                          <div className="text-lg mb-1">📷</div>
                          Click or Ctrl+V
                        </div>
                      )}
                      <input
                        id={`build-image-${index}`}
                        type="file"
                        accept={"image/*"}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              updateFeaturedBuild(index, 'image', event.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-white/40 text-xs mb-1">Build Name</label>
                              <input
                                type="text"
                                value={build.name}
                                onChange={(e) => updateFeaturedBuild(index, 'name', e.target.value)}
                                placeholder="800HP Supra"
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-spades-gold/50 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-white/40 text-xs mb-1">Owner Handle</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={build.owner}
                                  onChange={(e) => updateFeaturedBuild(index, 'owner', e.target.value)}
                                  placeholder="@turbo_mike"
                                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-spades-gold/50 focus:outline-none"
                                />
                                {username && (
                                  <Link
                                    href={`/garage/${username}`}
                                    target="_blank"
                                    className="px-3 py-2 bg-white/10 text-white text-sm rounded hover:bg-white/20 transition-colors flex items-center gap-1 border border-white/10"
                                    title="View garage"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-white/40 text-xs mb-1">Image URL (optional)</label>
                            <input
                              type="text"
                              value={build.image?.startsWith('data:') ? '' : build.image || ''}
                              onChange={(e) => updateFeaturedBuild(index, 'image', e.target.value)}
                              placeholder="https://example.com/image.jpg"
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-spades-gold/50 focus:outline-none"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removeFeaturedBuild(index)}
                          className="p-2 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                          title="Remove build"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TikTok Videos Section */}
      {activeSection === 'tiktok' && (
        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white">🎬 TikTok Videos</h3>
              <p className="text-white/40 text-sm">Manage TikTok videos displayed on the Archive page.</p>
            </div>

            {/* Add TikTok URL */}
            <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <label className="block text-white/60 text-sm mb-2 font-medium">
                Add TikTok Video
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tiktokUrlInput}
                  onChange={(e) => setTiktokUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addTikTokVideo();
                    }
                  }}
                  placeholder="Paste TikTok video URL (e.g., https://www.tiktok.com/@spadesperformance/video/1234567890)"
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-spades-gold/50 focus:outline-none"
                />
                <button
                  onClick={addTikTokVideo}
                  disabled={!tiktokUrlInput.trim()}
                  className="px-6 py-2.5 bg-spades-gold text-black font-bold rounded-lg hover:bg-spades-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Video
                </button>
              </div>
              <p className="text-white/40 text-xs mt-2">
                💡 Just copy and paste the full TikTok video URL from your browser
              </p>
            </div>

            {/* TikTok Videos List */}
            <div className="space-y-3">
              {(!formData.tiktokVideos || formData.tiktokVideos.length === 0) ? (
                <div className="text-center py-12 text-white/40">
                  <p className="text-sm">No TikTok videos added yet. Add one above!</p>
                </div>
              ) : (
                formData.tiktokVideos.map((url, index) => {
                  const videoId = url.match(/video\/(\d+)/)?.[1];
                  return (
                    <div
                      key={index}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {/* Preview */}
                        {videoId ? (
                          <div className="w-24 h-32 bg-black rounded-lg overflow-hidden flex-shrink-0">
                            <iframe
                              src={`https://www.tiktok.com/embed/v2/${videoId}`}
                              className="w-full h-full"
                              allow="encrypted-media"
                              allowFullScreen
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-32 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-8 h-8 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                            </svg>
                          </div>
                        )}
                        
                        {/* URL Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-spades-gold flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                            </svg>
                            <span className="text-white/60 text-xs font-mono truncate">{url}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-white/10 text-white text-xs rounded hover:bg-white/20 transition-colors flex items-center gap-1"
                            >
                              View on TikTok
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                            <button
                              onClick={() => removeTikTokVideo(index)}
                              className="px-3 py-1.5 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 text-xs rounded transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Other Text Section */}
      {activeSection === 'text' && (
        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">✏️ Other Text Content</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/50 text-sm mb-1">Join Section Tagline</label>
                <input
                  type="text"
                  value={formData.joinTagline}
                  onChange={(e) => setFormData({ ...formData, joinTagline: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
                />
                <p className="text-white/30 text-xs mt-1">Shown on the "Ready to Join?" section</p>
              </div>

              <div>
                <label className="block text-white/50 text-sm mb-1">About Text</label>
                <textarea
                  value={formData.aboutText}
                  onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none h-24"
                />
                <p className="text-white/30 text-xs mt-1">Brief description of the crew</p>
              </div>

              <div>
                <label className="block text-white/50 text-sm mb-1">Rules Page Intro</label>
                <textarea
                  value={formData.rulesIntro}
                  onChange={(e) => setFormData({ ...formData, rulesIntro: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none h-24"
                />
              </div>

              <div>
                <label className="block text-white/50 text-sm mb-1">Footer Text</label>
                <input
                  type="text"
                  value={formData.footerText}
                  onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help */}
      <div className="mt-8 bg-spades-gold/10 rounded-xl p-4 border border-spades-gold/20">
        <h4 className="text-spades-gold font-bold mb-2">💡 Content Tips</h4>
        <ul className="text-white/60 text-sm space-y-1">
          <li>• Changes are <strong>saved to your browser</strong> - click "Save All Changes" to apply</li>
          <li>• <strong>Stats</strong> can include symbols like "+" (e.g., "130+")</li>
          <li>• <strong>Featured builds</strong> - Search for a member's username to auto-populate their garage info</li>
          <li>• Featured builds link to the member's garage page on the homepage</li>
          <li>• <strong>TikTok videos</strong> - Just paste the full video URL from TikTok, no API needed!</li>
          <li>• Keep text <strong>short and punchy</strong> for best impact</li>
        </ul>
      </div>
    </div>
  );
}

