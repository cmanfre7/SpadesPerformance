import Link from "next/link";

// Sample event data - will be replaced with Supabase
const events = [
  {
    id: "1",
    date: "12.21.25",
    type: "NIGHT MEET",
    location: "DENVER",
    time: "22:00",
    access: "PRIVATE",
    spots: { taken: 38, total: 50 },
  },
  {
    id: "2",
    date: "01.01.26",
    type: "PRIVATE",
    location: "TBA",
    time: "23:00",
    access: "INVITE ONLY",
    spots: null, // Drop not open yet
    dropDate: "12.27.25",
  },
  {
    id: "3",
    date: "01.15.26",
    type: "WAREHOUSE",
    location: "PRIVATE LOT",
    time: "21:00",
    access: "VERIFIED",
    spots: { taken: 40, total: 40 },
  },
];

const pastEvents = [
  { id: "p1", date: "12.14.25", type: "NIGHT MEET", location: "DENVER", attendance: 47 },
  { id: "p2", date: "12.07.25", type: "WAREHOUSE", location: "COMMERCE CITY", attendance: 35 },
  { id: "p3", date: "11.30.25", type: "NIGHT MEET", location: "DENVER", attendance: 52 },
];

export default function EventsPage() {
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

                    {/* Spots or Drop Info */}
                    {event.spots ? (
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-white/30 font-mono">
                          {event.spots.taken}/{event.spots.total}
                        </span>
                        {event.spots.taken < event.spots.total ? (
                          <Link
                            href={`/events/${event.id}`}
                            className="text-xs text-white/50 hover:text-white transition-colors font-mono"
                          >
                            RSVP
                          </Link>
                        ) : (
                          <span className="text-xs text-white/20 font-mono">FULL</span>
                        )}
                      </div>
                    ) : event.dropDate ? (
                      <span className="text-xs text-white/30 font-mono">
                        DROP {event.dropDate}
                      </span>
                    ) : null}
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
                  <span className="text-white/10">/</span>
                  <span className="text-white/20">{event.attendance} attended</span>
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
