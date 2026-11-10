import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  FileText,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import MatchScoreBadge from '../../components/MatchScoreBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ScoreBreakdownModal from '../../components/ScoreBreakdownModal';
import ResumeViewerModal from '../../components/ResumeViewerModal';
import ScheduleInterviewModal from '../../components/ScheduleInterviewModal';
import StatusUpdateModal from '../../components/StatusUpdateModal';

export default function ApplicantsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || 'All';

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedJob, setSelectedJob] = useState(initialJobId);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [minScore, setMinScore] = useState('0');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [scoreModalData, setScoreModalData] = useState(null);
  const [resumeModalData, setResumeModalData] = useState(null);
  const [interviewModalData, setInterviewModalData] = useState(null);
  const [statusModalData, setStatusModalData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/jobs', { params: { myJobs: 'true' } }),
        api.get('/applications/recruiter', {
          params: {
            jobId: selectedJob !== 'All' ? selectedJob : undefined,
            status: selectedStatus !== 'All' ? selectedStatus : undefined,
            search: searchTerm.trim() || undefined,
          },
        }),
      ]);

      setJobs(jobsRes.data.jobs || []);
      let fetchedApps = appsRes.data.applications || [];

      if (minScore !== '0') {
        fetchedApps = fetchedApps.filter(
          (a) => (a.matchScore?.score || 0) >= Number(minScore)
        );
      }

      setApplications(fetchedApps);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedJob, selectedStatus, minScore, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Applicant Pipeline
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-2xs font-bold border border-indigo-200">
              {applications.length} Candidates
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review parsed candidate credentials, evaluate match scores, update stages, and schedule interviews.
          </p>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          {/* Search box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search candidate name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 bg-white"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Job Filter */}
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 max-w-xs"
            >
              <option value="All">All Job Openings</option>
              {jobs.map((j) => (
                <option key={j._id} value={j._id}>
                  {j.title}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Pipeline Stages</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Min Score Filter */}
            <select
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="0">Min Score: Any</option>
              <option value="85">Score ≥ 85% (Top Match)</option>
              <option value="70">Score ≥ 70% (Qualified)</option>
              <option value="50">Score ≥ 50%</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <LoadingSpinner text="Retrieving candidate pipeline..." />
      ) : applications.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-2xs font-semibold">
                  <th className="py-3 px-5">Candidate</th>
                  <th className="py-3 px-5">Job Applied For</th>
                  <th className="py-3 px-5">ATS Match Score</th>
                  <th className="py-3 px-5">Current Stage</th>
                  <th className="py-3 px-5">Applied Date</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Candidate Name & Info */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {app.candidate?.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <Link
                            to={`/recruiter/candidates/${app._id}`}
                            className="font-bold text-slate-900 hover:text-indigo-600 block transition-colors"
                          >
                            {app.candidate?.name}
                          </Link>
                          <span className="text-2xs text-slate-400">{app.candidate?.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Job Title */}
                    <td className="py-3.5 px-5">
                      <span className="font-semibold text-slate-800 block">
                        {app.job?.title || 'Open Position'}
                      </span>
                      <span className="text-2xs text-slate-400">
                        {app.job?.department || 'Engineering'}
                      </span>
                    </td>

                    {/* Match Score Badge */}
                    <td className="py-3.5 px-5">
                      <MatchScoreBadge
                        score={app.matchScore?.score || 0}
                        onClick={() =>
                          setScoreModalData({
                            scoreData: app.matchScore,
                            candidateName: app.candidate?.name,
                            jobTitle: app.job?.title,
                          })
                        }
                      />
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-5">
                      <StatusBadge status={app.status} />
                    </td>

                    {/* Applied Date */}
                    <td className="py-3.5 px-5 text-slate-400 text-2xs">
                      {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-5 text-right space-x-1.5 whitespace-nowrap">
                      {/* View Resume */}
                      {app.resumeUrl && (
                        <button
                          onClick={() =>
                            setResumeModalData({
                              resumeUrl: app.resumeUrl,
                              profile: app.candidateProfile,
                              name: app.candidate?.name,
                            })
                          }
                          className="px-2.5 py-1 text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-lg text-2xs font-semibold transition-colors cursor-pointer"
                        >
                          Resume
                        </button>
                      )}

                      {/* Update Stage */}
                      <button
                        onClick={() => setStatusModalData(app)}
                        className="px-2.5 py-1 text-slate-700 hover:text-indigo-600 border border-slate-300 hover:border-indigo-300 rounded-lg text-2xs font-semibold transition-colors cursor-pointer"
                      >
                        Stage
                      </button>

                      {/* Schedule Interview */}
                      <button
                        onClick={() => setInterviewModalData(app)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-2xs font-semibold transition-colors cursor-pointer shadow-2xs"
                      >
                        Interview
                      </button>

                      {/* Full Dossier */}
                      <Link
                        to={`/recruiter/candidates/${app._id}`}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 inline-block transition-colors"
                        title="View Full Profile Dossier"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No candidates found"
          description="Try clearing your filters or selecting a different job requisition."
          actionLabel="Clear Filters"
          onAction={() => {
            setSelectedJob('All');
            setSelectedStatus('All');
            setMinScore('0');
            setSearchTerm('');
          }}
        />
      )}

      {/* Modals */}
      {scoreModalData && (
        <ScoreBreakdownModal
          isOpen={!!scoreModalData}
          onClose={() => setScoreModalData(null)}
          matchScore={scoreModalData.scoreData}
          candidateName={scoreModalData.candidateName}
          jobTitle={scoreModalData.jobTitle}
        />
      )}

      {resumeModalData && (
        <ResumeViewerModal
          isOpen={!!resumeModalData}
          onClose={() => setResumeModalData(null)}
          resumeUrl={resumeModalData.resumeUrl}
          candidateProfile={resumeModalData.profile}
          candidateName={resumeModalData.name}
        />
      )}

      {statusModalData && (
        <StatusUpdateModal
          isOpen={!!statusModalData}
          onClose={() => setStatusModalData(null)}
          application={statusModalData}
          onSuccess={fetchData}
        />
      )}

      {interviewModalData && (
        <ScheduleInterviewModal
          isOpen={!!interviewModalData}
          onClose={() => setInterviewModalData(null)}
          application={interviewModalData}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}

