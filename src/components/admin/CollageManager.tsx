"use client";

import { useState, useEffect } from 'react';
import { adminStore, CollageItem } from '@/lib/admin-store';

export function CollageManager() {
  const [items, setItems] = useState<CollageItem[]>([]);
  const [editingItem, setEditingItem] = useState<CollageItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newType, setNewType] = useState<'image' | 'video'>('image');

  useEffect(() => {
    const stored = adminStore.getCollage();
    setItems(stored);
  }, []);

  const saveItems = (newItems: CollageItem[]) => {
    setItems(newItems);
    adminStore.saveCollage(newItems);
  };

  const toggleVisibility = (id: string) => {
    const updated = items.map(item => 
      item.id === id ? { ...item, visible: !item.visible } : item
    );
    saveItems(updated);
  };

  const updateItem = (item: CollageItem) => {
    const updated = items.map(i => i.id === item.id ? item : i);
    saveItems(updated);
    setEditingItem(null);
  };

  const addItem = () => {
    if (!newUrl) return;
    
    const newItem: CollageItem = {
      id: adminStore.generateId(),
      type: newType,
      filename: newUrl, // Now stores full URL
      ext: '',
      width: 'w-36 md:w-48',
      height: 'h-[85%]',
      offset: 'mt-[8%]',
      displayOrder: items.length + 1,
      visible: true,
    };
    saveItems([...items, newItem]);
    setNewUrl('');
    setShowAddForm(false);
  };

  const deleteItem = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    // Re-order remaining items
    updated.forEach((item, i) => item.displayOrder = i + 1);
    saveItems(updated);
  };

  const resetToDefaults = () => {
    if (confirm('Reset collage to default images? This will restore all original images.')) {
      adminStore.resetCollage();
      const defaults = adminStore.getCollage();
      setItems(defaults);
    }
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;

    const newItems = [...items];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    newItems.forEach((item, i) => item.displayOrder = i + 1);
    saveItems(newItems);
  };

  // Size presets
  const sizePresets = [
    { label: 'Small', width: 'w-28 md:w-36' },
    { label: 'Medium', width: 'w-36 md:w-48' },
    { label: 'Large', width: 'w-40 md:w-52' },
    { label: 'XL', width: 'w-48 md:w-64' },
    { label: 'Hero', width: 'w-72 md:w-[400px]' },
  ];

  const heightPresets = [
    { label: 'Short', height: 'h-[65%]', offset: 'mt-[20%]' },
    { label: 'Medium', height: 'h-[78%]', offset: 'mt-[11%]' },
    { label: 'Tall', height: 'h-[88%]', offset: 'mt-[6%]' },
    { label: 'Full', height: 'h-[95%]', offset: 'mt-[2%]' },
  ];

  const visibleCount = items.filter(i => i.visible).length;
  const imageCount = items.filter(i => i.type === 'image').length;
  const videoCount = items.filter(i => i.type === 'video').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Homepage Reel</h2>
          <p className="text-white/40 text-sm mt-1">Manage the scrolling photo/video collage on the homepage.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 bg-white/10 text-white font-bold text-sm rounded-lg hover:bg-white/20 transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-spades-gold text-black font-bold text-sm rounded-lg hover:bg-spades-gold/90 transition-colors"
          >
            + Add Media
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-white">{items.length}</div>
          <div className="text-xs text-white/50">Total Items</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-green-400">{visibleCount}</div>
          <div className="text-xs text-white/50">Visible</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-blue-400">{imageCount}</div>
          <div className="text-xs text-white/50">Images</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-purple-400">{videoCount}</div>
          <div className="text-xs text-white/50">Videos</div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Add New Media</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white/50 text-sm mb-1">Media Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setNewType('image')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    newType === 'image' 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                      : 'bg-white/5 text-white/50'
                  }`}
                >
                  📷 Image
                </button>
                <button
                  onClick={() => setNewType('video')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    newType === 'video' 
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                      : 'bg-white/5 text-white/50'
                  }`}
                >
                  🎥 Video
                </button>
              </div>
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">
                {newType === 'image' ? 'Image URL' : 'Video URL'}
              </label>
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder={newType === 'image' 
                  ? 'https://i.imgur.com/example.jpg or Google Drive link' 
                  : 'https://i.imgur.com/example.mp4 or direct video link'
                }
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-spades-gold/50 focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={addItem}
                disabled={!newUrl}
                className="px-6 py-2 bg-spades-gold text-black font-bold text-sm rounded-lg hover:bg-spades-gold/90 transition-colors disabled:opacity-50"
              >
                Add to Reel
              </button>
              <button
                onClick={() => { setShowAddForm(false); setNewUrl(''); }}
                className="px-6 py-2 bg-white/10 text-white font-bold text-sm rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How to get URLs */}
      <div className="bg-spades-gold/10 rounded-xl p-4 border border-spades-gold/20 mb-6">
        <h4 className="text-spades-gold font-bold mb-2">📸 How to Add Photos & Videos</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-white/70 font-medium mb-2">Option 1: Imgur (Easiest)</p>
            <ol className="text-white/50 space-y-1 list-decimal list-inside">
              <li>Go to <a href="https://imgur.com/upload" target="_blank" className="text-spades-gold hover:underline">imgur.com/upload</a></li>
              <li>Upload your photo/video</li>
              <li>Right-click the image → "Copy image address"</li>
              <li>Paste the URL here</li>
            </ol>
          </div>
          <div>
            <p className="text-white/70 font-medium mb-2">Option 2: Google Drive</p>
            <ol className="text-white/50 space-y-1 list-decimal list-inside">
              <li>Upload to Google Drive</li>
              <li>Right-click → Share → Anyone with link</li>
              <li>Copy the link</li>
              <li>Convert it using a <a href="https://www.labnol.org/embed/google/drive/" target="_blank" className="text-spades-gold hover:underline">Drive link converter</a></li>
            </ol>
          </div>
        </div>
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <div className="bg-white/5 rounded-xl p-12 border border-white/10 text-center">
          <div className="text-4xl mb-4">🖼️</div>
          <h3 className="text-white font-bold mb-2">No media yet</h3>
          <p className="text-white/40 text-sm mb-4">Add your first photo or video to the homepage reel</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-spades-gold text-black font-bold text-sm rounded-lg hover:bg-spades-gold/90 transition-colors"
          >
            + Add Media
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.sort((a, b) => a.displayOrder - b.displayOrder).map((item, index) => (
            <div 
              key={item.id} 
              className={`bg-white/5 rounded-xl p-4 border transition-colors ${
                item.visible ? 'border-white/10' : 'border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-20 h-20 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                  {item.type === 'image' ? (
                    <img 
                      src={item.filename} 
                      alt="" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect fill="%23333" width="80" height="80"/><text x="40" y="45" text-anchor="middle" fill="%23666" font-size="12">Error</text></svg>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl bg-purple-500/20">
                      🎥
                    </div>
                  )}
                </div>

                {/* Order controls */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveItem(item.id, 'up')}
                    disabled={index === 0}
                    className="text-white/30 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed text-sm"
                  >
                    ▲
                  </button>
                  <span className="text-white/40 text-xs text-center">{item.displayOrder}</span>
                  <button
                    onClick={() => moveItem(item.id, 'down')}
                    disabled={index === items.length - 1}
                    className="text-white/30 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed text-sm"
                  >
                    ▼
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      item.type === 'video' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {item.type === 'video' ? '🎥 Video' : '📷 Image'}
                    </span>
                    <span className="text-white/30 text-xs">{item.width.split(' ')[0]} • {item.height}</span>
                  </div>
                  <div className="text-white/50 text-xs truncate">{item.filename}</div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleVisibility(item.id)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      item.visible 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-white/10 text-white/30'
                    }`}
                  >
                    {item.visible ? '👁 Visible' : '👁‍🗨 Hidden'}
                  </button>
                  <button
                    onClick={() => setEditingItem(item)}
                    className="px-3 py-1.5 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Size
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Remove this item from the reel?')) deleteItem(item.id);
                    }}
                    className="px-3 py-1.5 text-xs text-red-400/50 hover:text-red-400 bg-white/5 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Size Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-spades-dark rounded-xl p-6 border border-white/10 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">Adjust Size</h3>
            
            <div className="space-y-4">
              {/* Preview */}
              <div className="aspect-video bg-white/5 rounded-lg overflow-hidden">
                {editingItem.type === 'image' ? (
                  <img src={editingItem.filename} alt="" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🎥</div>
                )}
              </div>

              <div>
                <label className="block text-white/50 text-sm mb-2">Width</label>
                <div className="flex gap-2 flex-wrap">
                  {sizePresets.map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => setEditingItem({ ...editingItem, width: preset.width })}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        editingItem.width === preset.width
                          ? 'bg-spades-gold text-black'
                          : 'bg-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/50 text-sm mb-2">Height</label>
                <div className="flex gap-2 flex-wrap">
                  {heightPresets.map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => setEditingItem({ 
                        ...editingItem, 
                        height: preset.height,
                        offset: preset.offset
                      })}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        editingItem.height === preset.height
                          ? 'bg-spades-gold text-black'
                          : 'bg-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/50 text-sm mb-1">URL</label>
                <input
                  type="text"
                  value={editingItem.filename}
                  onChange={(e) => setEditingItem({ ...editingItem, filename: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-spades-gold/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => updateItem(editingItem)}
                className="flex-1 py-2 bg-spades-gold text-black font-bold text-sm rounded-lg hover:bg-spades-gold/90 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 py-2 bg-white/10 text-white font-bold text-sm rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
