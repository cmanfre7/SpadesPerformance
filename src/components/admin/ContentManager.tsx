"use client";

import { useState } from 'react';
import { SiteContent } from '@/lib/admin-store';

interface ContentManagerProps {
  content: SiteContent;
  onSave: (content: SiteContent) => void;
}

export function ContentManager({ content, onSave }: ContentManagerProps) {
  const [formData, setFormData] = useState(content);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<'hero' | 'stats' | 'builds' | 'text'>('hero');

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

  const sections = [
    { id: 'hero', label: 'Hero Section', icon: '🏠' },
    { id: 'stats', label: 'Stats', icon: '📊' },
    { id: 'builds', label: 'Featured Builds', icon: '🚗' },
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
              <button
                onClick={addFeaturedBuild}
                className="px-3 py-1.5 bg-spades-gold/20 text-spades-gold text-sm rounded-lg hover:bg-spades-gold/30 transition-colors"
              >
                + Add Build
              </button>
            </div>

            <div className="space-y-4">
              {formData.featuredBuilds.map((build, index) => (
                <div key={build.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
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
                        accept="image/*"
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
                          <input
                            type="text"
                            value={build.owner}
                            onChange={(e) => updateFeaturedBuild(index, 'owner', e.target.value)}
                            placeholder="@turbo_mike"
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-spades-gold/50 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs mb-1">Or paste image URL</label>
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
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
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
          <li>• <strong>Featured builds</strong> use image numbers from your collage folder</li>
          <li>• Keep text <strong>short and punchy</strong> for best impact</li>
        </ul>
      </div>
    </div>
  );
}

