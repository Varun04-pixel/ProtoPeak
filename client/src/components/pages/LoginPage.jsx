import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../api/client';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [startupName, setStartupName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          startupName: startupName.trim(),
          email: email.trim(),
          password,
        }),
      });

      if (typeof onLogin === 'function') {
        onLogin(data);
      }

      navigate('/discover');
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="space-y-1.5 border-b border-white/10 pb-5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            Startup Sign In
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Verify your existing startup account to publish or post updates.
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
              Startup Name <span className="text-slate-500 font-normal">(Optional check)</span>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-indigo-950/70 border border-indigo-400/30"
          >
            {loading ? 'Checking Account...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 pt-2 border-t border-white/10">
          Need a startup account?{' '}
          <Link
            to="/signup"
            className="text-indigo-300 hover:text-indigo-200 font-semibold transition"
          >
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
}