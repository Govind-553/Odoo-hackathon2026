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
  MoreHorizontal, 
  CheckCircle2, 
  XCircle,
  Layout,
  UserCheck
} from 'lucide-react';
import PageHeader from '../../components/Shared/PageHeader';
import DataTable from '../../components/Shared/DataTable';
import Modal from '../../components/Shared/Modal';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);
  const [showModal, setShowModal] = useState(false);
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
    admin: 'bg-red-50 text-red-700 border-red-100',
    manager: 'bg-amber-50 text-amber-700 border-amber-100',
    employee: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  };

  const columns = [
    {
      header: 'Identity',
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-primary text-sm border-2 border-white shadow-sm ring-1 ring-slate-100">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-secondary tracking-tight">{row.name}</p>
            <div className="flex items-center gap-1.5 text-muted">
              <Mail className="w-3 h-3" />
              <span className="text-[11px] font-medium truncate max-w-[150px]">{row.email}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Access Level',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${roleStyles[row.role]}`}>
          {row.role}
        </span>
      )
    },
    {
      header: 'Line Manager',
      render: (row) => (
        <div className="flex items-center gap-2 text-muted font-bold text-xs uppercase tracking-tight">
          <Shield className="w-3.5 h-3.5 text-slate-300" />
          {row.managerId?.name || 'Self-Managed'}
        </div>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.isActive ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <XCircle className="w-4 h-4 text-slate-300" />
          )}
          <span className={`text-xs font-bold ${row.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
            {row.isActive ? 'Active' : 'Inactive'}
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
        action={
          <button 
            onClick={() => setShowModal(true)}
            className="btn h-11 px-6 shadow-lg shadow-primary/20 flex gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add New User
          </button>
        }
      />

      <div className="card border-none bg-white shadow-sm ring-1 ring-slate-100 p-0 overflow-hidden">
        <DataTable columns={columns} data={users} loading={loading} />
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="Provision Identity"
        maxWidth="max-w-md"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-secondary h-11">Approve Cancel</button>
            <button onClick={handleSubmit(onSubmit)} className="btn h-11 px-8" disabled={loading}>
              {loading ? 'Processing...' : 'Provision User'}
            </button>
          </>
        }
      >
        <div className="space-y-6 py-2">
          <div className="input-group">
            <label className="label">Full Identity</label>
            <input type="text" className="input h-11" placeholder="Legal full name" {...register('name', { required: 'Name is required' })} />
            {errors.name && <p className="text-xs text-danger font-bold mt-1.5">{errors.name.message}</p>}
          </div>

          <div className="input-group">
            <label className="label">Corporate Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-muted" />
              <input type="email" className="input h-11 pl-10" placeholder="user@reimburseiq.com" {...register('email', { required: 'Email is required' })} />
            </div>
            {errors.email && <p className="text-xs text-danger font-bold mt-1.5">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="input-group">
              <label className="label text-secondary">Initial Key</label>
              <input type="password" placeholder="••••••••" className="input h-11" {...register('password', { required: 'Password is required' })} />
            </div>
            <div className="input-group">
              <label className="label text-secondary">System Role</label>
              <select className="input h-11 appearance-none" {...register('role', { required: true })}>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Global Admin</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="label">Reporting Manager ID (Optional)</label>
            <input type="text" className="input h-11" placeholder="Paste user Object ID" {...register('managerId')} />
            <p className="text-[10px] text-muted mt-2 uppercase font-black tracking-widest">Connects to organizational hierarchy</p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" {...register('isManagerApprover')} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </div>
            <span className="text-sm font-bold text-secondary">Grant Authority Power</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
