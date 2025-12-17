import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

// Sample event data - will be replaced with Supabase
const events = [
  {
    id: "1",
    title: "Winter Night Meet",
    date: "2024-12-21",
    time: "7:00 PM",
    location: "South Denver",
    type: "Meet",
    status: "ON" as const,
    spotsTotal: 50,
    spotsTaken: 38,
    dropTime: null,
    isPrivate: false,
    description: "End of year night meet. Show off those winter builds.",
  },
  {
    id: "2",
    title: "New Year's Cruise",
    date: "2025-01-01",
    time: "2:00 PM",
    location: "Red Rocks Area",
    type: "Cruise",
    status: "ON" as const,
    spotsTotal: 30,
    spotsTaken: 0,
    dropTime: "2024-12-27T18:00:00",
    isPrivate: false,
    description: "First cruise of 2025. Scenic mountain route.",
  },
  {
    id: "3",
    title: "Private Track Day",
    date: "2025-01-15",
    time: "9:00 AM",
    location: "Colorado Motorsports Park",
    type: "Track",
    status: "ON" as const,
    spotsTotal: 20,
    spotsTaken: 20,
    dropTime: null,
    isPrivate: true,
    description: "Verified members only. Full track access.",
  },
];

const upcomingDrops = [
  {
    eventTitle: "New Year's Cruise",
    dropTime: "Dec 27, 6:00 PM",
    spots: 30,
  },
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case "ON":
      return "status-on";
    case "MOVED":
      return "status-moved";
    case "CANCELED":
      return "status-canceled";
    default:
      return "bg-white/10 text-white/70";
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case "Meet":
      return "bg-blue-500/20 text-blue-400";
    case "Cruise":
      return "bg-purple-500/20 text-purple-400";
    case "Track":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-white/10 text-white/70";
  }
}

export default function EventsPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 px-4 bg-spades-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Events</h1>
          <p className="text-white/60 max-w-2xl">
            RSVP to exclusive meets, cruises, and track days. Limited spots.
            Drop times for premium events.
          </p>
        </div>
      </section>

      {/* Upcoming Drops Alert */}
      {upcomingDrops.length > 0 && (
        <section className="py-6 px-4 bg-spades-gold/10 border-b border-spades-gold/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-spades-gold">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">Upcoming Drop:</span>
              </div>
              {upcomingDrops.map((drop) => (
                <span key={drop.eventTitle} className="text-white/80">
                  <strong>{drop.eventTitle}</strong> opens {drop.dropTime} ({drop.spots} spots)
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Events Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="card flex flex-col md:flex-row md:items-center gap-6"
              >
                {/* Date Badge */}
                <div className="flex-shrink-0 w-20 h-20 bg-white/5 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="text-sm text-white/50">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </span>
                </div>

                {/* Event Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-xl font-bold">{event.title}</h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded ${getStatusColor(
                        event.status
                      )}`}
                    >
                      {event.status}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded ${getTypeColor(
                        event.type
                      )}`}
                    >
                      {event.type}
                    </span>
                    {event.isPrivate && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded bg-spades-gold/20 text-spades-gold flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Verified Only
                      </span>
                    )}
                  </div>
                  <p className="text-white/60 mb-3">{event.description}</p>
                  <div className="flex items-center gap-6 text-sm text-white/50">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
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
                      {event.location}
                    </span>
                  </div>
                </div>

                {/* RSVP Section */}
                <div className="flex-shrink-0 w-full md:w-48">
                  {event.dropTime && new Date(event.dropTime) > new Date() ? (
                    <div className="text-center">
                      <p className="text-xs text-white/50 mb-2">Drop opens</p>
                      <p className="font-semibold text-spades-gold mb-3">
                        {new Date(event.dropTime).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                      <button
                        disabled
                        className="w-full px-4 py-2 bg-white/10 text-white/50 rounded-lg cursor-not-allowed"
                      >
                        Notify Me
                      </button>
                    </div>
                  ) : event.spotsTaken >= event.spotsTotal ? (
                    <div className="text-center">
                      <p className="text-xs text-white/50 mb-2">
                        {event.spotsTotal}/{event.spotsTotal} spots
                      </p>
                      <div className="h-2 bg-white/10 rounded-full mb-3">
                        <div className="h-full bg-red-500 rounded-full w-full" />
                      </div>
                      <button className="w-full px-4 py-2 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-colors">
                        Join Waitlist
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-xs text-white/50 mb-2">
                        {event.spotsTaken}/{event.spotsTotal} spots
                      </p>
                      <div className="h-2 bg-white/10 rounded-full mb-3 overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{
                            width: `${(event.spotsTaken / event.spotsTotal) * 100}%`,
                          }}
                        />
                      </div>
                      <Link
                        href={`/events/${event.id}`}
                        className="block w-full px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors text-center"
                      >
                        RSVP
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-4 bg-spades-dark border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">How Drops Work</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Watch the Clock</h3>
              <p className="text-white/50 text-sm">
                Premium events have drop times. RSVP opens exactly at the scheduled time.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Verified First</h3>
              <p className="text-white/50 text-sm">
                Verified members get early access. Regular members join after.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Show Up</h3>
              <p className="text-white/50 text-sm">
                No-shows lose priority. Consistent attendance unlocks better perks.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
