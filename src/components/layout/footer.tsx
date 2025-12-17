import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xs text-white/30 font-mono hover:text-white/50 transition-colors">
              SPADES
            </Link>
            <span className="text-white/10">|</span>
            <span className="text-xs text-white/20 font-mono">Denver</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link href="/rules" className="text-xs text-white/20 hover:text-white/40 transition-colors font-mono">
              Rules
            </Link>
            <a
              href="https://www.instagram.com/spades_performance/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/20 hover:text-white/40 transition-colors font-mono"
            >
              IG
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-white/10 font-mono">
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
