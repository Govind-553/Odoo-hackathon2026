import React from 'react';
import { PlusCircle } from 'lucide-react';

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 animate-in fade-in duration-500">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
        {Icon ? (
          <Icon className="w-8 h-8 text-muted" />
        ) : (
          <PlusCircle className="w-8 h-8 text-muted" />
        )}
      </div>
      <h3 className="text-xl font-bold text-secondary mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-muted mb-8 max-w-sm font-medium">{description}</p>
      {actionLabel && (
        <button 
          onClick={onAction}
          className="btn px-8"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
