import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signup, clearError } from '../store/slices/authSlice';
import { useForm } from 'react-hook-form';
import { 
  ClipboardList, 
  CheckCircle2, 
  Globe, 
  Building2, 
  User, 
  Mail, 
  Lock, 
  AlertCircle, 
  ArrowRight, 
  Loader2,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      role: 'admin'
    }
  });

  const countryValue = watch('country');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get('https://restcountries.com/v3.1/all?fields=name,currencies,flag');
        const formatted = res.data.map(c => ({
          name: c.name.common,
          currency: c.currencies ? Object.keys(c.currencies)[0] : 'USD',
          flag: c.flag
        })).sort((a, b) => a.name.localeCompare(b.name));
        setCountries(formatted);
      } catch (err) {
        console.error('Error fetching countries:', err);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (countryValue) {
      const country = countries.find(c => c.name === countryValue);
      setSelectedCountry(country);
    }
  }, [countryValue, countries]);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  const onSubmit = (data) => dispatch(signup(data));

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white selection:bg-primary/20">
      {/* Left Panel - Brand Context */}
      <div className="hidden lg:flex lg:w-[40%] bg-secondary p-16 flex-col justify-between text-white relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -mr-48 -mt-48 blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full -ml-32 -mb-32 blur-[80px]" />
        
        <Link to="/login" className="relative z-10 flex items-center gap-4 group w-fit">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300 shadow-lg">
            <ClipboardList className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">ReimburseIQ</span>
        </Link>

        <div className="relative z-10 max-w-sm">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-black mb-10 leading-[1.1] tracking-tighter">
              Take command of your company's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-accent">spend.</span>
            </h1>
          </motion.div>
          
          <div className="space-y-6 mb-12">
            {[
              'Global multi-currency support', 
              'Threshold-based automated workflows', 
              'AI receipt scanning & categorization', 
              'Real-time spending analytics'
            ].map((feat, i) => (
              <motion.div 
                key={i} 
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.08] transition-all cursor-default"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-sm font-semibold text-slate-300 tracking-wide">{feat}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-8 glass rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:rotate-12 transition-transform duration-700">
             <Sparkles className="w-16 h-16 text-white" />
          </div>
          <p className="text-base text-slate-300 font-medium italic leading-relaxed relative z-10">
            "ReimburseIQ has completely transformed our finance operations. We reduced processing time by 80% in the first quarter."
          </p>
          <div className="flex items-center gap-4 mt-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-xs shadow-md border-2 border-white/10">
              JD
            </div>
            <div>
              <p className="text-xs font-black text-white tracking-widest uppercase">FINANCE DIRECTOR · ACME CORP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Optimized Scrollable Form */}
      <div className="flex-1 flex items-start justify-center p-8 bg-surface lg:bg-white overflow-y-auto">
        <div className="w-full max-w-lg lg:max-w-md my-auto py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center lg:text-left"
          >
            <div className="lg:hidden flex justify-center mb-8">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 animate-float">
                <ClipboardList className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-black text-secondary tracking-tight mb-3 italic">Launch portal</h2>
            <p className="text-muted text-lg font-medium leading-relaxed">Establish your company headquarters on ReimburseIQ</p>
          </motion.div>

          {error && (
            <motion.div 
              className="bg-red-50 border border-red-100 p-5 rounded-2xl mb-8 flex items-start gap-4 shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 border border-red-200">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-black text-red-700 uppercase tracking-widest">Initialization Error</p>
                <p className="text-xs text-red-600 font-medium mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="input-group">
                <label className="label">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    className="input pl-12 h-12 text-sm font-semibold shadow-sm hover:border-slate-300 transition-colors" 
                    {...register('name', { required: 'Name is required' })} 
                    placeholder="John Marston" 
                  />
                </div>
                {errors.name && <span className="text-[10px] text-danger font-black mt-2 tracking-widest uppercase pl-1">{errors.name.message}</span>}
              </div>

              <div className="input-group">
                <label className="label">Organization Name</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    className="input pl-12 h-12 text-sm font-semibold shadow-sm hover:border-slate-300 transition-colors" 
                    {...register('companyName', { required: 'Company is required' })} 
                    placeholder="Acme Global" 
                  />
                </div>
                {errors.companyName && <span className="text-[10px] text-danger font-black mt-2 tracking-widest uppercase pl-1">{errors.companyName.message}</span>}
              </div>
            </div>

            <div className="input-group">
              <label className="label">Corporate Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  className="input pl-12 h-12 text-sm font-semibold shadow-sm hover:border-slate-300 transition-colors" 
                  {...register('email', { required: 'Email is required' })} 
                  placeholder="admin@acme.com" 
                />
              </div>
              {errors.email && <span className="text-[10px] text-danger font-black mt-2 tracking-widest uppercase pl-1">{errors.email.message}</span>}
            </div>

            <div className="input-group">
              <label className="label">Account Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  className="input pl-12 h-12 text-sm font-semibold shadow-sm hover:border-slate-300 transition-colors" 
                  {...register('password', { required: 'Password is required' })} 
                  placeholder="••••••••" 
                />
              </div>
              {errors.password && <span className="text-[10px] text-danger font-black mt-2 tracking-widest uppercase pl-1">{errors.password.message}</span>}
            </div>

            <div className="input-group">
              <label className="label">Operational Region</label>
              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none group-focus-within:text-primary transition-colors" />
                <select 
                  className="input pl-12 pr-10 h-14 text-sm font-black appearance-none bg-no-repeat bg-[right_1rem_center] cursor-pointer" 
                  {...register('country', { required: 'Country is required' })}
                >
                  <option value="">Select organizational region</option>
                  {countries.map(c => (
                    <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                   <ChevronDown className="w-5 h-5" />
                </div>
              </div>
              {selectedCountry && (
                <motion.div 
                  className="mt-4 bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-center justify-between"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1">Fiscal Currency</span>
                    <span className="text-xl font-black text-secondary">{selectedCountry.currency}</span>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-primary/10 flex items-center justify-center text-lg">
                    {selectedCountry.flag}
                  </div>
                </motion.div>
              )}
              {errors.country && <span className="text-[10px] text-danger font-black mt-2 tracking-widest uppercase pl-1">{errors.country.message}</span>}
            </div>

            <button 
              type="submit" 
              className="btn w-full h-14 text-lg font-black tracking-tighter shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 group relative overflow-hidden" 
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>Deploy Organization <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-sm font-bold text-muted tracking-tight mb-2 italic">
               Already established an account?
            </p>
            <Link to="/login" className="text-primary font-black tracking-tighter hover:text-primary-dark transition-colors inline-flex items-center gap-1.5 group">
              Access Workspace Portal 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
