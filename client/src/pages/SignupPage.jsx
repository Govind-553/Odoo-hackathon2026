import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signup, clearError } from '../store/slices/authSlice';
import { useForm } from 'react-hook-form';
import { ClipboardList, CheckCircle2, Globe, Building2, User, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Panel - Brand Wall */}
      <div className="hidden lg:flex lg:w-[45%] bg-secondary p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />
        
        <Link to="/login" className="relative z-10 flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 group-hover:bg-primary/30 transition-all">
            <ClipboardList className="w-5 h-5 text-primary" />
          </div>
          <span className="text-2xl font-bold tracking-tight">ReimburseIQ</span>
        </Link>

        <div className="relative z-10 max-w-sm">
          <h1 className="text-4xl font-black mb-8 leading-[1.2] tracking-tight">
            Take command of your company's <span className="text-primary underline underline-offset-8 decoration-4">spend.</span>
          </h1>
          <div className="space-y-6">
            {['Global currency support', 'Automated workflows', 'AI receipt scanning', 'Real-time analytics'].map((feat, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm font-semibold text-slate-300 tracking-wide">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-6 bg-slate-900/50 rounded-2xl border border-slate-800 shadow-xl">
          <p className="text-sm text-slate-400 italic leading-relaxed">
            "We've reduced our reimbursement cycle from 14 days to just 48 hours. Best decision for our finance team."
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-slate-700" />
            <span className="text-xs font-bold text-white tracking-widest uppercase">FINANCE LEAD</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Centered Scrollable Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface lg:bg-white overflow-y-auto">
        <div className="w-full max-w-lg lg:max-w-md py-10">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-secondary tracking-tight mb-2">Create company account</h2>
            <p className="text-muted font-medium">Get started with ReimburseIQ in minutes</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="input-group">
                <label className="label">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted" />
                  <input type="text" className="input pl-10 h-10" {...register('name', { required: 'Name is required' })} placeholder="Jane Doe" />
                </div>
                {errors.name && <span className="text-xs text-danger font-bold mt-1.5">{errors.name.message}</span>}
              </div>

              <div className="input-group">
                <label className="label">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-4 h-4 text-muted" />
                  <input type="text" className="input pl-10 h-10" {...register('companyName', { required: 'Company is required' })} placeholder="Acme Inc" />
                </div>
                {errors.companyName && <span className="text-xs text-danger font-bold mt-1.5">{errors.companyName.message}</span>}
              </div>
            </div>

            <div className="input-group">
              <label className="label">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted" />
                <input type="email" className="input pl-10 h-10" {...register('email', { required: 'Email is required' })} placeholder="jane@company.com" />
              </div>
              {errors.email && <span className="text-xs text-danger font-bold mt-1.5">{errors.email.message}</span>}
            </div>

            <div className="input-group">
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted" />
                <input type="password" className="input pl-10 h-10" {...register('password', { required: 'Password is required' })} placeholder="••••••••" />
              </div>
              {errors.password && <span className="text-xs text-danger font-bold mt-1.5">{errors.password.message}</span>}
            </div>

            <div className="input-group">
              <label className="label font-bold text-secondary">Operating Country</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 w-4 h-4 text-muted" />
                <select className="input pl-10 h-11 appearance-none bg-no-repeat bg-[right_1rem_center]" {...register('country', { required: 'Country is required' })}>
                  <option value="">Select country</option>
                  {countries.map(c => (
                    <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>
              {selectedCountry && (
                <div className="mt-3 bg-slate-50 border border-slate-100 p-3 rounded-lg flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Currency</span>
                  <span className="text-sm font-black text-primary">{selectedCountry.currency}</span>
                </div>
              )}
              {errors.country && <span className="text-xs text-danger font-bold mt-1.5">{errors.country.message}</span>}
            </div>

            <button type="submit" className="btn w-full h-11 text-md font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete Signup <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-muted font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4 decoration-2">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
