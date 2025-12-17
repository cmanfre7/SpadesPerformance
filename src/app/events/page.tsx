"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminStore, Event } from "@/lib/admin-store";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);

  useEffect(() => {
    const allEvents = adminStore.getEvents();
    const now = new Date();
    
    const upcoming = allEvents.filter(e => {
      if (e.isPast) return false;
      const [month, day, year] = e.date.split('.');
      const eventDate = new Date(`20${year}-${month}-${day}`);
      return eventDate >= now;
    });
    
    const past = allEvents.filter(e => {
      if (e.isPast) return true;
      const [month, day, year] = e.date.split('.');
      const eventDate = new Date(`20${year}-${month}-${day}`);
      return eventDate < now;
    });
    
    setEvents(upcoming);
    setPastEvents(past);
  }, []);
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 px-4 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xs text-white/30 font-mono tracking-widest mb-4">EVENTS</h1>
          <p className="text-white/40 text-sm font-mono">
            Limited spots. Private locations.
          </p>
        </div>
      </section>

      {/* Upcoming Events - Log Format */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs text-white/20 font-mono mb-8 tracking-widest">UPCOMING</h2>

          <div className="space-y-1">
            {events.map((event) => (
              <div
                key={event.id}
                className="py-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors"
              >
                {/* Log Entry */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="font-mono text-sm flex items-center gap-3 flex-wrap">
                    <span className="text-white/40">{event.date}</span>
                    <span className="text-white/10">/</span>
                    <span className="text-white/70">{event.type}</span>
                    <span className="text-white/10">/</span>
                    <span className="text-white/40">{event.location}</span>
                    <span className="text-white/10">/</span>
                    <span className="text-white/30">{event.time}</span>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Access Level */}
                    <span className="text-xs text-white/20 font-mono">
                      {event.access}
                    </span>

                    {/* RSVP Link */}
                    <Link
                      href={`/events/${event.id}`}
                      className="text-xs text-white/50 hover:text-white transition-colors font-mono"
                    >
                      RSVP
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-12 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs text-white/20 font-mono mb-8 tracking-widest">LOG</h2>

          <div className="space-y-1">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="py-4 border-b border-white/5"
              >
                <div className="font-mono text-sm flex items-center gap-3 text-white/30">
                  <span>{event.date}</span>
                  <span className="text-white/10">/</span>
                  <span>{event.type}</span>
                  <span className="text-white/10">/</span>
                  <span>{event.location}</span>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/media"
            className="block mt-8 text-xs text-white/20 hover:text-white/40 transition-colors font-mono"
          >
            View archive
          </Link>
        </div>
      </section>

      {/* Access Info - Minimal */}
      <section className="py-12 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xs text-white/30 font-mono mb-2">PRIVATE</h3>
              <p className="text-xs text-white/20">Members only</p>
            </div>
            <div>
              <h3 className="text-xs text-white/30 font-mono mb-2">INVITE ONLY</h3>
              <p className="text-xs text-white/20">Direct invite required</p>
            </div>
            <div>
              <h3 className="text-xs text-spades-gold/50 font-mono mb-2">VERIFIED</h3>
              <p className="text-xs text-white/20">Verified members</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
