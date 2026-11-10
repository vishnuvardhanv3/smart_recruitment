import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Sparkles, Briefcase, LogIn, UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PublicLayout() {
  const { isAuthenticated, isRecruiter, logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-slate-800">
      {/* Public Navbar */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-slate-900 tracking-tight">SmartHire</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <Link to="/" className="hover:text-indigo-600 transition-colors">
            Overview
          </Link>
          <Link to="/jobs" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
            Explore Jobs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to={isRecruiter ? '/recruiter/dashboard' : '/candidate/dashboard'}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" /> Log in
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" /> Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-2xs">
              S
            </div>
            <span className="font-semibold text-slate-800">SmartHire ATS</span>
            <span>— Smart Recruitment & Applicant Tracking System</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <span>Powered by PyMuPDF NLP Engine</span>
            <span>•</span>
            <span>Clean Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

