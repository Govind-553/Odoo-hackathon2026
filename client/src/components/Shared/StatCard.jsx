import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

const colorConfigs = {
  primary: {
    gradient: 'from-primary to-blue-600',
    bg: 'bg-primary/10',
    text: 'text-primary',
    glow: 'shadow-primary/20',
  },
  success: {
    gradient: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    glow: 'shadow-emerald-200',
  },
  warning: {
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    glow: 'shadow-amber-200',
  },
  danger: {
    gradient: 'from-red-500 to-rose-600',
    bg: 'bg-red-50',
    text: 'text-red-600',
    glow: 'shadow-red-200',
  },
  accent: {
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    glow: 'shadow-violet-200',
  },
};

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary', subtitle }) => {
  const config = colorConfigs[color] || colorConfigs.primary;

  return (
    <div className="card flex flex-col justify-between h-full hover:shadow-md transition-all group hover:-translate-y-0.5">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <p className="text-[11px] font-bold text-muted uppercase tracking-widest mb-2">{title}</p>
          <h3 className="text-2xl font-black text-secondary tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-muted mt-1 font-medium">{subtitle}</p>}
        </div>
        <div className={clsx(
          'w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0',
          'bg-gradient-to-br transition-transform group-hover:scale-110',
          config.gradient,
          config.glow,
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 pt-4 border-t border-slate-50">
          {trend === 'up' ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-red-500" />
          )}
          <span className={clsx('text-xs font-bold', trend === 'up' ? 'text-emerald-600' : 'text-red-600')}>
            {trendValue}%
          </span>
          <span className="text-[10px] text-muted font-medium uppercase tracking-wider">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
