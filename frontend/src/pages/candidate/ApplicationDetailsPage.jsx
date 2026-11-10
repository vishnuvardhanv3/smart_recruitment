import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  Calendar,
  Video,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import MatchScoreBadge from '../../components/MatchScoreBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ScoreBreakdownModal from '../../components/ScoreBreakdownModal';

export default function ApplicationDetailsPage() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showScoreModal, setShowScoreModal] = useState(false);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await api.get(`/applications/${id}`);
        setApplication(res.data.application);
      } catch (err) {
        setError('Failed to fetch application details.');
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id]);

  if (loading) return <LoadingSpinner text="Retrieving application log..." fullScreen />;
  if (error || !application) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <p className="text-sm text-slate-700">{error || 'Application not found'}</p>
        <Link
          to="/candidate/applications"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Applications
        </Link>
      </div>
    );
  }

  const { job, matchScore, statusHistory = [] } = application;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <Link
          to="/candidate/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Applications List
        </Link>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {job?.department || 'Engineering'}
              </span>
              <StatusBadge status={application.status} />
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {job?.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {job?.companyName || 'SmartHire Enterprise'}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job?.location || 'Remote'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Applied on {new Date(application.appliedAt || application.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <MatchScoreBadge
            score={matchScore?.score || 0}
            onClick={() => setShowScoreModal(true)}
          />
        </div>
      </div>

      {/* Chronological Audit Log */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Application Status History & Audit Log</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time chronological timeline of your recruitment progression
          </p>
        </div>

        <div className="relative pl-6 border-l-2 border-indigo-200 space-y-6 text-xs">
          {statusHistory.map((step, idx) => (
            <div key={idx} className="relative">
              <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-indigo-600 ring-4 ring-white" />
              <div className="bg-slate-50 border border-slate-200/70 p-4 rounded-2xl space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">{step.status}</span>
                  <span className="text-2xs text-slate-400 font-medium">
                    {new Date(step.updatedAt).toLocaleDateString()} at{' '}
                    {new Date(step.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {step.notes && (
                  <p className="text-xs text-slate-600 pt-1 leading-relaxed">{step.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Match Score Modal */}
      {showScoreModal && (
        <ScoreBreakdownModal
          isOpen={showScoreModal}
          onClose={() => setShowScoreModal(false)}
          matchScore={matchScore}
          jobTitle={job?.title}
        />
      )}
    </div>
  );
}

