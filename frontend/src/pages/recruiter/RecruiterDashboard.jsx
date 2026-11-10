import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  UserCheck,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import MatchScoreBadge from '../../components/MatchScoreBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ScoreBreakdownModal from '../../components/ScoreBreakdownModal';
import ResumeViewerModal from '../../components/ResumeViewerModal';
import ScheduleInterviewModal from '../../components/ScheduleInterviewModal';

export default function RecruiterDashboard() {
  const [data, setData] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedScore, setSelectedScore] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedInterviewApp, setSelectedInterviewApp] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, appsRes] = await Promise.all([
        api.get('/analytics/recruiter'),
        api.get('/applications/recruiter'),
      ]);

      setData(analyticsRes.data);
      setRecentApplications((appsRes.data.applications || []).slice(0, 6));
    } catch (err) {
      console.error('Failed to load recruiter analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner text="Compiling recruitment analytics..." />;

  const metrics = data?.metrics || {};
  const charts = data?.charts || {};

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Recruitment Overview
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-2xs font-bold border border-emerald-200">
              LIVE ATS
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time pipeline intelligence, automated resume parsing, and candidate match scores.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/recruiter/jobs/create"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Briefcase className="w-3.5 h-3.5" /> Post New Job
          </Link>
          <Link
            to="/recruiter/applicants"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" /> Pipeline View
          </Link>
        </div>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="Jobs Posted"
          value={metrics.totalJobs || 0}
          icon={Briefcase}
          color="indigo"
          subtitle="Open requisitions"
        />
        <StatCard
          title="Applications"
          value={metrics.totalApplications || 0}
          icon={Layers}
          color="blue"
          subtitle="Total in ATS"
        />
        <StatCard
          title="Candidates"
          value={metrics.totalCandidates || 0}
          icon={Users}
          color="purple"
          subtitle="Unique talent"
        />
        <StatCard
          title="Shortlisted"
          value={metrics.shortlistedCount || 0}
          icon={UserCheck}
          color="amber"
          subtitle="Qualified pool"
        />
        <StatCard
          title="Interviews"
          value={metrics.interviewScheduledCount || 0}
          icon={Calendar}
          color="indigo"
          subtitle="Active rounds"
        />
        <StatCard
          title="Selected"
          value={metrics.selectedCount || 0}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Offers / Hires"
        />
      </div>

      {/* 3 Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Applications Over Time */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Application Velocity
              </h3>
              <p className="text-2xs text-slate-400">Applications received across past days</p>
            </div>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.applicationsOverTime || []}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#635BFF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#635BFF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="#635BFF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorApps)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Pipeline by Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Pipeline Distribution
              </h3>
              <p className="text-2xs text-slate-400">Current applicant statuses in funnel</p>
            </div>
            <Layers className="w-4 h-4 text-purple-500" />
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.statusDistribution || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {(charts.statusDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#635BFF'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Applicants Per Job */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Top Requisitions
              </h3>
              <p className="text-2xs text-slate-400">Total applicant volume by job title</p>
            </div>
            <Briefcase className="w-4 h-4 text-blue-500" />
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.applicantsPerJob || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="title" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="applicants" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Applicants Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden space-y-0">
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Candidate Applications</h3>
            <p className="text-2xs text-slate-500">Sorted by ATS match score algorithm</p>
          </div>
          <Link
            to="/recruiter/applicants"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View All ({recentApplications.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-2xs font-semibold">
                <th className="py-3 px-5">Candidate</th>
                <th className="py-3 px-5">Job Opening</th>
                <th className="py-3 px-5">ATS Match</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Applied Date</th>
                <th className="py-3 px-5 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentApplications.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-2xs">
                        {app.candidate?.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 block">
                          {app.candidate?.name}
                        </span>
                        <span className="text-2xs text-slate-400">{app.candidate?.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-5 font-medium text-slate-700">
                    {app.job?.title || 'Open Position'}
                  </td>

                  <td className="py-3.5 px-5">
                    <MatchScoreBadge
                      score={app.matchScore?.score || 0}
                      onClick={() =>
                        setSelectedScore({
                          scoreData: app.matchScore,
                          candidateName: app.candidate?.name,
                          jobTitle: app.job?.title,
                        })
                      }
                    />
                  </td>

                  <td className="py-3.5 px-5">
                    <StatusBadge status={app.status} />
                  </td>

                  <td className="py-3.5 px-5 text-slate-400 text-2xs">
                    {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-5 text-right space-x-2">
                    {app.resumeUrl && (
                      <button
                        onClick={() =>
                          setSelectedResume({
                            resumeUrl: app.resumeUrl,
                            profile: app.candidateProfile,
                            name: app.candidate?.name,
                          })
                        }
                        className="px-2.5 py-1 text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-md text-2xs font-semibold transition-colors"
                      >
                        Resume
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedInterviewApp(app)}
                      className="px-2.5 py-1 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md text-2xs font-semibold transition-colors"
                    >
                      Interview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {selectedScore && (
        <ScoreBreakdownModal
          isOpen={!!selectedScore}
          onClose={() => setSelectedScore(null)}
          matchScore={selectedScore.scoreData}
          candidateName={selectedScore.candidateName}
          jobTitle={selectedScore.jobTitle}
        />
      )}

      {selectedResume && (
        <ResumeViewerModal
          isOpen={!!selectedResume}
          onClose={() => setSelectedResume(null)}
          resumeUrl={selectedResume.resumeUrl}
          candidateProfile={selectedResume.profile}
          candidateName={selectedResume.name}
        />
      )}

      {selectedInterviewApp && (
        <ScheduleInterviewModal
          isOpen={!!selectedInterviewApp}
          onClose={() => setSelectedInterviewApp(null)}
          application={selectedInterviewApp}
          onSuccess={fetchDashboardData}
        />
      )}
    </div>
  );
}

