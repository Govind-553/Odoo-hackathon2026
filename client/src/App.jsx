import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './store/slices/authSlice';

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

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchMe());
    }
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/employee" />} />
          
          <Route element={<AppShell><Routes>
            {/* Role-based redirect logic */}
            <Route path="/employee/*" element={<RoleRoute allowedRoles={['employee', 'manager', 'admin']} />}>
              <Route index element={<MyExpenses />} />
              <Route path="submit" element={<SubmitExpense />} />
              <Route path="expenses" element={<MyExpenses />} />
            </Route>
            
            <Route path="/manager/*" element={<RoleRoute allowedRoles={['manager', 'admin']} />}>
              <Route index element={<ManagerDashboard />} />
              <Route path="pending" element={<PendingApprovals />} />
            </Route>

            <Route path="/admin/*" element={<RoleRoute allowedRoles={['admin']} />}>
              <Route index element={<UserManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="rules" element={<ApprovalRules />} />
              <Route path="expenses" element={<AllExpenses />} />
            </Route>

            <Route path="/expenses/:id" element={<ExpenseDetail />} />
          </Routes></AppShell>} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
