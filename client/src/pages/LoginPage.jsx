import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';
import { useForm } from 'react-hook-form';
import { ClipboardList, ShieldCheck, Zap, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  const onSubmit = (data) => dispatch(login(data));

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Panel - Branding */}
      <div className="hidden md:flex md:w-[55%] bg-secondary p-12 lg:p-20 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full -ml-32 -mb-32 blur-3xl" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">ReimburseIQ</span>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl lg:text-6xl font-black mb-8 leading-[1.1] tracking-tight">
            Expense approvals, <span className="text-primary">effortless.</span>
          </h1>
          <p className="text-lg text-slate-400 mb-12 font-medium leading-relaxed">
            The intelligent reimbursement platform designed for modern teams. 
            Automate your claims, track in real-time, and get paid faster.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-white tracking-wide">Submit Instantly</h4>
                <p className="text-sm text-slate-500">Snap a photo and AI-powered OCR does the data entry for you.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h4 className="font-bold text-white tracking-wide">Approve Fast</h4>
                <p className="text-sm text-slate-500">Custom rules ensure compliance and speed up the approval cycle.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-slate-500 font-medium">
          &copy; 2026 ReimburseIQ Inc. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface md:bg-white">
        <div className="w-full max-w-sm">
          <div className="md:hidden flex items-center gap-2 mb-12 justify-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-secondary">ReimburseIQ</span>
          </div>

          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-secondary tracking-tight mb-2">Welcome back</h2>
            <p className="text-muted font-medium">Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="input-group">
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                <input
                  type="email"
                  className="input pl-10 h-11"
                  placeholder="name@company.com"
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
              {errors.email && <span className="text-xs text-danger mt-1.5 font-bold">{errors.email.message}</span>}
            </div>

            <div className="input-group">
              <div className="flex justify-between items-center mb-1.5">
                <label className="label mb-0">Password</label>
                <a href="#" className="text-xs font-bold text-primary hover:text-primary-dark">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                <input
                  type="password"
                  className="input pl-10 h-11"
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                />
              </div>
              {errors.password && <span className="text-xs text-danger mt-1.5 font-bold">{errors.password.message}</span>}
            </div>

            <button 
              type="submit" 
              className="btn w-full h-11 text-md font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group" 
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-muted font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-bold hover:underline underline-offset-4 decoration-2">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
