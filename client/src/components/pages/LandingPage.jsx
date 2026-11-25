import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TYPEWRITER_WORDS = ['Build', 'Showcase', 'Discover', 'Connect', 'Scale'];

const PLATFORM_STATS = [
  { value: '3+', label: 'Student Prototypes', detail: 'Across 3 high-growth sectors' },
  { value: '100%', label: 'Proof-of-Work Feed', detail: 'Real milestones & build logs' },
  { value: '3 Roles', label: 'Unified Ecosystem', detail: 'Startups, Investors & Companies' },
  { value: '0 Fees', label: 'Direct Discovery', detail: 'Zero middlemen on connections' },
];

const ROLE_CARDS = [
  {
    icon: '🚀',
    badge: 'Organization Account',
    title: 'For Student Startups',
    accent: 'from-blue-500/20 to-indigo-500/20 border-indigo-400/30',
    description:
      'Launch a dedicated startup profile with your full team roster, publish milestone updates on the community feed, and showcase working prototypes to real backers.',
    perks: [
      'Dedicated 1-to-1 verified startup showcase page',
      'Publish milestones, hiring calls & prototype updates',
      'Direct inbox inquiries from investors & companies',
    ],
    ctaLabel: 'Launch Your Startup',
    ctaLink: '/signup',
  },
  {
    icon: '💼',
    badge: 'Individual Account',
    title: 'For Investors',
    accent: 'from-purple-500/20 to-indigo-500/20 border-purple-400/30',
    description:
      'Spot high-conviction student builders before demo day. Filter prototypes by sector, stage, and funding ask, and engage directly with founders on their progress updates.',
    perks: [
      'Filter startups by stage, sector & capital ask',
      'Like and comment directly on founder build updates',
      'Express interest & start direct conversations',
    ],
    ctaLabel: 'Join as Investor',
    ctaLink: '/signup',
  },
  {
    icon: '🏢',
    badge: 'Organization Account',
    title: 'For Companies',
    accent: 'from-emerald-500/20 to-teal-500/20 border-emerald-400/30',
    description:
      'Partner with emerging engineering teams for enterprise pilots, sponsor campus R&D, and recruit proven builders who ship real products.',
    perks: [
      'Source technical teams for real-world pilot programs',
      'Engage with prototype updates on the live feed',
      'Connect directly with multi-disciplinary student leads',
    ],
    ctaLabel: 'Partner as Company',
    ctaLink: '/signup',
  },
];

const FEATURED_SECTORS = [
  {
    name: 'Cybersecurity',
    icon: '🛡️',
    tagline: 'Static analysis, zero-trust tooling & threat detection',
    stage: 'Prototype & Early Traction',
  },
  {
    name: 'CleanTech',
    icon: '🌱',
    tagline: 'Campus IoT telemetry, microgrids & sustainability',
    stage: 'Prototype',
  },
  {
    name: 'HealthTech',
    icon: '🩺',
    tagline: 'Offline clinical triage & accessible diagnostics',
    stage: 'Early Traction',
  },
  {
    name: 'EdTech',
    icon: '📚',
    tagline: 'Adaptive learning engines & peer skill labs',
    stage: 'Idea & Prototype',
  },
  {
    name: 'FinTech',
    icon: '💳',
    tagline: 'Micro-credit rails & student treasury tools',
    stage: 'Prototype',
  },
];

const CORE_LOOP_STEPS = [
  { step: '01', title: 'Build', desc: 'Assemble your team & ship an MVP' },
  { step: '02', title: 'Launch', desc: 'Create your startup profile on Discover' },
  { step: '03', title: 'Update', desc: 'Share milestones & progress on Feed' },
  { step: '04', title: 'Engage', desc: 'Investors & companies like and reply' },
  { step: '05', title: 'Connect', desc: 'Open direct founder conversations' },
  { step: '06', title: 'Scale', desc: 'Secure pilots, mentorship & seed backing' },
];

const FAQS = [
  {
    q: 'Who can launch a startup on ProtoPeak?',
    a: 'Only registered Startup accounts can launch a startup profile (one dedicated startup per account) and publish build updates to the Community Feed. This keeps Discover focused purely on authentic student-led ventures.',
  },
  {
    q: 'What can Investor and Company accounts do?',
    a: 'Individual Investors and partner Companies can browse all startups on Discover, inspect full team rosters, like and comment on posts in the Community Feed, and initiate direct messages with startup teams.',
  },
  {
    q: 'Is ProtoPeak free for student teams?',
    a: 'Yes. Creating a startup account, showcasing your prototype, and posting progress updates is completely free.',
  },
  {
    q: 'How do teams prove their progress?',
    a: 'Instead of static pitch decks alone, startups post continuous build logs—milestones, prototype updates, and hiring needs—creating a transparent timeline investors and companies can verify.',
  },
];

export default function LandingPage() {
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Typewriter effect
  useEffect(() => {
    const fullText = TYPEWRITER_WORDS[wordIndex];
    const handleTyping = () => {
      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText === fullText) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % TYPEWRITER_WORDS.length);
        }
      }
    };
    const timer = setTimeout(handleTyping, isDeleting ? 60 : 120);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex]);

  // Particles.js Initialization
  useEffect(() => {
    if (window.particlesJS) {
      window.particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 1000 } },
          color: { value: '#6366f1' },
          shape: { type: 'circle' },
          opacity: { value: 0.4, random: false },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#6366f1',
            opacity: 0.3,
            width: 1,
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            out_mode: 'out',
          },
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: false },
            onclick: { enable: false },
            resize: true,
          },
        },
        retina_detect: true,
      });
    }
  }, []);

  return (
    <div className="bg-slate-950 text-white overflow-x-hidden">
      {/* Full 100vh Hero Section covering the entire screen height (Unchanged) */}
      <section className="relative min-h-screen w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex flex-col justify-center items-center text-center px-4 text-white overflow-hidden bg-slate-900 shadow-2xl">
        {/* Particles Background Container taking 100% full height */}
        <div id="particles-js" className="absolute inset-0 z-0 pointer-events-none"></div>

        {/* Content Container centered vertically */}
        <div className="relative z-10 space-y-6 max-w-4xl mx-auto px-4 pt-16">
          {/* Typewriter Badge */}
          <div className="inline-flex items-center space-x-2px-5 py-2 backdrop-blur-md">
            <span className="text-4xl font-bold text-indigo-200 tracking-wide min-w-[90px] text-left">
              {currentText}
              <span className="animate-pulse border-r-2 border-indigo-400 ml-0.5">&nbsp;</span>
            </span>
          </div>
          <br />

          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
              Connecting Student Innovators & Early-Stage Investors
            </span>
          </div>
          <br />

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            From Student Prototypes to <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Real-World Opportunities
            </span>
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            ProtoPeak gives student startup teams a platform to showcase prototypes and publish progress, while enabling investors and companies to discover raw, promising talent early.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/discover"
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/50 text-sm"
            >
              Explore Startups
            </Link>
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 text-white border border-white/30 font-semibold rounded-xl hover:bg-white/20 transition backdrop-blur-md text-sm"
            >
              Post Your Prototype
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 space-y-24 py-20 px-4 sm:px-6 lg:px-8">
        {/* 1. Ecosystem Metrics Strip */}
        <section className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {PLATFORM_STATS.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center sm:text-left space-y-1.5 hover:border-indigo-400/30 transition"
              >
                <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm font-bold text-white">{stat.label}</p>
                <p className="text-xs text-slate-400">{stat.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Role-Based Value Proposition (Startups, Investors, Companies) */}
        <section className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Built for Three Core Roles
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              One Ecosystem, Clear Purpose
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Whether you are shipping code from a dorm room, backing early founders, or scouting enterprise pilots, ProtoPeak gives you purpose-built tools.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {ROLE_CARDS.map((card, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${card.accent} backdrop-blur-md border rounded-2xl p-7 shadow-xl flex flex-col justify-between space-y-6 hover:translate-y-[-2px] transition`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950/70 border border-white/10 flex items-center justify-center text-2xl">
                      {card.icon}
                    </div>
                    <span className="text-[11px] font-semibold bg-white/10 text-slate-200 border border-white/15 px-3 py-1 rounded-full">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white">{card.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {card.description}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-white/10">
                    {card.perks.map((perk, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-200">
                        <span className="text-indigo-400 font-bold mt-0.5">✓</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={card.ctaLink}
                  className="w-full text-center py-2.5 bg-slate-950/80 hover:bg-indigo-600 text-white font-semibold rounded-xl text-xs transition border border-white/15 hover:border-indigo-400/50"
                >
                  {card.ctaLabel} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 3. How ProtoPeak Works / 6-Step Core Loop */}
        <section className="bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              End-to-End Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              How ProtoPeak Works
            </h2>
            <p className="text-slate-400 text-sm">
              A frictionless discovery and direct communication bridge between builders and backers.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {CORE_LOOP_STEPS.map((item, index) => (
              <div
                key={index}
                className="bg-slate-950/60 border border-white/10 hover:border-indigo-400/40 p-5 rounded-2xl space-y-2 transition"
              >
                <span className="inline-block text-xs font-mono font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-400/25 px-2.5 py-0.5 rounded-full">
                  {item.step}
                </span>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Explore Active Sectors + Live Feed Preview */}
        <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Sectors */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                High-Signal Verticals
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Explore Prototypes by Sector
              </h2>
              <p className="text-sm text-slate-400">
                Browse student-led engineering prototypes across five core technology domains.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURED_SECTORS.map((sector, idx) => (
                <Link
                  key={idx}
                  to="/discover"
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/40 rounded-2xl p-5 flex items-start gap-4 transition group"
                >
                  <div className="w-11 h-11 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-center text-xl shrink-0">
                    {sector.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                        {sector.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {sector.tagline}
                    </p>
                    <span className="inline-block text-[10px] font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                      {sector.stage}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Live Community Feed Snapshot */}
          <div className="lg:col-span-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Live Build Feed</h3>
                <p className="text-xs text-slate-400">Real-time traction from campus teams</p>
              </div>
              <Link
                to="/feed"
                className="text-xs font-semibold text-indigo-300 hover:text-white transition"
              >
                Open Feed →
              </Link>
            </div>

            <div className="space-y-3.5">
              <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🛡️</span>
                    <span className="text-xs font-bold text-white">QueryGuard</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full">
                    Milestone
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Completed static analysis engine integration—flagging SQL injection vectors in under 120ms during automated local testing.
                </p>
              </div>

              <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🌱</span>
                    <span className="text-xs font-bold text-white">EcoTrace</span>
                  </div>
                  <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full">
                    Hiring
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Looking for a teammate experienced with MQTT brokers and time-series dashboards to scale our campus sensor fleet.
                </p>
              </div>
            </div>

            <Link
              to="/feed"
              className="block w-full text-center py-2.5 bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold rounded-xl text-xs transition border border-indigo-400/30"
            >
              Join the Conversation on Feed
            </Link>
          </div>
        </section>

        {/* 5. FAQ Accordion */}
        <section className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Questions & Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition"
                  >
                    <span className="text-sm font-bold text-white">{item.q}</span>
                    <span className="text-indigo-300 text-lg font-bold shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. Final Call to Action Banner */}
        <section className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 rounded-3xl p-8 sm:p-12 text-center text-white max-w-7xl mx-auto space-y-6 shadow-2xl shadow-indigo-950/70 border border-indigo-400/30">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to showcase or back early innovation?
          </h2>
          <p className="text-indigo-100 max-w-xl mx-auto text-sm sm:text-base">
            Join ProtoPeak as a student startup, individual investor, or partner company and turn raw prototypes into real-world impact.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/discover"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition shadow-md text-sm"
            >
              Start Exploring Now
            </Link>
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-950/30 hover:bg-slate-950/50 text-white border border-white/30 font-semibold rounded-xl transition text-sm"
            >
              Create Free Account
            </Link>
          </div>
        </section>

        {/* 7. Footer */}
        <footer className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-base font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              ProtoPeak
            </span>
            <span>• Student Prototypes to Real-World Opportunities</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link to="/discover" className="hover:text-white transition">
              Discover
            </Link>
            <Link to="/feed" className="hover:text-white transition">
              Feed
            </Link>
            <Link to="/messages" className="hover:text-white transition">
              Messages
            </Link>
            <Link to="/login" className="hover:text-white transition">
              Log In
            </Link>
            <Link to="/signup" className="hover:text-white transition">
              Sign Up
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}