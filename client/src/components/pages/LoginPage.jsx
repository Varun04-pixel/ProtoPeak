import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../api/client';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: cleanEmail,
          password,
        }),
      });

      if (data?.token) {
        try {
          localStorage.setItem('protopeak_token', data.token);
        } catch {
          // ignore storage errors
        }
      }

      if (data?.user) {
        try {
          localStorage.setItem('protopeak_user', JSON.stringify(data.user));
        } catch {
          // ignore storage errors
        }
      }

      if (typeof onLogin === 'function') {
        onLogin(data);
      }

      const role = String(data?.user?.role || 'startup').trim().toLowerCase();
      navigate(role === 'startup' ? '/discover' : '/feed');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Log in to your Startup, Investor, or Company account.
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="login-email"
              className="block text-[11px] font-bold uppercase tracking-wider text-slate-400"
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="login-password"
              className="block text-[11px] font-bold uppercase tracking-wider text-slate-400"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-indigo-950/70 border border-indigo-400/30"
          >
            {submitting ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div className="pt-2 border-t border-white/10 text-center space-y-2">
          <p className="text-xs text-slate-400">
            Don&apos;t have an account yet?{' '}
            <Link to="/signup" className="text-indigo-300 hover:text-indigo-200 font-semibold">
              Sign Up
            </Link>
          </p>
          <p className="text-[11px] text-slate-500">
            Supports Startup Organizations, Individual Investors, and Partner Companies.
          </p>
        </div>
      </div>
    </div>
  );
}