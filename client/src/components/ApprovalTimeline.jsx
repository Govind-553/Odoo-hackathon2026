import React from 'react';
import { CheckCircle2, Circle, XCircle, Clock } from 'lucide-react';

const ApprovalTimeline = ({ chain = [], log = [], currentStep = 0, status = 'pending' }) => {
  return (
    <div className="space-y-6">
      {chain.map((approver, index) => {
        const logEntry = log.find(l => l.approverId?._id === approver._id || l.approverId === approver._id);
        const isActive = index === currentStep && status === 'in_review';
        const isCompleted = logEntry && logEntry.action === 'approved';
        const isRejected = logEntry && logEntry.action === 'rejected';
        const isFuture = index > currentStep && status !== 'rejected';

        return (
          <div key={approver._id || index} className="relative flex gap-4">
            {/* Connector Line */}
            {index !== chain.length - 1 && (
              <div className={`absolute left-[11px] top-6 w-[2px] h-full ${isCompleted ? 'bg-green-500' : 'bg-slate-700'}`} />
            )}

            {/* Icon */}
            <div className="relative z-10 flex items-center justify-center">
              {isCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-green-500 bg-slate-900 rounded-full" />
              ) : isRejected ? (
                <XCircle className="w-6 h-6 text-red-500 bg-slate-900 rounded-full" />
              ) : isActive ? (
                <Clock className="w-6 h-6 text-primary-500 bg-slate-900 rounded-full animate-pulse" />
              ) : (
                <Circle className="w-6 h-6 text-slate-600 bg-slate-900 rounded-full" />
              )}
            </div>

            {/* Content */}
            <div className={`pb-8 ${isFuture ? 'opacity-50' : 'opacity-100'}`}>
              <p className="text-sm font-semibold text-white">
                {approver.name || 'Approver'}
                {isActive && <span className="ml-2 text-[10px] px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded-full uppercase tracking-wider">Awaiting</span>}
              </p>
              <p className="text-xs text-slate-400">{approver.role || 'Manager'}</p>
              
              {logEntry && (
                <div className="mt-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-300 italic">"{logEntry.comment || 'No comment provided'}"</p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {new Date(logEntry.timestamp).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ApprovalTimeline;
