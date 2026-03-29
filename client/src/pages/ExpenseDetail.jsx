import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenseById, approveExpense, rejectExpense } from '../store/slices/expenseSlice';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  FileText, 
  User, 
  Building, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download, 
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  MessageSquare,
  Sparkles,
  ExternalLink,
  History
} from 'lucide-react';
import PageHeader from '../components/Shared/PageHeader';
import StatusBadge from '../components/Shared/StatusBadge';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const ExpenseDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedExpense, loading, error } = useSelector((state) => state.expenses);
  const { user } = useSelector((state) => state.auth);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    dispatch(fetchExpenseById(id));
  }, [dispatch, id]);

  const isCurrentApprover = selectedExpense?.resolvedApproverChain[selectedExpense?.currentApproverIndex] === user?.userId;
  const canApprove = selectedExpense?.status === 'in_review' && isCurrentApprover;

  const handleAction = async (actionType) => {
    if (actionType === 'reject' && !comment) {
      toast.error('Rejection reason is required');
      return;
    }

    const action = actionType === 'approve' ? approveExpense : rejectExpense;
    const resultAction = await dispatch(action({ id, comment }));
    
    if (action.fulfilled.match(resultAction)) {
      toast.success(`Expense ${actionType}d successfully`);
      setComment('');
    }
  };

  if (loading) return (
    <div className="flex justify-center p-20 animate-pulse">
      <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-primary animate-spin" />
    </div>
  );

  if (error || !selectedExpense) return (
    <div className="card p-20 text-center space-y-4">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
      <h2 className="text-2xl font-black text-secondary tracking-tight">Access Denied</h2>
      <p className="text-muted font-medium max-w-sm mx-auto">This transaction record is unavailable or you lack organizational authority to view it.</p>
      <button onClick={() => navigate(-1)} className="btn-secondary mt-6">Return to Directory</button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-muted hover:text-primary hover:border-primary/20 transition-all shadow-sm group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-[0.2em]">
          <span>Directory</span>
          <ChevronRight className="w-3 h-3" />
          <span>Expense #...{selectedExpense._id.slice(-6).toUpperCase()}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-secondary tracking-tighter mb-2">
            Transaction Details
          </h1>
          <p className="text-sm text-muted font-medium flex items-center gap-2 uppercase tracking-widest">
            Submitted by <span className="text-secondary font-black">{selectedExpense.employeeId?.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={selectedExpense.status} />
          <button className="btn-secondary h-11 p-3">
            <Download className="w-5 h-5" />
          </button>
          <button className="btn-secondary h-11 p-3">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Grid: Core Details */}
        <div className="xl:col-span-7 space-y-6">
          <div className="card grid grid-cols-1 sm:grid-cols-2 gap-10 p-10 bg-white ring-1 ring-slate-100">
             <div className="space-y-1">
               <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-4">Total Amount</label>
               <div className="flex items-baseline gap-2">
                 <h2 className="text-5xl font-black text-secondary tracking-tight">
                   {selectedExpense.amountInCompanyCurrency.toFixed(2)}
                 </h2>
                 <span className="text-xs font-black text-primary uppercase tracking-widest opacity-50">BASE CR.</span>
               </div>
               <p className="text-sm font-bold text-muted mt-2 uppercase tracking-tighter">
                  Equivalent to {selectedExpense.amount} {selectedExpense.currency} @ {selectedExpense.exchangeRate.toFixed(4)}
               </p>
             </div>

             <div className="space-y-6">
                <div>
                   <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-1">Transaction Category</label>
                   <div className="flex items-center gap-2 text-indigo-700 font-black">
                      <Sparkles className="w-4 h-4" />
                      {selectedExpense.category.toUpperCase()}
                   </div>
                </div>
                <div>
                   <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-1">Accounting Date</label>
                   <div className="flex items-center gap-2 text-secondary font-bold">
                      <Calendar className="w-4 h-4 text-slate-300" />
                      {format(new Date(selectedExpense.date), 'MMMM dd, yyyy')}
                   </div>
                </div>
             </div>
          </div>

          <div className="card p-10 space-y-8">
             <div className="space-y-4">
               <label className="text-[10px] font-black text-muted uppercase tracking-widest border-b border-slate-50 pb-2 block">Business Purpose</label>
               <p className="text-base font-medium text-secondary leading-relaxed tracking-tight">
                  {selectedExpense.description}
               </p>
             </div>
          </div>

          {canApprove && (
            <div className="card border-primary/20 bg-primary/5 p-10 animate-in zoom-in-95 duration-500 shadow-2xl shadow-primary/10">
               <h3 className="text-xl font-black text-secondary mb-6 tracking-tight flex items-center gap-3">
                 <ShieldCheck className="w-6 h-6 text-primary" />
                 Sign-off Authorized
               </h3>
               <textarea 
                className="input h-32 mb-6 pt-4 text-base font-medium" 
                placeholder="Include authorization comments (required for rejections)..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
               <div className="grid grid-cols-2 gap-6">
                  <button 
                    onClick={() => handleAction('approve')}
                    className="btn h-14 text-base font-black tracking-widest uppercase shadow-xl shadow-primary/20 hover:scale-[1.02]"
                  >
                    AUTHORIZE
                  </button>
                  <button 
                    onClick={() => handleAction('reject')}
                    className="btn-secondary h-14 text-base font-black tracking-widest uppercase hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    DECLINE
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* Right Grid: Receipt & Timeline */}
        <div className="xl:col-span-5 space-y-6">
           <div className="card p-6 bg-slate-900 overflow-hidden group shadow-2xl">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4 flex justify-between items-center">
                 Evidence Captured
                 <a href={selectedExpense.receiptUrl} target="_blank" rel="noreferrer" className="text-primary hover:text-white flex items-center gap-1.6 transition-colors font-bold uppercase tracking-widest">
                    Full Preview <ExternalLink className="w-3 h-3" />
                 </a>
              </label>
              {selectedExpense.receiptUrl ? (
                <div className="relative rounded-xl overflow-hidden bg-slate-800 border border-slate-700 h-96 group/img">
                   <img 
                    src={selectedExpense.receiptUrl} 
                    alt="Receipt evidence" 
                    className="w-full h-full object-contain mix-blend-lighten opacity-90 group-hover/img:scale-105 group-hover/img:opacity-100 transition-all duration-700"
                   />
                </div>
              ) : (
                <div className="h-64 rounded-xl bg-slate-800/50 border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 gap-4">
                   <FileText className="w-12 h-12 opacity-20" />
                   <p className="text-[10px] font-black uppercase tracking-widest">No evidence scanned</p>
                </div>
              )}
           </div>

           <div className="card p-8 bg-white ring-1 ring-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-slate-50 pointer-events-none">
                 <History className="w-32 h-32" />
              </div>
              <h3 className="text-lg font-black text-secondary tracking-tight mb-8 flex items-center gap-3 relative z-10">
                 Approval Lifecycle
              </h3>
              
              <div className="space-y-8 relative z-10">
                 {/* Logic for timeline mapping from resolvedApproverChain and log */}
                 {selectedExpense.resolvedApproverChain.map((approver, idx) => {
                   const logEntry = selectedExpense.approvalLog.find(log => log.approverId?._id === approver._id || log.approverId === approver._id);
                   const isAwaiting = idx === selectedExpense.currentApproverIndex && selectedExpense.status === 'in_review';
                   const isCompleted = idx < selectedExpense.currentApproverIndex || (idx === selectedExpense.currentApproverIndex && selectedExpense.status === 'approved');
                   const isRejected = idx === selectedExpense.currentApproverIndex && selectedExpense.status === 'rejected';

                   return (
                     <div key={idx} className="flex gap-6 group">
                        <div className="flex flex-col items-center shrink-0">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                             isCompleted ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-200' :
                             isRejected ? 'bg-red-500 border-red-500 shadow-lg shadow-red-200' :
                             isAwaiting ? 'bg-white border-primary animate-pulse shadow-lg shadow-primary/20' :
                             'bg-white border-slate-200'
                           }`}>
                              {isCompleted ? <CheckCircle2 className="w-5 h-5 text-white" /> :
                               isRejected ? <XCircle className="w-5 h-5 text-white" /> :
                               isAwaiting ? <Clock className="w-5 h-5 text-primary" /> :
                               <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                              }
                           </div>
                           {idx < selectedExpense.resolvedApproverChain.length - 1 && (
                             <div className={`w-0.5 h-full min-h-[40px] my-2 rounded-full transition-colors duration-500 ${isCompleted ? 'bg-emerald-200' : 'bg-slate-100'}`} />
                           )}
                        </div>
                        <div className="flex-1 pb-10">
                           <div className="flex justify-between items-start mb-2">
                             <div>
                               <p className={`text-sm font-black tracking-tight leading-none ${isAwaiting ? 'text-primary' : 'text-secondary'}`}>
                                 {approver.name}
                               </p>
                               <span className="text-[10px] font-black text-muted uppercase tracking-widest mt-1.5 block">Step {idx + 1}: Hierarchy Sign-off</span>
                             </div>
                             {logEntry && (
                               <span className="text-[10px] text-muted font-bold tracking-tighter opacity-70">
                                 {format(new Date(logEntry.timestamp), 'MMM dd, p')}
                               </span>
                             )}
                           </div>
                           
                           {logEntry && logEntry.comment && (
                             <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-100 relative group-hover:bg-slate-100 transition-all">
                                <MessageSquare className="absolute -left-2 -top-2 w-4 h-4 text-slate-200" />
                                <p className="text-xs font-medium text-slate-600 leading-relaxed tabular-nums italic">
                                  "{logEntry.comment}"
                                </p>
                             </div>
                           )}

                           {isAwaiting && (
                             <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Active Step</span>
                             </div>
                           )}
                        </div>
                     </div>
                   );
                 })}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetail;
