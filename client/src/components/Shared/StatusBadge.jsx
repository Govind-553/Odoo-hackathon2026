import React from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status, size = 'sm' }) => {
  const configs = {
    approved: {
      style: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      icon: CheckCircle2,
      label: 'Approved',
    },
    rejected: {
      style: 'bg-red-50 text-red-700 border-red-200',
      dot: 'bg-red-500',
      icon: XCircle,
      label: 'Rejected',
    },
    pending: {
      style: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      icon: Clock,
      label: 'Pending',
    },
    in_review: {
      style: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
      icon: Clock,
      label: 'In Review',
    },
  };

  const config = configs[status] || {
    style: 'bg-slate-50 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    icon: AlertCircle,
    label: status,
  };

  const Icon = config.icon;

  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 rounded-full border font-bold transition-all',
      config.style,
      size === 'sm' ? 'px-2.5 py-1 text-[10px] tracking-wide uppercase' : 'px-3 py-1.5 text-xs tracking-wide uppercase',
    )}>
      <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', config.dot,
        status === 'in_review' ? 'animate-pulse' : ''
      )} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
