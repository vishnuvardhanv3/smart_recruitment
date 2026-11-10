import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  User,
  LogOut,
  Briefcase,
  ChevronDown,
  Sparkles,
  CheckCircle,
  Menu,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Navbar({ onMobileMenuToggle }) {
  const { user, isRecruiter, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/profile/notifications');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      // Quiet fail for notifications
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30s poll
    return () => clearInterval(interval);
  }, [user]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      await api.put('/profile/notifications/read');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      // Ignore
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
            {isRecruiter ? 'Recruiter ATS Portal' : 'Candidate Career Hub'}
          </span>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Explore Jobs Quick Link */}
        <Link
          to="/jobs"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Briefcase className="w-3.5 h-3.5" />
          Public Job Board
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications && unreadCount > 0) markAllRead();
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <span className="text-xs font-semibold text-slate-800">Notifications</span>
                <span className="text-2xs text-slate-500">{notifications.length} total</span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`p-3 text-xs transition-colors hover:bg-slate-50 ${
                        !n.read ? 'bg-indigo-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-800">{n.title}</span>
                        <span className="text-2xs text-slate-400 shrink-0">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1 leading-relaxed text-2xs">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No new notifications.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-xs shadow-xs">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-semibold text-slate-800 block leading-tight">
                {user?.name || 'User'}
              </span>
              <span className="text-2xs text-slate-400 capitalize">{user?.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-fadeIn">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-800 block truncate">{user?.name}</span>
                <span className="text-2xs text-slate-500 block truncate">{user?.email}</span>
              </div>

              {isRecruiter ? (
                <>
                  <Link
                    to="/recruiter/dashboard"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                  >
                    Recruiter Dashboard
                  </Link>
                  <Link
                    to="/recruiter/jobs/create"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                  >
                    Post New Job
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/candidate/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                  >
                    <User className="w-3.5 h-3.5" /> My Profile & Skills
                  </Link>
                  <Link
                    to="/candidate/resume"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Resume Parser
                  </Link>
                </>
              )}

              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

