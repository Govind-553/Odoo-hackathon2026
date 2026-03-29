import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRules, createRule, deleteRule } from '../../store/slices/approvalRuleSlice';
import { fetchUsers } from '../../store/slices/userSlice';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Users, 
  ArrowRight, 
  Percent, 
  User, 
  ShieldCheck, 
  Layers,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import PageHeader from '../../components/Shared/PageHeader';
import Modal from '../../components/Shared/Modal';
import { useForm } from 'react-hook-form';

const ApprovalRules = () => {
  const dispatch = useDispatch();
  const { rules, loading } = useSelector((state) => state.approvalRules);
  const { users } = useSelector((state) => state.users);
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      conditionType: 'none',
      isManagerApproverFirst: true,
      approvers: []
    }
  });

  const conditionType = watch('conditionType');

  useEffect(() => {
    dispatch(fetchRules());
    dispatch(fetchUsers());
  }, [dispatch]);

  const onSubmit = async (data) => {
    // Filter out unselected slots and format for backend
    const approverIds = data.approverIds || [];
    const validApproverIds = approverIds.filter(id => id && id.trim() !== '');

    const formattedData = {
      ...data,
      approvers: validApproverIds.map((id, index) => ({
        userId: id,
        sequence: index + 1
      }))
    };
    
    // Remove the raw approverIds array before sending
    delete formattedData.approverIds;
    
    const resultAction = await dispatch(createRule(formattedData));
    if (createRule.fulfilled.match(resultAction)) {
      setShowModal(false);
      reset();
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Archive this governance rule?')) {
      dispatch(deleteRule(id));
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <PageHeader 
        title="Governance Framework" 
        subtitle="Define conditional approval flows and signature authority thresholds"
        action={
          <button 
            onClick={() => setShowModal(true)}
            className="btn h-11 px-6 shadow-lg shadow-primary/20 flex gap-2"
          >
            <Plus className="w-4 h-4" />
            New Approval Rule
          </button>
        }
      />

      {loading && rules.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="card h-48 animate-pulse bg-slate-100/50" />
          ))}
        </div>
      ) : rules.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
           <Layers className="w-12 h-12 text-slate-200 mb-4" />
           <h3 className="text-xl font-bold text-secondary tracking-tight">No Governance Rules</h3>
           <p className="text-muted max-w-xs mt-2 font-medium">Create your first approval rule to start managing company spend.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rules.map((rule) => (
            <div key={rule._id} className="card group hover:ring-2 hover:ring-primary/10 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/10">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-secondary tracking-tight text-lg">{rule.name}</h3>
                      <span className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none">
                        Created {new Date(rule.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(rule._id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className={`w-2 h-2 rounded-full ${rule.isManagerApproverFirst ? 'bg-emerald-500 shadow-sm shadow-emerald-200' : 'bg-slate-300'}`} />
                    <span className="text-xs font-bold text-secondary uppercase tracking-tighter">Manager-First Path</span>
                    <span className={`ml-auto text-[10px] font-black tracking-widest uppercase ${rule.isManagerApproverFirst ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {rule.isManagerApproverFirst ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Sequential Chain</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {rule.approvers.map((app, idx) => (
                        <React.Fragment key={app._id}>
                          <div className="px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-xs font-bold text-secondary shadow-sm flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[10px] text-muted">{idx + 1}</span>
                            {app.userId?.name}
                          </div>
                          {idx < rule.approvers.length - 1 && <ArrowRight className="w-3 h-3 text-slate-300" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 px-2 rounded bg-indigo-50 border border-indigo-100 flex items-center gap-1.5">
                    <Percent className="w-3 h-3 text-indigo-600" />
                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">
                       {rule.conditionType.toUpperCase()}
                    </span>
                  </div>
                </div>
                {rule.percentageThreshold && (
                  <span className="text-sm font-black text-secondary tracking-tight">
                    {rule.percentageThreshold}% <span className="text-[10px] text-muted font-medium uppercase tracking-widest">Threshold</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="Establish Governance Rule"
        maxWidth="max-w-xl"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-secondary h-11">Review Cancel</button>
            <button onClick={handleSubmit(onSubmit)} className="btn h-11 px-8" disabled={loading}>
              Establish Rule
            </button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="input-group">
            <label className="label">Policy Title</label>
            <input type="text" className="input h-11" placeholder="e.g. Standard Corporate Travel" {...register('name', { required: 'Rule name is required' })} />
            {errors.name && <p className="text-xs text-danger font-bold mt-1.5">{errors.name.message}</p>}
          </div>

          <div className="flex items-center gap-3 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
             <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" {...register('isManagerApproverFirst')} />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </div>
            <div>
              <span className="text-sm font-bold text-secondary block">Manager-First Provisioning</span>
              <p className="text-[10px] text-muted font-medium uppercase tracking-tight">Automatically inserts direct supervisor as step 0</p>
            </div>
          </div>

          <div className="space-y-3">
             <label className="label">Custom Approval Chain</label>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {[1, 2, 3].map((step) => (
                 <div key={step}>
                   <select className="input h-10 text-xs font-medium" {...register(`approverIds.${step - 1}`)}>
                     <option value="">Step {step}: Select Approver</option>
                     {users.filter(u => u.isManagerApprover).map(u => (
                       <option key={u._id} value={u._id}>{u.name}</option>
                     ))}
                   </select>
                 </div>
               ))}
             </div>
             <p className="text-[10px] text-muted font-black tracking-widest uppercase flex items-center gap-1.5 mt-2">
               <AlertCircle className="w-3 h-3" />
               Sequential flow will start with step 1
             </p>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="input-group">
                <label className="label font-black text-[10px] text-secondary uppercase tracking-widest">Logic Model</label>
                <select className="input h-10 text-xs font-bold uppercase tracking-widest" {...register('conditionType')}>
                   <option value="none">Sequential (100%)</option>
                   <option value="percentage">Quota Based (%)</option>
                   <option value="specific">Key Individual</option>
                   <option value="hybrid">Dynamic Hybrid</option>
                </select>
              </div>

              {conditionType === 'percentage' && (
                <div className="input-group">
                  <label className="label font-black text-[10px] text-secondary uppercase tracking-widest">Threshold (%)</label>
                  <input type="number" className="input h-10 font-bold" placeholder="60" {...register('percentageThreshold')} />
                </div>
              )}

              {conditionType === 'specific' && (
                <div className="input-group">
                  <label className="label font-black text-[10px] text-secondary uppercase tracking-widest">Mandatory Key</label>
                  <select className="input h-10 text-xs font-medium" {...register('specificApproverId')}>
                    {users.filter(u => u.isManagerApprover).map(u => (
                      <option key={u._id} value={u._id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ApprovalRules;
