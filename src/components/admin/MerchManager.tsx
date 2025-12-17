"use client";

import { useState, useEffect } from 'react';
import { MerchItem } from '@/lib/admin-store';

interface MerchManagerProps {
  merch: MerchItem[];
  onSave: (item: MerchItem) => void;
  onDelete: (id: string) => void;
  editingMerch: MerchItem | null;
  setEditingMerch: (item: MerchItem | null) => void;
  showNewForm: boolean;
  setShowNewForm: (show: boolean) => void;
}

export function MerchManager({ 
  merch, onSave, onDelete, editingMerch, setEditingMerch, showNewForm, setShowNewForm 
}: MerchManagerProps) {
  const emptyMerch: MerchItem = {
    id: '',
    name: '',
    price: 0,
    inStock: true,
    description: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    images: [],
    category: 'Apparel',
    quantity: 0,
  };

  const [formData, setFormData] = useState<MerchItem>(emptyMerch);
  const [filter, setFilter] = useState<'all' | 'inStock' | 'outOfStock' | 'featured'>('all');

  useEffect(() => {
    if (editingMerch) {
      setFormData(editingMerch);
    } else if (showNewForm) {
      setFormData(emptyMerch);
    }
  }, [editingMerch, showNewForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData(emptyMerch);
  };

  const filteredMerch = merch.filter(m => {
    if (filter === 'inStock') return m.inStock;
    if (filter === 'outOfStock') return !m.inStock;
    if (filter === 'featured') return m.featured;
    return true;
  });

  const toggleStock = (item: MerchItem) => {
    onSave({ ...item, inStock: !item.inStock });
  };

  const toggleFeatured = (item: MerchItem) => {
    onSave({ ...item, featured: !item.featured });
  };

  const categories = ['Apparel', 'Accessories', 'Stickers', 'Limited'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Merch</h2>
          <p className="text-white/40 text-sm mt-1">Manage your merchandise inventory.</p>
        </div>
        {!showNewForm && !editingMerch && (
          <button
            onClick={() => setShowNewForm(true)}
            className="px-4 py-2 bg-spades-gold text-black font-bold text-sm rounded-lg hover:bg-spades-gold/90 transition-colors"
          >
            + Add Item
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-white">{merch.length}</div>
          <div className="text-xs text-white/50">Total Items</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-green-400">{merch.filter(m => m.inStock).length}</div>
          <div className="text-xs text-white/50">In Stock</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-red-400">{merch.filter(m => !m.inStock).length}</div>
          <div className="text-xs text-white/50">Sold Out</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-spades-gold">{merch.filter(m => m.featured).length}</div>
          <div className="text-xs text-white/50">Featured</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'inStock', 'outOfStock', 'featured'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === f 
                ? 'bg-white/10 text-white' 
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {f === 'inStock' ? 'In Stock' : f === 'outOfStock' ? 'Sold Out' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Form */}
      {(showNewForm || editingMerch) && (
        <form onSubmit={handleSubmit} className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">
            {editingMerch ? 'Edit Item' : 'New Item'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 text-sm mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                placeholder="SPADES HOODIE"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Price ($) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-white/50 text-sm mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Premium heavyweight cotton..."
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none h-20"
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Sizes (comma separated)</label>
              <input
                type="text"
                value={formData.sizes.join(', ')}
                onChange={(e) => setFormData({ ...formData, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="S, M, L, XL"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Colors (comma separated)</label>
              <input
                type="text"
                value={formData.colors.join(', ')}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="Black, White"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Image URLs (one per line)</label>
              <textarea
                value={formData.images.join('\n')}
                onChange={(e) => setFormData({ ...formData, images: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none h-20 font-mono text-xs"
              />
            </div>
            <div className="flex flex-col gap-3 justify-center">
              <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span>In Stock</span>
              </label>
              <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span>Featured (shows "Best Seller" badge)</span>
              </label>
              <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.limited || false}
                  onChange={(e) => setFormData({ ...formData, limited: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span>Limited Edition</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-spades-gold text-black font-bold text-sm rounded-lg hover:bg-spades-gold/90 transition-colors"
            >
              {editingMerch ? 'Save Changes' : 'Add Item'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNewForm(false);
                setEditingMerch(null);
              }}
              className="px-6 py-2 bg-white/10 text-white font-bold text-sm rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Merch Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMerch.map(item => (
          <div key={item.id} className="bg-white/5 rounded-xl p-4 border border-white/10 group">
            <div className="aspect-square bg-white/5 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
              {item.images.length > 0 ? (
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">👕</span>
              )}
              {/* Quick actions overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => toggleStock(item)}
                  className={`px-2 py-1 text-xs rounded ${item.inStock ? 'bg-red-500/80 text-white' : 'bg-green-500/80 text-white'}`}
                >
                  {item.inStock ? 'Mark Sold Out' : 'Mark In Stock'}
                </button>
              </div>
              {/* Badges */}
              {item.featured && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-white text-black text-[10px] font-bold rounded">
                  BEST SELLER
                </div>
              )}
              {item.limited && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-spades-gold text-black text-[10px] font-bold rounded">
                  LIMITED
                </div>
              )}
            </div>
            <h3 className="text-white font-bold text-sm mb-1 truncate">{item.name}</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-spades-gold font-bold">${item.price}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${item.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {item.inStock ? `${item.quantity || '∞'} left` : 'Sold Out'}
              </span>
            </div>
            <div className="text-xs text-white/30 mb-3">{item.sizes.join(' / ')}</div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleFeatured(item)}
                className={`flex-1 py-1.5 text-xs rounded transition-colors ${
                  item.featured 
                    ? 'bg-spades-gold/20 text-spades-gold' 
                    : 'bg-white/5 text-white/50 hover:text-white'
                }`}
              >
                {item.featured ? '★ Featured' : '☆ Feature'}
              </button>
              <button
                onClick={() => setEditingMerch(item)}
                className="flex-1 py-1.5 text-xs text-white/50 hover:text-white bg-white/5 rounded transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this item?')) onDelete(item.id);
                }}
                className="py-1.5 px-2 text-xs text-red-400/50 hover:text-red-400 bg-white/5 rounded transition-colors"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Help */}
      <div className="mt-8 bg-spades-gold/10 rounded-xl p-4 border border-spades-gold/20">
        <h4 className="text-spades-gold font-bold mb-2">💡 Merch Tips</h4>
        <ul className="text-white/60 text-sm space-y-1">
          <li>• <strong>Hover over items</strong> to quickly toggle stock status</li>
          <li>• <strong>Featured items</strong> get a "Best Seller" badge and priority placement</li>
          <li>• <strong>Limited items</strong> show a special badge to create urgency</li>
          <li>• Add <strong>image URLs</strong> from your hosting (Imgur, Google Drive, etc.)</li>
        </ul>
      </div>
    </div>
  );
}

