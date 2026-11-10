import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Sparkles,
  Users,
  Search,
} from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function InterviewManagementPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/interviews/my');
      setInterviews(res.data.interviews || []);
    } catch (err) {
      console.error('Failed to load interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleUpdateStatus = async (interviewId, newStatus) => {
    try {
      await api.put(`/interviews/${interviewId}`, { status: newStatus });
      fetchInterviews();
    } catch (err) {
      alert('Failed to update interview: ' + err.message);
    }
  };

  const filtered = interviews.filter((inv) => {
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    const term = search.toLowerCase();
    const matchesSearch =
      !term ||
      inv.candidate?.name?.toLowerCase().includes(term) ||
      inv.job?.title?.toLowerCase().includes(term) ||
      inv.round?.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Interview Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track upcoming screening, technical rounds, Google Meet links, and candidate evaluations.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search candidate, job, or round..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 bg-white"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Scheduled', 'Completed', 'Cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === s
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Interview Cards List */}
      {loading ? (
        <LoadingSpinner text="Retrieving interview schedule..." />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((inv) => (
            <div
              key={inv._id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {inv.candidate?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{inv.candidate?.name}</h3>
                      <p className="text-2xs text-slate-500">{inv.job?.title}</p>
                    </div>
                  </div>

                  <span
                    className={`text-2xs font-semibold px-2.5 py-1 rounded-full border ${
                      inv.status === 'Scheduled'
                        ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                        : inv.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>

                {/* Round Title */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1">
                  <span className="font-bold text-indigo-700 block">{inv.round}</span>
                  <p className="text-slate-600 text-2xs">{inv.title}</p>
                </div>

                {/* Date & Time */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    {new Date(inv.interviewDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>

                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    {inv.startTime} {inv.endTime ? `– ${inv.endTime}` : ''}
                  </span>
                </div>

                {/* Location / Video link */}
                <div className="text-xs">
                  {inv.type === 'Online' ? (
                    <a
                      href={inv.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-semibold text-2xs"
                    >
                      <Video className="w-3.5 h-3.5 text-indigo-500" />
                      Join Video Meeting <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-slate-600 text-2xs">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      {inv.location || 'On-site Office'}
                    </span>
                  )}
                </div>

                {inv.notes && (
                  <p className="text-2xs text-slate-500 italic bg-slate-50/80 p-2 rounded-lg">
                    "{inv.notes}"
                  </p>
                )}
              </div>

              {/* Status Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                {inv.status === 'Scheduled' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(inv._id, 'Completed')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-2xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Mark Completed
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(inv._id, 'Cancelled')}
                      className="px-3 py-1 border border-slate-300 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-lg text-2xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <XCircle className="w-3 h-3" /> Cancel
                    </button>
                  </>
                )}
                {inv.status === 'Completed' && (
                  <span className="text-2xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Interview Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No interviews scheduled"
          description="Schedule interviews directly from the Applicant Pipeline tab."
          actionLabel="Go to Applicants"
          onAction={() => (window.location.href = '/recruiter/applicants')}
        />
      )}
    </div>
  );
}

