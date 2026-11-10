import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const STARTUPS = [
  {
    id: 1,
    name: 'QueryGuard',
    tagline: 'Automated vulnerability detection for enterprise web apps.',
    description: 'QueryGuard uses real-time static code analysis and dynamic payload inspection to automatically detect SQL injection and database vulnerabilities during local CI/CD pipelines.',
    sector: 'Cybersecurity',
    stage: 'Prototype',
    location: 'Bangalore, India',
    fundingNeed: '$10k - $25k',
    members: 3,
    verified: true,
  },
  {
    id: 2,
    name: 'EcoTrace',
    tagline: 'IoT supply chain carbon tracking for manufacturing SME teams.',
    description: 'Hardware sensors connected to microcontrollers that continuously record micro-emissions and aggregate telemetry data onto an accessible cloud dashboard.',
    sector: 'CleanTech',
    stage: 'Early Traction',
    location: 'Mumbai, India',
    fundingNeed: '$25k - $50k',
    members: 4,
    verified: false,
  },
  {
    id: 3,
    name: 'MediPulse AI',
    tagline: 'AI-assisted preliminary diagnostic triage for rural clinics.',
    description: 'Lightweight web tool allowing community healthcare workers to input symptoms and vital metrics to generate immediate referral guidance.',
    sector: 'HealthTech',
    stage: 'Idea',
    location: 'Hyderabad, India',
    fundingNeed: '< $10k',
    members: 2,
    verified: true,
  },
];

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');

  const filteredStartups = STARTUPS.filter((startup) => {
    const matchesSearch = startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          startup.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All' || startup.sector === selectedIndustry;
    const matchesStage = selectedStage === 'All' || startup.stage === selectedStage;
    return matchesSearch && matchesIndustry && matchesStage;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            Discover Startups
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Explore early-stage student prototypes, connect with teams, and foster innovation.
          </p>
        </div>

        {/* Glassmorphism Filters Box */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Search</label>
            <input
              type="text"
              placeholder="Search by name or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Industry</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="All" className="bg-slate-900">All Industries</option>
              <option value="Cybersecurity" className="bg-slate-900">Cybersecurity</option>
              <option value="CleanTech" className="bg-slate-900">CleanTech</option>
              <option value="HealthTech" className="bg-slate-900">HealthTech</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Stage</label>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="All" className="bg-slate-900">All Stages</option>
              <option value="Idea" className="bg-slate-900">Idea</option>
              <option value="Prototype" className="bg-slate-900">Prototype</option>
              <option value="Early Traction" className="bg-slate-900">Early Traction</option>
            </select>
          </div>
        </div>

        {/* Glassmorphism Startup Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStartups.map((startup) => (
            <div 
              key={startup.id} 
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:border-indigo-500/50 hover:bg-white/[0.07] transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-white">{startup.name}</h3>
                      {startup.verified && (
                        <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{startup.location}</p>
                  </div>
                  <span className="text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-1 rounded-full">
                    {startup.stage}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-indigo-200">{startup.tagline}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {startup.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[11px] font-medium bg-white/10 text-slate-200 px-3 py-1 rounded-lg border border-white/10">
                    {startup.sector}
                  </span>
                  <span className="text-[11px] font-medium bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded-lg border border-emerald-500/20">
                    Need: {startup.fundingNeed}
                  </span>
                  <span className="text-[11px] font-medium bg-purple-500/10 text-purple-300 px-3 py-1 rounded-lg border border-purple-500/20">
                    👥 {startup.members} members
                  </span>
                </div>
              </div>

              <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-indigo-900/50 border border-indigo-400/30">
                Interested / Contact
              </button>
            </div>
          ))}
        </div>

        {filteredStartups.length === 0 && (
          <div className="text-center py-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <p className="text-slate-400 text-sm">No startups found matching your filter criteria.</p>
          </div>
        )}

      </div>
    </div>
  );
}