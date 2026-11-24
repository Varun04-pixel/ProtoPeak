import React from 'react';

export default function TeamMembersPreview({ members = [] }) {
  if (!members.length) return null;

  const visibleMembers = members.slice(0, 2);
  const remainingCount = members.length - visibleMembers.length;

  return (
    <div className="space-y-2 pt-2">
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-semibold text-purple-300">
          👥 {members.length} {members.length === 1 ? 'member' : 'members'}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {visibleMembers.map((member, idx) => (
          <span
            key={member.userId || `${member.name}-${idx}`}
            className="text-[11px] bg-white/5 text-slate-200 border border-white/10 px-2.5 py-1 rounded-lg"
          >
            <span className="font-semibold text-white">{member.name}</span>
            {member.roleTitle && (
              <span className="text-slate-400"> • {member.roleTitle}</span>
            )}
            {member.isLead && (
              <span className="ml-1 text-[10px] text-indigo-300">(Lead)</span>
            )}
          </span>
        ))}

        {remainingCount > 0 && (
          <span className="text-[11px] bg-indigo-500/15 text-indigo-300 border border-indigo-400/25 px-2.5 py-1 rounded-lg font-medium">
            +{remainingCount} more
          </span>
        )}
      </div>
    </div>
  );
}