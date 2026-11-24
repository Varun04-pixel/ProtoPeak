import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const startupDisplayName = (
    user?.startupName ||
    user?.name ||
    'Startup'
  ).trim();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-900/60 backdrop-blur-xs border-b border-white/10 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
                ProtoPeak
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-slate-300 hover:text-white font-medium text-sm transition">
              Home
            </Link>
            <Link to="/feed" className="text-slate-300 hover:text-white font-medium text-sm transition">
              Feed
            </Link>
            <Link to="/discover" className="text-slate-300 hover:text-white font-medium text-sm transition">
              Discover
            </Link>
            <Link to="/messages" className="text-slate-300 hover:text-white font-medium text-sm transition">
              Messages
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs">
                  <span className="text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-0.5 rounded-full">
                    {startupDisplayName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3.5 py-2 bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-200 border border-white/10 hover:border-rose-400/30 rounded-xl text-xs font-semibold transition"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl border border-indigo-400/30 shadow-lg shadow-indigo-950/60 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white focus:outline-none p-2 rounded-md"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown with Glassmorphism */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/90 backdrop-blur-lg border-b border-white/10 px-4 pt-2 pb-4 space-y-3">
          <Link to="/" className="block text-slate-300 hover:text-white font-medium py-1">
            Home
          </Link>
          <Link to="/feed" className="block text-slate-300 hover:text-white font-medium py-1">
            Feed
          </Link>
          <Link to="/discover" className="block text-slate-300 hover:text-white font-medium py-1">
            Discover
          </Link>
          <Link to="/messages" className="block text-slate-300 hover:text-white font-medium py-1">
            Messages
          </Link>

          <div className="pt-3 border-t border-white/10 flex flex-col space-y-2">
            {user ? (
              <>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-slate-400">Startup:</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    {startupDisplayName}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full text-center text-sm font-medium text-red-400 py-2 border border-red-500/20 rounded-lg bg-red-500/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="w-full text-center text-sm font-medium text-slate-300 py-2 border border-white/10 rounded-lg bg-white/5">
                  Log in
                </Link>
                <Link to="/signup" className="w-full text-center text-sm font-medium bg-indigo-600 text-white py-2 rounded-lg shadow-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}