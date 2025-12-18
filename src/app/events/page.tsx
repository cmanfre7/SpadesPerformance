"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminStore, Event } from "@/lib/admin-store";

function CountdownTimer({ eventDate, eventTime }: { eventDate: string; eventTime: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const [month, day, year] = eventDate.split('.');
      const [hours, minutes] = eventTime.split(':');
      const target = new Date(`20${year}-${month}-${day}T${hours}:${minutes}:00`);
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        setIsPast(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate, eventTime]);

  if (isPast) {
    return <span className="text-red-400/60 text-xs font-mono">PAST</span>;
  }

  return (
    <div className="flex items-center gap-3">
      {timeLeft.days > 0 && (
        <div className="text-center">
          <div className="text-2xl font-black text-spades-gold font-mono leading-none">{timeLeft.days}</div>
          <div className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Days</div>
        </div>
      )}
      <div className="text-center">
        <div className="text-2xl font-black text-white font-mono leading-none">{String(timeLeft.hours).padStart(2, '0')}</div>
        <div className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Hours</div>
      </div>
      <div className="text-spades-gold/50 font-mono">:</div>
      <div className="text-center">
        <div className="text-2xl font-black text-white font-mono leading-none">{String(timeLeft.minutes).padStart(2, '0')}</div>
        <div className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Min</div>
      </div>
      <div className="text-spades-gold/50 font-mono">:</div>
      <div className="text-center">
        <div className="text-2xl font-black text-white font-mono leading-none">{String(timeLeft.seconds).padStart(2, '0')}</div>
        <div className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Sec</div>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen pt-32 relative overflow-hidden">
      {/* Concrete Texture Background */}
      <div 
        className="fixed inset-0 -z-10 opacity-25"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px),
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.03) 0%, transparent 50%),
            linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%'
        }}
      />
      
      {/* Dark Lighting Effects - Spotlights */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-spades-gold/5 rounded-full blur-3xl opacity-10" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl opacity-8" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl opacity-5" />
      </div>

      {/* Subtle Grid Overlay */}
      <div 
        className="fixed inset-0 -z-10 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Underground City Road with Street Light */}
      <div className="fixed inset-0 -z-10 pointer-events-none" style={{ opacity: 0.04 }}>
        <svg 
          className="absolute bottom-0 right-0 w-full h-full" 
          viewBox="0 0 1200 800" 
          preserveAspectRatio="xMaxYMax meet"
        >
          <defs>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.03)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
            </linearGradient>
            <radialGradient id="lightGlow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="rgba(212,175,55,0.15)" />
              <stop offset="50%" stopColor="rgba(212,175,55,0.05)" />
              <stop offset="100%" stopColor="rgba(212,175,55,0)" />
            </radialGradient>
            <linearGradient id="roadSurface" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.1)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.05)" />
            </linearGradient>
          </defs>
          
          {/* Road surface - perspective */}
          <path
            d="M 400 800 L 500 600 L 550 400 L 575 200 L 600 0 L 625 200 L 650 400 L 700 600 L 800 800 Z"
            fill="url(#roadSurface)"
          />
          
          {/* Road edge lines - perspective */}
          <path
            d="M 400 800 L 500 600 L 550 400 L 575 200 L 600 0"
            fill="none"
            stroke="url(#roadGradient)"
            strokeWidth="1.5"
          />
          <path
            d="M 800 800 L 700 600 L 650 400 L 625 200 L 600 0"
            fill="none"
            stroke="url(#roadGradient)"
            strokeWidth="1.5"
          />
          
          {/* Road center line - dashed perspective */}
          <path
            d="M 600 800 L 600 0"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
            strokeDasharray="15 15"
          />
          
          {/* Street light pole - vertical */}
          <line
            x1="600"
            y1="800"
            x2="600"
            y2="120"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="2"
          />
          
          {/* Street light arm - horizontal */}
          <line
            x1="600"
            y1="120"
            x2="550"
            y2="110"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="2"
          />
          
          {/* Street light fixture base */}
          <line
            x1="550"
            y1="110"
            x2="545"
            y2="100"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.5"
          />
          
          {/* Street light fixture - lamp */}
          <ellipse
            cx="545"
            cy="95"
            rx="10"
            ry="16"
            fill="rgba(255,255,255,0.08)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.8"
          />
          
          {/* Light glow from street light */}
          <ellipse
            cx="545"
            cy="95"
            rx="35"
            ry="50"
            fill="url(#lightGlow)"
          />
          
          {/* Subtle road texture lines */}
          <path
            d="M 450 700 L 550 550 L 575 450 L 587.5 350 L 600 250"
            fill="none"
            stroke="rgba(255,255,255,0.02)"
            strokeWidth="0.5"
          />
          <path
            d="M 750 700 L 650 550 L 625 450 L 612.5 350 L 600 250"
            fill="none"
            stroke="rgba(255,255,255,0.02)"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Header */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            {/* Spotlight effect on header */}
            <div className="absolute -top-10 left-0 w-64 h-32 bg-spades-gold/10 rounded-full blur-2xl opacity-30" />
            <h1 className="relative text-6xl md:text-7xl font-black text-white mb-3 tracking-tight" style={{ textShadow: '0 0 30px rgba(212, 175, 55, 0.3)' }}>
              EVENTS
            </h1>
            <div className="relative flex items-center gap-4 mb-6">
              <div className="h-px bg-gradient-to-r from-spades-gold/50 via-white/20 to-transparent flex-1" />
              <p className="text-white/60 text-sm font-mono tracking-wider uppercase">Limited spots. Private locations.</p>
              <div className="h-px bg-gradient-to-l from-spades-gold/50 via-white/20 to-transparent flex-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="relative py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-xs text-white/30 font-mono mb-2 tracking-[0.3em] uppercase">Upcoming</h2>
            <div className="h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent w-32" />
          </div>

          {events.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-8 bg-white/5 rounded-xl border border-white/10">
                <p className="text-white/40 font-mono text-sm tracking-wider">No upcoming events</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => {
                const accessColors = {
                  "PRIVATE": "border-red-500/40 text-red-300 bg-red-500/10",
                  "INVITE ONLY": "border-purple-500/40 text-purple-300 bg-purple-500/10",
                  "VERIFIED": "border-spades-gold/50 text-spades-gold bg-spades-gold/10",
                };
                const accessColor = accessColors[event.access as keyof typeof accessColors] || "border-white/20 text-white/50 bg-white/5";

                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="group relative block"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Event Card with depth and framing */}
                    <div className="relative h-full bg-gradient-to-br from-black/90 via-black/70 to-black/90 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden transition-all duration-500 group-hover:border-spades-gold/50 group-hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] group-hover:scale-[1.02]">
                      {/* Concrete texture overlay */}
                      <div 
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px)`
                        }}
                      />
                      
                      {/* Spotlight effect on hover */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.15) 0%, transparent 70%)'
                        }}
                      />

                      {/* Content */}
                      <div className="relative p-6 space-y-4">
                        {/* Header with date and access */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-4xl font-black text-white mb-1 font-mono">{event.date}</div>
                            <div className="text-xs text-white/40 font-mono uppercase tracking-wider">{event.time}</div>
                          </div>
                          <span className={`px-3 py-1 text-[10px] rounded-full border font-bold backdrop-blur-sm ${accessColor}`}>
                            {event.access}
                          </span>
                        </div>

                        {/* Event Type - Large and bold */}
                        <div>
                          <h3 className="text-2xl font-black text-white mb-2 group-hover:text-spades-gold transition-colors">
                            {event.type}
                          </h3>
                          <div className="flex items-center gap-2 text-white/50 text-sm font-mono">
                            <svg className="w-4 h-4 text-spades-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{event.location}</span>
                          </div>
                        </div>

                        {/* Countdown Timer */}
                        <div className="pt-4 border-t border-white/10">
                          <div className="text-[10px] text-white/40 font-mono uppercase tracking-wider mb-2">Countdown</div>
                          <CountdownTimer eventDate={event.date} eventTime={event.time} />
                        </div>

                        {/* RSVP Button */}
                        <div className="pt-2">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-spades-gold/10 border border-spades-gold/30 rounded-lg group-hover:bg-spades-gold/20 group-hover:border-spades-gold/50 transition-all">
                            <span className="text-spades-gold font-bold text-sm font-mono">RSVP</span>
                            <span className="text-spades-gold group-hover:translate-x-1 transition-transform">→</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom accent line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-spades-gold/0 to-transparent group-hover:via-spades-gold/50 transition-all duration-500" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Past Events / Log */}
      {pastEvents.length > 0 && (
        <section className="relative py-12 px-4 border-t border-white/10 mt-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-xs text-white/30 font-mono mb-2 tracking-[0.3em] uppercase">Log</h2>
              <div className="h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent w-32" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="font-mono text-sm flex items-center gap-2 text-white/30 flex-wrap">
                    <span className="text-white/50">{event.date}</span>
                    <span className="text-white/10">/</span>
                    <span>{event.type}</span>
                    <span className="text-white/10">/</span>
                    <span className="text-white/40">{event.location}</span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/media"
              className="inline-block mt-8 text-sm text-white/40 hover:text-spades-gold transition-colors font-mono"
            >
              View archive →
            </Link>
          </div>
        </section>
      )}

      {/* Access Info */}
      <section className="relative py-16 px-4 border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 text-center">
              <div className="flex justify-center mb-3">
                <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-sm text-white/70 font-mono mb-2 uppercase tracking-wider">Private</h3>
              <p className="text-xs text-white/40">Members only</p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10 text-center">
              <div className="flex justify-center mb-3">
                <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-sm text-white/70 font-mono mb-2 uppercase tracking-wider">Invite Only</h3>
              <p className="text-xs text-white/40">Direct invite required</p>
            </div>
            <div className="p-6 bg-spades-gold/10 rounded-xl border border-spades-gold/30 text-center">
              <div className="flex justify-center mb-3">
                <svg className="w-12 h-12 text-spades-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm text-spades-gold font-mono mb-2 uppercase tracking-wider">Verified</h3>
              <p className="text-xs text-white/40">Verified members</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
