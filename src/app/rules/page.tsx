import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

export default function RulesPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 px-4 bg-spades-dark border-b border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <SpadeIcon className="w-12 h-12 mx-auto mb-4 text-white/50" />
          <h1 className="text-4xl font-bold mb-4">Rules & Code of Conduct</h1>
          <p className="text-xl text-white/60">
            We keep it clean so we can keep doing it.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-invert max-w-none">
            {/* The Golden Rule */}
            <div className="card mb-8 border-spades-gold/30 bg-gradient-to-br from-spades-gray to-spades-dark">
              <h2 className="text-2xl font-bold text-spades-gold mb-4">
                The Golden Rule
              </h2>
              <p className="text-lg text-white/80">
                Don&apos;t do anything that gets the spot burned, the club shut down,
                or members in trouble. Everything else flows from this.
              </p>
            </div>

            {/* At Events */}
            <div className="card mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                  1
                </span>
                At Events
              </h2>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>
                    <strong className="text-white">Show up on time.</strong> If you RSVP,
                    be there. No-shows lose priority.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>
                    <strong className="text-white">No burnouts, revving, or reckless behavior</strong>{" "}
                    at meet locations. Save it for the track.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>
                    <strong className="text-white">Respect the property.</strong> Don&apos;t leave
                    trash, don&apos;t damage anything, don&apos;t block businesses.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>
                    <strong className="text-white">Leave when it&apos;s time.</strong> When organizers
                    say it&apos;s over, it&apos;s over.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>
                    <strong className="text-white">No alcohol or substances</strong> at events.
                    Zero tolerance.
                  </span>
                </li>
              </ul>
            </div>

            {/* On the Road */}
            <div className="card mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400">
                  2
                </span>
                On the Road
              </h2>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>
                    <strong className="text-white">Follow traffic laws</strong> during cruises.
                    Spades doesn&apos;t condone street racing.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>
                    <strong className="text-white">Stay together, don&apos;t race.</strong> Cruises
                    are scenic, not competitive.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>
                    <strong className="text-white">Pull over safely</strong> if you need to stop.
                    Don&apos;t hold up traffic or block roads.
                  </span>
                </li>
              </ul>
            </div>

            {/* Online */}
            <div className="card mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                  3
                </span>
                Online & Marketplace
              </h2>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>
                    <strong className="text-white">Be honest in listings.</strong> Accurate
                    descriptions, real photos, fair prices.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>
                    <strong className="text-white">No harassment or hate.</strong> Respect other
                    members regardless of their build or platform.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>
                    <strong className="text-white">No scamming.</strong> Instant ban, no
                    exceptions.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>
                    <strong className="text-white">No doxxing or sharing private info</strong>{" "}
                    about members or event locations.
                  </span>
                </li>
              </ul>
            </div>

            {/* Enforcement */}
            <div className="card mb-8 border-red-500/30">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">
                  !
                </span>
                Enforcement
              </h2>
              <div className="space-y-4 text-white/70">
                <p>
                  Breaking rules results in warnings, temporary bans, or permanent removal
                  depending on severity. Organizers have final say.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-yellow-500/10 rounded-lg">
                    <h4 className="font-semibold text-yellow-400 mb-1">Warning</h4>
                    <p className="text-sm">Minor first offenses</p>
                  </div>
                  <div className="p-4 bg-orange-500/10 rounded-lg">
                    <h4 className="font-semibold text-orange-400 mb-1">Temp Ban</h4>
                    <p className="text-sm">Repeat offenses, serious issues</p>
                  </div>
                  <div className="p-4 bg-red-500/10 rounded-lg">
                    <h4 className="font-semibold text-red-400 mb-1">Permanent Ban</h4>
                    <p className="text-sm">Scamming, harassment, illegal activity</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Report */}
            <div className="card text-center">
              <h2 className="text-xl font-bold mb-4">See Something? Say Something.</h2>
              <p className="text-white/60 mb-6">
                Report violations, scams, or unsafe behavior. We take it seriously.
              </p>
              <Link href="/contact" className="btn-primary">
                Report an Issue
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
