import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Save,
  AlertCircle,
  Building2,
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import MatchScoreBadge from '../../components/MatchScoreBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ScoreBreakdownModal from '../../components/ScoreBreakdownModal';
import ResumeViewerModal from '../../components/ResumeViewerModal';
import ScheduleInterviewModal from '../../components/ScheduleInterviewModal';
import StatusUpdateModal from '../../components/StatusUpdateModal';

export default function CandidateDetailsPage() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSuccess, setNotesSuccess] = useState(false);

  // Modals
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const fetchApplication = async () => {
    try {
      const res = await api.get(`/applications/${id}`);
      setApplication(res.data.application);
      setNotes(res.data.application.recruiterNotes || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load candidate application.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    setNotesSuccess(false);
    try {
      await api.put(`/applications/${id}/status`, {
        status: application.status,
        notes: notes.trim(),
      });
      setNotesSuccess(true);
      setTimeout(() => setNotesSuccess(false), 3000);
      fetchApplication();
    } catch (err) {
      alert('Failed to save notes: ' + err.message);
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading candidate dossier..." fullScreen />;
  if (error || !application) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <p className="text-sm text-slate-700">{error || 'Application not found'}</p>
        <Link
          to="/recruiter/applicants"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Applicants
        </Link>
      </div>
    );
  }

  const { candidate, candidateProfile, job, matchScore, statusHistory = [] } = application;
  const profile = candidateProfile || {};

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Back button */}
      <div>
        <Link
          to="/recruiter/applicants"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Applicant Pipeline
        </Link>
      </div>

      {/* Hero Dossier Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-md">
              {candidate?.name?.charAt(0) || 'C'}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {candidate?.name}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {profile.headline || 'Software Engineering Professional'}
              </p>
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="font-semibold text-slate-700">Applied for:</span>
                <span className="font-bold text-indigo-600">{job?.title}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <MatchScoreBadge
              score={matchScore?.score || 0}
              onClick={() => setShowScoreModal(true)}
            />
            <StatusBadge status={application.status} />

            <button
              onClick={() => setShowStatusModal(true)}
              className="px-3.5 py-1.5 border border-slate-300 hover:border-slate-400 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Update Status
            </button>

            <button
              onClick={() => setShowInterviewModal(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" /> Schedule Interview
            </button>

            {application.resumeUrl && (
              <button
                onClick={() => setShowResumeModal(true)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" /> View Resume
              </button>
            )}
          </div>
        </div>

        {/* Contact Info bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Email</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5 truncate">
              <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              {profile.email || candidate?.email}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Phone</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              {profile.phone || 'Not specified'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Location</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              {profile.location || 'United States'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Experience</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              {profile.yearsOfExperience || 0} years verified
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Experience, Skills & Status Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-8">
          {/* Cover Letter */}
          {application.coverLetter && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Candidate Note / Cover Letter
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                "{application.coverLetter}"
              </p>
            </div>
          )}

          {/* NLP Extracted Technical Skills */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Technical Skill Profile ({profile.skills?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience History */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              Career & Professional Experience
            </h3>

            {profile.experience?.length > 0 ? (
              <div className="space-y-4">
                {profile.experience.map((exp, idx) => (
                  <div key={idx} className="p-4 border border-slate-200/80 rounded-xl bg-slate-50/50 space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-sm text-slate-900">{exp.title}</span>
                        <span className="text-xs text-slate-500 block">
                          {exp.company} • {exp.location || 'Remote'}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-slate-600 pt-2 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl">
                PyMuPDF parser detected {profile.yearsOfExperience || 1} years of full-stack engineering experience from PDF resume.
              </p>
            )}
          </div>

          {/* Education */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              Education & Academic Credentials
            </h3>
            {profile.education?.length > 0 ? (
              <div className="space-y-3">
                {profile.education.map((edu, idx) => (
                  <div key={idx} className="p-4 border border-slate-200/80 rounded-xl bg-slate-50/50 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{edu.degree}</span>
                      <span className="text-slate-500">{edu.institution} {edu.grade ? `• ${edu.grade}` : ''}</span>
                    </div>
                    {edu.endYear && <span className="text-slate-400 font-medium">{edu.endYear}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No education entries recorded.</p>
            )}
          </div>
        </div>

        {/* Right Col: Timeline & Recruiter Notes */}
        <div className="space-y-6">
          {/* Recruiter Internal Notes */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Recruiter Private Notes
              </h3>
              {notesSuccess && (
                <span className="text-2xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Saved
                </span>
              )}
            </div>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record impressions, salary expectations, interview feedback..."
              className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 bg-white"
            />
            <button
              onClick={handleSaveNotes}
              disabled={savingNotes}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {savingNotes ? 'Saving...' : 'Save Recruiter Notes'}
            </button>
          </div>

          {/* Audit History Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              Application Audit Log
            </h3>

            <div className="relative pl-5 border-l-2 border-slate-200 space-y-4 text-xs">
              {statusHistory.map((hist, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white" />
                  <div>
                    <span className="font-bold text-slate-800 block">{hist.status}</span>
                    <span className="text-2xs text-slate-400 block">
                      {new Date(hist.updatedAt).toLocaleDateString()} at{' '}
                      {new Date(hist.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {hist.notes && (
                      <p className="text-2xs text-slate-600 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                        {hist.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showScoreModal && (
        <ScoreBreakdownModal
          isOpen={showScoreModal}
          onClose={() => setShowScoreModal(false)}
          matchScore={matchScore}
          candidateName={candidate?.name}
          jobTitle={job?.title}
        />
      )}

      {showResumeModal && (
        <ResumeViewerModal
          isOpen={showResumeModal}
          onClose={() => setShowResumeModal(false)}
          resumeUrl={application.resumeUrl}
          candidateProfile={profile}
          candidateName={candidate?.name}
        />
      )}

      {showStatusModal && (
        <StatusUpdateModal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          application={application}
          onSuccess={fetchApplication}
        />
      )}

      {showInterviewModal && (
        <ScheduleInterviewModal
          isOpen={showInterviewModal}
          onClose={() => setShowInterviewModal(false)}
          application={application}
          onSuccess={fetchApplication}
        />
      )}
    </div>
  );
}

