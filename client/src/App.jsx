import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe, setInitialized } from './store/slices/authSlice';

// Routes
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

// Layout
import AppShell from './components/Layout/AppShell';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserManagement from './pages/admin/UserManagement';
import ApprovalRules from './pages/admin/ApprovalRules';
import AllExpenses from './pages/admin/AllExpenses';
import SubmitExpense from './pages/employee/SubmitExpense';
import MyExpenses from './pages/employee/MyExpenses';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import PendingApprovals from './pages/manager/PendingApprovals';
import ExpenseDetail from './pages/ExpenseDetail';

// Smart role-based default redirect
const RoleRedirect = () => {
  const { user, isInitialized } = useSelector((state) => state.auth);
  
  if (!isInitialized) return null;
  if (!user) return <Navigate to="/login" />;
  
  if (user.role === 'admin') return <Navigate to="/admin/expenses" replace />;
  if (user.role === 'manager') return <Navigate to="/manager" replace />;
  return <Navigate to="/employee/expenses" replace />;
};

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchMe());
    } else {
      dispatch(setInitialized());
    }
  }, [dispatch]);

  if (!isInitialized && loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted text-sm font-medium tracking-widest uppercase">Initializing Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <RoleRedirect />} />
        <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <RoleRedirect />} />

        {/* Protected Routes — wrapped in AppShell layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            {/* Default redirect based on role */}
            <Route index element={<RoleRedirect />} />
            <Route path="/" element={<RoleRedirect />} />

            {/* Employee routes — accessible by all roles */}
            <Route element={<RoleRoute allowedRoles={['employee', 'manager', 'admin']} />}>
              <Route path="/employee" element={<MyExpenses />} />
              <Route path="/employee/expenses" element={<MyExpenses />} />
              <Route path="/employee/submit" element={<SubmitExpense />} />
            </Route>

            {/* Manager routes */}
            <Route element={<RoleRoute allowedRoles={['manager', 'admin']} />}>
              <Route path="/manager" element={<ManagerDashboard />} />
              <Route path="/manager/pending" element={<PendingApprovals />} />
            </Route>

            {/* Admin routes */}
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<Navigate to="/admin/expenses" replace />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/rules" element={<ApprovalRules />} />
              <Route path="/admin/expenses" element={<AllExpenses />} />
            </Route>

            {/* Expense detail — all authenticated roles */}
            <Route path="/expenses/:id" element={<ExpenseDetail />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
