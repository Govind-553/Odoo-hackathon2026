import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TrendingUp, Clock, CheckCircle, XCircle, ChevronRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ManagerDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({ pending: 0, recentlyApproved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/expenses/pending');
        setStats({
          pending: response.data.data.length,
          recentlyApproved: 0 // Placeholder for now
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-slate-400">You have {stats.pending} expense claims awaiting your approval.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="card border-primary-500/20 bg-primary-500/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pending</p>
              <h3 className="text-2xl font-bold text-white">{stats.pending}</h3>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Approved</p>
              <h3 className="text-2xl font-bold text-white">12</h3>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rejected</p>
              <h3 className="text-2xl font-bold text-white">2</h3>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center text-slate-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Team Budget</p>
              <h3 className="text-2xl font-bold text-white">$4.2k</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white">Action Required</h2>
            <Link to="/manager/pending" className="text-primary-500 text-sm font-semibold hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="card p-0 overflow-hidden">
            {loading ? (
              <div className="p-10 text-center animate-pulse text-slate-500">Loading claims...</div>
            ) : stats.pending === 0 ? (
              <div className="p-10 text-center text-slate-500">No pending claims. You're all caught up!</div>
            ) : (
              <div className="divide-y divide-slate-800">
                <Link to="/manager/pending" className="flex items-center gap-6 p-6 hover:bg-slate-800/50 transition-colors">
                  <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold">Multiple Pending Claims</h4>
                    <p className="text-sm text-slate-400">You have {stats.pending} items waiting in your queue.</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-6">Quick Links</h2>
          <div className="space-y-4">
            <button className="btn-secondary w-full justify-start text-sm">Policy Documents</button>
            <button className="btn-secondary w-full justify-start text-sm">Team Statistics</button>
            <button className="btn-secondary w-full justify-start text-sm">Delegation Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
