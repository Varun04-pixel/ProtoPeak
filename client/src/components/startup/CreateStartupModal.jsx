import React, { useState, useEffect } from 'react';

const EMPTY_MEMBER = { name: '', roleTitle: '', isLead: false };

export default function CreateStartupModal({
  isOpen,
  onClose,
  onCreateStartup,
  onCreate,
  currentUser = null,
}) {
  const defaultName = currentUser?.startupName || '';
  const defaultLocation = currentUser?.institution || 'Bengaluru, India';

  const [name, setName] = useState(defaultName);
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [sector, setSector] = useState('Cybersecurity');
  const [stage, setStage] = useState('Prototype');
  const [location, setLocation] = useState(defaultLocation);
  const [fundingNeed, setFundingNeed] = useState('$10k - $25k');
  const [members, setMembers] = useState([
    { name: defaultName, roleTitle: 'Team Lead', isLead: true },
  ]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const accountStartup = currentUser?.startupName || '';
      const accountInstitution = currentUser?.institution || 'Bengaluru, India';
      setName(accountStartup);
      setLocation(accountInstitution);
      setMembers((prev) =>
        prev.length === 1 && !prev[0].name
          ? [{ name: accountStartup, roleTitle: 'Team Lead', isLead: true }]
          : prev
      );
      setError('');
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const submitHandler = onCreateStartup || onCreate;

  const handleMemberChange = (index, field, value) => {
    setMembers((prev) =>
      prev.map((m, i) => {
        if (i !== index) return m;
        if (field === 'isLead') {
          return { ...m, isLead: Boolean(value) };
        }
        return { ...m, [field]: value };
      })
    );
  };

  const handleSetLead = (index) => {
    setMembers((prev) =>
      prev.map((m, i) => ({
        ...m,
        isLead: i === index,
      }))
    );
  };

  const handleAddMember = () => {
    setMembers((prev) => [...prev, { ...EMPTY_MEMBER }]);
  };

  const handleRemoveMember = (index) => {
    if (members.length <= 1) return;
    setMembers((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (!next.some((m) => m.isLead) && next.length > 0) {
        next[0] = { ...next[0], isLead: true };
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError('');

    const finalStartupName = (name || currentUser?.startupName || '').trim();
    if (!finalStartupName || !tagline.trim() || !description.trim()) {
      setError('Please enter a startup name, tagline, and summary.');
      return;
    }

    const cleanedMembers = members
      .map((m, idx) => ({
        name: (m.name || (idx === 0 ? finalStartupName : '')).trim(),
        roleTitle: m.roleTitle.trim() || (idx === 0 ? 'Team Lead' : 'Builder'),
        isLead: Boolean(m.isLead),
      }))
      .filter((m) => m.name.length > 0);

    if (cleanedMembers.length === 0) {
      setError('Please add at least one team member.');
      return;
    }

    if (!cleanedMembers.some((m) => m.isLead)) {
      cleanedMembers[0].isLead = true;
    }

    const createdStartup = {
      name: finalStartupName,
      tagline: tagline.trim(),
      description: description.trim(),
      sector,
      stage,
      location:
        (location && location.trim()) ||
        (currentUser?.institution && currentUser.institution.trim()) ||
        'Bengaluru, India',
      fundingNeed: fundingNeed.trim() || '< $10k',
      verified: false,
      members: cleanedMembers,
    };

    setSubmitting(true);
    try {
      if (typeof submitHandler === 'function') {
        await submitHandler(createdStartup);
      }

      setName(currentUser?.startupName || '');
      setTagline('');
      setDescription('');
      setSector('Cybersecurity');
      setStage('Prototype');
      setLocation(currentUser?.institution || 'Bengaluru, India');
      setFundingNeed('$10k - $25k');
      setMembers([
        {
          name: currentUser?.startupName || '',
          roleTitle: 'Team Lead',
          isLead: true,
        },
      ]);
      onClose();
    } catch (err) {
      setError(err?.message || 'Could not publish startup.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Create Startup Profile</h3>
            <p className="text-xs text-slate-400">
              Publish your single startup profile and assemble your team roster
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Startup Name
              </label>
              <input
                type="text"
                placeholder="e.g., PacketSentinel"
                value={name}
                readOnly={Boolean(currentUser?.startupName)}
                onChange={(e) => setName(e.target.value)}
                className={`w-full bg-slate-950/70 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 ${
                  currentUser?.startupName ? 'opacity-80 cursor-not-allowed' : ''
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Institution / Location
              </label>
              <input
                type="text"
                placeholder="Institution or Bengaluru, India"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              One-Line Pitch / Tagline
            </label>
            <input
              type="text"
              placeholder="What problem do you solve and for whom?"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Prototype & Solution Overview
            </label>
            <textarea
              rows="3"
              placeholder="Describe how your prototype works, current traction, or pilot goals..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Industry
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="CleanTech">CleanTech</option>
                <option value="HealthTech">HealthTech</option>
                <option value="EdTech">EdTech</option>
                <option value="FinTech">FinTech</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Idea">Idea</option>
                <option value="Prototype">Prototype</option>
                <option value="Early Traction">Early Traction</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Funding / Support Ask
              </label>
              <input
                type="text"
                placeholder="$10k - $25k"
                value={fundingNeed}
                onChange={(e) => setFundingNeed(e.target.value)}
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Dynamic Team Members Roster */}
          <div className="space-y-2.5 pt-2 border-t border-white/10">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Team Members ({members.length})
              </label>
              <button
                type="button"
                onClick={handleAddMember}
                className="text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-400/30 px-3 py-1 rounded-lg transition"
              >
                + Add Teammate
              </button>
            </div>

            <div className="space-y-2.5">
              {members.map((member, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-white/5 border border-white/10 rounded-xl p-2.5"
                >
                  <input
                    type="text"
                    placeholder="Member name"
                    value={member.name}
                    onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                    className="sm:col-span-5 bg-slate-950/70 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g., Backend, ML)"
                    value={member.roleTitle}
                    onChange={(e) => handleMemberChange(idx, 'roleTitle', e.target.value)}
                    className="sm:col-span-4 bg-slate-950/70 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleSetLead(idx)}
                    className={`sm:col-span-2 py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition ${
                      member.isLead
                        ? 'bg-indigo-600/80 text-white border-indigo-400/40'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {member.isLead ? '★ Lead' : 'Set Lead'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(idx)}
                    disabled={members.length <= 1}
                    className="sm:col-span-1 py-1.5 text-xs text-slate-400 hover:text-rose-400 disabled:opacity-30 transition text-center"
                    aria-label="Remove member"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Footer */}
          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl text-xs transition border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold rounded-xl text-xs transition shadow-lg shadow-indigo-900/40 border border-indigo-400/30"
            >
              {submitting ? 'Publishing...' : 'Publish Startup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}