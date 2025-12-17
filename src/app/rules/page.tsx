import Link from "next/link";

export default function RulesPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 px-4 border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xs text-white/30 font-mono tracking-widest mb-4">RULES</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Core */}
          <div className="mb-12">
            <p className="text-white/50 text-sm font-mono leading-relaxed">
              Don&apos;t burn the spot. Everything else follows from this.
            </p>
          </div>

          {/* Rules List */}
          <div className="space-y-8">
            {/* Events */}
            <div className="border-b border-white/5 pb-8">
              <h2 className="text-xs text-white/30 font-mono mb-4 tracking-widest">EVENTS</h2>
              <ul className="space-y-3 text-sm text-white/40 font-mono">
                <li>Show up if you RSVP</li>
                <li>No burnouts at meet locations</li>
                <li>Leave clean</li>
                <li>Leave when it&apos;s time</li>
                <li>No substances</li>
              </ul>
            </div>

            {/* Road */}
            <div className="border-b border-white/5 pb-8">
              <h2 className="text-xs text-white/30 font-mono mb-4 tracking-widest">ROAD</h2>
              <ul className="space-y-3 text-sm text-white/40 font-mono">
                <li>Follow traffic laws during cruises</li>
                <li>Stay together</li>
                <li>Pull over safely</li>
              </ul>
            </div>

            {/* Online */}
            <div className="border-b border-white/5 pb-8">
              <h2 className="text-xs text-white/30 font-mono mb-4 tracking-widest">ONLINE</h2>
              <ul className="space-y-3 text-sm text-white/40 font-mono">
                <li>Honest listings</li>
                <li>No harassment</li>
                <li>No scamming</li>
                <li>No doxxing</li>
              </ul>
            </div>

            {/* Enforcement */}
            <div>
              <h2 className="text-xs text-white/30 font-mono mb-4 tracking-widest">ENFORCEMENT</h2>
              <div className="flex gap-8 text-sm font-mono">
                <div>
                  <p className="text-white/30">Warning</p>
                  <p className="text-white/20 text-xs">Minor</p>
                </div>
                <div>
                  <p className="text-white/30">Temp ban</p>
                  <p className="text-white/20 text-xs">Repeat</p>
                </div>
                <div>
                  <p className="text-white/30">Permanent</p>
                  <p className="text-white/20 text-xs">Serious</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
