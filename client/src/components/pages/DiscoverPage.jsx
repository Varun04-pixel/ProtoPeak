import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_STARTUPS } from '../../data/startupsData';
import TeamMembersPreview from '../startup/TeamMembersPreview';
import CreateStartupModal from '../startup/CreateStartupModal';

const SECTORS = ['All', 'Cybersecurity', 'CleanTech', 'HealthTech', 'EdTech', 'FinTech'];
const STAGES = ['All', 'Idea', 'Prototype', 'Early Traction'];

export default function DiscoverPage({
  startups = INITIAL_STARTUPS,
  loading = false,
  currentUser = null,
  onCreateStartup,
  onExpressInterest,
}) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState(null);

  // Check whether the logged-in user already owns a startup
  const userStartup = useMemo(() => {
    if (!currentUser) return null;
    const uid = String(currentUser.id || currentUser._id || '');
    return (
      startups.find(
        (s) =>
          (s.createdBy && String(s.createdBy) === uid) ||
          s.members?.some((m) => m.user && String(m.user) === uid)
      ) || null
    );
  }, [startups, currentUser]);

  const filteredStartups = useMemo(() => {
    return startups.filter((startup) => {
      const matchesSector =
        selectedSector === 'All' || startup.sector === selectedSector;
      const matchesStage =
        selectedStage === 'All' || startup.stage === selectedStage;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        startup.name?.toLowerCase().includes(q) ||
        startup.tagline?.toLowerCase().includes(q) ||
        startup.description?.toLowerCase().includes(q) ||
        startup.members?.some((m) => m.name?.toLowerCase().includes(q));

      return matchesSector && matchesStage && matchesSearch;
    });
  }, [startups, searchQuery, selectedSector, selectedStage]);

  const handleOpenCreateModal = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (userStartup) return;
    setIsCreateOpen(true);
  };

  const handleAddStartup = async (newStartup) => {
    if (!currentUser || userStartup) return;
    if (typeof onCreateStartup === 'function') {
      await onCreateStartup(newStartup);
    }
    setIsCreateOpen(false);
  };

  const handleContactTeam = (startup) => {
    setSelectedStartup(null);
    if (typeof onExpressInterest === 'function') {
      onExpressInterest(startup);
    } else {
      navigate('/messages');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header + Launch CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              Discover Student Prototypes
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
              Explore early-stage student startups, inspect full multi-member teams, and connect directly with builders.
            </p>
          </div>

          {userStartup ? (
            <div className="self-start sm:self-auto px-4 py-2.5 bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0">
              <span>✓</span>
              <span>Launched: {userStartup.name} (1/1)</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="self-start sm:self-auto px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-lg shadow-indigo-950/70 border border-indigo-400/30 flex items-center gap-2 shrink-0"
            >
              <span className="text-base leading-none">+</span>
              <span>{currentUser ? 'Launch Startup' : 'Log In to Launch Startup'}</span>
            </button>
          )}
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by startup name, tagline, or team member..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />

            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage === 'All' ? 'All Stages' : stage}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {SECTORS.map((sector) => {
              const active = selectedSector === sector;
              return (
                <button
                  key={sector}
                  type="button"
                  onClick={() => setSelectedSector(sector)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-400/50 shadow-lg shadow-indigo-950/60'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {sector}
                </button>
              );
            })}
          </div>
        </div>

        {/* Startups Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            Loading startups...
          </div>
        ) : filteredStartups.length === 0 ? (
          <div className="text-center py-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl space-y-3">
            <p className="text-slate-300 font-semibold">No startups match your filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedSector('All');
                setSelectedStage('All');
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-xs font-semibold rounded-xl border border-white/10 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((startup) => (
              <div
                key={startup.id}
                onClick={() => setSelectedStartup(startup)}
                className="cursor-pointer bg-white/5 backdrop-blur-md border border-white/10 hover:border-indigo-400/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5 transition"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full">
                      {startup.sector}
                    </span>
                    <div className="flex items-center gap-2">
                      {startup.verified && (
                        <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                      <span className="text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                        {startup.stage}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-xl font-bold text-white hover:text-indigo-300 transition">
                      {startup.name}
                    </h2>
                    <p className="text-xs font-medium text-indigo-200/90 leading-snug">
                      {startup.tagline}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                    {startup.description}
                  </p>

                  <TeamMembersPreview members={startup.members || []} />
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>📍 {startup.location}</span>
                    <span className="text-slate-200 font-semibold">
                      Ask: {startup.fundingNeed}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStartup(startup);
                      }}
                      className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 font-semibold rounded-xl text-xs transition border border-white/10"
                    >
                      View Full Details
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContactTeam(startup);
                      }}
                      className="flex-1 py-2.5 bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold rounded-xl text-xs transition border border-indigo-400/40"
                    >
                      Contact Team
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Startup Details Modal (Scrollable with Full Description & All Members) */}
      {selectedStartup && (
        <div
          onClick={() => setSelectedStartup(null)}
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 pt-20 sm:pt-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-white/15 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 my-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full">
                    {selectedStartup.sector}
                  </span>
                  <span className="text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    {selectedStartup.stage}
                  </span>
                  {selectedStartup.verified && (
                    <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-black text-white">
                  {selectedStartup.name}
                </h2>
                <p className="text-xs sm:text-sm font-medium text-indigo-200/90">
                  {selectedStartup.tagline}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStartup(null)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition shrink-0"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Full Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Full Description
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {selectedStartup.description}
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Location
                </p>
                <p className="text-xs sm:text-sm font-semibold text-white mt-1">
                  📍 {selectedStartup.location || 'Campus'}
                </p>
              </div>

              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Funding Ask
                </p>
                <p className="text-xs sm:text-sm font-semibold text-emerald-300 mt-1">
                  {selectedStartup.fundingNeed || 'Bootstrapped'}
                </p>
              </div>

              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Stage
                </p>
                <p className="text-xs sm:text-sm font-semibold text-indigo-300 mt-1">
                  {selectedStartup.stage}
                </p>
              </div>
            </div>

            {/* Complete Team Members List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                👥 Team Members ({selectedStartup.members?.length || 0})
              </h3>

              {Array.isArray(selectedStartup.members) && selectedStartup.members.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedStartup.members.map((member, idx) => (
                    <div
                      key={member.userId || member.user || `${member.name}-${idx}`}
                      className="bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-white truncate">
                          {member.name}
                        </p>
                        {member.roleTitle && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {member.roleTitle}
                          </p>
                        )}
                      </div>

                      {member.isLead && (
                        <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-0.5 rounded-full shrink-0">
                          Lead
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No team members listed yet.</p>
              )}
            </div>

            {/* Optional Links if present on Startup */}
            {(selectedStartup.website || selectedStartup.demoUrl || selectedStartup.repoUrl) && (
              <div className="flex flex-wrap gap-2.5">
                {selectedStartup.website && (
                  <a
                    href={selectedStartup.website}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold text-indigo-200 rounded-xl border border-white/10 transition"
                  >
                    Website ↗
                  </a>
                )}
                {selectedStartup.demoUrl && (
                  <a
                    href={selectedStartup.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold text-indigo-200 rounded-xl border border-white/10 transition"
                  >
                    Live Demo ↗
                  </a>
                )}
                {selectedStartup.repoUrl && (
                  <a
                    href={selectedStartup.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold text-indigo-200 rounded-xl border border-white/10 transition"
                  >
                    Repository ↗
                  </a>
                )}
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedStartup(null)}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl text-xs transition border border-white/10"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleContactTeam(selectedStartup)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition border border-indigo-400/40 shadow-lg shadow-indigo-950/60"
              >
                Interested / Contact Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Startup Modal (Authenticated Users Without a Startup Only) */}
      {isCreateOpen && currentUser && !userStartup && (
        <CreateStartupModal
          isOpen={isCreateOpen}
          currentUser={currentUser}
          onClose={() => setIsCreateOpen(false)}
          onCreate={handleAddStartup}
          onCreateStartup={handleAddStartup}
          onSubmit={handleAddStartup}
        />
      )}
    </div>
  );
}