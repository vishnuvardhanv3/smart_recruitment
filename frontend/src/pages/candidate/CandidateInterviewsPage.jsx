import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Building2,
} from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function CandidateInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await api.get('/interviews/my');
        setInterviews(res.data.interviews || []);
      } catch (err) {
        console.error('Failed to load candidate interviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  if (loading) return <LoadingSpinner text="Retrieving your interview schedule..." />;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            My Interview Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Confirmed technical screenings, team interviews, meeting links, and calendar dates.
          </p>
        </div>
      </div>

      {interviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interviews.map((inv) => (
            <div
              key={inv._id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-2xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                      {inv.round}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5">{inv.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inv.job?.companyName || 'SmartHire Partner'} • {inv.job?.title}</span>
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

                {/* Date & Time */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    {new Date(inv.interviewDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>

                  <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    {inv.startTime} {inv.endTime ? `– ${inv.endTime}` : ''}
                  </span>
                </div>

                {/* Location / Meeting Link */}
                <div className="pt-1">
                  {inv.type === 'Online' && inv.meetingLink ? (
                    <a
                      href={inv.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Video className="w-3.5 h-3.5 text-indigo-600" />
                      Open Google Meet Link <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      {inv.location || 'On-site Office'}
                    </span>
                  )}
                </div>

                {/* Notes */}
                {inv.notes && (
                  <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-600 space-y-1">
                    <span className="font-semibold text-slate-700 block text-2xs uppercase tracking-wider">
                      Preparation Notes
                    </span>
                    <p className="leading-relaxed">{inv.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No scheduled interviews yet"
          description="Once recruiters review your application and book an interview, it will appear here."
          actionLabel="View My Applications"
          onAction={() => (window.location.href = '/candidate/applications')}
        />
      )}
    </div>
  );
}

