import Link from "next/link";
import { SpadeIcon } from "@/components/ui/spade-icon";

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <SpadeIcon className="w-16 h-16 mx-auto mb-4 text-white" />
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-white/60 mt-2">
            Sign in to your Spades account
          </p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">
                Email or Username
              </label>
              <input
                type="text"
                className="w-full bg-spades-dark border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm text-white/70">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-white/50 hover:text-white"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                className="w-full bg-spades-dark border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="rounded border-white/20"
              />
              <label htmlFor="remember" className="text-sm text-white/70">
                Remember me
              </label>
            </div>
            <button type="submit" className="w-full btn-primary py-3">
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-3 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>

        {/* Create Account */}
        <p className="text-center text-white/50 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/join" className="text-white hover:underline">
            Join Spades
          </Link>
        </p>
      </div>
    </div>
  );
}
