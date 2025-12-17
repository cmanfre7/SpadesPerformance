import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-12">
      <div className="max-w-sm w-full">
        {/* Logo */}
        <div className="text-center mb-12">
          <SpadeIcon className="w-10 h-10 mx-auto mb-4 text-white/30" />
          <h1 className="text-xs text-white/30 font-mono tracking-widest">SIGN IN</h1>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div>
            <input
              type="email"
              className="w-full bg-spades-gray border border-white/5 rounded px-4 py-3 text-sm font-mono focus:outline-none focus:border-white/20 transition-colors placeholder:text-white/20"
              placeholder="Email"
            />
          </div>
          <div>
            <input
              type="password"
              className="w-full bg-spades-gray border border-white/5 rounded px-4 py-3 text-sm font-mono focus:outline-none focus:border-white/20 transition-colors placeholder:text-white/20"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white/10 hover:bg-white/20 text-white/70 text-sm font-mono py-3 rounded transition-colors"
          >
            Sign in
          </button>
        </form>

        {/* Links */}
        <div className="mt-8 text-center">
          <p className="text-xs text-white/20 font-mono">
            <Link href="/join" className="hover:text-white/40 transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
