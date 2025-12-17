"use client";

import { useState, useEffect } from 'react';
import { adminStore, MarketListing } from '@/lib/admin-store';

export function MarketplaceManager() {
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'flagged' | 'sold'>('all');
  const [search, setSearch] = useState('');
  const [selectedListing, setSelectedListing] = useState<MarketListing | null>(null);

  useEffect(() => {
    setListings(adminStore.getMarketplace());
  }, []);

  const updateListing = (listing: MarketListing) => {
    const updated = listings.map(l => l.id === listing.id ? listing : l);
    setListings(updated);
    adminStore.saveMarketplace(updated);
    setSelectedListing(null);
  };

  const deleteListing = (id: string) => {
    const updated = listings.filter(l => l.id !== id);
    setListings(updated);
    adminStore.saveMarketplace(updated);
  };

  const approveListing = (id: string) => {
    const updated = listings.map(l => l.id === id ? { ...l, status: 'active' as const } : l);
    setListings(updated);
    adminStore.saveMarketplace(updated);
  };

  const flagListing = (id: string, reason: string) => {
    const updated = listings.map(l => l.id === id ? { ...l, status: 'flagged' as const, flagReason: reason } : l);
    setListings(updated);
    adminStore.saveMarketplace(updated);
  };

  const markSold = (id: string) => {
    const updated = listings.map(l => l.id === id ? { ...l, status: 'sold' as const } : l);
    setListings(updated);
    adminStore.saveMarketplace(updated);
  };

  const filteredListings = listings.filter(l => {
    const matchesFilter = filter === 'all' || l.status === filter;
    const matchesSearch = !search || 
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.seller.toLowerCase().includes(search.toLowerCase()) ||
      l.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: MarketListing['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'sold': return 'bg-white/10 text-white/50';
      case 'flagged': return 'bg-red-500/20 text-red-400';
      case 'removed': return 'bg-red-900/20 text-red-600';
    }
  };

  const stats = {
    total: listings.length,
    active: listings.filter(l => l.status === 'active').length,
    pending: listings.filter(l => l.status === 'pending').length,
    flagged: listings.filter(l => l.status === 'flagged').length,
    totalValue: listings.filter(l => l.status === 'active').reduce((sum, l) => sum + l.price, 0),
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Marketplace Monitor</h2>
      <p className="text-white/40 text-sm mb-6">Review and moderate member listings.</p>
      
      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-xs text-white/50">Total</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.active}</div>
          <div className="text-xs text-white/50">Active</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
          <div className="text-xs text-white/50">Pending</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-red-400">{stats.flagged}</div>
          <div className="text-xs text-white/50">Flagged</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-spades-gold">${stats.totalValue.toLocaleString()}</div>
          <div className="text-xs text-white/50">Active Value</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search listings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-spades-gold/50 focus:outline-none"
        />
        <div className="flex gap-2">
          {(['all', 'active', 'pending', 'flagged', 'sold'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filter === f 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'pending' && stats.pending > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-yellow-500/30 text-yellow-400 rounded text-[10px]">
                  {stats.pending}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <div className="grid grid-cols-7 gap-4 p-4 border-b border-white/10 text-xs text-white/50 font-mono">
          <div className="col-span-2">ITEM</div>
          <div>CATEGORY</div>
          <div>PRICE</div>
          <div>SELLER</div>
          <div>STATUS</div>
          <div>ACTIONS</div>
        </div>
        
        {filteredListings.length === 0 ? (
          <div className="text-center py-12 text-white/30">
            No listings found.
          </div>
        ) : (
          filteredListings.map(listing => (
            <div key={listing.id} className="grid grid-cols-7 gap-4 p-4 border-b border-white/5 items-center hover:bg-white/[0.02] transition-colors">
              <div className="col-span-2">
                <div className="text-white font-medium text-sm">{listing.title}</div>
                <div className="text-white/30 text-xs">{listing.location}</div>
              </div>
              <div className="text-white/50 text-sm">{listing.category}</div>
              <div className="text-spades-gold font-bold">${listing.price.toLocaleString()}</div>
              <div className="text-white/50 text-sm">
                <span className="flex items-center gap-1">
                  @{listing.seller}
                  {listing.sellerVerified && <span className="text-spades-gold text-xs">✓</span>}
                </span>
              </div>
              <div>
                <span className={`px-2 py-1 text-xs rounded ${getStatusColor(listing.status)}`}>
                  {listing.status.toUpperCase()}
                </span>
              </div>
              <div className="flex gap-1">
                {listing.status === 'pending' && (
                  <button
                    onClick={() => approveListing(listing.id)}
                    className="px-2 py-1 text-xs text-green-400 hover:bg-green-400/10 rounded transition-colors"
                  >
                    ✓ Approve
                  </button>
                )}
                {listing.status === 'active' && (
                  <button
                    onClick={() => markSold(listing.id)}
                    className="px-2 py-1 text-xs text-white/50 hover:bg-white/10 rounded transition-colors"
                  >
                    Mark Sold
                  </button>
                )}
                <button
                  onClick={() => setSelectedListing(listing)}
                  className="px-2 py-1 text-xs text-white/50 hover:bg-white/10 rounded transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Reason for flagging?');
                    if (reason) flagListing(listing.id, reason);
                  }}
                  className="px-2 py-1 text-xs text-orange-400/50 hover:text-orange-400 hover:bg-orange-400/10 rounded transition-colors"
                >
                  🚩
                </button>
                <button
                  onClick={() => {
                    if (confirm('Remove this listing?')) deleteListing(listing.id);
                  }}
                  className="px-2 py-1 text-xs text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                >
                  🗑
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-spades-dark rounded-xl p-6 border border-white/10 w-full max-w-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedListing.title}</h3>
                <p className="text-white/40 text-sm">Posted by @{selectedListing.seller}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded ${getStatusColor(selectedListing.status)}`}>
                {selectedListing.status.toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-white/50 text-xs mb-1">Price</div>
                  <div className="text-spades-gold font-bold text-xl">${selectedListing.price.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-white/50 text-xs mb-1">Category</div>
                  <div className="text-white">{selectedListing.category}</div>
                </div>
                <div>
                  <div className="text-white/50 text-xs mb-1">Location</div>
                  <div className="text-white">{selectedListing.location}</div>
                </div>
                <div>
                  <div className="text-white/50 text-xs mb-1">Posted</div>
                  <div className="text-white">{new Date(selectedListing.datePosted).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div>
                <div className="text-white/50 text-xs mb-1">Description</div>
                <div className="text-white/70 text-sm">{selectedListing.description}</div>
              </div>
              
              <div>
                <div className="text-white/50 text-xs mb-1">Contact</div>
                <div className="text-white">{selectedListing.contactInfo}</div>
              </div>

              {selectedListing.flagReason && (
                <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <div className="text-red-400 text-xs font-bold mb-1">⚠️ Flag Reason</div>
                  <div className="text-white/70 text-sm">{selectedListing.flagReason}</div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {selectedListing.status === 'pending' && (
                <button
                  onClick={() => {
                    approveListing(selectedListing.id);
                    setSelectedListing(null);
                  }}
                  className="flex-1 py-2 bg-green-500 text-white font-bold text-sm rounded-lg hover:bg-green-500/90 transition-colors"
                >
                  ✓ Approve
                </button>
              )}
              {selectedListing.status === 'flagged' && (
                <button
                  onClick={() => {
                    approveListing(selectedListing.id);
                    setSelectedListing(null);
                  }}
                  className="flex-1 py-2 bg-green-500 text-white font-bold text-sm rounded-lg hover:bg-green-500/90 transition-colors"
                >
                  Unflag & Approve
                </button>
              )}
              <button
                onClick={() => {
                  if (confirm('Remove this listing permanently?')) {
                    deleteListing(selectedListing.id);
                    setSelectedListing(null);
                  }
                }}
                className="flex-1 py-2 bg-red-500/20 text-red-400 font-bold text-sm rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Remove Listing
              </button>
              <button
                onClick={() => setSelectedListing(null)}
                className="flex-1 py-2 bg-white/10 text-white font-bold text-sm rounded-lg hover:bg-white/20 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help */}
      <div className="mt-8 bg-spades-gold/10 rounded-xl p-4 border border-spades-gold/20">
        <h4 className="text-spades-gold font-bold mb-2">💡 Marketplace Tips</h4>
        <ul className="text-white/60 text-sm space-y-1">
          <li>• <strong>Pending listings</strong> need approval before going live</li>
          <li>• <strong>Verified sellers</strong> (✓) have attended 3+ events</li>
          <li>• <strong>Flag listings</strong> that violate rules with a reason</li>
          <li>• <strong>Mark as sold</strong> to keep records but hide from active listings</li>
        </ul>
      </div>
    </div>
  );
}

