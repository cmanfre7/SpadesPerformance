import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

// Sample data - will be replaced with real data from Supabase
const nextEvent = {
  title: "Winter Night Meet",
  date: "Saturday, Dec 21",
  time: "7:00 PM",
  location: "South Denver",
  status: "ON" as const,
  spotsLeft: 12,
  totalSpots: 50,
};

const thisWeekEvents = [
  { id: 1, title: "Cars & Coffee", date: "Sat 21", type: "Meet" },
  { id: 2, title: "Mountain Run", date: "Sun 22", type: "Cruise" },
];

const sponsors = [
  { name: "Elite Wraps", category: "Wrap Shop" },
  { name: "Denver Detail Co", category: "Detailing" },
  { name: "Apex Alignment", category: "Performance" },
  { name: "Mile High Tint", category: "Tint & PPF" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-spades-black via-spades-dark to-spades-black" />

        {/* Subtle spade pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20">
            <SpadeIcon className="w-32 h-32" />
          </div>
          <div className="absolute bottom-40 right-32">
            <SpadeIcon className="w-24 h-24" />
          </div>
          <div className="absolute top-1/2 left-1/4">
            <SpadeIcon className="w-16 h-16" />
          </div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <SpadeIcon className="w-20 h-20 text-white spade-glow" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            SPADES
            <span className="block text-white/60">PERFORMANCE</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/60 mb-2">
            Denver Performance Culture. Organized.
          </p>
          <p className="text-white/40 mb-12 max-w-xl mx-auto">
            Exclusive meets. Verified members. The Colorado performance scene done right.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join" className="btn-primary text-lg">
              Join Spades
            </Link>
            <Link href="/events" className="btn-secondary text-lg">
              View Events
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Next Event Card Section */}
      <section className="py-20 px-4 bg-spades-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Next Event Card */}
            <div className="card bg-gradient-to-br from-spades-gray to-spades-dark border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">
                  Next Event
                </h2>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                    nextEvent.status === "ON"
                      ? "status-on"
                      : nextEvent.status === "MOVED"
                      ? "status-moved"
                      : "status-canceled"
                  }`}
                >
                  {nextEvent.status}
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-4">{nextEvent.title}</h3>
              <div className="space-y-2 text-white/70 mb-6">
                <p className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {nextEvent.date} at {nextEvent.time}
                </p>
                <p className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {nextEvent.location}
                </p>
              </div>
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/50">Spots remaining</span>
                  <span className="font-semibold">
                    {nextEvent.spotsLeft}/{nextEvent.totalSpots}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{
                      width: `${
                        ((nextEvent.totalSpots - nextEvent.spotsLeft) /
                          nextEvent.totalSpots) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <Link
                href="/events"
                className="btn-primary w-full text-center block"
              >
                RSVP Now
              </Link>
            </div>

            {/* This Week Mini Calendar */}
            <div className="card">
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-6">
                This Week
              </h2>
              <div className="space-y-4">
                {thisWeekEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-sm text-white/50">{event.date}</p>
                    </div>
                    <span className="text-xs px-3 py-1 bg-white/10 rounded-full">
                      {event.type}
                    </span>
                  </Link>
                ))}
                {thisWeekEvents.length === 0 && (
                  <p className="text-white/50 text-center py-8">
                    No events this week
                  </p>
                )}
              </div>
              <Link
                href="/events"
                className="mt-6 block text-center text-sm text-white/50 hover:text-white transition-colors"
              >
                View Full Calendar →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-20 px-4 bg-spades-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Verified members get the drops, the perks, and the respect.
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Join Spades to RSVP to exclusive events, access the members-only marketplace,
              and become part of Denver&apos;s premier car community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Tier */}
            <div className="card text-center">
              <h3 className="text-xl font-bold mb-2">Public</h3>
              <p className="text-3xl font-bold mb-4">Free</p>
              <ul className="text-left space-y-3 mb-8 text-white/70">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Browse public events
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  View media gallery
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  See sponsor deals
                </li>
              </ul>
              <Link href="/join" className="btn-secondary w-full block">
                Browse Free
              </Link>
            </div>

            {/* Member Tier */}
            <div className="card text-center border-white/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-black text-xs font-bold rounded-full">
                POPULAR
              </div>
              <h3 className="text-xl font-bold mb-2">Member</h3>
              <p className="text-3xl font-bold mb-4">
                $10<span className="text-lg text-white/50">/mo</span>
              </p>
              <ul className="text-left space-y-3 mb-8 text-white/70">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  RSVP to events
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Add cars to Garage
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Post in Marketplace
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Earn badges
                </li>
              </ul>
              <Link href="/join" className="btn-primary w-full block">
                Join as Member
              </Link>
            </div>

            {/* Verified Tier */}
            <div className="card text-center bg-gradient-to-br from-spades-gray to-spades-dark">
              <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
                Verified
                <svg className="w-5 h-5 text-spades-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </h3>
              <p className="text-3xl font-bold mb-4">
                $25<span className="text-lg text-white/50">/mo</span>
              </p>
              <ul className="text-left space-y-3 mb-8 text-white/70">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-spades-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Early RSVP access
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-spades-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Private event locations
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-spades-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Exclusive sponsor codes
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-spades-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Route packs access
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-spades-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified seller badge
                </li>
              </ul>
              <Link href="/join" className="btn-primary w-full block bg-spades-gold hover:bg-yellow-600">
                Get Verified
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-20 px-4 bg-spades-dark border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">Partners & Sponsors</h2>
            <p className="text-white/50">
              Trusted shops supporting the Denver performance community
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.name}
                className="p-6 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-colors"
              >
                <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <SpadeIcon className="w-8 h-8 text-white/30" />
                </div>
                <h3 className="font-semibold mb-1">{sponsor.name}</h3>
                <p className="text-sm text-white/50">{sponsor.category}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/sponsors"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              View all sponsors & deals →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-spades-black">
        <div className="max-w-3xl mx-auto text-center">
          <SpadeIcon className="w-16 h-16 mx-auto mb-8 text-white/20" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to join Denver&apos;s elite?
          </h2>
          <p className="text-white/50 mb-8">
            Stop scrolling Instagram. Get verified. Get access.
          </p>
          <Link href="/join" className="btn-primary text-lg">
            Join Spades Performance
          </Link>
        </div>
      </section>
    </div>
  );
}
