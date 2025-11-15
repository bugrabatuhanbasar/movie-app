'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/categories', label: 'Kategoriler' },
    { href: '/search', label: 'Arama' },
    { href: '/watchlist', label: 'İzleme Listem' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/50 shadow-lg'
          : 'bg-gradient-to-b from-black/80 via-black/50 to-transparent backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            href="/"
            className="text-2xl md:text-3xl font-bold relative group"
          >
            <span className="relative z-10 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent group-hover:from-red-500 group-hover:via-orange-500 group-hover:to-red-400 transition-all drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              My Movies
            </span>
            <span className="absolute inset-0 blur-xl bg-gradient-to-r from-red-600 to-orange-500 opacity-20 group-hover:opacity-30 transition-opacity" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-semibold transition-all ${
                  pathname === link.href
                    ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                    : 'text-zinc-300 hover:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {pathname === link.href && (
                  <span className="absolute -bottom-[26px] left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-full shadow-lg shadow-red-600/50" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
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

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  pathname === link.href
                    ? 'bg-red-600 text-white'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
