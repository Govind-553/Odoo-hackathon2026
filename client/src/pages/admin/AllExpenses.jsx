import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllExpenses, overrideExpense } from '../../store/slices/expenseSlice';
import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Eye, 
  ShieldAlert, 
  DollarSign, 
  ArrowUpRight, 
  CreditCard,
  Layers,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/Shared/PageHeader';
import DataTable from '../../components/Shared/DataTable';
import StatusBadge from '../../components/Shared/StatusBadge';
import StatCard from '../../components/Shared/StatCard';
import { format } from 'date-fns';

const AllExpenses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allExpenses, loading } = useSelector((state) => state.expenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(fetchAllExpenses());
  }, [dispatch]);

  const filteredExpenses = allExpenses.filter(exp => {
    const matchesSearch = exp.employeeId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         exp.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || exp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { title: 'Total Volume', value: `$${allExpenses.reduce((acc, curr) => acc + curr.amountInCompanyCurrency, 0).toLocaleString()}`, icon: DollarSign, color: 'primary' },
    { title: 'Pending Approval', value: allExpenses.filter(e => e.status === 'in_review').length, icon: Layers, color: 'warning' },
    { title: 'Approved Claims', value: allExpenses.filter(e => e.status === 'approved').length, icon: CreditCard, color: 'success' },
    { title: 'Rejection Rate', value: `${((allExpenses.filter(e => e.status === 'rejected').length / (allExpenses.length || 1)) * 100).toFixed(1)}%`, icon: ShieldAlert, color: 'danger' },
  ];

  const columns = [
    { 
      header: 'Employee', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-primary text-xs border border-slate-200">
            {row.employeeId?.name?.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-secondary tracking-tight">{row.employeeId?.name}</p>
            <p className="text-[10px] text-muted uppercase tracking-wider font-semibold">{row.category}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Date', 
      render: (row) => (
        <div className="flex items-center gap-2 text-muted font-medium">
          <Calendar className="w-3.5 h-3.5" />
          {format(new Date(row.date), 'MMM dd, yyyy')}
        </div>
      )
    },
    { 
      header: 'Amount', 
      render: (row) => (
        <div>
          <p className="font-black text-secondary tracking-tight">
            {row.amountInCompanyCurrency.toFixed(2)}
          </p>
          <p className="text-[10px] text-muted font-medium">
            {row.amount} {row.currency}
          </p>
        </div>
      )
    },
    { 
      header: 'Status', 
      render: (row) => <StatusBadge status={row.status} /> 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Expense Oversight" 
        subtitle="Review and manage all corporate reimbursement claims"
        action={
          <div className="flex items-center gap-3">
            <button className="btn-secondary flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Main Table View */}
      <div className="card border-none bg-white shadow-sm ring-1 ring-slate-100">
        <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted" />
            <input 
              type="text" 
              placeholder="Search by employee or purpose..." 
              className="input pl-10 h-10 text-sm bg-slate-50/50 border-none focus:bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-100">
            {['all', 'in_review', 'approved', 'rejected'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  filterStatus === s 
                    ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200' 
                    : 'text-muted hover:text-secondary'
                }`}
              >
                {s === 'all' ? 'All' : s.replace('_', ' ').charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={filteredExpenses} 
          loading={loading}
          onRowClick={(row) => navigate(`/expenses/${row._id}`)}
        />
      </div>
    </div>
  );
};

export default AllExpenses;
