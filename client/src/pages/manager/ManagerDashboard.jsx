import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  TrendingUp, Clock, CheckCircle2, XCircle, ChevronRight, 
  ArrowRight, Zap, ShieldCheck, BarChart2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchPendingApprovals } from '../../store/slices/expenseSlice';
import PageHeader from '../../components/Shared/PageHeader';
import StatusBadge from '../../components/Shared/StatusBadge';
import { format } from 'date-fns';

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { pending, loading } = useSelector(state => state.expenses);

  useEffect(() => {
    dispatch(fetchPendingApprovals());
  }, [dispatch]);

  const stats = [
    {
      label: 'Pending Review',
      value: pending.length,
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-100',
    },
    {
      label: 'Action Required',
      value: pending.length > 0 ? 'Yes' : 'Clear',
      icon: Zap,
      color: pending.length > 0 ? 'from-red-500 to-rose-500' : 'from-emerald-500 to-green-500',
      bg: pending.length > 0 ? 'bg-red-50' : 'bg-emerald-50',
      text: pending.length > 0 ? 'text-red-700' : 'text-emerald-700',
      border: pending.length > 0 ? 'border-red-100' : 'border-emerald-100',
    },
    {
      label: 'Your Role',
      value: 'Manager',
      icon: ShieldCheck,
      color: 'from-primary to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-100',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title={`Welcome, ${user?.name?.split(' ')[0] || 'Manager'}`}
        subtitle={pending.length > 0 
          ? `You have ${pending.length} expense claim${pending.length !== 1 ? 's' : ''} awaiting your authorization`
          : 'Your approval queue is clear — great work!'
        }
        action={
          <Link
            to="/manager/pending"
            className="btn h-11 px-6 shadow-lg shadow-primary/20 flex gap-2 items-center group"
          >
            <Clock className="w-4 h-4" />
            Review Queue
            <span className="ml-1 bg-white/20 text-white text-xs font-black px-2 py-0.5 rounded-full">
              {pending.length}
            </span>
          </Link>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`card border ${stat.border} flex items-center gap-5`}>
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md shrink-0`}>
              <stat.icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className={`text-2xl font-black tracking-tight ${stat.text}`}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Pending approvals preview */}
      <div className="card p-0 overflow-hidden border border-slate-100 shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-base font-black text-secondary tracking-tight">Pending Approvals</h2>
          </div>
          <Link
            to="/manager/pending"
            className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="divide-y divide-slate-50">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-5 flex gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                </div>
                <div className="h-6 bg-slate-100 rounded-full w-20" />
              </div>
            ))}
          </div>
        ) : pending.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-black text-secondary tracking-tight">All Clear!</h3>
              <p className="text-sm text-muted mt-1 font-medium">No pending claims require your attention.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {pending.slice(0, 5).map((exp) => (
              <Link
                key={exp._id}
                to={`/expenses/${exp._id}`}
                className="flex items-center gap-4 p-5 hover:bg-slate-50/80 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-primary text-sm border-2 border-white shadow-sm shrink-0">
                  {exp.employeeId?.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-secondary text-sm truncate">{exp.employeeId?.name}</p>
                  <p className="text-xs text-muted font-medium truncate mt-0.5">{exp.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-secondary text-sm">{exp.amountInCompanyCurrency?.toFixed(2)}</p>
                  <p className="text-[10px] text-muted uppercase tracking-tight font-semibold">
                    {exp.date ? format(new Date(exp.date), 'MMM dd') : ''}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors shrink-0" />
              </Link>
            ))}
            {pending.length > 5 && (
              <div className="p-4 text-center">
                <Link to="/manager/pending" className="text-sm font-bold text-primary hover:underline flex items-center gap-1 justify-center">
                  View {pending.length - 5} more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/manager/pending"
          className="card border border-slate-100 flex items-center justify-between p-5 hover:border-primary/20 hover:bg-primary/5 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-secondary text-sm">Approval Queue</p>
              <p className="text-xs text-muted font-medium">{pending.length} waiting</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
        </Link>

        <Link
          to="/employee/expenses"
          className="card border border-slate-100 flex items-center justify-between p-5 hover:border-primary/20 hover:bg-primary/5 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-bold text-secondary text-sm">My Expenses</p>
              <p className="text-xs text-muted font-medium">View your submissions</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
        </Link>
      </div>
    </div>
  );
};

export default ManagerDashboard;
