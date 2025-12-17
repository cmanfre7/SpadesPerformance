import Link from "next/link";
import Image from "next/image";
import { SpadeIcon } from "@/components/ui/spade-icon";

// Collage images with varying widths for film-strip effect
const collageImages = [
  { id: 1, width: "w-32 md:w-40" },
  { id: 2, width: "w-28 md:w-36" },
  { id: 3, width: "w-24 md:w-32" },
  { id: 4, width: "w-32 md:w-44" },
  { id: 5, width: "w-28 md:w-36" },
  { id: 6, width: "w-36 md:w-48" },
  { id: 7, width: "w-24 md:w-32" },
  { id: 8, width: "w-32 md:w-40" },
  { id: 9, width: "w-28 md:w-36" },
  { id: 10, width: "w-36 md:w-44" },
  { id: 11, width: "w-24 md:w-32" },
  { id: 12, width: "w-32 md:w-40" },
  { id: 13, width: "w-28 md:w-36" },
  { id: 14, width: "w-36 md:w-48" },
  { id: 15, width: "w-24 md:w-32" },
  { id: 16, width: "w-32 md:w-40" },
  { id: 17, width: "w-28 md:w-36" },
  { id: 18, width: "w-32 md:w-44" },
];

const recentEvents = [
  { id: 1, date: "12.21.25", type: "NIGHT MEET", location: "DENVER", status: "PRIVATE" },
  { id: 2, date: "12.22.25", type: "PRIVATE", location: "TBA", status: "INVITE ONLY" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero with Background */}
      <section className="h-[60vh] md:h-[70vh] flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/collage/Banner.png"
            alt=""
            fill
            className="object-cover object-center grayscale"
            style={{ opacity: 0.3 }}
            priority
            unoptimized
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-spades-black via-spades-black/40 to-transparent" />
        </div>

        {/* Text */}
        <div className="text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2">
            SPADES PERFORMANCE
          </h1>
          <p className="text-white/40 text-lg tracking-widest">
            Colorado's Fastest.
          </p>
        </div>
      </section>

      {/* Film Strip Collage */}
      <section className="w-full overflow-hidden">
        <div className="flex gap-1 h-[50vh] md:h-[70vh] animate-scroll-slow">
          {collageImages.map((img) => (
            <div
              key={img.id}
              className={`${img.width} h-full flex-shrink-0 relative overflow-hidden`}
            >
              <Image
                src={`/images/collage/${img.id}.jpg`}
                alt=""
                fill
                className="object-cover"
                quality={100}
                unoptimized
              />
              {/* Subtle dark overlay on edges */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {collageImages.map((img) => (
            <div
              key={`dup-${img.id}`}
              className={`${img.width} h-full flex-shrink-0 relative overflow-hidden`}
            >
              <Image
                src={`/images/collage/${img.id}.jpg`}
                alt=""
                fill
                className="object-cover"
                quality={100}
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
            </div>
          ))}
        </div>
      </section>

      {/* Event Log */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs text-white/30 font-mono mb-8 tracking-widest">UPCOMING</h2>
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <Link
                key={event.id}
                href="/events"
                className="block py-4 border-b border-white/5 hover:border-white/10 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 font-mono text-sm">
                    <span className="text-white/40">{event.date}</span>
                    <span className="text-white/20">/</span>
                    <span className="text-white/60">{event.type}</span>
                    <span className="text-white/20">/</span>
                    <span className="text-white/40">{event.location}</span>
                  </div>
                  <span className="text-xs text-white/20 group-hover:text-white/40 transition-colors">
                    {event.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/events"
            className="block text-center mt-8 text-sm text-white/30 hover:text-white/50 transition-colors font-mono"
          >
            All events
          </Link>
        </div>
      </section>

      {/* Access Tiers - Minimal */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xs text-white/30 font-mono mb-12 tracking-widest text-center">ACCESS</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Nobody */}
            <div className="text-center p-6 bg-white/[0.02] border border-white/5 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-white/50">Nobody</h3>
              <p className="text-xs text-white/30 mb-6">Public access</p>
              <ul className="text-sm text-white/40 space-y-2">
                <li>View events</li>
                <li>Browse media</li>
                <li>See partners</li>
              </ul>
            </div>

            {/* Member */}
            <div className="text-center p-6 bg-white/[0.03] border border-white/10 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Member</h3>
              <p className="text-xs text-white/30 mb-6">Invite only</p>
              <ul className="text-sm text-white/50 space-y-2">
                <li>RSVP to meets</li>
                <li>Post builds</li>
                <li>Marketplace access</li>
              </ul>
            </div>

            {/* Verified */}
            <div className="text-center p-6 bg-spades-gold/[0.03] border border-spades-gold/20 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-spades-gold/80">Verified</h3>
              <p className="text-xs text-spades-gold/40 mb-6">Earned</p>
              <ul className="text-sm text-white/50 space-y-2">
                <li>Private locations</li>
                <li>Early access</li>
                <li>Partner codes</li>
              </ul>
            </div>
          </div>
          <p className="text-center text-xs text-white/20 mt-12 font-mono">
            Show up 3+ times to verify.
          </p>
        </div>
      </section>

      {/* Minimal Footer */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-xl mx-auto text-center">
          <SpadeIcon className="w-8 h-8 mx-auto mb-6 text-white/10" />
          <p className="text-xs text-white/20 font-mono">Invite only</p>
        </div>
      </section>
    </div>
  );
}
