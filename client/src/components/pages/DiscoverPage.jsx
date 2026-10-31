import React, { useState } from 'react';

// Mock sample startup data matching ProtoPeak brief fields
const SAMPLE_STARTUPS = [
  {
    id: 1,
    name: 'QueryGuard',
    tagline: 'Automated vulnerability detection for enterprise web apps.',
    industry: 'Cybersecurity',
    stage: 'Prototype',
    fundingNeed: '$10k - $25k',
    location: 'Bangalore, India',
    teamSize: 3,
    verified: true,
    description: 'QueryGuard uses real-time static code analysis and dynamic payload inspection to automatically detect SQL injection and database vulnerabilities during local CI/CD pipelines.',
  },
  {
    id: 2,
    name: 'EcoTrace',
    tagline: 'IoT supply chain carbon tracking for manufacturing SME teams.',
    industry: 'CleanTech',
    stage: 'Early Traction',
    fundingNeed: '$25k - $50k',
    location: 'Mumbai, India',
    teamSize: 4,
    verified: false,
    description: 'Hardware sensors connected to microcontrollers that continuously record micro-emissions and aggregate telemetry data onto an accessible cloud dashboard.',
  },
  {
    id: 3,
    name: 'MediPulse AI',
    tagline: 'AI-assisted preliminary diagnostic triage for rural clinics.',
    industry: 'HealthTech',
    stage: 'Idea',
    fundingNeed: '< $10k',
    location: 'Hyderabad, India',
    teamSize: 2,
    verified: true,
    description: 'Lightweight web tool allowing community healthcare workers to input symptoms and vital metrics to generate immediate referral guidance.',
  },
];

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [interestedIds, setInterestedIds] = useState([]);

  // Toggle "Interested" action button
  const handleToggleInterest = (id) => {
    if (interestedIds.includes(id)) {
      setInterestedIds(interestedIds.filter((item) => item !== id));
    } else {
      setInterestedIds([...interestedIds, id]);
    }
  };

  // Filter logic
  const filteredStartups = SAMPLE_STARTUPS.filter((startup) => {
    const matchesSearch =
      startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry =
      selectedIndustry === 'All' || startup.industry === selectedIndustry;
    const matchesStage = selectedStage === 'All' || startup.stage === selectedStage;

    return matchesSearch && matchesIndustry && matchesStage;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Discover Startups</h1>
        <p className="text-gray-500 mt-1">
          Explore early-stage student prototypes, connect with teams, and foster innovation.
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Bar */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by startup name or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Industry Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Industry
          </label>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="All">All Industries</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="CleanTech">CleanTech</option>
            <option value="HealthTech">HealthTech</option>
            <option value="FinTech">FinTech</option>
          </select>
        </div>

        {/* Stage Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Stage
          </label>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="All">All Stages</option>
            <option value="Idea">Idea</option>
            <option value="Prototype">Prototype</option>
            <option value="Early Traction">Early Traction</option>
          </select>
        </div>
      </div>

      {/* Startup Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStartups.map((startup) => {
          const isInterested = interestedIds.includes(startup.id);

          return (
            <div
              key={startup.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Header info */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-gray-900">{startup.name}</h3>
                      {startup.verified && (
                        <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
                          Verified
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-gray-400">
                      {startup.location}
                    </span>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md">
                    {startup.stage}
                  </span>
                </div>

                <p className="text-sm font-medium text-indigo-600 mb-2">
                  {startup.tagline}
                </p>
                <p className="text-xs text-gray-600 line-clamp-3 mb-4">
                  {startup.description}
                </p>

                {/* Metadata Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-[11px] bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-medium">
                    {startup.industry}
                  </span>
                  <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-medium">
                    Need: {startup.fundingNeed}
                  </span>
                  <span className="text-[11px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium">
                    👥 {startup.teamSize} members
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggleInterest(startup.id)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition ${
                    isInterested
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isInterested ? '✓ Interest Sent' : 'Interested / Contact'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredStartups.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 font-medium">No startups found matching your filter criteria.</p>
        </div>
      )}
    </div>
  );
}



