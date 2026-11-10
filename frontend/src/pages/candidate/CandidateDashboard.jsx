import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  UserCheck,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  Video,
  CheckCircle2,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import MatchScoreBadge from '../../components/MatchScoreBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function CandidateDashboard() {
  const { user, profile } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/candidate');
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to load candidate analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner text="Loading candidate workspace..." />;

  const metrics = analytics?.metrics || {};
  const nextInterview = analytics?.upcomingInterviews?.[0];
  const recentUpdates = analytics?.recentUpdates || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Candidate Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Engineer'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Track your job applications, monitor real-time ATS match scoring, and prepare for upcoming interviews.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/candidate/jobs"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            <Briefcase className="w-3.5 h-3.5" /> Explore Open Roles
          </Link>
          <Link
            to="/candidate/resume"
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition-colors flex items-center gap-2"
          >
            <FileText className="w-3.5 h-3.5" /> Resume Parser
          </Link>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Applications Submitted"
          value={metrics.totalApplications || 0}
          icon={Layers}
          color="indigo"
          subtitle="Positions applied"
        />
        <StatCard
          title="Shortlisted / Advanced"
          value={metrics.shortlistedCount || 0}
          icon={UserCheck}
          color="emerald"
          subtitle="Passed initial ATS filter"
        />
        <StatCard
          title="Upcoming Interviews"
          value={metrics.upcomingInterviewsCount || 0}
          icon={Calendar}
          color="purple"
          subtitle="Scheduled conversations"
        />
      </div>

      {/* Next Upcoming Interview Highlight */}
      {nextInterview && (
        <div className="bg-linear-to-r from-indigo-50 to-purple-50 border border-indigo-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md">
              Next Upcoming Interview
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              {nextInterview.title} • {nextInterview.job?.title}
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                {new Date(nextInterview.interviewDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                {nextInterview.startTime} {nextInterview.endTime ? `– ${nextInterview.endTime}` : ''}
              </span>
            </div>
          </div>

          <div>
            {nextInterview.type === 'Online' && nextInterview.meetingLink ? (
              <a
                href={nextInterview.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
              >
                <Video className="w-3.5 h-3.5" /> Join Google Meet Call
              </a>
            ) : (
              <span className="text-xs font-semibold text-slate-700">
                In-person: {nextInterview.location || 'Office'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Recent Applications Updates */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Application Status Updates</h3>
            <p className="text-2xs text-slate-500">Live recruitment progress tracked by ATS</p>
          </div>
          <Link
            to="/candidate/applications"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            All Applications <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentUpdates.length > 0 ? (
          <div className="divide-y divide-slate-100 text-xs">
            {recentUpdates.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">{item.jobTitle}</h4>
                  <span className="text-2xs text-slate-500">{item.company}</span>
                </div>

                <div className="flex items-center gap-4">
                  <MatchScoreBadge score={item.matchScore} showIcon={false} />
                  <StatusBadge status={item.status} />
                  <Link
                    to={`/candidate/applications/${item.id}`}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100"
                    title="View Timeline"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            You haven't submitted any job applications yet.
            <div className="pt-3">
              <Link
                to="/candidate/jobs"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold"
              >
                Browse Job Openings
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

