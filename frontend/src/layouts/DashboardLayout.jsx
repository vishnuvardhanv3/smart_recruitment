import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DashboardLayout({ requiredRole }) {
  const { user, loading, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner text="Authenticating session..." fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect recruiter trying to access candidate page or vice versa
    const fallback = user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <Navbar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

