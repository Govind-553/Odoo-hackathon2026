import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingApprovals, approveExpense, rejectExpense } from '../../store/slices/expenseSlice';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign, 
  User, 
  FileText, 
  MessageSquare,
  ArrowRight,
  MoreVertical,
  Calendar,
  AlertCircle,
  Eye,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/Shared/PageHeader';
import { toast } from 'react-hot-toast';
import Modal from '../../components/Shared/Modal';

const PendingApprovals = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pending, loading } = useSelector((state) => state.expenses);
  const [comment, setComment] = useState('');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'

  useEffect(() => {
    dispatch(fetchPendingApprovals());
  }, [dispatch]);

  const handleAction = async () => {
    if (!selectedExpense || !actionType) return;
    
    if (actionType === 'reject' && !comment) {
        toast.error('Rejection reason is required');
        return;
    }

    const action = actionType === 'approve' ? approveExpense : rejectExpense;
    const resultAction = await dispatch(action({ id: selectedExpense._id, comment }));
    
    if (action.fulfilled.match(resultAction)) {
      toast.success(`Expense ${actionType}d successfully`);
      setSelectedExpense(null);
      setComment('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageHeader 
        title="Approval Queue" 
        subtitle="Review and authorize pending reimbursement claims from your department"
      />

      {loading && pending.length === 0 ? (
        <div className="flex justify-center p-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-white"></div>
        </div>
      ) : pending.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm animate-in zoom-in-95 duration-500">
           <Zap className="w-16 h-16 text-slate-100 mb-6" />
           <h3 className="text-xl font-black text-secondary tracking-tight">Zero-In Queue</h3>
           <p className="text-sm text-muted max-w-xs mt-2 font-medium">All pending claims have been cleared. No items currently require your authorization.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pending.map((exp) => (
            <div key={exp._id} className="card group hover:ring-2 hover:ring-primary/10 transition-all flex flex-col justify-between overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rotate-45 translate-x-12 -translate-y-12 transition-all group-hover:bg-primary/5 group-hover:translate-x-10 group-hover:-translate-y-10" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-primary border border-white shadow-sm">
                       {exp.employeeId?.name?.charAt(0)}
                     </div>
                     <div>
                       <p className="text-sm font-black text-secondary tracking-tight leading-none">{exp.employeeId?.name}</p>
                       <span className="text-[10px] text-muted font-bold uppercase tracking-widest leading-none block mt-1">{exp.category}</span>
                     </div>
                   </div>
                   <div className="px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                     <Clock className="w-3 h-3" /> PENDING
                   </div>
                </div>

                <div className="mb-8 space-y-4">
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-secondary tracking-tighter">
                       {exp.amountInCompanyCurrency.toFixed(2)}
                    </p>
                    <span className="text-[10px] text-muted font-bold uppercase tracking-widest">{exp.currency} ORIG.</span>
                  </div>
                  <p className="text-sm text-muted font-medium line-clamp-2 leading-relaxed">
                    {exp.description}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] font-black text-muted uppercase tracking-widest pt-4 border-t border-slate-50">
                    <Calendar className="w-3.5 h-3.5 text-slate-300" />
                    {new Date(exp.date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <button 
                  onClick={() => { setSelectedExpense(exp); setActionType('approve'); }}
                  className="btn flex-1 h-10 text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 group/btn"
                >
                  <CheckCircle2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /> 
                  APPROVE
                </button>
                <button 
                  onClick={() => { setSelectedExpense(exp); setActionType('reject'); }}
                  className="btn-secondary flex-1 h-10 text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-100 group/btn"
                >
                  <XCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  REJECT
                </button>
                <button 
                  onClick={() => navigate(`/expenses/${exp._id}`)}
                  className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-muted hover:text-primary transition-all shadow-inner"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      <Modal
        isOpen={!!selectedExpense}
        onClose={() => setSelectedExpense(null)}
        title={actionType === 'approve' ? 'Finalize Approval' : 'Decline Transaction'}
        maxWidth="max-w-md"
        footer={
          <>
            <button onClick={() => setSelectedExpense(null)} className="btn-secondary h-11">Review Cancel</button>
            <button 
              onClick={handleAction} 
              className={`btn h-11 px-8 ${actionType === 'reject' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : ''}`}
            >
              {actionType === 'approve' ? 'Authorize Claim' : 'Decline Claim'}
            </button>
          </>
        }
      >
        <div className="space-y-6">
           <div className={`p-4 rounded-xl border flex items-start gap-3 ${actionType === 'approve' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
              {actionType === 'approve' ? (
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-sm font-black tracking-tight ${actionType === 'approve' ? 'text-emerald-900' : 'text-red-900'}`}>
                   {actionType === 'approve' ? 'Confirm Authorization' : 'Required Documentation'}
                </p>
                <p className={`text-xs font-medium mt-1 leading-relaxed ${actionType === 'approve' ? 'text-emerald-700' : 'text-red-700'}`}>
                   {actionType === 'approve' 
                    ? 'Upon confirmation, this claim will proceed to the next stage in the approval hierarchy.' 
                    : 'Please provide a clear justification for declining this expense claim to inform the employee.'}
                </p>
              </div>
           </div>

           <div className="input-group">
              <label className="label">Authorization Commentary</label>
              <div className="relative group">
                <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-muted pointer-events-none transition-colors group-focus-within:text-indigo-500" />
                <textarea 
                  className="input pl-11 pt-3 min-h-[100px] font-medium"
                  placeholder={actionType === 'reject' ? "Mandatory: Enter rejection reason..." : "Optional: Enter approval comments..."}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
           </div>
        </div>
      </Modal>
    </div>
  );
};

export default PendingApprovals;
