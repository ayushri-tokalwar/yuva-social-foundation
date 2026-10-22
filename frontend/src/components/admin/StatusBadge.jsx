import React from 'react';

const STATUS_CONFIGS = {
  // Volunteers & General
  pending: { label: 'Pending Review', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  under_review: { label: 'Under Review', bg: 'bg-sky-500/10 text-sky-500 border-sky-500/20' },
  approved: { label: 'Approved', bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  rejected: { label: 'Rejected', bg: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
  active: { label: 'Active', bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  contacted: { label: 'Contacted', bg: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
  archived: { label: 'Archived', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },

  // Donations
  received: { label: 'Confirmed', bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  receipt_issued: { label: 'Receipt Issued', bg: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  completed: { label: 'Completed', bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  closed: { label: 'Closed', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  cancelled: { label: 'Cancelled', bg: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },

  // Messages
  unread: { label: 'New / Unread', bg: 'bg-red-500/10 text-red-500 border-red-500/20 font-bold' },
  read: { label: 'Read', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  in_progress: { label: 'In Progress', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  replied: { label: 'Resolved / Replied', bg: 'bg-teal-500/10 text-teal-500 border-teal-500/20' },

  // Campaigns
  upcoming: { label: 'Upcoming', bg: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
};

export default function StatusBadge({ status, customLabel }) {
  const normalized = (status || '').toLowerCase().trim();
  const config = STATUS_CONFIGS[normalized] || {
    label: customLabel || status || 'Unknown',
    bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {customLabel || config.label}
    </span>
  );
}
