import React from 'react';

const PageHeader = ({ title, subtitle, action, badge }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
      <div>
        {badge && (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest mb-3 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {badge}
          </span>
        )}
        <h1 className="text-2xl md:text-3xl font-black text-secondary tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted mt-1.5 font-medium leading-relaxed max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0 animate-in fade-in slide-in-from-right-4 duration-300">
          {action}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
