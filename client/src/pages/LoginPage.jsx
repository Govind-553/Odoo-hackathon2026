import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';
import { useForm } from 'react-hook-form';
import { 
  ClipboardList, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  Eye, 
  EyeOff,
  Sparkles,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') navigate('/admin/expenses');
      else if (user?.role === 'manager') navigate('/manager');
      else navigate('/employee/expenses');
    }
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch, user]);

  const onSubmit = (data) => dispatch(login(data));

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white selection:bg-primary/20">
      {/* Left Panel - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary p-16 flex-col justify-between text-white relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full -mr-64 -mt-64 blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/20 rounded-full -ml-48 -mb-48 blur-[80px]" />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 group w-fit">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-black tracking-tighter text-white">ReimburseIQ</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-6xl font-black mb-10 leading-[1.05] tracking-tighter">
              Expense <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-accent">approvals,</span> <br />
              effortless.
            </h1>
            <p className="text-xl text-slate-400 font-medium mb-12 leading-relaxed">
              The intelligent reimbursement platform designed for modern teams. 
              Automate your claims, track in real-time, and get paid faster.
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              { icon: Zap, title: 'Submit Instantly', desc: 'Snap a photo and AI-powered OCR does the data entry for you.', color: 'text-amber-400' },
              { icon: CheckCircle2, title: 'Approve Fast', desc: 'Custom rules ensure compliance and speed up the approval cycle.', color: 'text-emerald-400' }
            ].map((feat, i) => (
              <motion.div 
                key={i} 
                className="flex items-start gap-5 group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
              >
                <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors`}>
                  <feat.icon className={`w-6 h-6 ${feat.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{feat.title}</h3>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between">
           <p className="text-xs font-bold text-slate-500 tracking-widest uppercase">
             © 2026 ReimburseIQ Inc. All rights reserved.
           </p>
           <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
               <Sparkles className="w-4 h-4 text-white" />
             </div>
           </div>
        </div>
      </div>

      {/* Right Panel - Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface lg:bg-white relative">
        {/* Subtle decorative background for mobile/tablet */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-secondary to-surface -z-10" />
        
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-10 text-center">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 mb-4 animate-float">
              <ClipboardList className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white lg:text-secondary tracking-tight">ReimburseIQ</h1>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-secondary tracking-tight mb-3 italic">Welcome back</h2>
            <p className="text-muted text-lg font-medium leading-relaxed">
              Enter your credentials to access your secure portal
            </p>
          </div>

          {error && (
            <motion.div 
              className="bg-red-50 border border-red-100 p-4 rounded-2xl mb-8 flex items-start gap-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-red-700 font-bold">Authentication failed</p>
                <p className="text-xs text-red-600 font-medium mt-0.5">{error}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="input-group">
              <label className="label">Employee ID or Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none group-focus-within:text-primary transition-colors">
                  <Mail className="w-full h-full" />
                </div>
                <input
                  type="email"
                  className="input pl-12 h-14 text-base font-medium shadow-sm hover:border-slate-300 transition-colors"
                  placeholder="name@company.com"
                  {...register('email', { required: 'Work email is required' })}
                />
              </div>
              {errors.email && <p className="text-[11px] text-danger font-black mt-2 tracking-widest uppercase pl-1">{errors.email.message}</p>}
            </div>

            <div className="input-group">
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Secure Password</label>
                <span className="text-[11px] font-black text-primary hover:text-primary-dark cursor-pointer uppercase tracking-widest">Forgot?</span>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none group-focus-within:text-primary transition-colors">
                  <Lock className="w-full h-full" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pl-12 pr-12 h-14 text-base font-medium shadow-sm hover:border-slate-300 transition-colors"
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-danger font-black mt-2 tracking-widest uppercase pl-1">{errors.password.message}</p>}
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
                <>Sign into Workspace <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-12 text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner">
            <p className="text-sm text-muted font-bold tracking-tight mb-4">
               Don't have a corporate account yet?
            </p>
            <Link 
              to="/signup" 
              className="btn-secondary w-full h-12 bg-white text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/40"
            >
              Register your organization
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
