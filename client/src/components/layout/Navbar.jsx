import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper badge color based on user role
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'student': return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case 'investor': return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      case 'company': return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30';
      case 'admin': return 'bg-red-500/20 text-red-300 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

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
              {/* <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider backdrop-blur-sm">
                MVP
              </span> */}
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
              <div className="flex items-center space-x-4 pl-4 border-l border-white/10">
                {/* User Role Badge */}
                <span className={`text-xs px-2.5 py-1 rounded-md font-semibold uppercase tracking-wider border ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </span>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="text-sm font-medium text-slate-300 hover:text-red-400 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 pl-4 border-l border-white/10">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white transition"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-medium bg-indigo-600/90 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition shadow-md shadow-indigo-900/40 border border-indigo-400/30 backdrop-blur-sm"
                >
                  Get Started
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
                  <span className="text-sm text-slate-400">Role:</span>
                  <span className={`text-xs px-2 py-0.5 rounded-md font-semibold uppercase border ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
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