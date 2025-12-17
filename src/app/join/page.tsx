import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

export default function JoinPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <SpadeIcon className="w-16 h-16 mx-auto mb-4 text-white" />
          <h1 className="text-3xl font-bold">Join Spades</h1>
          <p className="text-white/60 mt-2">
            Denver Performance Culture. Organized.
          </p>
        </div>

        {/* Membership Options */}
        <div className="space-y-4 mb-8">
          {/* Member Tier */}
          <div className="card cursor-pointer hover:border-white/30 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg">Member</h3>
                <p className="text-2xl font-bold mt-1">
                  $10<span className="text-sm text-white/50">/month</span>
                </p>
              </div>
              <input
                type="radio"
                name="tier"
                className="w-5 h-5 mt-1"
                defaultChecked
              />
            </div>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                RSVP to all events
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Add cars to Garage
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Post in Marketplace
              </li>
            </ul>
          </div>

          {/* Verified Tier */}
          <div className="card cursor-pointer hover:border-spades-gold/50 transition-colors border-spades-gold/30 bg-gradient-to-br from-spades-gray to-spades-dark">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  Verified
                  <svg className="w-5 h-5 text-spades-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </h3>
                <p className="text-2xl font-bold mt-1">
                  $25<span className="text-sm text-white/50">/month</span>
                </p>
              </div>
              <input type="radio" name="tier" className="w-5 h-5 mt-1" />
            </div>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-spades-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Everything in Member
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-spades-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Early RSVP access
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-spades-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Private event locations
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-spades-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Exclusive sponsor codes
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-spades-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Route packs access
              </li>
            </ul>
          </div>
        </div>

        {/* Sign Up Form */}
        <div className="card">
          <h2 className="font-bold text-lg mb-4">Create Account</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Email</label>
              <input
                type="email"
                className="w-full bg-spades-dark border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Username</label>
              <input
                type="text"
                className="w-full bg-spades-dark border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="your_username"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Password</label>
              <input
                type="password"
                className="w-full bg-spades-dark border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full btn-primary py-3"
            >
              Continue to Payment
            </button>
          </form>
        </div>

        {/* Already have account */}
        <p className="text-center text-white/50 mt-6">
          Already a member?{" "}
          <Link href="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>

        {/* Terms */}
        <p className="text-center text-white/30 text-xs mt-4">
          By joining, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-white/50">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/rules" className="underline hover:text-white/50">
            Code of Conduct
          </Link>
        </p>
      </div>
    </div>
  );
}
