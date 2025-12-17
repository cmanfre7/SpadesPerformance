"use client";

import { useState, useEffect } from 'react';
import { adminStore, Member } from '@/lib/admin-store';

interface MembersManagerProps {
  members: Member[];
  onSave: (member: Member) => void;
  onDelete: (id: string) => void;
  onGenerateInvite: (id: string) => void;
  editingMember: Member | null;
  setEditingMember: (member: Member | null) => void;
  showNewForm: boolean;
  setShowNewForm: (show: boolean) => void;
}

export function MembersManager({ 
  members, onSave, onDelete, onGenerateInvite, editingMember, setEditingMember, showNewForm, setShowNewForm 
}: MembersManagerProps) {
  const emptyMember: Member = {
    id: '',
    name: '',
    instagram: '',
    car: '',
    tags: ['member'],
    joinedDate: new Date().toISOString().split('T')[0],
    eventsAttended: 0,
    active: true,
  };

  const [formData, setFormData] = useState<Member>(emptyMember);
  const [filter, setFilter] = useState<'all' | 'member' | 'verified' | 'og'>('all');
  const [search, setSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (editingMember) {
      // Handle migration from old 'tier' format to new 'tags' format
      const tags = editingMember.tags || [(editingMember as any).tier || 'member'];
      setFormData({ ...editingMember, tags });
    } else if (showNewForm) {
      setFormData(emptyMember);
    }
  }, [editingMember, showNewForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData(emptyMember);
  };

  const filteredMembers = members.filter(m => {
    // Handle both old 'tier' format and new 'tags' format
    const memberTags = m.tags || [(m as any).tier || 'member'];
    const matchesFilter = filter === 'all' || memberTags.includes(filter);
    const matchesSearch = !search || 
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.instagram?.toLowerCase().includes(search.toLowerCase()) ||
      m.car?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const copyInviteLink = (code: string) => {
    const link = `https://spadesdenver.club/join?invite=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const generateInviteLink = async () => {
    const res = await fetch('/api/invites/generate', { method: 'POST' });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.link) {
      alert('Could not generate invite. Make sure you are logged in as admin and Supabase is configured.');
      return;
    }
    try {
      await navigator.clipboard.writeText(json.link);
      alert('Invite link copied to clipboard!');
    } catch {
      // Clipboard blocked on localhost - show the link instead
      prompt('Copy this invite link:', json.link);
    }
  };

  const stats = {
    total: members.length,
    active: members.filter(m => m.active).length,
    verified: members.filter(m => (m.tags || [(m as any).tier]).includes('verified')).length,
    og: members.filter(m => (m.tags || [(m as any).tier]).includes('og')).length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Members</h2>
          <p className="text-white/40 text-sm mt-1">Manage your crew and generate invite links.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={generateInviteLink}
            className="px-4 py-2 bg-white/10 text-white font-bold text-sm rounded-lg hover:bg-white/20 transition-colors"
          >
            Generate Invite Link
          </button>
          {!showNewForm && !editingMember && (
            <button
              onClick={() => setShowNewForm(true)}
              className="px-4 py-2 bg-spades-gold text-black font-bold text-sm rounded-lg hover:bg-spades-gold/90 transition-colors"
            >
              + Add Member
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-xs text-white/50">Total</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.active}</div>
          <div className="text-xs text-white/50">Active</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.verified}</div>
          <div className="text-xs text-white/50">Verified</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <div className="text-2xl font-bold text-spades-gold">{stats.og}</div>
          <div className="text-xs text-white/50">OG</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-spades-gold/50 focus:outline-none"
        />
        <div className="flex gap-2">
          {(['all', 'member', 'verified', 'og'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filter === f 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      {(showNewForm || editingMember) && (
        <form onSubmit={handleSubmit} className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">
            {editingMember ? 'Edit Member' : 'New Member'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 text-sm mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John D."
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
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
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Car</label>
              <input
                type="text"
                value={formData.car || ''}
                onChange={(e) => setFormData({ ...formData, car: e.target.value })}
                placeholder="2020 Supra"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-2">Rank</label>
              <select
                value={formData.tags.includes('admin') ? 'admin' : formData.tags.includes('og') ? 'og' : formData.tags.includes('verified') ? 'verified' : 'member'}
                onChange={(e) => {
                  const rank = e.target.value;
                  // Hierarchy: Admin > OG > Verified > Member
                  if (rank === 'admin') {
                    setFormData({ ...formData, tags: ['member', 'verified', 'og', 'admin'] });
                  } else if (rank === 'og') {
                    setFormData({ ...formData, tags: ['member', 'verified', 'og'] });
                  } else if (rank === 'verified') {
                    setFormData({ ...formData, tags: ['member', 'verified'] });
                  } else {
                    setFormData({ ...formData, tags: ['member'] });
                  }
                }}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              >
                <option value="member">Member</option>
                <option value="verified">Verified</option>
                <option value="og">OG</option>
                <option value="admin">Administrator</option>
              </select>
              <p className="text-white/30 text-xs mt-2">Higher ranks automatically include all lower ranks.</p>
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Email (optional)</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              />
            </div>
            {!editingMember && (
              <>
                <div>
                  <label className="block text-white/50 text-sm mb-1">Username *</label>
                  <input
                    type="text"
                    value={(formData as any).username || ''}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value } as any)}
                    placeholder="username (for login)"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
                    required={!editingMember}
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-sm mb-1">Temporary Password *</label>
                  <input
                    type="password"
                    value={(formData as any).password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value } as any)}
                    placeholder="They can change this later"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
                    required={!editingMember}
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-white/50 text-sm mb-1">Events Attended</label>
              <input
                type="number"
                value={formData.eventsAttended}
                onChange={(e) => setFormData({ ...formData, eventsAttended: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-white/50 text-sm mb-1">Notes (private)</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any notes about this member..."
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none h-20"
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span>Active member</span>
              </label>
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
        {filteredMembers.length === 0 && (
          <div className="text-center py-12 text-white/30">
            No members found.
          </div>
        )}
        {filteredMembers.map(member => (
          <div key={member.id} className={`bg-white/5 rounded-xl p-4 border border-white/10 ${!member.active ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-spades-gold/20 to-spades-gold/5 flex items-center justify-center text-spades-gold font-bold text-lg">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-bold">{member.name}</span>
                    {(() => {
                      const tags = member.tags || [(member as any).tier || 'member'];
                      // Show highest rank only (Admin > OG > Verified > Member)
                      const highestRank = tags.includes('admin') ? 'admin' : tags.includes('og') ? 'og' : tags.includes('verified') ? 'verified' : 'member';
                      return (
                        <span 
                          className={`px-2 py-0.5 text-xs rounded ${
                            highestRank === 'admin' ? 'bg-red-500/20 text-red-400' :
                            highestRank === 'og' ? 'bg-spades-gold/20 text-spades-gold' :
                            highestRank === 'verified' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-white/10 text-white/50'
                          }`}
                        >
                          {highestRank === 'admin' ? 'ADMIN' : highestRank === 'og' ? 'OG' : highestRank === 'verified' ? 'VERIFIED' : 'MEMBER'}
                        </span>
                      );
                    })()}
                    {!member.active && (
                      <span className="px-2 py-0.5 text-xs rounded bg-red-500/20 text-red-400">INACTIVE</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/40">
                    {member.instagram && <span>{member.instagram}</span>}
                    {member.car && <span>• {member.car}</span>}
                    <span>• {member.eventsAttended} events</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {member.inviteCode && (
                  <button
                    onClick={() => copyInviteLink(member.inviteCode!)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      copiedCode === member.inviteCode 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-spades-gold/10 text-spades-gold hover:bg-spades-gold/20'
                    }`}
                  >
                    {copiedCode === member.inviteCode ? '✓ Copied!' : `📋 ${member.inviteCode}`}
                  </button>
                )}
                <button
                  onClick={() => onGenerateInvite(member.id)}
                  className="px-3 py-1 text-sm text-white/30 hover:text-white/60 transition-colors"
                  title="Generate new invite code"
                >
                  🔄
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

      {/* Help */}
      <div className="mt-8 bg-spades-gold/10 rounded-xl p-4 border border-spades-gold/20">
        <h4 className="text-spades-gold font-bold mb-2">💡 Invite System</h4>
        <ul className="text-white/60 text-sm space-y-1">
          <li>• Each member can have their own <strong>unique invite code</strong></li>
          <li>• Click the code to copy the full invite link</li>
          <li>• Use <strong>Generate 5 Invites</strong> for bulk codes</li>
          <li>• Members become <strong>Verified</strong> after attending 3+ events</li>
        </ul>
      </div>
    </div>
  );
}

