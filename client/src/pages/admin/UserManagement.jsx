import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUser } from '../../store/slices/userSlice';
import { useForm } from 'react-hook-form';
import { 
  Users, 
  Plus, 
  Mail, 
  Shield, 
  UserPlus, 
  CheckCircle2, 
  XCircle,
  ShieldCheck,
  ChevronRight,
  Search,
  Key,
  Briefcase,
  UserCheck,
  ArrowRight
} from 'lucide-react';
import PageHeader from '../../components/Shared/PageHeader';
import DataTable from '../../components/Shared/DataTable';
import Modal from '../../components/Shared/Modal';
import { motion } from 'framer-motion';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const resultAction = await dispatch(createUser(data));
    if (createUser.fulfilled.match(resultAction)) {
      setShowModal(false);
      reset();
    }
  };

  const roleStyles = {
    admin: 'bg-red-50 text-red-700 border-red-200',
    manager: 'bg-amber-50 text-amber-700 border-amber-200',
    employee: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Identity',
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center font-black text-primary text-sm border border-primary/10 shadow-sm shrink-0">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-secondary tracking-tight truncate">{row.name}</p>
            <div className="flex items-center gap-1.5 text-muted truncate">
              <Mail className="w-3 h-3 shrink-0" />
              <span className="text-[11px] font-medium truncate">{row.email}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Access Level',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${roleStyles[row.role]}`}>
          {row.role}
        </span>
      )
    },
    {
      header: 'Line Manager',
      render: (row) => (
        <div className="flex items-center gap-2 text-muted font-bold text-xs">
          <Shield className="w-3.5 h-3.5 text-slate-300" />
          <span className="truncate">{row.managerId?.name || 'Top Level'}</span>
        </div>
      )
    },
    {
      header: 'Authority',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-md ${row.isManagerApprover ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
            <UserCheck className="w-4 h-4" />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${row.isManagerApprover ? 'text-emerald-700' : 'text-slate-400'}`}>
            {row.isManagerApprover ? 'Active' : 'No Authority'}
          </span>
        </div>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${row.isActive ? 'bg-emerald-500 shadow-sm shadow-emerald-200' : 'bg-slate-300'}`} />
          <span className={`text-xs font-bold ${row.isActive ? 'text-secondary' : 'text-slate-400'}`}>
            {row.isActive ? 'Active' : 'Deactivated'}
          </span>
        </div>
      )
    }
  ];

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <PageHeader 
        title="Workforce Directory" 
        subtitle="Provision access levels and define organizational reporting chains"
        badge="Governance Panel"
        action={
          <button 
            onClick={() => setShowModal(true)}
            className="btn h-11 px-6 shadow-xl shadow-primary/20 flex gap-2 group"
          >
            <UserPlus className="w-4 h-4" />
            Provision Identity
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search directory..." 
            className="input pl-11 h-11 text-sm bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <p className="text-xs font-bold text-muted uppercase tracking-widest">
          {filteredUsers.length} Users Found
        </p>
      </div>

      <div className="card border-none bg-white shadow-xl shadow-slate-200/50 p-0 overflow-hidden ring-1 ring-slate-100">
        <DataTable columns={columns} data={filteredUsers} loading={loading} />
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="Provision Authority Identity"
        maxWidth="max-w-md"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-secondary h-11 font-black uppercase text-[10px] tracking-widest">Discard</button>
            <button onClick={handleSubmit(onSubmit)} className="btn h-11 px-8 min-w-[160px]" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Provision Account'}
            </button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="input-group">
            <label className="label">Legal Full Identity</label>
            <div className="relative">
              <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input type="text" className="input h-12 pl-12 font-semibold" placeholder="Arthur Morgan" {...register('name', { required: 'Name is required' })} />
            </div>
            {errors.name && <p className="text-[10px] text-danger font-black mt-2 tracking-widest uppercase pl-1">{errors.name.message}</p>}
          </div>

          <div className="input-group">
            <label className="label">Corporate Email Protocol</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input type="email" className="input h-12 pl-12 font-semibold" placeholder="arthur@van-der-linde.com" {...register('email', { required: 'Email is required' })} />
            </div>
            {errors.email && <p className="text-[10px] text-danger font-black mt-2 tracking-widest uppercase pl-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="input-group">
              <label className="label">Access Key</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input type="password" placeholder="••••••••" className="input h-12 pl-12 font-semibold" {...register('password', { required: 'Password is required' })} />
              </div>
            </div>
            <div className="input-group">
              <label className="label font-bold text-secondary">Assigned Rank</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <select className="input h-12 pl-12 appearance-none font-black text-xs uppercase bg-white" {...register('role', { required: true })}>
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div className="input-group">
            <label className="label">Line Manager ID</label>
            <div className="relative">
              <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input type="text" className="input h-12 pl-12 font-medium text-xs font-mono" placeholder="Manager Object ID" {...register('managerId')} />
            </div>
            <p className="text-[9px] text-muted mt-2 uppercase font-black tracking-[0.2em] px-1">Connects to organizational reporting chain</p>
          </div>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center justify-between group hover:bg-primary/10 transition-colors">
            <div>
              <span className="text-xs font-black text-secondary uppercase tracking-tight block">Signature Authority</span>
              <p className="text-[9px] text-primary font-bold uppercase tracking-widest mt-0.5">Allow user to approve expenses</p>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" {...register('isManagerApprover')} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
