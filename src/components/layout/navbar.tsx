"use client";

import Link from "next/link";
import { useState } from "react";
import { SpadeIcon } from "@/components/ui/spade-icon";

const navLinks = [
  { href: "/events", label: "Events" },
  { href: "/members", label: "Members" },
  { href: "/garage", label: "Garage" },
  { href: "/media", label: "Media" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/sponsors", label: "Sponsors" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-spades-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <SpadeIcon className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
            <span className="font-bold text-lg tracking-tight">
              SPADES<span className="text-white/60">PERFORMANCE</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/join"
              className="px-4 py-2 text-sm bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Join Spades
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white/70 hover:text-white"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/10 mt-2 pt-4 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="px-4 py-3 text-white/70 hover:text-white text-center rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/join"
                  className="px-4 py-3 bg-white text-black font-semibold text-center rounded-lg"
                >
                  Join Spades
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
