import React from 'react';
import { Link } from 'react-router-dom';

export default function Msg({ startups = [], currentUser = null }) {
  const startupName = (
    currentUser?.startupName ||
    currentUser?.name ||
    'Startup Account'
  ).trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-2xl">
          💬
        </div>

        <div className="space-y-2">
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            {startupName} Inbox
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            Messages Portal Coming Soon
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Direct startup-to-startup and partner messaging is queued for the next milestone.
            {startups.length > 0
              ? ` ${startups.length} startups are currently listed in the ecosystem.`
              : ''}
          </p>
        </div>

        <div className="bg-slate-950/60 border border-white/10 rounded-xl p-4 text-left space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Planned Capabilities
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5">
            <li>• Thread conversations tied to verified startup accounts</li>
            <li>• Share prototype links, hiring roles, and pilot updates</li>
            <li>• Unread counters and real-time message sync</li>
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Link
            to="/feed"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl border border-indigo-400/30 shadow-lg shadow-indigo-950/60 transition"
          >
            Go to Feed
          </Link>
          <Link
            to="/discover"
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold rounded-xl border border-white/10 transition"
          >
            Explore Startups
          </Link>
        </div>
      </div>
    </div>
  );
}