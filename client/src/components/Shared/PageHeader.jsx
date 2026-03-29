import React from 'react';

const PageHeader = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-secondary tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted mt-1 font-medium">
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
