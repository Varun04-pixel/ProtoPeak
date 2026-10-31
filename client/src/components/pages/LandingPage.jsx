import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TYPEWRITER_WORDS = ['Build.', 'Showcase.', 'Discover.', 'Connect.', 'Scale.'];

export default function LandingPage() {
    const [wordIndex, setWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

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
                        width: 1
                    },
                    move: { enable: true, speed: 2, direction: 'none', random: false, out_mode: 'out' }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { enable: false },
                        onclick: { enable: false },
                        resize: true
                    }
                },
                retina_detect: true
            });
        }
    }, []);

    return (
        <div className="space-y-16 pb-16 overflow-x-hidden">
            {/* Full 100vh Hero Section covering the entire screen height */}
            <section className="relative min-h-screen w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex flex-col justify-center items-center text-center px-4 text-white overflow-hidden bg-slate-900 shadow-2xl">

                {/* Particles Background Container taking 100% full height */}
                <div id="particles-js" className="absolute inset-0 z-0 pointer-events-none"></div>

                {/* Content Container centered vertically */}
                <div className="relative z-10 space-y-6 max-w-4xl mx-auto px-4 pt-16">

                    
                    
                    {/* Typewriter Badge */}
                    <div className="inline-flex items-center space-x-2px-5 py-2 backdrop-blur-md">
                        {/* <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-400 animate-ping" /> */}
                        <span className="text-4xl font-bold text-indigo-200 tracking-wide min-w-[90px] text-left">
                            {currentText}
                            <span className="animate-pulse border-r-2 border-indigo-400 ml-0.5">&nbsp;</span>
                        </span>
                    </div>
                    <br/>

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

            {/* Value Proposition Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl font-bold">
                        🎓
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">For Student Teams</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Create a dedicated startup profile, publish build updates, showcase working prototypes, and attract direct industry backing or mentorship.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-4">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl font-bold">
                        💼
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">For Investors</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Discover student startups filtered by industry, stage, and funding requirement. Track proof of progress and express direct interest.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl font-bold">
                        🏢
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">For Companies</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Source emerging technical talent, partner with student builders for pilots, and foster early innovation right out of universities.
                    </p>
                </div>
            </section>
            {/* How it Works / Core Loop Banner */}
            <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
                    <h2 className="text-2xl sm:text-3xl font-extrabold">How ProtoPeak Works</h2>
                    <p className="text-slate-400 text-sm">
                        A frictionless discovery and direct communication bridge between creators and supporters.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                    {[
                        { step: '01', title: 'Build', desc: 'Develop prototype' },
                        { step: '02', title: 'Post', desc: 'Share updates' },
                        { step: '03', title: 'Discover', desc: 'Filtered search' },
                        { step: '04', title: 'Interest', desc: 'Express support' },
                        { step: '05', title: 'Message', desc: 'Direct chat' },
                        { step: '06', title: 'Opportunity', desc: 'Pilots & funding' },
                    ].map((item, index) => (
                        <div key={index} className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-1">
                            <span className="text-xs font-mono font-bold text-indigo-400">{item.step}</span>
                            <h4 className="text-sm font-bold text-white">{item.title}</h4>
                            <p className="text-[11px] text-slate-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action Banner */}
            <section className="bg-indigo-600 rounded-3xl p-8 sm:p-12 text-center text-white max-w-6xl mx-auto space-y-6">
                <h2 className="text-3xl font-bold">Ready to showcase or support innovation?</h2>
                <p className="text-indigo-100 max-w-xl mx-auto text-sm">
                    Join ProtoPeak today to help student startups take their early-stage ideas into the real world.
                </p>
                <div>
                    <Link
                        to="/discover"
                        className="inline-block px-8 py-3.5 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition shadow-md text-sm"
                    >
                        Start Exploring Now
                    </Link>
                </div>
            </section>
        </div>
    );
}