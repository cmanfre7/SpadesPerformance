"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminStore, Event, Member, MerchItem, SiteContent } from '@/lib/admin-store';
import { EventsManager } from '@/components/admin/EventsManager';
import { MembersManager } from '@/components/admin/MembersManager';
import { MerchManager } from '@/components/admin/MerchManager';
import { MarketplaceManager } from '@/components/admin/MarketplaceManager';
import { ContentManager } from '@/components/admin/ContentManager';
import { CollageManager } from '@/components/admin/CollageManager';
import { SettingsManager } from '@/components/admin/SettingsManager';
import { JoinRequestsManager } from '@/components/admin/JoinRequestsManager';

type Tab = 'overview' | 'events' | 'members' | 'requests' | 'merch' | 'marketplace' | 'content' | 'collage' | 'settings';

const resolveMemberTags = (member: Member): Member['tags'] => {
  if (member.tags && member.tags.length > 0) {
    return member.tags;
  }
  const tier = (member as any).tier;
  return tier ? [tier] : ['member'];
};

const getHighestMemberRank = (member: Member): 'admin' | 'og' | 'verified' | 'member' => {
  const tags = resolveMemberTags(member);
  if (tags.includes('admin')) return 'admin';
  if (tags.includes('og')) return 'og';
  if (tags.includes('verified')) return 'verified';
  return 'member';
};

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

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/admin/members");
      const json = await res.json();
      if (json.ok) {
        setMembers(json.members || []);
      }
    } catch (err) {
      console.error("Failed to fetch members:", err);
    }
  };

  useEffect(() => {
    // Check auth
    const auth = sessionStorage.getItem('spades_admin_auth');
    if (auth !== 'true') {
      router.push('/admin');
      return;
    }

    // Load data
    setEvents(adminStore.getEvents());
    fetchMembers(); // Fetch from Supabase
    setMerch(adminStore.getMerch());
    setSiteContent(adminStore.getSiteContent());
  }, [router]);

  // Refresh members when switching to members tab
  useEffect(() => {
    if (activeTab === 'members') {
      fetchMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleLogout = () => {
    sessionStorage.removeItem('spades_admin_auth');
    router.push('/admin');
  };

  const verifiedMembersCount = members.filter(member => resolveMemberTags(member).includes('verified')).length;

  // Event handlers
  const saveEvent = (event: Event) => {
    const updated = editingEvent 
      ? events.map(e => e.id === event.id ? event : e)
      : [...events, { ...event, id: event.id || adminStore.generateId() }];
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
  const saveMember = async (member: Member) => {
    try {
      // Get highest rank from tags
      const highestRank = getHighestMemberRank(member);
      
      // If no ID, it's a new member - use POST
      if (!member.id || editingMember === null) {
        // For new members, we need username and password from form
        const username = (member as any).username;
        const password = (member as any).password;
        
        if (!username || !password) {
          alert("Username and password required to create a new member");
          return;
        }

        const res = await fetch("/api/admin/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: member.name,
            instagram: member.instagram || "",
            car: member.car || "",
            email: member.email || "",
            rank: highestRank,
            username: username.toLowerCase(),
            password: password,
          }),
        });

        const json = await res.json();
        if (json.ok) {
          await fetchMembers();
          setEditingMember(null);
          setShowNewForm(false);
          alert("Member created! They can now log in with their username and password.");
        } else {
          alert(json.error || "Failed to create member");
        }
      } else {
        // Existing member - use PATCH
        const res = await fetch("/api/admin/members", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: member.id,
            rank: highestRank,
            name: member.name,
            instagram: member.instagram,
            car: member.car,
            email: member.email,
          }),
        });

        const json = await res.json();
        if (json.ok) {
          await fetchMembers();
          setEditingMember(null);
          setShowNewForm(false);
        } else {
          alert(json.error || "Failed to save member");
        }
      }
    } catch (err) {
      console.error("Failed to save member:", err);
      alert("Failed to save member");
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm("Remove this member? They will be marked as rejected.")) return;
    
    try {
      const res = await fetch(`/api/admin/members?id=${id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (json.ok) {
        // Refresh members list
        await fetchMembers();
      } else {
        alert(json.error || "Failed to remove member");
      }
    } catch (err) {
      console.error("Failed to delete member:", err);
      alert("Failed to remove member");
    }
  };

  const generateNewInvite = (memberId: string) => {
    let newCode = '';
    const updated = members.map(m => {
      if (m.id === memberId) {
        newCode = adminStore.generateInviteCode();
        return { ...m, inviteCode: newCode };
      }
      return m;
    });
    setMembers(updated);
    adminStore.saveMembers(updated);
    if (newCode) {
      adminStore.addInvite(newCode);
    }
  };

  // Merch handlers
  const saveMerchItem = (item: MerchItem) => {
    const updated = editingMerch
      ? merch.map(m => m.id === item.id ? item : m)
      : [...merch, { ...item, id: item.id || adminStore.generateId() }];
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
    { id: 'requests', label: 'Join Requests', icon: '📩' },
    { id: 'merch', label: 'Merch', icon: '👕' },
    { id: 'marketplace', label: 'Marketplace', icon: '🏪' },
    { id: 'content', label: 'Site Content', icon: '✏️' },
    { id: 'collage', label: 'Homepage Reel', icon: '🖼️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-spades-black">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 sticky top-0 bg-spades-black/95 backdrop-blur z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white/50 hover:text-white transition-colors text-sm">
              ← Back to Site
            </Link>
            <span className="text-white/20">|</span>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-spades-gold">♠</span> Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/30 text-xs font-mono">Shift+Ctrl+A to access</span>
            <button
              onClick={handleLogout}
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <nav className="w-64 border-r border-white/10 min-h-[calc(100vh-73px)] p-4 sticky top-[73px] self-start">
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
                <span className="text-white">{events.filter(e => !e.isPast).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Members</span>
                <span className="text-white">{members.filter(m => m.active).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Merch Items</span>
                <span className="text-white">{merch.filter(m => m.inStock).length}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-4 p-4 bg-spades-gold/10 rounded-lg border border-spades-gold/20">
            <h3 className="text-xs text-spades-gold font-mono mb-2">QUICK ACTIONS</h3>
            <div className="space-y-2">
              <button
                onClick={() => { setActiveTab('events'); setShowNewForm(true); }}
                className="w-full text-left text-xs text-white/60 hover:text-white py-1"
              >
                + New Event
              </button>
              <button
                onClick={() => { setActiveTab('members'); setShowNewForm(true); }}
                className="w-full text-left text-xs text-white/60 hover:text-white py-1"
              >
                + New Member
              </button>
              <button
                onClick={() => { setActiveTab('merch'); setShowNewForm(true); }}
                className="w-full text-left text-xs text-white/60 hover:text-white py-1"
              >
                + New Merch
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back! 👋</h2>
              <p className="text-white/40 text-sm mb-6">Here's what's happening with Spades Performance.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-spades-gold/20 to-spades-gold/5 rounded-xl p-6 border border-spades-gold/20">
                  <div className="text-3xl font-bold text-spades-gold mb-2">{events.filter(e => !e.isPast).length}</div>
                  <div className="text-white/50 text-sm">Upcoming Events</div>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-3xl font-bold text-white mb-2">{members.filter(m => m.active).length}</div>
                  <div className="text-white/50 text-sm">Active Members</div>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-3xl font-bold text-white mb-2">{merch.filter(m => m.inStock).length}</div>
                  <div className="text-white/50 text-sm">Items In Stock</div>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-3xl font-bold text-white mb-2">{verifiedMembersCount}</div>
                  <div className="text-white/50 text-sm">Verified Members</div>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => { setActiveTab('events'); setShowNewForm(true); }}
                    className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-center group"
                  >
                    <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">📅</span>
                    <span className="text-sm text-white/70">Add Event</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('members'); setShowNewForm(true); }}
                    className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-center group"
                  >
                    <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">👤</span>
                    <span className="text-sm text-white/70">Add Member</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('merch'); setShowNewForm(true); }}
                    className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-center group"
                  >
                    <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">👕</span>
                    <span className="text-sm text-white/70">Add Merch</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('content')}
                    className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-center group"
                  >
                    <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">✏️</span>
                    <span className="text-sm text-white/70">Edit Content</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity / Upcoming Events */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">📅 Next Events</h3>
                  <div className="space-y-3">
                    {events.filter(e => !e.isPast).slice(0, 3).map(event => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <div className="text-white font-medium">{event.type}</div>
                          <div className="text-white/40 text-xs">{event.date} • {event.location}</div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${
                          event.published ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {event.published ? 'Live' : 'Draft'}
                        </span>
                      </div>
                    ))}
                    {events.filter(e => !e.isPast).length === 0 && (
                      <div className="text-center py-4 text-white/30">No upcoming events</div>
                    )}
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">👥 Recent Members</h3>
                  <div className="space-y-3">
                    {members.slice(-3).reverse().map(member => {
                      const rank = getHighestMemberRank(member);
                      return (
                        <div key={member.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-spades-gold/20 flex items-center justify-center text-spades-gold font-bold text-sm">
                            {member.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium text-sm">{member.name}</div>
                            <div className="text-white/40 text-xs">{member.car || 'No car listed'}</div>
                          </div>
                          <span className={`px-2 py-0.5 text-xs rounded ${
                            rank === 'admin' ? 'bg-red-500/20 text-red-400' :
                            rank === 'og' ? 'bg-spades-gold/20 text-spades-gold' :
                            rank === 'verified' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-white/10 text-white/50'
                          }`}>
                            {rank === 'admin' ? 'ADMIN' : rank === 'og' ? 'OG' : rank === 'verified' ? 'VERIFIED' : 'MEMBER'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="mt-8 bg-spades-gold/10 rounded-xl p-6 border border-spades-gold/20">
                <h3 className="text-lg font-bold text-spades-gold mb-2">📖 How to Use This Dashboard</h3>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2 text-white/60 text-sm">
                    <p><strong className="text-white">📅 Events:</strong> Create and manage meets. Publish when ready.</p>
                    <p><strong className="text-white">👥 Members:</strong> Add crew, generate invite codes, track attendance.</p>
                    <p><strong className="text-white">👕 Merch:</strong> Manage products, stock levels, and featured items.</p>
                    <p><strong className="text-white">🏪 Marketplace:</strong> Review and moderate member listings.</p>
                  </div>
                  <div className="space-y-2 text-white/60 text-sm">
                    <p><strong className="text-white">✏️ Content:</strong> Edit homepage text, stats, featured builds, and TikTok videos.</p>
                    <p><strong className="text-white">🖼️ Homepage Reel:</strong> Manage the scrolling photo collage.</p>
                    <p><strong className="text-white">⚙️ Settings:</strong> Site config, backups, and data management.</p>
                  </div>
                </div>
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

          {/* Join Requests Tab */}
          {activeTab === 'requests' && (
            <JoinRequestsManager />
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

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <SettingsManager />
          )}
        </main>
      </div>
    </div>
  );
}
