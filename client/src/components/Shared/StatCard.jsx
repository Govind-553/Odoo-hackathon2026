import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
  const colorConfigs = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    accent: 'bg-accent/10 text-accent',
  };

  return (
    <div className="card flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-muted mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-secondary tracking-tight">{value}</h3>
        </div>
        <div className={clsx("p-3 rounded-xl", colorConfigs[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-1.5 mt-auto pt-4 border-t border-slate-50">
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-success" />
          ) : (
            <TrendingDown className="w-4 h-4 text-danger" />
          )
          }
          <span className={clsx("text-xs font-bold", trend === 'up' ? 'text-success' : 'text-danger')}>
            {trendValue}%
          </span>
          <span className="text-[10px] text-muted font-medium uppercase tracking-wider">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
