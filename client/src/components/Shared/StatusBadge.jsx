import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const StatusBadge = ({ status }) => {
  const configs = {
    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    in_review: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const style = configs[status] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span className={twMerge(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border transition-colors",
      style
    )}>
      <span className={clsx("w-1.5 h-1.5 rounded-full mr-2 bg-current")} />
      {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
    </span>
  );
};

export default StatusBadge;
