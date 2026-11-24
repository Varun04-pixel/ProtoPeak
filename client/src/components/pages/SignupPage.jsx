import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../api/client';

export default function SignupPage({ onSignup }) {
  const navigate = useNavigate();
  const [startupName, setStartupName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !startupName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !institution.trim()
    ) {
      setError('Please fill in startup name, email, password, and institution.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          startupName: startupName.trim(),
          email: email.trim(),
          password,
          institution: institution.trim(),
          role: 'startup',
        }),
      });

      if (typeof onSignup === 'function') {
        onSignup(data);
      }

      navigate('/discover');
    } catch (err) {
      setError(err.message || 'Could not create startup account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="space-y-1.5 border-b border-white/10 pb-5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            Create Startup Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Register your startup account to publish one prototype profile and share feed updates.
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Startup Name
            </label>
            <input
              type="text"
              placeholder="e.g., QueryGuard"
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              placeholder="team@yourstartup.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Institution
            </label>
            <input
              type="text"
              placeholder="e.g., B.M.S. College of Engineering"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-indigo-950/70 border border-indigo-400/30"
          >
            {loading ? 'Creating Startup Account...' : 'Create Startup Account'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 pt-2 border-t border-white/10">
          Already have a startup account?{' '}
          <Link
            to="/login"
            className="text-indigo-300 hover:text-indigo-200 font-semibold transition"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}