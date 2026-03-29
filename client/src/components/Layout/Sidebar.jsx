import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Settings, 
  ClipboardList, 
  PlusCircle, 
  History, 
  CheckSquare, 
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const navItems = {
    employee: [
      { label: 'My Expenses', icon: History, path: '/employee/expenses' },
      { label: 'Submit New', icon: PlusCircle, path: '/employee/submit' },
    ],
    manager: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/manager' },
      { label: 'Pending', icon: CheckSquare, path: '/manager/pending' },
      { label: 'My Expenses', icon: History, path: '/employee/expenses' },
    ],
    admin: [
      { label: 'Admin Panel', icon: BarChart3, path: '/admin/expenses' },
      { label: 'Users', icon: Users, path: '/admin/users' },
      { label: 'Rules', icon: Settings, path: '/admin/rules' },
      { label: 'My Expenses', icon: History, path: '/employee/expenses' },
    ]
  };

  const currentNav = navItems[user?.role] || navItems.employee;

  return (
    <div className="hidden lg:flex flex-col w-60 h-screen bg-secondary fixed left-0 top-0 border-r border-slate-800 text-slate-300">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <ClipboardList className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">ReimburseIQ</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {currentNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium ${
                isActive 
                  ? 'bg-primary text-white shadow-md' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User / Bottom */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold border-2 border-slate-600">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
            <span className="inline-block px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-slate-700">
              {user?.role}
            </span>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
