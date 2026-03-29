import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { submitExpense } from '../../store/slices/expenseSlice';
import { 
  UploadCloud, 
  DollarSign, 
  Calendar, 
  Tag, 
  FileText, 
  AlertCircle, 
  Sparkles, 
  Info,
  ArrowRight,
  ChevronRight,
  Loader2,
  Wallet,
  Globe,
  ReceiptText
} from 'lucide-react';
import ReceiptUploader from '../../components/ReceiptUploader';
import PageHeader from '../../components/Shared/PageHeader';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const SubmitExpense = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.expenses);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      currency: 'USD',
      category: 'Travel',
      date: new Date().toISOString().split('T')[0]
    }
  });

  const amount = watch('amount');
  const currency = watch('currency');

  const handleOCRSuccess = (data) => {
    if (data.amount) setValue('amount', data.amount);
    if (data.currency) setValue('currency', data.currency);
    if (data.merchantName || data.description) {
      const desc = `${data.merchantName || ''} - ${data.description || ''}`.trim();
      setValue('description', desc);
    }
    toast.success('AI extracted receipt details!', {
        icon: <Sparkles className="w-5 h-5 text-indigo-500" />
    });
  };
  
  const onSubmit = async (data) => {
    const resultAction = await dispatch(submitExpense(data));
    if (submitExpense.fulfilled.match(resultAction)) {
      toast.success('Expense claim submitted for review');
      navigate('/employee/expenses');
    }
  };

  const categories = [
    { value: 'Travel', icon: Globe },
    { value: 'Meals', icon: UtensilsCrossed },
    { value: 'Accommodation', icon: Home },
    { value: 'Office', icon: Briefcase },
    { value: 'Other', icon: Tag }
  ];

  // Placeholder icons if Lucide doesn't have some above
  const catIcons = {
    'Travel': Globe,
    'Meals': Tag, // Fallback
    'Accommodation': Tag,
    'Office': Tag,
    'Other': Tag
  };

  const commonCurrencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Submit Expense" 
        subtitle="Digitize your receipts and submit for organizational approval"
        badge="New Submission"
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column - Form */}
        <div className="xl:col-span-7 space-y-6 order-2 xl:order-1">
          {error && (
            <motion.div 
              className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-sm text-red-700 font-bold">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="card space-y-8 shadow-xl shadow-slate-200/40 border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="input-group">
                  <label className="label">Amount</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none group-focus-within:text-primary transition-colors">
                      <DollarSign className="w-full h-full" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      className="input pl-12 h-14 text-xl font-black tracking-tighter"
                      placeholder="0.00"
                      {...register('amount', { required: 'Amount is required', min: 0.01 })}
                    />
                  </div>
                  {errors.amount && <p className="text-[10px] text-danger font-black mt-2 tracking-widest uppercase pl-1">{errors.amount.message}</p>}
                </div>

                <div className="input-group">
                  <label className="label">Currency</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none group-focus-within:text-primary transition-colors">
                      <Wallet className="w-full h-full" />
                    </div>
                    <select className="input pl-12 h-14 font-black text-secondary appearance-none bg-no-repeat bg-[right_1rem_center]" {...register('currency', { required: true })}>
                      {commonCurrencies.map(curr => (
                        <option key={curr} value={curr}>{curr}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="input-group">
                  <label className="label">Category</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none group-focus-within:text-indigo-500 transition-colors">
                      <Tag className="w-full h-full" />
                    </div>
                    <select className="input pl-12 h-14 font-black text-secondary appearance-none bg-no-repeat bg-[right_1rem_center]" {...register('category', { required: true })}>
                      {['Travel', 'Meals', 'Accommodation', 'Office', 'Other'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label className="label">Transaction Date</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none group-focus-within:text-indigo-500 transition-colors">
                      <Calendar className="w-full h-full" />
                    </div>
                    <input
                      type="date"
                      className="input pl-12 h-14 font-bold text-secondary"
                      {...register('date', { required: 'Date is required' })}
                    />
                  </div>
                  {errors.date && <p className="text-[10px] text-danger font-black mt-2 tracking-widest uppercase pl-1">{errors.date.message}</p>}
                </div>
              </div>

              <div className="input-group">
                <label className="label">Business Purpose / Context</label>
                <div className="relative group">
                  <div className="absolute left-4 top-5 w-4 h-4 text-muted pointer-events-none group-focus-within:text-indigo-500 transition-colors">
                    <ReceiptText className="w-full h-full" />
                  </div>
                  <textarea
                    rows="3"
                    className="input pl-12 pt-4 min-h-[140px] font-medium leading-relaxed"
                    placeholder="Provide details for this expense (e.g., Client Dinner - ACME Europe Strategy Meeting)"
                    {...register('description', { required: 'Description is required' })}
                  />
                </div>
                {errors.description && <p className="text-[10px] text-danger font-black mt-2 tracking-widest uppercase pl-1">{errors.description.message}</p>}
              </div>
            </div>

            <div className="flex items-center gap-4">
               <button 
                type="submit" 
                className="btn flex-1 h-14 text-lg font-black tracking-tighter shadow-2xl shadow-primary/30 flex gap-4 group relative overflow-hidden"
                disabled={loading}
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                 {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                   <>Submit Authorization Claim <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" /></>
                 )}
               </button>
               <button 
                type="button" 
                onClick={() => navigate('/employee/expenses')}
                className="btn-secondary h-14 px-8 font-black uppercase text-[10px] tracking-widest"
               >
                 Discard
               </button>
            </div>
          </form>
        </div>

        {/* Right Column - OCR and Insights */}
        <div className="xl:col-span-5 space-y-8 order-1 xl:order-2">
          <motion.div 
            className="card border-primary/20 bg-primary/5 p-10 relative overflow-hidden group shadow-2xl shadow-primary/5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-primary/20 transition-all duration-700 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-primary/10">
                  <Sparkles className="w-7 h-7 text-primary animate-float" />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-secondary tracking-tight italic">AI Receipt Scan</h3>
                   <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1 italic">Automated Ledger Input</p>
                </div>
              </div>
              <ReceiptUploader onUploadSuccess={handleOCRSuccess} />
              <div className="mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-sm">
                <p className="text-xs text-muted font-semibold text-center leading-relaxed">
                  Upload high-quality images for best extraction results. Our neural engine will pre-fill the form for you.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="card bg-slate-900 text-white p-10 border-none overflow-hidden relative shadow-2xl">
             <div className="absolute bottom-0 right-0 opacity-10 translate-x-1/4 translate-y-1/4 select-none">
               <ReceiptText className="w-64 h-64" />
             </div>
             <div className="relative z-10">
               <h3 className="text-xl font-black tracking-tighter mb-8 flex items-center gap-3 italic">
                 Policy Compliance
               </h3>
               <ul className="space-y-5">
                 {[
                   'Receipts must be legible and uncropped',
                   'Foreign currency uses real-time exchange rates',
                   'Approvals finalized within 72 business hours',
                   'Over-threshold items require senior sign-off'
                 ].map((text, i) => (
                   <li key={i} className="flex gap-4 items-start group">
                     <span className="w-6 h-6 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                       <ChevronRight className="w-4 h-4 text-white" />
                     </span>
                     <span className="text-base font-medium text-slate-400 group-hover:text-white transition-all duration-300">{text}</span>
                   </li>
                 ))}
               </ul>
               <div className="mt-10 pt-8 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Policy active</span>
                  </div>
                  <Info className="w-4 h-4 text-slate-700" />
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitExpense;
