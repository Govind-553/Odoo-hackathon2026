import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Settings, 
  ClipboardList, 
  PlusCircle, 
  History, 
  CheckSquare, 
  LogOut,
  LayoutDashboard,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = {
    employee: [
      { label: 'My Expenses', icon: History, path: '/employee/expenses' },
      { label: 'Submit Claim', icon: PlusCircle, path: '/employee/submit' },
    ],
    manager: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/manager' },
      { label: 'Pending Approvals', icon: CheckSquare, path: '/manager/pending' },
      { label: 'My Expenses', icon: History, path: '/employee/expenses' },
    ],
    admin: [
      { label: 'All Expenses', icon: BarChart3, path: '/admin/expenses' },
      { label: 'Users', icon: Users, path: '/admin/users' },
      { label: 'Approval Rules', icon: Settings, path: '/admin/rules' },
      { label: 'My Expenses', icon: History, path: '/employee/expenses' },
    ],
  };

  const roleColors = {
    admin: 'bg-red-500/20 text-red-300 border-red-500/20',
    manager: 'bg-amber-500/20 text-amber-300 border-amber-500/20',
    employee: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/20',
  };

  const currentNav = navItems[user?.role] || navItems.employee;

  return (
    <div className="hidden lg:flex flex-col w-60 h-screen bg-secondary fixed left-0 top-0 border-r border-slate-800/60 text-slate-300 z-30">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
        <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
          <ClipboardList className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-black text-white tracking-tight">ReimburseIQ</span>
          <div className="flex items-center gap-1 mt-0.5">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">AI-Powered</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-3 mb-3">Navigation</p>
        {currentNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm group ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/25'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-4 h-4 shrink-0 transition-transform ${!isActive ? 'group-hover:scale-110' : ''}`} />
                <span className="flex-1 truncate">{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User / Bottom */}
      <div className="p-3 border-t border-slate-800/60">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shrink-0">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate leading-tight">{user?.name}</p>
            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border mt-1 ${roleColors[user?.role] || roleColors.employee}`}>
              {user?.role}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
        >
          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
