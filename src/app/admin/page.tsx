"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem('spades_admin_auth');
    if (auth === 'true') {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        });
        if (!res.ok) {
          throw new Error('Wrong password');
        }
        sessionStorage.setItem('spades_admin_auth', 'true');
        setIsAuthenticated(true);
        router.push('/admin/dashboard');
      } catch (err) {
        setError('Wrong password');
        setPassword('');
      }
    })();
  };

  return (
    <div className="min-h-screen bg-spades-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 border border-white/10 rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-spades-gold" fill="currentColor">
              <path d="M12 2C12 2 4 10 4 14C4 17 6.5 19 9 19C9 19 8 21 12 21C16 21 15 19 15 19C17.5 19 20 17 20 14C20 10 12 2 12 2Z"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-1">Admin Access</h1>
          <p className="text-white/30 text-sm">Spades Performance</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-spades-gold/50 transition-colors"
              autoFocus
            />
          </div>
          
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-spades-gold text-black font-bold uppercase tracking-wider text-sm rounded-lg hover:bg-spades-gold/90 transition-colors"
          >
            Enter
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-8 font-mono">
          Press Shift+Ctrl+A anywhere to access
        </p>
      </div>
    </div>
  );
}

