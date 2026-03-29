import React, { useState } from 'react';
import { Menu, X, ClipboardList, LogOut, History, PlusCircle, LayoutDashboard, CheckSquare, BarChart3, Users, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

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
    <>
      <header className="lg:hidden sticky top-0 z-40 w-full h-16 bg-secondary border-b border-slate-800 flex items-center justify-between px-4 shadow-md">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-slate-400 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-xl font-bold text-white">ReimburseIQ</span>
        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold border border-slate-600">
          {user?.name?.charAt(0)}
        </div>
      </header>

      {/* Drawer Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-72 h-full bg-secondary shadow-2xl animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ReimburseIQ</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="p-6 space-y-2 flex-1 overflow-y-auto max-h-[calc(100vh-140px)]">
              {currentNav.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                      isActive 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="absolute bottom-0 w-full p-6 border-t border-slate-800 bg-slate-900/50">
              <button 
                onClick={() => {
                  dispatch(logout());
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
