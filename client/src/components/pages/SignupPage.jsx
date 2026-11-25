import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../api/client';

const ROLE_OPTIONS = [
  {
    value: 'startup',
    label: 'Startup',
    subtitle: 'Organization & prototype builder',
    nameLabel: 'Startup Name',
    namePlaceholder: 'e.g. QueryGuard',
    orgLabel: 'Institution / Campus',
    orgPlaceholder: 'e.g. BMSCE',
  },
  {
    value: 'investor',
    label: 'Investor',
    subtitle: 'Individual angel or fund backer',
    nameLabel: 'Full Name',
    namePlaceholder: 'e.g. Rohan Kulkarni',
    orgLabel: 'Fund / Affiliation',
    orgPlaceholder: 'e.g. Independent Angel / Seed Fund',
  },
  {
    value: 'company',
    label: 'Company',
    subtitle: 'Organization & industry partner',
    nameLabel: 'Company Name',
    namePlaceholder: 'e.g. NovaCloud Systems',
    orgLabel: 'Organization / Hub',
    orgPlaceholder: 'e.g. Bengaluru Enterprise Hub',
  },
];

export default function SignupPage({ onSignup }) {
  const navigate = useNavigate();

  const [role, setRole] = useState('startup');
  const [accountName, setAccountName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const activeRoleConfig =
    ROLE_OPTIONS.find((item) => item.value === role) || ROLE_OPTIONS[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const cleanName = accountName.trim();
    const cleanEmail = email.trim();
    const cleanOrg = institution.trim();

    if (!cleanName || !cleanEmail || !cleanOrg || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const payload = {
        role,
        name: cleanName,
        startupName: role === 'startup' ? cleanName : '',
        email: cleanEmail,
        password,
        institution: cleanOrg,
        organization: cleanOrg,
      };

      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (typeof onSignup === 'function') {
        onSignup(data);
      }

      navigate(role === 'startup' ? '/discover' : '/feed');
    } catch (err) {
      setError(err.message || 'Could not create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            Create ProtoPeak Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Join as a startup organization, an individual investor, or a partner company.
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selector */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Account Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ROLE_OPTIONS.map((option) => {
                const isSelected = role === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setRole(option.value);
                      setError('');
                    }}
                    className={`p-3 rounded-xl border text-left transition ${
                      isSelected
                        ? 'bg-indigo-600/25 border-indigo-400 text-white shadow-lg shadow-indigo-950/60'
                        : 'bg-slate-950/60 border-white/10 text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-bold">{option.label}</p>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                      {option.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Startup / Full / Company Name */}
          <div className="space-y-1">
            <label
              htmlFor="accountName"
              className="block text-[11px] font-bold uppercase tracking-wider text-slate-400"
            >
              {activeRoleConfig.nameLabel}
            </label>
            <input
              id="accountName"
              type="text"
              placeholder={activeRoleConfig.namePlaceholder}
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-[11px] font-bold uppercase tracking-wider text-slate-400"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Institution / Affiliation / Organization */}
          <div className="space-y-1">
            <label
              htmlFor="institution"
              className="block text-[11px] font-bold uppercase tracking-wider text-slate-400"
            >
              {activeRoleConfig.orgLabel}
            </label>
            <input
              id="institution"
              type="text"
              placeholder={activeRoleConfig.orgPlaceholder}
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-400"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-400"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-indigo-950/70 border border-indigo-400/30"
          >
            {submitting ? 'Creating Account...' : `Sign Up as ${activeRoleConfig.label}`}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-300 hover:text-indigo-200 font-semibold">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}