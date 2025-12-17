"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminStore, Event, Member, MerchItem, SiteContent } from '@/lib/admin-store';

type Tab = 'overview' | 'events' | 'members' | 'merch' | 'marketplace' | 'socials' | 'content' | 'collage';

interface MarketListing {
  id: string;
  title: string;
  category: string;
  price: number;
  seller: string;
  verified: boolean;
  location: string;
  status: 'active' | 'pending' | 'sold' | 'flagged';
  datePosted: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [events, setEvents] = useState<Event[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [merch, setMerch] = useState<MerchItem[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  
  // Form states
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editingMerch, setEditingMerch] = useState<MerchItem | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    // Check auth
    const auth = sessionStorage.getItem('spades_admin_auth');
    if (auth !== 'true') {
      router.push('/admin');
      return;
    }

    // Load data
    setEvents(adminStore.getEvents());
    setMembers(adminStore.getMembers());
    setMerch(adminStore.getMerch());
    setSiteContent(adminStore.getSiteContent());
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('spades_admin_auth');
    router.push('/admin');
  };

  // Event handlers
  const saveEvent = (event: Event) => {
    const updated = editingEvent 
      ? events.map(e => e.id === event.id ? event : e)
      : [...events, { ...event, id: adminStore.generateId() }];
    setEvents(updated);
    adminStore.saveEvents(updated);
    setEditingEvent(null);
    setShowNewForm(false);
  };

  const deleteEvent = (id: string) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    adminStore.saveEvents(updated);
  };

  // Member handlers
  const saveMember = (member: Member) => {
    const updated = editingMember
      ? members.map(m => m.id === member.id ? member : m)
      : [...members, { ...member, id: adminStore.generateId(), inviteCode: adminStore.generateInviteCode() }];
    setMembers(updated);
    adminStore.saveMembers(updated);
    setEditingMember(null);
    setShowNewForm(false);
  };

  const deleteMember = (id: string) => {
    const updated = members.filter(m => m.id !== id);
    setMembers(updated);
    adminStore.saveMembers(updated);
  };

  const generateNewInvite = (memberId: string) => {
    const updated = members.map(m => 
      m.id === memberId ? { ...m, inviteCode: adminStore.generateInviteCode() } : m
    );
    setMembers(updated);
    adminStore.saveMembers(updated);
  };

  // Merch handlers
  const saveMerchItem = (item: MerchItem) => {
    const updated = editingMerch
      ? merch.map(m => m.id === item.id ? item : m)
      : [...merch, { ...item, id: adminStore.generateId() }];
    setMerch(updated);
    adminStore.saveMerch(updated);
    setEditingMerch(null);
    setShowNewForm(false);
  };

  const deleteMerchItem = (id: string) => {
    const updated = merch.filter(m => m.id !== id);
    setMerch(updated);
    adminStore.saveMerch(updated);
  };

  // Site content handlers
  const saveSiteContent = (content: SiteContent) => {
    setSiteContent(content);
    adminStore.saveSiteContent(content);
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'members', label: 'Members', icon: '👥' },
    { id: 'merch', label: 'Merch', icon: '👕' },
    { id: 'marketplace', label: 'Marketplace', icon: '🏪' },
    { id: 'socials', label: 'Socials', icon: '📱' },
    { id: 'content', label: 'Site Content', icon: '✏️' },
    { id: 'collage', label: 'Homepage Reel', icon: '🖼️' },
  ];

  return (
    <div className="min-h-screen bg-spades-black">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white/50 hover:text-white transition-colors">
              ← Back to Site
            </Link>
            <span className="text-white/20">|</span>
            <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <nav className="w-64 border-r border-white/10 min-h-[calc(100vh-73px)] p-4">
          <div className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowNewForm(false);
                  setEditingEvent(null);
                  setEditingMember(null);
                  setEditingMerch(null);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-spades-gold/20 text-spades-gold' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 p-4 bg-white/5 rounded-lg">
            <h3 className="text-xs text-white/40 font-mono mb-3">QUICK STATS</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Events</span>
                <span className="text-white">{events.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Members</span>
                <span className="text-white">{members.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Merch Items</span>
                <span className="text-white">{merch.length}</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-3xl font-bold text-spades-gold mb-2">{events.filter(e => !e.isPast).length}</div>
                  <div className="text-white/50 text-sm">Upcoming Events</div>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-3xl font-bold text-spades-gold mb-2">{members.length}</div>
                  <div className="text-white/50 text-sm">Total Members</div>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-3xl font-bold text-spades-gold mb-2">{merch.filter(m => m.inStock).length}</div>
                  <div className="text-white/50 text-sm">Items In Stock</div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => { setActiveTab('events'); setShowNewForm(true); }}
                    className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-center"
                  >
                    <span className="text-2xl mb-2 block">📅</span>
                    <span className="text-sm text-white/70">Add Event</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('members'); setShowNewForm(true); }}
                    className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-center"
                  >
                    <span className="text-2xl mb-2 block">👤</span>
                    <span className="text-sm text-white/70">Add Member</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('merch'); setShowNewForm(true); }}
                    className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-center"
                  >
                    <span className="text-2xl mb-2 block">👕</span>
                    <span className="text-sm text-white/70">Add Merch</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('content')}
                    className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-center"
                  >
                    <span className="text-2xl mb-2 block">✏️</span>
                    <span className="text-sm text-white/70">Edit Content</span>
                  </button>
                </div>
              </div>

              {/* Help Section */}
              <div className="mt-8 bg-spades-gold/10 rounded-xl p-6 border border-spades-gold/20">
                <h3 className="text-lg font-bold text-spades-gold mb-2">📖 How to Use</h3>
                <ul className="text-white/60 text-sm space-y-2">
                  <li>• <strong>Events:</strong> Add upcoming meets, edit details, mark as past</li>
                  <li>• <strong>Members:</strong> Add/remove members, generate invite codes</li>
                  <li>• <strong>Merch:</strong> Manage products, stock status, photos</li>
                  <li>• <strong>Socials:</strong> Connect Instagram/TikTok, choose posts to display</li>
                  <li>• <strong>Site Content:</strong> Edit homepage text, stats, taglines</li>
                  <li>• <strong>Homepage Reel:</strong> Manage the photo/video collage</li>
                </ul>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <EventsManager
              events={events}
              onSave={saveEvent}
              onDelete={deleteEvent}
              editingEvent={editingEvent}
              setEditingEvent={setEditingEvent}
              showNewForm={showNewForm}
              setShowNewForm={setShowNewForm}
            />
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <MembersManager
              members={members}
              onSave={saveMember}
              onDelete={deleteMember}
              onGenerateInvite={generateNewInvite}
              editingMember={editingMember}
              setEditingMember={setEditingMember}
              showNewForm={showNewForm}
              setShowNewForm={setShowNewForm}
            />
          )}

          {/* Merch Tab */}
          {activeTab === 'merch' && (
            <MerchManager
              merch={merch}
              onSave={saveMerchItem}
              onDelete={deleteMerchItem}
              editingMerch={editingMerch}
              setEditingMerch={setEditingMerch}
              showNewForm={showNewForm}
              setShowNewForm={setShowNewForm}
            />
          )}

          {/* Marketplace Tab */}
          {activeTab === 'marketplace' && (
            <MarketplaceManager />
          )}

          {/* Socials Tab */}
          {activeTab === 'socials' && (
            <SocialsManager />
          )}

          {/* Content Tab */}
          {activeTab === 'content' && siteContent && (
            <ContentManager
              content={siteContent}
              onSave={saveSiteContent}
            />
          )}

          {/* Collage Tab */}
          {activeTab === 'collage' && (
            <CollageManager />
          )}
        </main>
      </div>
    </div>
  );
}

// Events Manager Component
function EventsManager({ 
  events, onSave, onDelete, editingEvent, setEditingEvent, showNewForm, setShowNewForm 
}: {
  events: Event[];
  onSave: (event: Event) => void;
  onDelete: (id: string) => void;
  editingEvent: Event | null;
  setEditingEvent: (event: Event | null) => void;
  showNewForm: boolean;
  setShowNewForm: (show: boolean) => void;
}) {
  const emptyEvent: Event = {
    id: '',
    date: '',
    type: '',
    location: '',
    time: '',
    access: 'PRIVATE',
    spots: { taken: 0, total: 50 },
  };

  const [formData, setFormData] = useState<Event>(emptyEvent);

  useEffect(() => {
    if (editingEvent) {
      setFormData(editingEvent);
    } else if (showNewForm) {
      setFormData(emptyEvent);
    }
  }, [editingEvent, showNewForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData(emptyEvent);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Events</h2>
        {!showNewForm && !editingEvent && (
          <button
            onClick={() => setShowNewForm(true)}
            className="px-4 py-2 bg-spades-gold text-black font-bold text-sm rounded-lg hover:bg-spades-gold/90 transition-colors"
          >
            + Add Event
          </button>
        )}
      </div>

      {/* Form */}
      {(showNewForm || editingEvent) && (
        <form onSubmit={handleSubmit} className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">
            {editingEvent ? 'Edit Event' : 'New Event'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 text-sm mb-1">Date (MM.DD.YY)</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="12.25.25"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Type</label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value.toUpperCase() })}
                placeholder="NIGHT MEET"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value.toUpperCase() })}
                placeholder="DENVER"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Time</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="22:00"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Access Level</label>
              <select
                value={formData.access}
                onChange={(e) => setFormData({ ...formData, access: e.target.value as Event['access'] })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                <option value="PRIVATE">PRIVATE</option>
                <option value="INVITE ONLY">INVITE ONLY</option>
                <option value="VERIFIED">VERIFIED</option>
                <option value="PUBLIC">PUBLIC</option>
              </select>
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Total Spots</label>
              <input
                type="number"
                value={formData.spots?.total || 50}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  spots: { taken: formData.spots?.taken || 0, total: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-spades-gold text-black font-bold text-sm rounded-lg hover:bg-spades-gold/90 transition-colors"
            >
              {editingEvent ? 'Save Changes' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNewForm(false);
                setEditingEvent(null);
              }}
              className="px-6 py-2 bg-white/10 text-white font-bold text-sm rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Events List */}
      <div className="space-y-3">
        {events.map(event => (
          <div key={event.id} className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-spades-gold font-mono">{event.date}</div>
              <div className="text-white font-bold">{event.type}</div>
              <div className="text-white/50">{event.location}</div>
              <div className="text-white/30">{event.time}</div>
              <span className={`px-2 py-0.5 text-xs rounded ${
                event.access === 'VERIFIED' ? 'bg-spades-gold/20 text-spades-gold' :
                event.access === 'INVITE ONLY' ? 'bg-purple-500/20 text-purple-400' :
                'bg-white/10 text-white/50'
              }`}>
                {event.access}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingEvent(event)}
                className="px-3 py-1 text-sm text-white/50 hover:text-white transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this event?')) onDelete(event.id);
                }}
                className="px-3 py-1 text-sm text-red-400/50 hover:text-red-400 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Members Manager Component
function MembersManager({ 
  members, onSave, onDelete, onGenerateInvite, editingMember, setEditingMember, showNewForm, setShowNewForm 
}: {
  members: Member[];
  onSave: (member: Member) => void;
  onDelete: (id: string) => void;
  onGenerateInvite: (id: string) => void;
  editingMember: Member | null;
  setEditingMember: (member: Member | null) => void;
  showNewForm: boolean;
  setShowNewForm: (show: boolean) => void;
}) {
  const emptyMember: Member = {
    id: '',
    name: '',
    instagram: '',
    car: '',
    tier: 'member',
    joinedDate: new Date().toISOString().split('T')[0],
  };

  const [formData, setFormData] = useState<Member>(emptyMember);

  useEffect(() => {
    if (editingMember) {
      setFormData(editingMember);
    } else if (showNewForm) {
      setFormData(emptyMember);
    }
  }, [editingMember, showNewForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData(emptyMember);
  };

  const copyInviteLink = (code: string) => {
    navigator.clipboard.writeText(`https://spadesperformance.com/join?invite=${code}`);
    alert('Invite link copied!');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Members</h2>
        {!showNewForm && !editingMember && (
          <button
            onClick={() => setShowNewForm(true)}
            className="px-4 py-2 bg-spades-gold text-black font-bold text-sm rounded-lg hover:bg-spades-gold/90 transition-colors"
          >
            + Add Member
          </button>
        )}
      </div>

      {/* Form */}
      {(showNewForm || editingMember) && (
        <form onSubmit={handleSubmit} className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">
            {editingMember ? 'Edit Member' : 'New Member'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 text-sm mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John D."
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Instagram</label>
              <input
                type="text"
                value={formData.instagram || ''}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="@handle"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Car</label>
              <input
                type="text"
                value={formData.car || ''}
                onChange={(e) => setFormData({ ...formData, car: e.target.value })}
                placeholder="2020 Supra"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Tier</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value as Member['tier'] })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              >
                <option value="member">Member</option>
                <option value="verified">Verified</option>
                <option value="og">OG</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-spades-gold text-black font-bold text-sm rounded-lg hover:bg-spades-gold/90 transition-colors"
            >
              {editingMember ? 'Save Changes' : 'Add Member'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNewForm(false);
                setEditingMember(null);
              }}
              className="px-6 py-2 bg-white/10 text-white font-bold text-sm rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Members List */}
      <div className="space-y-3">
        {members.map(member => (
          <div key={member.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-bold">{member.name}</div>
                  <div className="text-white/50 text-sm">{member.car}</div>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded ${
                  member.tier === 'og' ? 'bg-spades-gold/20 text-spades-gold' :
                  member.tier === 'verified' ? 'bg-green-500/20 text-green-400' :
                  'bg-white/10 text-white/50'
                }`}>
                  {member.tier.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {member.inviteCode && (
                  <button
                    onClick={() => copyInviteLink(member.inviteCode!)}
                    className="px-3 py-1 text-sm text-spades-gold/70 hover:text-spades-gold transition-colors"
                    title="Copy invite link"
                  >
                    📋 {member.inviteCode}
                  </button>
                )}
                <button
                  onClick={() => onGenerateInvite(member.id)}
                  className="px-3 py-1 text-sm text-white/50 hover:text-white transition-colors"
                >
                  New Code
                </button>
                <button
                  onClick={() => setEditingMember(member)}
                  className="px-3 py-1 text-sm text-white/50 hover:text-white transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm('Remove this member?')) onDelete(member.id);
                  }}
                  className="px-3 py-1 text-sm text-red-400/50 hover:text-red-400 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Merch Manager Component
function MerchManager({ 
  merch, onSave, onDelete, editingMerch, setEditingMerch, showNewForm, setShowNewForm 
}: {
  merch: MerchItem[];
  onSave: (item: MerchItem) => void;
  onDelete: (id: string) => void;
  editingMerch: MerchItem | null;
  setEditingMerch: (item: MerchItem | null) => void;
  showNewForm: boolean;
  setShowNewForm: (show: boolean) => void;
}) {
  const emptyMerch: MerchItem = {
    id: '',
    name: '',
    price: 0,
    inStock: true,
    description: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    images: [],
  };

  const [formData, setFormData] = useState<MerchItem>(emptyMerch);

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Merch</h2>
        {!showNewForm && !editingMerch && (
          <button
            onClick={() => setShowNewForm(true)}
            className="px-4 py-2 bg-spades-gold text-black font-bold text-sm rounded-lg hover:bg-spades-gold/90 transition-colors"
          >
            + Add Item
          </button>
        )}
      </div>

      {/* Form */}
      {(showNewForm || editingMerch) && (
        <form onSubmit={handleSubmit} className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">
            {editingMerch ? 'Edit Item' : 'New Item'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 text-sm mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                placeholder="SPADES HOODIE"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Price ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-white/50 text-sm mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Premium heavyweight cotton..."
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white h-20"
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Sizes (comma separated)</label>
              <input
                type="text"
                value={formData.sizes.join(', ')}
                onChange={(e) => setFormData({ ...formData, sizes: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="S, M, L, XL"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Colors (comma separated)</label>
              <input
                type="text"
                value={formData.colors.join(', ')}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="Black, White"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div className="col-span-2 flex gap-6">
              <label className="flex items-center gap-2 text-white/70">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4"
                />
                In Stock
              </label>
              <label className="flex items-center gap-2 text-white/70">
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-white/70">
                <input
                  type="checkbox"
                  checked={formData.limited || false}
                  onChange={(e) => setFormData({ ...formData, limited: e.target.checked })}
                  className="w-4 h-4"
                />
                Limited
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {merch.map(item => (
          <div key={item.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="aspect-square bg-white/5 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-4xl">👕</span>
            </div>
            <h3 className="text-white font-bold text-sm mb-1">{item.name}</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-spades-gold font-bold">${item.price}</span>
              <span className={`text-xs ${item.inStock ? 'text-green-400' : 'text-red-400'}`}>
                {item.inStock ? 'In Stock' : 'Sold Out'}
              </span>
            </div>
            <div className="flex gap-2">
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
                className="flex-1 py-1.5 text-xs text-red-400/50 hover:text-red-400 bg-white/5 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Marketplace Manager Component
function MarketplaceManager() {
  const [listings] = useState<MarketListing[]>([
    { id: '1', title: 'Volk TE37 18x9.5 +22', category: 'Wheels', price: 2800, seller: 'mike_evo', verified: true, location: 'Denver', status: 'active', datePosted: '2024-12-15' },
    { id: '2', title: 'Invidia Q300 Cat-back', category: 'Exhaust', price: 650, seller: 'stisnow', verified: true, location: 'Aurora', status: 'active', datePosted: '2024-12-14' },
    { id: '3', title: 'BC Racing BR Coilovers', category: 'Suspension', price: 800, seller: 'boosted_civic', verified: false, location: 'Littleton', status: 'pending', datePosted: '2024-12-16' },
  ]);

  const getStatusColor = (status: MarketListing['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'sold': return 'bg-white/10 text-white/50';
      case 'flagged': return 'bg-red-500/20 text-red-400';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Marketplace Monitor</h2>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-green-400">{listings.filter(l => l.status === 'active').length}</div>
          <div className="text-xs text-white/50">Active</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-yellow-400">{listings.filter(l => l.status === 'pending').length}</div>
          <div className="text-xs text-white/50">Pending</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-white/50">{listings.filter(l => l.status === 'sold').length}</div>
          <div className="text-xs text-white/50">Sold</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-red-400">{listings.filter(l => l.status === 'flagged').length}</div>
          <div className="text-xs text-white/50">Flagged</div>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <div className="grid grid-cols-6 gap-4 p-4 border-b border-white/10 text-xs text-white/50 font-mono">
          <div>ITEM</div>
          <div>CATEGORY</div>
          <div>PRICE</div>
          <div>SELLER</div>
          <div>STATUS</div>
          <div>ACTIONS</div>
        </div>
        {listings.map(listing => (
          <div key={listing.id} className="grid grid-cols-6 gap-4 p-4 border-b border-white/5 items-center">
            <div className="text-white font-medium text-sm truncate">{listing.title}</div>
            <div className="text-white/50 text-sm">{listing.category}</div>
            <div className="text-spades-gold font-bold">${listing.price.toLocaleString()}</div>
            <div className="text-white/50 text-sm">
              @{listing.seller}
              {listing.verified && <span className="text-spades-gold ml-1">✓</span>}
            </div>
            <div>
              <span className={`px-2 py-1 text-xs rounded ${getStatusColor(listing.status)}`}>
                {listing.status.toUpperCase()}
              </span>
            </div>
            <div className="flex gap-2">
              <button className="px-2 py-1 text-xs text-green-400 hover:bg-green-400/10 rounded transition-colors">
                Approve
              </button>
              <button className="px-2 py-1 text-xs text-red-400 hover:bg-red-400/10 rounded transition-colors">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Help */}
      <div className="mt-6 bg-spades-gold/10 rounded-xl p-4 border border-spades-gold/20">
        <p className="text-spades-gold text-sm">
          <strong>💡 Marketplace Tips:</strong>
        </p>
        <ul className="text-white/60 text-sm mt-2 space-y-1">
          <li>• <strong>Pending:</strong> New listings awaiting approval</li>
          <li>• <strong>Flagged:</strong> Reported by members - review before action</li>
          <li>• Only verified members can post without approval</li>
        </ul>
      </div>
    </div>
  );
}

// Socials Manager Component
function SocialsManager() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Social Media</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Instagram */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📸</span>
            <h3 className="text-lg font-bold text-white">Instagram</h3>
          </div>
          <p className="text-white/50 text-sm mb-4">
            Connect your Instagram to display posts on the site.
          </p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="@spades_performance"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
            <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity">
              Connect Instagram
            </button>
          </div>
          <div className="mt-4 p-3 bg-spades-gold/10 rounded-lg">
            <p className="text-spades-gold text-xs">
              💡 <strong>How it works:</strong> Once connected, your latest posts will automatically appear on the Media page. You can choose which ones to feature.
            </p>
          </div>
        </div>

        {/* TikTok */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🎵</span>
            <h3 className="text-lg font-bold text-white">TikTok</h3>
          </div>
          <p className="text-white/50 text-sm mb-4">
            Connect your TikTok to display videos on the site.
          </p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="@spadesperformance"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
            <button className="w-full py-2 bg-black text-white font-bold text-sm rounded-lg border border-white/20 hover:bg-white/5 transition-colors">
              Connect TikTok
            </button>
          </div>
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-white/50 text-xs">
              💡 <strong>Coming soon:</strong> TikTok integration is in development. Check back later!
            </p>
          </div>
        </div>
      </div>

      {/* Manual Post Management */}
      <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Manual Post Management</h3>
        <p className="text-white/50 text-sm mb-4">
          Don't want to connect APIs? Add posts manually by entering their URLs.
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Paste Instagram or TikTok post URL..."
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          />
          <button className="px-6 py-2 bg-spades-gold text-black font-bold text-sm rounded-lg hover:bg-spades-gold/90 transition-colors">
            Add Post
          </button>
        </div>
      </div>
    </div>
  );
}

// Content Manager Component
function ContentManager({ content, onSave }: { content: SiteContent; onSave: (content: SiteContent) => void }) {
  const [formData, setFormData] = useState(content);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Site Content</h2>
        <button
          onClick={handleSave}
          className={`px-6 py-2 font-bold text-sm rounded-lg transition-colors ${
            saved 
              ? 'bg-green-500 text-white' 
              : 'bg-spades-gold text-black hover:bg-spades-gold/90'
          }`}
        >
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">🏠 Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white/50 text-sm mb-1">Main Title</label>
              <input
                type="text"
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xl font-bold"
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Tagline</label>
              <input
                type="text"
                value={formData.heroTagline}
                onChange={(e) => setFormData({ ...formData, heroTagline: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">📊 Stats Display</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-white/50 text-sm mb-1">Members</label>
              <input
                type="text"
                value={formData.memberCount}
                onChange={(e) => setFormData({ ...formData, memberCount: e.target.value })}
                placeholder="130+"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Events</label>
              <input
                type="text"
                value={formData.eventCount}
                onChange={(e) => setFormData({ ...formData, eventCount: e.target.value })}
                placeholder="47"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Builds</label>
              <input
                type="text"
                value={formData.buildCount}
                onChange={(e) => setFormData({ ...formData, buildCount: e.target.value })}
                placeholder="70+"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-center font-bold"
              />
            </div>
          </div>
        </div>

        {/* Join Section */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">🚪 Join Section</h3>
          <div>
            <label className="block text-white/50 text-sm mb-1">Join Tagline</label>
            <input
              type="text"
              value={formData.joinTagline}
              onChange={(e) => setFormData({ ...formData, joinTagline: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="bg-spades-gold/10 rounded-xl p-6 border border-spades-gold/20">
          <h3 className="text-lg font-bold text-spades-gold mb-4">👁️ Live Preview</h3>
          <div className="text-center py-8 bg-spades-black rounded-lg">
            <h1 className="text-4xl font-black italic text-white mb-2">{formData.heroTitle}</h1>
            <p className="text-white/50 italic">{formData.heroTagline}</p>
            <div className="flex justify-center gap-8 mt-6">
              <div>
                <div className="text-2xl font-bold text-spades-gold">{formData.memberCount}</div>
                <div className="text-xs text-white/30">MEMBERS</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-spades-gold">{formData.eventCount}</div>
                <div className="text-xs text-white/30">EVENTS</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-spades-gold">{formData.buildCount}</div>
                <div className="text-xs text-white/30">BUILDS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Collage Manager Component
function CollageManager() {
  const [items, setItems] = useState<{ id: string; filename: string; type: 'image' | 'video'; visible: boolean }[]>([]);

  useEffect(() => {
    // Load existing collage items
    const stored = adminStore.getCollage();
    if (stored.length > 0) {
      setItems(stored.map(s => ({ id: s.id, filename: s.filename, type: s.type, visible: s.visible })));
    }
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Homepage Reel</h2>
      
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">📁 Current Media</h3>
        <p className="text-white/50 text-sm mb-4">
          Media files are stored in <code className="bg-white/10 px-2 py-0.5 rounded">public/images/collage/</code>
        </p>
        
        <div className="bg-spades-gold/10 rounded-lg p-4 mb-4">
          <p className="text-spades-gold text-sm">
            <strong>💡 To add new photos/videos:</strong>
          </p>
          <ol className="text-white/60 text-sm mt-2 space-y-1 list-decimal list-inside">
            <li>Drop files into the <code className="bg-white/10 px-1 rounded">public/images/collage/</code> folder</li>
            <li>Name them with numbers (e.g., 25.jpg, 26.jpg) or descriptive names</li>
            <li>Supported formats: .jpg, .jpeg, .png, .mp4, .mov</li>
            <li>Push changes to GitHub - Railway will auto-deploy</li>
          </ol>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 24 }, (_, i) => i + 1).map(num => (
            <div key={num} className="aspect-square bg-white/5 rounded-lg flex items-center justify-center text-white/30 text-sm">
              {num}.jpg
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">🎬 Video Clips</h3>
        <div className="grid grid-cols-2 gap-4">
          {['ATSV Flame shot.mov', 'RollM1.mp4', 'RollM2.mp4', 'Mroll3.mp4', 'Mroll4.mp4'].map(video => (
            <div key={video} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <span className="text-2xl">🎥</span>
              <span className="text-white/70 text-sm">{video}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

