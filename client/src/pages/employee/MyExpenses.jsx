import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyExpenses } from '../../store/slices/expenseSlice';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  Filter, 
  Calendar, 
  DollarSign, 
  MoreVertical, 
  History,
  Tag,
  ChevronRight,
  TrendingUp,
  CreditCard,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/Shared/PageHeader';
import DataTable from '../../components/Shared/DataTable';
import StatusBadge from '../../components/Shared/StatusBadge';
import StatCard from '../../components/Shared/StatCard';
import { format } from 'date-fns';

const MyExpenses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mine, loading } = useSelector((state) => state.expenses);
  const [viewType, setViewType] = useState('table'); // 'table' or 'grid'
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchMyExpenses());
  }, [dispatch]);

  const filteredExpenses = mine.filter(exp => {
    const matchesSearch = exp.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         exp.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || exp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { title: 'Total Claimed', value: `$${mine.reduce((acc, curr) => acc + curr.amountInCompanyCurrency, 0).toLocaleString()}`, icon: DollarSign, color: 'primary' },
    { title: 'Processing', value: mine.filter(e => e.status === 'in_review').length, icon: History, color: 'warning' },
    { title: 'Approved', value: mine.filter(e => e.status === 'approved').length, icon: CreditCard, color: 'success' },
  ];

  const columns = [
    { 
      header: 'Context', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-primary/10 transition-colors">
            <FileText className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
          </div>
          <div>
            <p className="font-bold text-secondary tracking-tight truncate max-w-[200px]">{row.description}</p>
            <span className="text-[10px] font-black text-muted uppercase tracking-widest leading-none">{row.category}</span>
          </div>
        </div>
      )
    },
    { 
      header: 'Date', 
      render: (row) => (
        <div className="flex items-center gap-2 text-muted font-bold text-xs uppercase tracking-tight">
          <Calendar className="w-3.5 h-3.5" />
          {format(new Date(row.date), 'MMM dd, yyyy')}
        </div>
      )
    },
    { 
      header: 'Personal Wall', 
      render: (row) => (
        <div className="text-right sm:text-left">
          <p className="font-black text-secondary tracking-tight">
             {row.amountInCompanyCurrency.toFixed(2)}
          </p>
          <p className="text-[10px] text-muted font-semibold tracking-tighter uppercase">{row.amount} {row.currency}</p>
        </div>
      )
    },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader 
        title="Expense Tracker" 
        subtitle="Manage your disbursement claims and monitor approval lifecycles"
        action={
          <button 
            onClick={() => navigate('/employee/submit')}
            className="btn h-11 px-6 shadow-lg shadow-primary/20 flex gap-2 group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            New Reimbursement
          </button>
        }
      />

      {/* Mini Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-2 p-1 bg-white ring-1 ring-slate-100 rounded-lg shadow-sm">
          {['all', 'in_review', 'approved', 'rejected'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                filterStatus === s 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-muted hover:text-secondary hover:bg-slate-50'
              }`}
            >
              {s === 'all' ? 'Activity' : s.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
            <input 
              type="text" 
              placeholder="Search expenses..." 
              className="input pl-10 h-10 w-full sm:w-64 text-sm bg-white border-slate-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center p-1 bg-white ring-1 ring-slate-100 rounded-lg shadow-sm shrink-0">
             <button onClick={() => setViewType('table')} className={`p-1.5 rounded-md transition-all ${viewType === 'table' ? 'bg-slate-100 text-primary' : 'text-muted'}`}>
               <List className="w-4 h-4" />
             </button>
             <button onClick={() => setViewType('grid')} className={`p-1.5 rounded-md transition-all ${viewType === 'grid' ? 'bg-slate-100 text-primary' : 'text-muted'}`}>
               <LayoutGrid className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>

      {viewType === 'table' ? (
        <DataTable 
          columns={columns} 
          data={filteredExpenses} 
          loading={loading}
          onRowClick={(row) => navigate(`/expenses/${row._id}`)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExpenses.map((exp) => (
            <div 
              key={exp._id} 
              onClick={() => navigate(`/expenses/${exp._id}`)}
              className="card group cursor-pointer hover:border-primary/20 transition-all flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-6">
                 <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                   <Tag className="w-5 h-5 text-muted group-hover:text-primary transition-all" />
                 </div>
                 <StatusBadge status={exp.status} />
              </div>
              
              <div>
                <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">{exp.category}</p>
                <h4 className="text-lg font-black text-secondary tracking-tight mb-4 group-hover:text-primary transition-colors">{exp.description}</h4>
                
                <div className="flex items-center gap-4 py-4 border-t border-slate-50">
                   <div>
                     <p className="text-[10px] text-muted font-bold uppercase tracking-tight">Claimed</p>
                     <p className="text-xl font-black text-secondary tracking-tight">{exp.amountInCompanyCurrency.toFixed(2)}</p>
                   </div>
                   <div className="shrink-0">
                      <ChevronRight className="w-5 h-5 text-slate-200 group-hover:translate-x-1 transition-all" />
                   </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest pt-4 border-t border-slate-50">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(exp.date), 'MMM dd, yyyy')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyExpenses;
