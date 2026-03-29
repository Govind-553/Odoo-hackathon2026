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
  ChevronRight
} from 'lucide-react';
import ReceiptUploader from '../../components/ReceiptUploader';
import PageHeader from '../../components/Shared/PageHeader';
import { toast } from 'react-hot-toast';

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
    toast.success('Receipt details extracted successfully!', {
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

  const categories = ['Travel', 'Meals', 'Accommodation', 'Office', 'Other'];
  const commonCurrencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Submit Expense" 
        subtitle="Digitize your receipts and submit for organizational approval"
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column - Form */}
        <div className="xl:col-span-7 space-y-6 order-2 xl:order-1">
          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700 font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="card space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="input-group mb-0">
                  <label className="label">Amount</label>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-3.5 w-4 h-4 text-muted pointer-events-none transition-colors group-focus-within:text-primary">
                      <DollarSign className="w-full h-full" />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      className="input pl-11 h-11 text-lg font-black tracking-tight"
                      placeholder="0.00"
                      {...register('amount', { required: 'Amount is required', min: 0.01 })}
                    />
                  </div>
                  {errors.amount && <span className="text-xs text-danger font-black mt-2 tracking-wide uppercase italic">{errors.amount.message}</span>}
                </div>

                <div className="input-group mb-0">
                  <label className="label">Currency</label>
                  <select className="input h-11 font-bold text-secondary px-4 bg-slate-50 border-none shadow-inner" {...register('currency', { required: true })}>
                    {commonCurrencies.map(curr => (
                      <option key={curr} value={curr}>{curr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="input-group mb-0">
                  <label className="label">Category</label>
                  <div className="relative group">
                    <Tag className="absolute left-3.5 top-3.5 w-4 h-4 text-muted pointer-events-none group-focus-within:text-indigo-500" />
                    <select className="input pl-11 h-11 font-bold text-secondary" {...register('category', { required: true })}>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="input-group mb-0">
                  <label className="label">Transaction Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-muted pointer-events-none group-focus-within:text-indigo-500" />
                    <input
                      type="date"
                      className="input pl-11 h-11 font-bold text-secondary"
                      {...register('date', { required: 'Date is required' })}
                    />
                  </div>
                  {errors.date && <span className="text-xs text-danger font-black mt-2 tracking-wide uppercase italic">{errors.date.message}</span>}
                </div>
              </div>

              <div className="input-group mb-0">
                <label className="label">Business Purpose / Description</label>
                <div className="relative group">
                  <FileText className="absolute left-3.5 top-4 w-4 h-4 text-muted pointer-events-none group-focus-within:text-indigo-500" />
                  <textarea
                    rows="3"
                    className="input pl-11 pt-3.5 min-h-[120px] font-medium leading-relaxed"
                    placeholder="Provide context for this expense (e.g., Q3 Client Dinner - Acme Corp)"
                    {...register('description', { required: 'Description is required' })}
                  />
                </div>
                {errors.description && <span className="text-xs text-danger font-black mt-2 tracking-wide uppercase italic">{errors.description.message}</span>}
              </div>
            </div>

            <div className="flex items-center gap-4">
               <button 
                type="submit" 
                className="btn flex-1 h-14 text-lg font-black tracking-tight shadow-2xl shadow-primary/20 flex gap-3 group"
                disabled={loading}
               >
                 {loading ? 'Processing Transaction...' : (
                   <>Submit Claim <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                 )}
               </button>
               <button 
                type="button" 
                onClick={() => navigate('/employee/expenses')}
                className="btn-secondary h-14 px-8 font-bold"
               >
                 Cancel
               </button>
            </div>
          </form>
        </div>

        {/* Right Column - OCR and Policy */}
        <div className="xl:col-span-5 space-y-6 order-1 xl:order-2">
          <div className="card border-primary/20 bg-primary/5 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/20 transition-all pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-primary/10">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-secondary tracking-tight">AI Receipt Capture</h3>
                   <p className="text-xs font-bold text-primary uppercase tracking-widest mt-0.5">Automated Extraction</p>
                </div>
              </div>
              <ReceiptUploader onUploadSuccess={handleOCRSuccess} />
              <p className="mt-6 text-xs text-muted font-medium text-center leading-relaxed max-w-xs mx-auto">
                Upload image (JPEG, PNG). Our engine will try to extract amount, currency, and date automatically.
              </p>
            </div>
          </div>

          <div className="card bg-slate-900 text-white p-8 border-none overflow-hidden relative shadow-xl">
             <div className="absolute bottom-0 right-0 opacity-10 translate-x-1/4 translate-y-1/4">
               <Info className="w-48 h-48" />
             </div>
             <div className="relative z-10">
               <h3 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2">
                 Compliance Checklist
               </h3>
               <ul className="space-y-4">
                 {[
                   'All receipts must be legible and uncropped',
                   'Foreign currency claims use real-time exchange rates',
                   'Approvals usually finalized in 72 business hours',
                   'Over-threshold items require secondary manager sign-off'
                 ].map((text, i) => (
                   <li key={i} className="flex gap-4 items-start group">
                     <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary transition-all">
                       <ChevronRight className="w-3 h-3 text-white" />
                     </span>
                     <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-all">{text}</span>
                   </li>
                 ))}
               </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitExpense;
