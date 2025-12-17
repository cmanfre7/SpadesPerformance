"use client";

import { useState, useEffect } from 'react';
import { adminStore, Event } from '@/lib/admin-store';

interface EventsManagerProps {
  events: Event[];
  onSave: (event: Event) => void;
  onDelete: (id: string) => void;
  editingEvent: Event | null;
  setEditingEvent: (event: Event | null) => void;
  showNewForm: boolean;
  setShowNewForm: (show: boolean) => void;
}

export function EventsManager({ 
  events, onSave, onDelete, editingEvent, setEditingEvent, showNewForm, setShowNewForm 
}: EventsManagerProps) {
  const emptyEvent: Event = {
    id: '',
    date: '',
    type: '',
    location: '',
    time: '',
    access: 'PRIVATE',
    spots: { taken: 0, total: 50 },
    published: false,
  };

  const [formData, setFormData] = useState<Event>(emptyEvent);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

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

  const filteredEvents = events.filter(e => {
    if (filter === 'upcoming') return !e.isPast;
    if (filter === 'past') return e.isPast;
    return true;
  });

  const duplicateEvent = (event: Event) => {
    const newEvent = { 
      ...event, 
      id: adminStore.generateId(), 
      date: '', 
      published: false 
    };
    onSave(newEvent);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Events</h2>
          <p className="text-white/40 text-sm mt-1">Create and manage your events. Changes appear on the site immediately.</p>
        </div>
        {!showNewForm && !editingEvent && (
          <button
            onClick={() => setShowNewForm(true)}
            className="px-4 py-2 bg-spades-gold text-black font-bold text-sm rounded-lg hover:bg-spades-gold/90 transition-colors"
          >
            + Add Event
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'upcoming', 'past'] as const).map(f => (
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
          </button>
        ))}
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
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              >
                <option value="">Select type...</option>
                <option value="NIGHT MEET">NIGHT MEET</option>
                <option value="WAREHOUSE">WAREHOUSE</option>
                <option value="CRUISE">CRUISE</option>
                <option value="PRIVATE">PRIVATE</option>
                <option value="SHOW">SHOW</option>
              </select>
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value.toUpperCase() })}
                placeholder="DENVER"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
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
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-white/50 text-sm mb-1">Access Level</label>
              <select
                value={formData.access}
                onChange={(e) => setFormData({ ...formData, access: e.target.value as Event['access'] })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              >
                <option value="PRIVATE">PRIVATE - Members only</option>
                <option value="INVITE ONLY">INVITE ONLY - Direct invite</option>
                <option value="VERIFIED">VERIFIED - Verified members</option>
                <option value="PUBLIC">PUBLIC - Anyone</option>
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
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-white/50 text-sm mb-1">Address (optional, only shown to attendees)</label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full address..."
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-white/50 text-sm mb-1">Description (optional)</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Event details..."
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-spades-gold/50 focus:outline-none h-20"
              />
            </div>
            <div className="col-span-2 flex gap-6">
              <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span>Published (visible on site)</span>
              </label>
              <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPast || false}
                  onChange={(e) => setFormData({ ...formData, isPast: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span>Mark as past event</span>
              </label>
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
        {filteredEvents.length === 0 && (
          <div className="text-center py-12 text-white/30">
            No events found. Create your first event!
          </div>
        )}
        {filteredEvents.map(event => (
          <div 
            key={event.id} 
            className={`bg-white/5 rounded-xl p-4 border transition-colors ${
              event.published ? 'border-white/10' : 'border-orange-500/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-spades-gold font-mono text-lg">{event.date}</div>
                <div className="text-white font-bold">{event.type}</div>
                <div className="text-white/50">{event.location}</div>
                <div className="text-white/30">{event.time}</div>
                <span className={`px-2 py-0.5 text-xs rounded ${
                  event.access === 'VERIFIED' ? 'bg-spades-gold/20 text-spades-gold' :
                  event.access === 'INVITE ONLY' ? 'bg-purple-500/20 text-purple-400' :
                  event.access === 'PUBLIC' ? 'bg-green-500/20 text-green-400' :
                  'bg-white/10 text-white/50'
                }`}>
                  {event.access}
                </span>
                {!event.published && (
                  <span className="px-2 py-0.5 text-xs rounded bg-orange-500/20 text-orange-400">
                    DRAFT
                  </span>
                )}
                {event.isPast && (
                  <span className="px-2 py-0.5 text-xs rounded bg-white/5 text-white/30">
                    PAST
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {event.spots && (
                  <span className="text-xs text-white/30 font-mono mr-2">
                    {event.spots.taken}/{event.spots.total} spots
                  </span>
                )}
                <button
                  onClick={() => duplicateEvent(event)}
                  className="px-3 py-1 text-sm text-white/30 hover:text-white/60 transition-colors"
                  title="Duplicate"
                >
                  📋
                </button>
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
          </div>
        ))}
      </div>

      {/* Help */}
      <div className="mt-8 bg-spades-gold/10 rounded-xl p-4 border border-spades-gold/20">
        <h4 className="text-spades-gold font-bold mb-2">💡 Quick Tips</h4>
        <ul className="text-white/60 text-sm space-y-1">
          <li>• <strong>Draft events</strong> are not visible on the site until published</li>
          <li>• <strong>RSVP spots</strong> can be manually adjusted as people sign up</li>
          <li>• <strong>Duplicate</strong> an event to quickly create similar ones</li>
          <li>• Mark events as <strong>past</strong> to move them to the event log</li>
        </ul>
      </div>
    </div>
  );
}

