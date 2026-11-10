import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Users,
  Calendar,
  FileText,
  FileUp,
  UserCheck,
  CheckSquare,
  Search,
  Sparkles,
  LogOut,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, isRecruiter, logout } = useAuth();

  const recruiterLinks = [
    { name: 'ATS Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
    { name: 'Job Postings', path: '/recruiter/jobs', icon: Briefcase },
    { name: 'Post New Job', path: '/recruiter/jobs/create', icon: PlusCircle },
    { name: 'Applicant Pipeline', path: '/recruiter/applicants', icon: Users },
    { name: 'Interview Schedules', path: '/recruiter/interviews', icon: Calendar },
  ];

  const candidateLinks = [
    { name: 'My Dashboard', path: '/candidate/dashboard', icon: LayoutDashboard },
    { name: 'Browse Jobs', path: '/candidate/jobs', icon: Search },
    { name: 'My Applications', path: '/candidate/applications', icon: CheckSquare },
    { name: 'Resume Upload & NLP', path: '/candidate/resume', icon: FileUp },
    { name: 'Profile & Skills', path: '/candidate/profile', icon: UserCheck },
    { name: 'My Interviews', path: '/candidate/interviews', icon: Calendar },
  ];

  const links = isRecruiter ? recruiterLinks : candidateLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#111827] text-slate-300 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800`}
      >
        {/* Top Logo */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold text-white tracking-tight">SmartHire</span>
                <span className="text-2xs font-semibold px-1.5 py-0.5 rounded-sm bg-indigo-500/20 text-indigo-400">
                  ATS
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role badge */}
          <div className="px-6 py-3 border-b border-slate-800/40 bg-slate-900/40 flex items-center justify-between text-2xs text-slate-400">
            <span>Signed in as</span>
            <span className="font-semibold uppercase tracking-wider text-indigo-400">
              {isRecruiter ? 'Recruiter' : 'Candidate'}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Card & Quick Links */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
          <Link
            to="/jobs"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors mb-2"
          >
            <span className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Public Portal
            </span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-700">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
                <p className="text-2xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

