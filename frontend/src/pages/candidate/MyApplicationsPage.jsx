import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  Sparkles,
  ExternalLink,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import MatchScoreBadge from '../../components/MatchScoreBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ScoreBreakdownModal from '../../components/ScoreBreakdownModal';

const PIPELINE_STAGES = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected'];

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScore, setSelectedScore] = useState(null);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications/my');
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error('Failed to load candidate applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStageIndex = (status) => {
    if (status === 'Rejected') return -1;
    return PIPELINE_STAGES.indexOf(status);
  };

  if (loading) return <LoadingSpinner text="Retrieving your submitted applications..." />;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              My Job Applications
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-2xs font-bold border border-indigo-200">
              {applications.length} Tracked
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track recruitment progress, status audit logs, and scheduled interview invites.
          </p>
        </div>

        <Link
          to="/candidate/jobs"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          Browse More Jobs
        </Link>
      </div>

      {/* Applications List */}
      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => {
            const currentStageIdx = getStageIndex(app.status);
            const isRejected = app.status === 'Rejected';

            return (
              <div
                key={app._id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:border-slate-300 transition-all space-y-5"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        {app.job?.title || 'Applied Position'}
                      </h3>
                      <StatusBadge status={app.status} />
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {app.job?.companyName || 'SmartHire Enterprise'}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {app.job?.location || 'Remote'}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        Applied {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MatchScoreBadge
                      score={app.matchScore?.score || 0}
                      onClick={() =>
                        setSelectedScore({
                          scoreData: app.matchScore,
                          jobTitle: app.job?.title,
                        })
                      }
                    />

                    <Link
                      to={`/candidate/applications/${app._id}`}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      Audit Details <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Visual Pipeline Progress Stepper */}
                <div className="pt-2">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                    Recruitment Stage Progress
                  </span>

                  {isRejected ? (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                      <XCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>This application was not selected for further rounds. Thank you for your interest!</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-2 text-center text-2xs">
                      {PIPELINE_STAGES.map((stage, idx) => {
                        const isCompleted = currentStageIdx >= idx;
                        const isCurrent = currentStageIdx === idx;

                        return (
                          <div key={stage} className="space-y-1.5">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                isCompleted
                                  ? 'bg-indigo-600'
                                  : 'bg-slate-200'
                              }`}
                            />
                            <span
                              className={`block truncate font-medium ${
                                isCurrent
                                  ? 'text-indigo-600 font-bold'
                                  : isCompleted
                                  ? 'text-slate-700'
                                  : 'text-slate-400'
                              }`}
                            >
                              {stage}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No applications found"
          description="You haven't submitted any job applications yet."
          actionLabel="Find Openings"
          onAction={() => (window.location.href = '/candidate/jobs')}
        />
      )}

      {/* Score Modal */}
      {selectedScore && (
        <ScoreBreakdownModal
          isOpen={!!selectedScore}
          onClose={() => setSelectedScore(null)}
          matchScore={selectedScore.scoreData}
          jobTitle={selectedScore.jobTitle}
        />
      )}
    </div>
  );
}

