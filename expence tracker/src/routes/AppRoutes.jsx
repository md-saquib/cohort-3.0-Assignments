import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { useSelector } from 'react-redux';

// Layout components
import AuthLayout from '../components/layout/AuthLayout';
import DashboardLayout from '../components/layout/DashboardLayout';

// Page components
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import TransactionsPage from '../pages/TransactionsPage';
import NotFoundPage from '../pages/NotFoundPage';

// Spinner UI
import Spinner from '../components/ui/Spinner';

// 1. Auth Guard Component: Redirects to login if not authenticated
const AuthGuard = ({ children }) => {
  const { user, isInitialized } = useSelector((state) => state.auth);
  
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-indigo-650">
        <Spinner size="xl" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// 2. Guest Guard Component: Redirects to dashboard if already authenticated
const GuestGuard = ({ children }) => {
  const { user, isInitialized } = useSelector((state) => state.auth);
  
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-indigo-650">
        <Spinner size="xl" />
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirect Public Root to Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Guest Only Routes (Login, Register) */}
      <Route
        path="/login"
        element={
          <GuestGuard>
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          </GuestGuard>
        }
      />
      <Route
        path="/register"
        element={
          <GuestGuard>
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          </GuestGuard>
        }
      />

      {/* Protected Layout Routes */}
      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/transactions"
        element={
          <AuthGuard>
            <DashboardLayout>
              <TransactionsPage />
            </DashboardLayout>
          </AuthGuard>
        }
      />

      {/* 404 Route */}
      <Route path="/404" element={<NotFoundPage />} />
      
      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
